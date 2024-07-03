import { Test } from '@nestjs/testing'
import {
  PortfolioService,
  ProjectEntry,
} from '../../src/portfolio/portfolio.service'
import { AppModule } from '../../src/app.module'
import { PortfolioModule } from '../../src/portfolio/portfolio.module'
import { INestApplication } from '@nestjs/common'
import { PortfolioItemDto } from '../../src/portfolio/dto/portfolioItem.dto'
import { ProjectRepository } from '../../src/portfolio/entity/project.repository'
import { PortfolioPurchaseRepository } from '../../src/portfolio/entity/portfoliopurchase.repository'
import { PrismaService } from '../../src/prisma.service'

describe('test portfolio service', () => {
  let app: INestApplication
  let portfolioService: PortfolioService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, PortfolioModule],
      providers: [
        PortfolioService,
        ProjectRepository,
        PortfolioPurchaseRepository,
        PrismaService,
      ],
    }).compile()
    app = moduleRef.createNestApplication()

    portfolioService = app.get(PortfolioService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(portfolioService).toBeDefined()
  })

  it('should test and validate the method calculate portfolio', () => {
    const requestedVolumw = 1000
    const projects: ProjectEntry[] = [
      {
        id: 1,
        name: 'one',
        distributionWeight: 0.05,
        offeredVolumeInTons: 15,
      },
      {
        id: 2,
        name: 'two',
        distributionWeight: 0.1,
        offeredVolumeInTons: 900,
      },
      {
        id: 3,
        name: 'th',
        distributionWeight: 0.15,
        offeredVolumeInTons: 1500,
      },
      {
        id: 4,
        name: 'f',
        distributionWeight: 0.25,
        offeredVolumeInTons: 1100,
      },
      {
        id: 5,
        name: 'r',
        distributionWeight: 0.45,
        offeredVolumeInTons: 16000,
      },
    ]
    const expectedResult: PortfolioItemDto[] = [
      {
        id: 1,
        name: 'one',
        allocatedVolumeInTons: 15,
      },
      {
        id: 2,
        name: 'two',
        allocatedVolumeInTons: 104,
      },
      {
        id: 3,
        name: 'th',
        allocatedVolumeInTons: 156,
      },
      {
        id: 4,
        name: 'f',
        allocatedVolumeInTons: 260,
      },
      {
        id: 5,
        name: 'r',
        allocatedVolumeInTons: 463,
      },
    ]
    const result = portfolioService.calculatePortfolio(
      requestedVolumw,
      projects,
    )
    expect(result).toEqual(expectedResult)
  })
})
