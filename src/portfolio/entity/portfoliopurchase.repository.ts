import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import {
  PortfolioItemDto,
  PortfolioItemPricedDto,
} from '../dto/portfolioItem.dto'
import { CheckoutDto } from '../dto/checkout.dto'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class PortfolioPurchaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insert(
    email: string,
    portfolio: PortfolioItemPricedDto[],
    transaction: Prisma.TransactionClient,
  ) {
    const purchase = await transaction.portfolioPurchase.create({
      data: {
        email: email,
        portfolio: JSON.stringify(portfolio),
        totalPrice: portfolio.reduce((agg, item) => agg + item.totalPrice, 0),
      },
    })
  }
}
