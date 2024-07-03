import { PortfolioItemDto } from './portfolioItem.dto'
import { ArrayMinSize, IsEmail } from 'class-validator'
import { Type } from 'class-transformer'

export class CheckoutDto {
  @IsEmail()
  email: string

  @Type(() => PortfolioItemDto)
  @ArrayMinSize(1)
  portfolio: PortfolioItemDto[]
}
