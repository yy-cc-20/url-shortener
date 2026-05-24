import { Controller, Get, Post, Body, Param, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import type {
  CreateUrlResponse,
  RedirectUrlResponse,
  UrlMetadata,
} from '../../../libs/types/url';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/url')
  create(@Body() createUrlDto: CreateUrlDto): Promise<CreateUrlResponse> {
    return this.urlService.create(createUrlDto);
  }

  @Get(':short_url')
  @Redirect('', 302)
  redirect(@Param('short_url') shortUrl: string): Promise<RedirectUrlResponse> {
    return this.urlService.redirect(shortUrl);
  }

  @Get(':short_url/metadata')
  findOne(@Param('short_url') shortUrl: string): Promise<UrlMetadata> {
    return this.urlService.getMetadata(shortUrl);
  }
}
