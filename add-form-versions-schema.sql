-- Add version tracking to personal injury forms
ALTER TABLE personal_injury_forms 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- Create index for version queries
CREATE INDEX IF NOT EXISTS idx_personal_injury_forms_version ON personal_injury_forms(version);

-- Add version tracking to wrongful death forms
ALTER TABLE wrongful_death_forms 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- Create index for version queries
CREATE INDEX IF NOT EXISTS idx_wrongful_death_forms_version ON wrongful_death_forms(version);

-- Add version tracking to wrongful termination forms
ALTER TABLE wrongful_termination_forms 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- Create index for version queries
CREATE INDEX IF NOT EXISTS idx_wrongful_termination_forms_version ON wrongful_termination_forms(version);

-- Function to update form version history
CREATE OR REPLACE FUNCTION update_form_version_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment version number
  NEW.version = COALESCE(OLD.version, 0) + 1;
  
  -- Add previous version to history if this is an update (not insert)
  IF TG_OP = 'UPDATE' THEN
    NEW.version_history = COALESCE(OLD.version_history, '[]'::jsonb) || 
      jsonb_build_object(
        'version', OLD.version,
        'timestamp', OLD.updated_at,
        'changes', jsonb_build_object(
          'updated_by', NEW.submitted_by,
          'previous_data', row_to_json(OLD)::jsonb
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for version tracking
DROP TRIGGER IF EXISTS personal_injury_forms_version_trigger ON personal_injury_forms;
CREATE TRIGGER personal_injury_forms_version_trigger
  BEFORE UPDATE ON personal_injury_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_form_version_history();

DROP TRIGGER IF EXISTS wrongful_death_forms_version_trigger ON wrongful_death_forms;
CREATE TRIGGER wrongful_death_forms_version_trigger
  BEFORE UPDATE ON wrongful_death_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_form_version_history();

DROP TRIGGER IF EXISTS wrongful_termination_forms_version_trigger ON wrongful_termination_forms;
CREATE TRIGGER wrongful_termination_forms_version_trigger
  BEFORE UPDATE ON wrongful_termination_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_form_version_history();