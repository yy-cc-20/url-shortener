import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

@Injectable()
export class AppService {
  health(): HealthResponse {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
