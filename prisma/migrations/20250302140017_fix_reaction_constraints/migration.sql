-- DropIndex
DROP INDEX "reactions_anonymousId_articleId_commentId_key";

-- CreateIndex
CREATE INDEX "anonymous_reaction_index" ON "reactions"("anonymousId", "articleId", "commentId");
