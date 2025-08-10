import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @MessagePattern('send-welcome')
  welcome(@Payload() { email, name }: { email: string; name: string }) {
    return this.mailService.sendUserWelcome(email, name, '1132435');
  }

  @MessagePattern('mail-new-movie')
  newMovie(
    @Payload()
    { email, name, content }: { email: string; name: string; content: any },
  ) {
    return this.mailService.newEpisode(email, name, content);
  }
}
