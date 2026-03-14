-- Run this script in your Supabase SQL Editor for your newly linked project

-- 1. Create the base table if it doesn't exist
CREATE TABLE IF NOT EXISTS eacapplications (
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
ALTER TABLE eacapplications
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
-- SELECT * FROM eacapplications LIMIT 1;

-- 3. Create table for handling email OTP verifications
CREATE TABLE IF NOT EXISTS otps (
  email text primary key,
  code text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);
