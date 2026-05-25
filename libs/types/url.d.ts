export interface CreateUrlRequest {
  long_url: string;
  custom_alias?: string;
  expiry_time?: Date;
}

export interface CreateUrlResponse {
  short_url: string;
}

export interface RedirectUrlResponse {
  url: string;
}

export interface UrlMetadata {
  long_url: string;
  click_count: number;
  created_at: Date;
  expiry_time: Date | undefined;
}
