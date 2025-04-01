-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group contacts junction table
CREATE TABLE IF NOT EXISTS group_contacts (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, contact_id)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Variables table
CREATE TABLE IF NOT EXISTS variables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_groups_user_id ON groups(user_id);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_variables_user_id ON variables(user_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_contact_id ON messages(contact_id);
CREATE INDEX idx_messages_template_id ON messages(template_id);

-- Create Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Contacts policies
CREATE POLICY "Users can view their own contacts" ON contacts
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own contacts" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own contacts" ON contacts
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own contacts" ON contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables
-- Groups
CREATE POLICY "Users can view their own groups" ON groups
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own groups" ON groups
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own groups" ON groups
  FOR DELETE USING (auth.uid() = user_id);

-- Group contacts
CREATE POLICY "Users can view their own group contacts" ON group_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_contacts.group_id
      AND groups.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can insert their own group contacts" ON group_contacts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_contacts.group_id
      AND groups.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can delete their own group contacts" ON group_contacts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_contacts.group_id
      AND groups.user_id = auth.uid()
    )
  );

-- Templates
CREATE POLICY "Users can view their own templates" ON templates
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own templates" ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own templates" ON templates
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own templates" ON templates
  FOR DELETE USING (auth.uid() = user_id);

-- Variables
CREATE POLICY "Users can view their own variables" ON variables
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own variables" ON variables
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own variables" ON variables
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own variables" ON variables
  FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own messages" ON messages
  FOR DELETE USING (auth.uid() = user_id);

