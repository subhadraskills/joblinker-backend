-- DropForeignKey
ALTER TABLE "public"."JobLink" DROP CONSTRAINT "JobLink_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "public"."JobLink" ADD CONSTRAINT "JobLink_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
