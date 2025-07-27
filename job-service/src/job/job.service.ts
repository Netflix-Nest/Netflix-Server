import { Injectable } from '@nestjs/common';
import { exec, execFile, execSync } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

@Injectable()
export class JobService {
  hasAudio(inputPath: string): boolean {
    try {
      const result = execSync(
        `ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 ${inputPath}`,
      ).toString();
      return result.trim() !== ''; //if has audio ? -> return true
    } catch {
      return false;
    }
  }
  async transcodeToHLS(inputPath: string, outputDir: string) {
    const audioExists = this.hasAudio(inputPath);

    const ffmpegArgs: string[] = [
      '-i',
      inputPath,
      '-preset',
      'veryfast',
      '-g',
      '48',
      '-sc_threshold',
      '0',
      '-filter_complex',
      '[0:v]split=3[v1][v2][v3];' +
        '[v1]scale=w=1920:h=1080[v1out];' +
        '[v2]scale=w=1280:h=720[v2out];' +
        '[v3]scale=w=854:h=480[v3out]',
      '-map',
      '[v1out]',
      ...(audioExists ? ['-map', '0:a'] : []),
      '-map',
      '[v2out]',
      ...(audioExists ? ['-map', '0:a'] : []),
      '-map',
      '[v3out]',
      ...(audioExists ? ['-map', '0:a'] : []),
      '-c:v',
      'libx264',
      ...(audioExists ? ['-c:a', 'aac', '-b:a', '128k'] : []),
      '-b:v:0',
      '5000k',
      '-b:v:1',
      '3000k',
      '-b:v:2',
      '1500k',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_playlist_type',
      'vod',
      '-master_pl_name',
      'master.m3u8',
      '-var_stream_map',
      audioExists ? 'v:0,a:0 v:1,a:0 v:2,a:0' : 'v:0 v:1 v:2',
      `${outputDir}/stream_%v.m3u8`,
    ];

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1: Get input video
    // 2: Optimize encode, keyframe each 48 frame
    // 3: Get video and audio from input
    // 4: Encode video = H.264, audio = AAC
    // 5: Stream 0: 1080p - bitrate 5Mbps
    // 6: Stream 1: 720p - bitrate 3Mbps
    // 7: Stream 2: 480p - bitrate 1.5Mbps
    // 8: Output HLS: each paragraph 6s
    // 9: Create file master playlist HLS
    // 10: Match each video stream with audio
    // 11: Output file for each stream (0/1/2)
    const command = `
    ffmpeg -i ${inputPath} \ 
    -preset veryfast -g 48 -sc_threshold 0 \
    -map 0:v -map 0:a \
    -c:v libx264 -c:a aac -b:a 128k \
    -s:v:0 1920x1080 -b:v:0 5000k \
    -s:v:1 1280x720 -b:v:1 3000k \
    -s:v:2 854x480 -b:v:2 1500k \
    -f hls -hls_time 6 -hls_playlist_type vod \
    -master_pl_name master.m3u8 \
    -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
    ${outputDir}/stream_%v.m3u8
  `;

    // console.log(`Running FFmpeg: ${command}`);
    // await execAsync(command);
    await execFileAsync('ffmpeg', ffmpegArgs);

    const probeCommand = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${inputPath}`;
    const { stdout } = await execAsync(probeCommand);
    return parseFloat(stdout);
  }
}
