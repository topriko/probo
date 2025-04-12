CREATE TYPE risk_treatment AS ENUM ('MITIGATED', 'TRANSFERRED', 'AVOIDED', 'ACCEPTED');

ALTER TABLE risks ADD COLUMN treatment risk_treatment NOT NULL DEFAULT 'MITIGATED';
ALTER TABLE risks ALTER COLUMN treatment DROP DEFAULT;