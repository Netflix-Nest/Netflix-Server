import { Controller } from '@nestjs/common';
import { FcmService } from './fcm.service';

@Controller()
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}
}
