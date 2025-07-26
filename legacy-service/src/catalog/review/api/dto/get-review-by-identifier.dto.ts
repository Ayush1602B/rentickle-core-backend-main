import { BaseDto, BaseListResponseOutputDto } from '@/shared/api/api.types'
import { IsNumber, IsString } from 'class-validator'
import { ReviewDto } from './review-common.dto'
import { ApiProperty } from '@nestjs/swagger'
export class GetReviewByIdentifierInputDto extends BaseDto<GetReviewByIdentifierInputDto> {
  @ApiProperty()
  @IsNumber()
  identifier: number

  @ApiProperty()
  @IsNumber()
  storeId: number
}

export class GetReviewByIdentifierOutputDto extends ReviewDto {
  @ApiProperty()
  @IsNumber()
  ratingDetail: number

  @ApiProperty()
  @IsString()
  reviewTitle: string

  @ApiProperty()
  @IsString()
  reviewDetail: string

  @ApiProperty()
  @IsString()
  nickname: string
}

export class GetReviewByIdentifierOutputListDto
  extends BaseDto<GetReviewByIdentifierOutputListDto>
  implements BaseListResponseOutputDto<GetReviewByIdentifierOutputDto>
{
  @ApiProperty({ type: () => GetReviewByIdentifierOutputDto, isArray: true })
  list: GetReviewByIdentifierOutputDto[]

  @ApiProperty()
  @IsNumber()
  page: number

  @ApiProperty()
  @IsNumber()
  length: number

  @ApiProperty()
  @IsNumber()
  limit: number

  @ApiProperty()
  @IsNumber()
  hasMore?: boolean

  @ApiProperty()
  @IsNumber()
  total?: number
}
