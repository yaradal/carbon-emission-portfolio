import { Module } from '@nestjs/common'
import { PortfolioModule } from './portfolio/portfolio.module'
import { PrismaService } from './prisma.service'

@Module({
  imports: [PortfolioModule],
  providers: [PrismaService],
})
export class AppModule {}
