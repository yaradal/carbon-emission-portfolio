-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pricePerTon" DOUBLE PRECISION NOT NULL,
    "offeredVolumeInTons" INTEGER NOT NULL,
    "distributionWeight" DOUBLE PRECISION NOT NULL,
    "supplierName" TEXT NOT NULL,
    "earliestDelivery" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioPurchase" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "portfolio" JSONB NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioPurchase_pkey" PRIMARY KEY ("id")
);
