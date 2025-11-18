-- Add full-text search support for packages table
-- This migration adds tsvector column and GIN indexes for fast search

-- Add search_vector column for full-text search
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search_vector
CREATE OR REPLACE FUNCTION packages_search_vector_update() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search_vector
DROP TRIGGER IF EXISTS packages_search_vector_trigger ON packages;
CREATE TRIGGER packages_search_vector_trigger
BEFORE INSERT OR UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION packages_search_vector_update();

-- Update existing rows
UPDATE packages SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(location, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(city, '')), 'C');

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_packages_search_vector 
ON packages USING GIN(search_vector);

-- Create additional indexes for filtering
CREATE INDEX IF NOT EXISTS idx_packages_price 
ON packages(price) WHERE status = 'PUBLISHED';

CREATE INDEX IF NOT EXISTS idx_packages_type_city 
ON packages(type, city) WHERE status = 'PUBLISHED';

CREATE INDEX IF NOT EXISTS idx_packages_dates
ON packages("startDate", "endDate") WHERE status = 'PUBLISHED';

-- Create composite index for common search + filter queries
CREATE INDEX IF NOT EXISTS idx_packages_search_composite
ON packages(type, city, price) WHERE status = 'PUBLISHED';

-- Add index for sorting by popularity (we'll use review count as proxy)
CREATE INDEX IF NOT EXISTS idx_packages_created_at
ON packages("createdAt" DESC) WHERE status = 'PUBLISHED';

-- Comment on the search_vector column
COMMENT ON COLUMN packages.search_vector IS 'Full-text search vector with weighted fields: title (A), description (B), location/city (C)';

