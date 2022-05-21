-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "cover" SET DEFAULT E'https://picsum.photos/seed/picsum${Math.floor(Math.random()*20)}/400';
