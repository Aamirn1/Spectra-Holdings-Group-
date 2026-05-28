-- ============================================================================
-- Spectra Holdings Group — Supabase PostgreSQL Migration
-- Generated from Prisma schema
-- ============================================================================

-- Enable uuid extension (required for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'RESIDENT', 'BUSINESS');
  END IF;
END
$$;

-- ============================================================================
-- TABLES (ordered by dependency — leaf tables first)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- State
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "State" (
  "id"           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"         TEXT        NOT NULL,
  "slug"         TEXT        NOT NULL,
  "abbreviation" TEXT        NOT NULL,
  "isActive"     BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "State_slug_key" UNIQUE ("slug")
);

-- ----------------------------------------------------------------------------
-- City
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "City" (
  "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"      TEXT        NOT NULL,
  "slug"      TEXT        NOT NULL,
  "stateId"   UUID        NOT NULL,
  "isActive"  BOOLEAN     NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "City_slug_key"         UNIQUE ("slug"),
  CONSTRAINT "City_stateId_fkey"     FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- Community
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Community" (
  "id"          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"        TEXT        NOT NULL,
  "slug"        TEXT        NOT NULL,
  "cityId"      UUID        NOT NULL,
  "description" TEXT,
  "imageUrl"    TEXT,
  "isActive"    BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "Community_slug_key"    UNIQUE ("slug"),
  CONSTRAINT "Community_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- User
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "User" (
  "id"           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"        TEXT        NOT NULL,
  "passwordHash" TEXT        NOT NULL,
  "name"         TEXT        NOT NULL,
  "role"         "Role"      NOT NULL DEFAULT 'RESIDENT',
  "phone"        TEXT,
  "address"      TEXT,
  "city"         TEXT,
  "state"        TEXT,
  "neighborhood" TEXT,
  "latitude"     DOUBLE PRECISION,
  "longitude"    DOUBLE PRECISION,
  "avatarUrl"    TEXT,
  "bio"          TEXT,
  "communityId"  UUID,
  "isVerified"   BOOLEAN     NOT NULL DEFAULT false,
  "isActive"     BOOLEAN     NOT NULL DEFAULT true,
  "lastLoginAt"  TIMESTAMPTZ,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "User_email_key"       UNIQUE ("email"),
  CONSTRAINT "User_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- Category (self-referencing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Category" (
  "id"          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"        TEXT        NOT NULL,
  "slug"        TEXT        NOT NULL,
  "icon"        TEXT,
  "description" TEXT,
  "parentId"    UUID,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "Category_slug_key"    UNIQUE ("slug"),
  CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- Business
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Business" (
  "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"         UUID        NOT NULL,
  "name"           TEXT        NOT NULL,
  "slug"           TEXT        NOT NULL,
  "description"    TEXT        NOT NULL,
  "address"        TEXT        NOT NULL,
  "city"           TEXT        NOT NULL,
  "state"          TEXT        NOT NULL,
  "neighborhood"   TEXT,
  "latitude"       DOUBLE PRECISION,
  "longitude"      DOUBLE PRECISION,
  "phone"          TEXT        NOT NULL,
  "whatsapp"       TEXT,
  "website"        TEXT,
  "email"          TEXT,
  "categoryId"     UUID        NOT NULL,
  "communityId"    UUID,
  "hours"          TEXT,       -- JSON string of operating hours
  "logoUrl"        TEXT,
  "coverUrl"       TEXT,
  "images"         TEXT,       -- JSON string array of image URLs
  "services"       TEXT,       -- JSON string array of services offered
  "licenseInfo"    TEXT,
  "socialLinks"    TEXT,       -- JSON string for social media URLs
  "serviceArea"    TEXT,
  "status"         TEXT        NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  "isFeatured"     BOOLEAN     NOT NULL DEFAULT false,
  "seoTitle"       TEXT,
  "seoDescription" TEXT,
  "viewCount"      INTEGER     NOT NULL DEFAULT 0,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "Business_slug_key"        UNIQUE ("slug"),
  CONSTRAINT "Business_userId_fkey"     FOREIGN KEY ("userId")      REFERENCES "User"("id")      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Business_categoryId_fkey"  FOREIGN KEY ("categoryId")  REFERENCES "Category"("id")  ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Business_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id")  ON DELETE SET NULL ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- SavedBusiness
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SavedBusiness" (
  "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"     UUID        NOT NULL,
  "businessId" UUID        NOT NULL,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "SavedBusiness_userId_businessId_key" UNIQUE ("userId", "businessId"),
  CONSTRAINT "SavedBusiness_userId_fkey"           FOREIGN KEY ("userId")     REFERENCES "User"("id")     ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "SavedBusiness_businessId_fkey"       FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- Event
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Event" (
  "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"          TEXT        NOT NULL,
  "slug"           TEXT        NOT NULL,
  "description"    TEXT        NOT NULL,
  "content"        TEXT,       -- Rich content/HTML
  "date"           TIMESTAMPTZ NOT NULL,
  "endDate"        TIMESTAMPTZ,
  "location"       TEXT,
  "city"           TEXT,
  "state"          TEXT,
  "imageUrl"       TEXT,
  "category"       TEXT,
  "communityId"    UUID,
  "businessId"     UUID,
  "isPublished"    BOOLEAN     NOT NULL DEFAULT true,
  "isFeatured"     BOOLEAN     NOT NULL DEFAULT false,
  "seoTitle"       TEXT,
  "seoDescription" TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "Event_slug_key"        UNIQUE ("slug"),
  CONSTRAINT "Event_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Event_businessId_fkey"  FOREIGN KEY ("businessId")  REFERENCES "Business"("id")  ON DELETE SET NULL ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- EventRegistration
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "EventRegistration" (
  "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"    UUID        NOT NULL,
  "eventId"   UUID        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "EventRegistration_userId_eventId_key" UNIQUE ("userId", "eventId"),
  CONSTRAINT "EventRegistration_userId_fkey"        FOREIGN KEY ("userId")  REFERENCES "User"("id")  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EventRegistration_eventId_fkey"       FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ----------------------------------------------------------------------------
-- News
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "News" (
  "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"          TEXT        NOT NULL,
  "slug"           TEXT        NOT NULL,
  "excerpt"        TEXT,
  "content"        TEXT        NOT NULL,
  "imageUrl"       TEXT,
  "category"       TEXT,
  "isPublished"    BOOLEAN     NOT NULL DEFAULT true,
  "isFeatured"     BOOLEAN     NOT NULL DEFAULT false,
  "seoTitle"       TEXT,
  "seoDescription" TEXT,
  "authorId"       TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "News_slug_key" UNIQUE ("slug")
);

-- ----------------------------------------------------------------------------
-- ContactMessage
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"      TEXT        NOT NULL,
  "email"     TEXT        NOT NULL,
  "phone"     TEXT,
  "subject"   TEXT        NOT NULL,
  "message"   TEXT        NOT NULL,
  "isRead"    BOOLEAN     NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- SiteSetting
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  "id"    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key"   TEXT NOT NULL,
  "value" TEXT NOT NULL,

  CONSTRAINT "SiteSetting_key_key" UNIQUE ("key")
);

-- ----------------------------------------------------------------------------
-- ContentBlock
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ContentBlock" (
  "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "key"       TEXT        NOT NULL,
  "title"     TEXT        NOT NULL,
  "content"   TEXT,
  "imageUrl"  TEXT,
  "isActive"  BOOLEAN     NOT NULL DEFAULT true,
  "order"     INTEGER     NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "ContentBlock_key_key" UNIQUE ("key")
);

-- ----------------------------------------------------------------------------
-- AuditLog
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"     UUID,
  "action"     TEXT        NOT NULL,
  "resource"   TEXT        NOT NULL,
  "resourceId" TEXT,
  "details"    TEXT,
  "ipAddress"  TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================================================
-- INDEXES (DROP IF EXISTS + CREATE for idempotency)
-- ============================================================================

-- State indexes
DROP INDEX IF EXISTS "State_slug_idx";
CREATE INDEX "State_slug_idx" ON "State" ("slug");

-- City indexes
DROP INDEX IF EXISTS "City_slug_idx";
CREATE INDEX "City_slug_idx" ON "City" ("slug");

DROP INDEX IF EXISTS "City_stateId_idx";
CREATE INDEX "City_stateId_idx" ON "City" ("stateId");

-- Community indexes
DROP INDEX IF EXISTS "Community_slug_idx";
CREATE INDEX "Community_slug_idx" ON "Community" ("slug");

DROP INDEX IF EXISTS "Community_cityId_idx";
CREATE INDEX "Community_cityId_idx" ON "Community" ("cityId");

-- User indexes
DROP INDEX IF EXISTS "User_communityId_idx";
CREATE INDEX "User_communityId_idx" ON "User" ("communityId");

DROP INDEX IF EXISTS "User_role_idx";
CREATE INDEX "User_role_idx" ON "User" ("role");

-- Category indexes
DROP INDEX IF EXISTS "Category_slug_idx";
CREATE INDEX "Category_slug_idx" ON "Category" ("slug");

DROP INDEX IF EXISTS "Category_parentId_idx";
CREATE INDEX "Category_parentId_idx" ON "Category" ("parentId");

-- Business indexes
DROP INDEX IF EXISTS "Business_slug_idx";
CREATE INDEX "Business_slug_idx" ON "Business" ("slug");

DROP INDEX IF EXISTS "Business_status_idx";
CREATE INDEX "Business_status_idx" ON "Business" ("status");

DROP INDEX IF EXISTS "Business_communityId_idx";
CREATE INDEX "Business_communityId_idx" ON "Business" ("communityId");

DROP INDEX IF EXISTS "Business_userId_idx";
CREATE INDEX "Business_userId_idx" ON "Business" ("userId");

DROP INDEX IF EXISTS "Business_categoryId_idx";
CREATE INDEX "Business_categoryId_idx" ON "Business" ("categoryId");

-- Event indexes
DROP INDEX IF EXISTS "Event_slug_idx";
CREATE INDEX "Event_slug_idx" ON "Event" ("slug");

DROP INDEX IF EXISTS "Event_communityId_idx";
CREATE INDEX "Event_communityId_idx" ON "Event" ("communityId");

DROP INDEX IF EXISTS "Event_isFeatured_idx";
CREATE INDEX "Event_isFeatured_idx" ON "Event" ("isFeatured");

DROP INDEX IF EXISTS "Event_date_idx";
CREATE INDEX "Event_date_idx" ON "Event" ("date");

DROP INDEX IF EXISTS "Event_businessId_idx";
CREATE INDEX "Event_businessId_idx" ON "Event" ("businessId");

-- News indexes
DROP INDEX IF EXISTS "News_slug_idx";
CREATE INDEX "News_slug_idx" ON "News" ("slug");

DROP INDEX IF EXISTS "News_isFeatured_idx";
CREATE INDEX "News_isFeatured_idx" ON "News" ("isFeatured");

-- ContentBlock indexes
DROP INDEX IF EXISTS "ContentBlock_key_idx";
CREATE INDEX "ContentBlock_key_idx" ON "ContentBlock" ("key");

DROP INDEX IF EXISTS "ContentBlock_order_idx";
CREATE INDEX "ContentBlock_order_idx" ON "ContentBlock" ("order");

-- AuditLog indexes
DROP INDEX IF EXISTS "AuditLog_action_idx";
CREATE INDEX "AuditLog_action_idx" ON "AuditLog" ("action");

DROP INDEX IF EXISTS "AuditLog_resource_idx";
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog" ("resource");

DROP INDEX IF EXISTS "AuditLog_userId_idx";
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog" ("userId");

DROP INDEX IF EXISTS "AuditLog_createdAt_idx";
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog" ("createdAt");

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION (auto-update updatedAt on row change)
-- ============================================================================

CREATE OR REPLACE FUNCTION "update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to every table that has an updatedAt column

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'State', 'City', 'Community', 'User', 'Category',
    'Business', 'Event', 'News', 'ContentBlock', 'AuditLog'
  ]) LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW
         EXECUTE FUNCTION "update_updated_at_column"();',
      t, t
    );
  END LOOP;
END
$$;

-- ============================================================================
-- RLS (Row Level Security) — enable on all tables for Supabase
-- ============================================================================

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'User', 'State', 'City', 'Community', 'Category',
    'Business', 'SavedBusiness', 'Event', 'EventRegistration',
    'News', 'ContactMessage', 'SiteSetting', 'ContentBlock', 'AuditLog'
  ]) LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END
$$;

-- ============================================================================
-- RLS POLICIES — Allow full access via anon key (our API handles auth logic)
-- Our app uses custom JWT auth in API routes, not Supabase Auth.
-- The publishable key needs full CRUD on all tables.
-- ============================================================================

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'User', 'State', 'City', 'Community', 'Category',
    'Business', 'SavedBusiness', 'Event', 'EventRegistration',
    'News', 'ContactMessage', 'SiteSetting', 'ContentBlock', 'AuditLog'
  ]) LOOP
    -- Allow all operations for anon key (our API routes handle authorization)
    EXECUTE format('DROP POLICY IF EXISTS "%s_all_anon" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "%s_all_anon" ON %I FOR ALL USING (true) WITH CHECK (true);', t, t);
  END LOOP;
END
$$;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
