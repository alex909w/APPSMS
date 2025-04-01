-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create configuration table
CREATE TABLE IF NOT EXISTS configuration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sms_provider TEXT,
  api_key TEXT,
  api_secret TEXT,
  from_number TEXT,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_configuration_user_id ON configuration(user_id);

-- Create RLS policies for activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for configuration
ALTER TABLE configuration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own configuration" ON configuration
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own configuration" ON configuration
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own configuration" ON configuration
  FOR UPDATE USING (auth.uid() = user_id);

-- Create stored procedure for executing queries (for compatibility)
CREATE OR REPLACE FUNCTION execute_query(query_text TEXT, params_array JSONB DEFAULT '[]')
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE query_text INTO result USING params_array;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

