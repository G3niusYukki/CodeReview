-- Add user API key fields

ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "apiKey" TEXT;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "apiProvider" VARCHAR(255);
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "apiEndpoint" VARCHAR(255);
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "apiModel" VARCHAR(255) DEFAULT 'gpt-4';

-- Add check constraint for apiProvider
ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS "check_apiProvider";
ALTER TABLE "Users" ADD CONSTRAINT "check_apiProvider" 
  CHECK ("apiProvider" IS NULL OR "apiProvider" IN ('openai', 'anthropic', 'google', 'custom'));
