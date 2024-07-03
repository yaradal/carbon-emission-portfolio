import { Module } from '@nestjs/common'
import { PortfolioController } from './portfolio.controller'
import { PortfolioService } from './portfolio.service'
import { PrismaService } from '../prisma.service'
import { ProjectRepository } from './entity/project.repository'
import { PortfolioPurchaseRepository } from './entity/portfoliopurchase.repository'

@Module({
  imports: [],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    PrismaService,
    ProjectRepository,
    PortfolioPurchaseRepository,
  ],
  exports: [PortfolioService],
})
export class PortfolioModule {}
