import { Injectable, Logger } from '@nestjs/common'
import {
  PortfolioItemDto,
  PortfolioItemPricedDto,
} from './dto/portfolioItem.dto'
import { CheckoutDto } from './dto/checkout.dto'
import { ProjectRepository } from './entity/project.repository'
import { PortfolioPurchaseRepository } from './entity/portfoliopurchase.repository'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PortfolioService {
  private logger = new Logger(PortfolioService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectRepo: ProjectRepository,
    private readonly portfolioPurchaseRepo: PortfolioPurchaseRepository,
  ) {}

  /**
   * generatePortfolio - generates and returns the needed portfolio
   * queries the db table and gets all projects
   * @param requestedVolume - requested volume in tons
   * @returns a list of PortfolioItemDto
   */
  async generatePortfolio(
    requestedVolume: number,
  ): Promise<PortfolioItemDto[]> {
    const projects = await this.projectRepo.fetchAll()
    //calculate and return the correct portfolio
    return this.calculatePortfolio(requestedVolume, projects)
  }
  async checkoutPortfolio(checkoutDto: CheckoutDto) {
    const projects = await this.projectRepo.fetchAll()
    const portfolioWithPrices = checkoutDto.portfolio.map((item) => {
      const pricePerTon = projects.find((p) => p.id === item.id).pricePerTon
      return {
        ...item,
        pricePerTon: pricePerTon,
        totalPrice: pricePerTon * item.allocatedVolumeInTons,
      } as PortfolioItemPricedDto
    })

    await this.prisma.$transaction(async (tx) => {
      // update the table of the carbon emission data
      await this.projectRepo.updateOfferedVolumes(checkoutDto.portfolio, tx)
      //save the purchase in a table, with id, email address and maybe a json of the portfolio?
      await this.portfolioPurchaseRepo.insert(
        checkoutDto.email,
        portfolioWithPrices,
        tx,
      )
    })
  }

  /**
   * calculatePortfolio - actually calculates the portfolio
   * @param requestedVolume - in tons
   * @param projects - the entries relevant
   * we iterate over the project and in the first run we allocate initial volume for the projects
   * in case there's remaining volume - meaning one of the projects at least didnt have sufficient credits
   * we iterate over the projects while there is remaining volume and calculate each time the distribute weight accordingly
   * @returns an array of PortfolioItemDto
   */
  calculatePortfolio(
    requestedVolume: number,
    projects: ProjectEntry[],
  ): PortfolioItemDto[] {
    let remainingVolume = requestedVolume
    const portfolio: PortfolioProjectItem[] = []

    //calculate and allocate the initial volume for each project based on their distribution weights and available volume.
    for (const project of projects) {
      const maxVolume = Math.floor(requestedVolume * project.distributionWeight)
      const allocatedVolumeInTons = Math.min(
        maxVolume,
        project.offeredVolumeInTons,
      )
      remainingVolume -= allocatedVolumeInTons

      if (allocatedVolumeInTons > 0) {
        // initial allocation of portfolio item and track each project's remaining capacity
        portfolio.push({
          id: project.id,
          name: project.name,
          allocatedVolumeInTons: allocatedVolumeInTons,
          distributionWeight: project.distributionWeight,
          remainingCapacity:
            project.offeredVolumeInTons - allocatedVolumeInTons,
        })
      }
    }

    // distribute remaining volume
    while (remainingVolume > 0) {
      //recalculate total distributed weight
      const totalRemainingDistributedWeight = portfolio.reduce(
        (sum, project) =>
          sum +
          (project.remainingCapacity > 0 ? project.distributionWeight : 0),
        0,
      )

      if (totalRemainingDistributedWeight === 0) {
        break // No remaining capacity in any project
      }

      let allocatedInThisRound = 0

      for (const project of portfolio) {
        if (remainingVolume <= 0) {
          break
        }

        if (project.remainingCapacity > 0) {
          const additionalVolume = Math.floor(
            (remainingVolume * project.distributionWeight) /
              totalRemainingDistributedWeight,
          )
          const volumeToAllocate = Math.min(
            additionalVolume,
            project.remainingCapacity,
          )
          //update the entries of each Project Entry
          project.allocatedVolumeInTons += volumeToAllocate
          project.remainingCapacity -= volumeToAllocate
          remainingVolume -= volumeToAllocate
          allocatedInThisRound += volumeToAllocate
        }
      }

      if (allocatedInThisRound === 0) {
        break // No volume was allocated in this round, so break to avoid infinite loop
      }
    }
    const sum = portfolio.reduce(
      (sum, project) => sum + project.allocatedVolumeInTons,
      0,
    )

    this.logger.log('sum is ${sum}')

    return portfolio.map(({ id, name, allocatedVolumeInTons }) => ({
      id,
      name,
      allocatedVolumeInTons,
    }))
  }
  roundToThreeDecimals(number: number): number {
    return Number(number.toFixed(1))
  }
}
export class PortfolioProjectItem {
  id: number
  name: string
  allocatedVolumeInTons: number
  distributionWeight: number
  remainingCapacity: number
}
export type ProjectEntry = {
  id: number
  name: string
  distributionWeight: number
  offeredVolumeInTons: number
}
