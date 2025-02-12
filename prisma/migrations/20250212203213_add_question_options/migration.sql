-- AlterTable
ALTER TABLE "Question" 
ADD COLUMN "optionA" TEXT NOT NULL DEFAULT 'Option A',
ADD COLUMN "optionB" TEXT NOT NULL DEFAULT 'Option B',
ADD COLUMN "optionC" TEXT NOT NULL DEFAULT 'Option C',
ADD COLUMN "optionD" TEXT NOT NULL DEFAULT 'Option D';

-- After migration, you can update the default values with actual content
