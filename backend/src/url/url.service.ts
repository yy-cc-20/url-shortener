import {
  ConflictException,
  GoneException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import type {
  CreateUrlResponse,
  RedirectUrlResponse,
  UrlMetadata,
} from '../../../libs/types/url';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(
    @InjectRepository(Url)
    private readonly repo: Repository<Url>,
  ) {}

  async create(dto: CreateUrlDto): Promise<CreateUrlResponse> {
    const normalizedUrl = new URL(dto.long_url).toString();
    this.logger.log(`Creating short URL for: ${normalizedUrl}`);

    if (dto.custom_alias != undefined) {
      try {
        await this.repo.save({
          originalUrl: normalizedUrl,
          shortUrl: dto.custom_alias,
          expiryTime: dto.expiry_time,
        });

        this.logger.log(`Short code created: ${dto.custom_alias}`);

        return {
          short_url: dto.custom_alias,
        };
      } catch (error) {
        if (this.isUniqueViolation(error)) {
          this.logger.warn(`Collision detected for code: ${dto.custom_alias}`);
          throw new ConflictException('Custom alias already in use');
        }

        this.logger.error('Failed to create URL', this.getErrorStack(error));
        throw error;
      }
    }

    while (true) {
      const shortCode = this.generateRandomBase62ShortCode();
      try {
        await this.repo.save({
          originalUrl: normalizedUrl,
          shortUrl: shortCode,
          expiryTime: dto.expiry_time,
        });

        this.logger.log(`Short code created: ${shortCode}`);
        return {
          short_url: shortCode,
        };
      } catch (error) {
        if (this.isUniqueViolation(error)) {
          this.logger.warn(`Collision detected for code: ${shortCode}`);
          continue;
        }

        this.logger.error('Failed to create URL', this.getErrorStack(error));
        throw error;
      }
    }
  }

  async redirect(shortUrl: string): Promise<RedirectUrlResponse> {
    const url = await this.repo.findOneBy({ shortUrl });
    this.logger.log(`Redirect request for code: ${shortUrl}`);

    if (!url) {
      this.logger.warn(`Short code not found: ${shortUrl}`);
      throw new NotFoundException('Short code not found');
    }

    if (this.isExpired(url)) {
      this.logger.log(`Expired URL request for code: ${shortUrl}`);
      throw new GoneException('Short URL has expired');
    }

    try {
      await this.repo.increment({ shortUrl }, 'clickCount', 1);
    } catch (error) {
      this.logger.error(
        'Failed to increment click count',
        this.getErrorStack(error),
      );
    }

    this.logger.log(`Redirecting to: ${url.originalUrl}`);
    return {
      url: url.originalUrl,
    };
  }

  async getMetadata(shortUrl: string): Promise<UrlMetadata> {
    const url = await this.repo.findOneBy({ shortUrl });
    this.logger.log(`Metadata request for code: ${shortUrl}`);

    if (!url) {
      this.logger.warn(`Short code not found: ${shortUrl}`);
      throw new NotFoundException('Short code not found');
    }

    this.logger.log(`Metadata retrieved for code: ${shortUrl}`);
    return {
      long_url: url.originalUrl,
      click_count: url.clickCount,
      expiry_time: url.expiryTime,
      created_at: url.createdAt,
    };
  }

  findAll() {
    return `This action returns all url`;
  }

  private isExpired(url: Url): boolean {
    return url.expiryTime !== undefined && url.expiryTime < new Date();
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    );
  }

  private getErrorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined;
  }

  private generateRandomBase62ShortCode(): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let code = '';

    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
  }
}
