-- Renombrar la columna existente (si es necesario)
ALTER TABLE "Comment" RENAME COLUMN "authorId" TO "userId";

-- Agregar las nuevas columnas
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "parentId" INTEGER REFERENCES "Comment"("id");
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "fileUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId"); 