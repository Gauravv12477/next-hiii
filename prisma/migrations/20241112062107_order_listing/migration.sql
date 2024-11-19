-- CreateTable
CREATE TABLE "OrderTaskListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskOrder" TEXT[],

    CONSTRAINT "OrderTaskListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderTaskListing_userId_key" ON "OrderTaskListing"("userId");

-- AddForeignKey
ALTER TABLE "OrderTaskListing" ADD CONSTRAINT "OrderTaskListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
