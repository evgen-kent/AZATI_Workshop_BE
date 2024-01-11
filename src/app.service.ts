import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): string {
    return 'Workshop BE app is ready! Now on deploy!';
  }
}
