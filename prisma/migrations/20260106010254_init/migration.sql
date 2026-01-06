-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "examine" TEXT,
    "members" BOOLEAN NOT NULL,
    "limit" INTEGER,
    "value" INTEGER NOT NULL,
    "lowalch" INTEGER,
    "highalch" INTEGER,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "high" INTEGER NOT NULL,
    "low" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Price_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE INDEX "Price_itemId_timestamp_idx" ON "Price"("itemId", "timestamp");
