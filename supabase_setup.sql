-- Run this script in your Supabase SQL Editor for your newly linked project

-- 1. Create the base table if it doesn't exist
CREATE TABLE IF NOT EXISTS EACapplications (
  id uuid default gen_random_uuid() primary key,
  application_number text unique not null,
  email text not null,
  phone text not null,
  experience text,
  relocate text,
  language text,
  status text,
  created_at timestamp with time zone default now()
);

-- 2. Add all the new columns to the table
ALTER TABLE EACapplications
ADD COLUMN IF NOT EXISTS origin_country text,
ADD COLUMN IF NOT EXISTS destination_country text,
ADD COLUMN IF NOT EXISTS job_sector text,
ADD COLUMN IF NOT EXISTS job_subcategory text,
ADD COLUMN IF NOT EXISTS interview_date date,
ADD COLUMN IF NOT EXISTS interview_time time,
ADD COLUMN IF NOT EXISTS mpesa_code text,
ADD COLUMN IF NOT EXISTS remarks text,
ADD COLUMN IF NOT EXISTS is_job_selected smallint default 0;

-- Optional: Verify structure
-- SELECT * FROM EACapplications LIMIT 1;
