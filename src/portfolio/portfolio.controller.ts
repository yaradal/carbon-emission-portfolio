import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { PortfolioService } from './portfolio.service'
import { PortfolioItemDto } from './dto/portfolioItem.dto'
import { CheckoutDto } from './dto/checkout.dto'

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('/generate')
  async generatePortfolio(
    @Query('requestedVolume', ParseIntPipe) requestedVolume: number,
  ): Promise<PortfolioItemDto[]> {
    return await this.portfolioService.generatePortfolio(requestedVolume)
  }

  @Post('/checkout')
  async checkoutPortfolio(@Body() dto: CheckoutDto) {
    return await this.portfolioService.checkoutPortfolio(dto)
  }
}
