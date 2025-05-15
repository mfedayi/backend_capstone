-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Reply"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
