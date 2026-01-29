/*
  # Add invite tracking to empleados table

  1. Changes
    - Add `invite_status` column to track invitation state (pending, accepted, none)
    - Add `invite_sent_at` timestamp to track when invitation was sent
    - Add `auth_user_id` to link employee to Supabase auth user

  2. Notes
    - These columns enable tracking of user invitations for the invite-only signup system
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'invite_status'
  ) THEN
    ALTER TABLE empleados ADD COLUMN invite_status text DEFAULT 'none';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'invite_sent_at'
  ) THEN
    ALTER TABLE empleados ADD COLUMN invite_sent_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE empleados ADD COLUMN auth_user_id uuid;
  END IF;
END $$;
