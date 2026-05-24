import {
  IsAlphanumeric,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  long_url!: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(10)
  custom_alias?: string;

  @IsOptional()
  @IsDateString()
  expiry_time?: Date;
}
