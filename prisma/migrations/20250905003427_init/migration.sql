-- CreateTable
CREATE TABLE "public"."JobLink" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."JobLink" ADD CONSTRAINT "JobLink_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
