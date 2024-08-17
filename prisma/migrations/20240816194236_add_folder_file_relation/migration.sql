-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "folderPath" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderPath_fkey" FOREIGN KEY ("folderPath") REFERENCES "Folder"("path") ON DELETE RESTRICT ON UPDATE CASCADE;
