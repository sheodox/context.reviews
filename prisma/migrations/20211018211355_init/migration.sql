-- CreateTable
CREATE TABLE "phrases" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "phrases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "speechSynthesis" BOOLEAN NOT NULL,
    "autoSpeechSynthesis" BOOLEAN NOT NULL,
    "userId" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "oauthId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "oauthProvider" TEXT NOT NULL,
    "raw" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_35ca8e413bbbdfc7a313e0a8bd" ON "phrases"("userId", "phrase");

-- CreateIndex
CREATE INDEX "IDX_e499462bf68bdfea3f867f186c" ON "phrases"("userId", "deleted");

-- CreateIndex
CREATE UNIQUE INDEX "settings_userId_key" ON "settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_oauthId_key" ON "users"("oauthId");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
