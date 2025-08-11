import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ContentEpisodeDto, ContentMovieDto } from 'src/dto/content.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @EventPattern('send-welcome')
  welcome(
    @Payload()
    { email, name, token }: { email: string; name: string; token: string },
  ) {
    return this.mailService.sendUserWelcome(email, name, token);
  }

  @EventPattern('reset-password')
  resetPass(
    @Payload()
    { email, name, token }: { email: string; name: string; token: string },
  ) {
    return this.mailService.resetPassword(email, name, token);
  }

  @EventPattern('mail-new-movie')
  newMovie(
    @Payload()
    {
      email,
      name,
      content,
    }: {
      email: string;
      name: string;
      content: ContentMovieDto;
    },
  ) {
    return this.mailService.newFilm(email, name, content);
  }

  @EventPattern('mail-new-episode')
  newEpisode(
    @Payload()
    {
      email,
      name,
      content,
    }: {
      email: string;
      name: string;
      content: ContentEpisodeDto;
    },
  ) {
    return this.mailService.newEpisode(email, name, content);
  }
}
