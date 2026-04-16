import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { ok: true, name: 'k-journal-api' };
  }
}
