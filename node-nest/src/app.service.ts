import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

const PORT = 4050;
const LINKS = new Map();

@Injectable()
export class AppService {
  home(): string {
    return 'OK';
  }

  getLink(token: string): string {
    return LINKS.get(token);
  }

  postLink(url: string): { token: string; url: string } {
    const token = randomBytes(20).toString('hex');

    LINKS.set(token, url);

    return {
      token,
      url: `http://localhost:${PORT}/link/${token}`,
    };
  }
}
