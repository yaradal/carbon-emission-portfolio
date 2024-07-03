import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { PortfolioItemDto } from '../dto/portfolioItem.dto'
import { CheckoutDto } from '../dto/checkout.dto'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * calls the table and gets all projects, we get only necessary columns
   */
  async fetchAll() {
    return this.prisma.project.findMany({
      select: {
        id: true,
        name: true,
        distributionWeight: true,
        offeredVolumeInTons: true,
        pricePerTon: true,
      },
    })
  }
  async updateOfferedVolumes(
    portfolio: PortfolioItemDto[],
    transaction: Prisma.TransactionClient,
  ) {
    const updatePromises = portfolio.map((portfolioItemDto) => {
      return transaction.$executeRaw`
    UPDATE "Project"
    SET "offeredVolumeInTons" = "offeredVolumeInTons" - ${portfolioItemDto.allocatedVolumeInTons}
    WHERE "id" = ${portfolioItemDto.id}
    AND "offeredVolumeInTons" >= ${portfolioItemDto.allocatedVolumeInTons}`
    })
    const results = await Promise.all(updatePromises)
    // Check results
    for (let i = 0; i < results.length; i++) {
      if (results[i] === 0) {
        throw new HttpException(
          `${portfolio[i].name} doesn't have sufficient offeredVolume`,
          HttpStatus.BAD_REQUEST,
        )
      }
    }
  }
}
