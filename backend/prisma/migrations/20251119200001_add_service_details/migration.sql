-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "images" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'PRESENTIAL',
    "hostYears" INTEGER NOT NULL DEFAULT 1,
    "hostLanguages" TEXT NOT NULL DEFAULT '["Português"]',
    "hostJob" TEXT NOT NULL DEFAULT 'Profissional',
    "highlights" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_services" ("categoryId", "createdAt", "description", "id", "images", "latitude", "location", "longitude", "price", "rating", "reviewCount", "title", "updatedAt", "userId") SELECT "categoryId", "createdAt", "description", "id", "images", "latitude", "location", "longitude", "price", "rating", "reviewCount", "title", "updatedAt", "userId" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");
CREATE INDEX "services_userId_idx" ON "services"("userId");
CREATE INDEX "services_location_idx" ON "services"("location");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
