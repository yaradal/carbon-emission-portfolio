export class PortfolioItemDto {
  id: number
  name: string
  allocatedVolumeInTons: number
}

export class PortfolioItemPricedDto extends PortfolioItemDto {
  pricePerTon: number
  totalPrice: number
}
