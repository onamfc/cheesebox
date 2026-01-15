-- Fix existing team members that have user_id but wrong status or missing email
-- This corrects data from before the status field was properly set

UPDATE team_members tm
SET
  status = 'ACCEPTED',
  email = u.email
FROM users u
WHERE tm.user_id = u.id
  AND tm.user_id IS NOT NULL
  AND (tm.status = 'PENDING' OR tm.email IS NULL);
