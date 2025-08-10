import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class ContentMovieDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  thumbnail: string;
  @IsNotEmpty()
  publishAt: Date;
  @IsNotEmpty()
  quality: string;
}

export class ContentEpisodeDto extends ContentMovieDto {
  @IsNotEmpty()
  episodeNumber: number;
  @IsNotEmpty()
  series: string;
}
