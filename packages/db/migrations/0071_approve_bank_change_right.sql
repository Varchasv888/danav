-- Owners and admins hold the new right to approve bank detail changes; other roles do not.
UPDATE roles
   SET permissions = ARRAY(SELECT DISTINCT p FROM unnest(permissions || ARRAY['special.approveBankChange']) AS p ORDER BY p)
 WHERE key IN ('owner', 'admin');
