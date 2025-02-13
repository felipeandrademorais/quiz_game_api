-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'FINISHED');

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "status" "SeasonStatus" NOT NULL DEFAULT 'OPEN';
