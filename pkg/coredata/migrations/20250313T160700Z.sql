ALTER TABLE controls ADD COLUMN standards TEXT[] DEFAULT '{}' NOT NULL;
ALTER TABLE controls ALTER COLUMN standards DROP DEFAULT;