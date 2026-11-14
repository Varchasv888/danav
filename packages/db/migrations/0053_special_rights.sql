-- Special rights (back-dating, future dating, selling below cost, agent commission, import): everyone who
-- could do these things before keeps the right, so nothing stops working. Owners can now take them away per role.
UPDATE roles
   SET permissions = ARRAY(SELECT DISTINCT p FROM unnest(permissions || ARRAY[
         'special.changeDate', 'special.futureDate', 'special.sellBelowCost', 'special.seeAgentCommission', 'special.importData'
       ]) AS p ORDER BY p)
 WHERE key <> 'viewer';
