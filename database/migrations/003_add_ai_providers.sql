-- Add AIProviders table and update Reviews table

-- Create AIProviders table
CREATE TABLE IF NOT EXISTS "AIProviders" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  "displayName" VARCHAR(255) NOT NULL,
  "providerType" VARCHAR(255) NOT NULL CHECK ("providerType" IN ('openai', 'anthropic', 'google', 'openai-compatible', 'custom')),
  "apiEndpoint" VARCHAR(255) NOT NULL,
  "apiKey" TEXT,
  "defaultModel" VARCHAR(255) NOT NULL DEFAULT 'gpt-4',
  "availableModels" JSONB DEFAULT '[]',
  headers JSONB DEFAULT '{}',
  config JSONB DEFAULT '{"temperature": 0.3, "maxTokens": 4000, "timeout": 60000}',
  "isActive" BOOLEAN DEFAULT true,
  "isDefault" BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  "rateLimitRPM" INTEGER DEFAULT 60,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_aiproviders_name ON "AIProviders"(name);
CREATE INDEX IF NOT EXISTS idx_aiproviders_active ON "AIProviders"("isActive");
CREATE INDEX IF NOT EXISTS idx_aiproviders_priority ON "AIProviders"(priority);

-- Update Reviews table
ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS provider VARCHAR(255);
ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS model VARCHAR(255);

-- Add trigger for AIProviders updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_aiproviders_updated_at ON "AIProviders";
CREATE TRIGGER update_aiproviders_updated_at
  BEFORE UPDATE ON "AIProviders"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
