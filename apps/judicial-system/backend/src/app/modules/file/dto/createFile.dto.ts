import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseFileCategory } from '@island.is/judicial-system/types'

export class CreateFileDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly type!: string

  @IsOptional()
  @IsEnum(CaseFileCategory)
  @ApiPropertyOptional({ enum: CaseFileCategory })
  readonly category?: CaseFileCategory

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @ApiProperty({ type: String })
  readonly key!: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number })
  readonly size!: number

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly policeCaseNumber?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  readonly chapter?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  readonly orderWithinChapter?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly displayDate?: Date

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly policeFileId?: string

  @IsOptional()
  @MaxLength(255)
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly userGeneratedFilename?: string
}
