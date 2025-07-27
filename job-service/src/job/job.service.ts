import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class JobService {
  async transcodeToHLS(inputPath: string, outputDir: string) {
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

    console.log(`Running FFmpeg: ${command}`);
    await execAsync(command);
  }
}
