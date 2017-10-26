 -- get the least recent volunteers
SELECT h.history_id, h.date, h.member_id, h.role_id, h.served, m.first_name, r.role_name
FROM history h
LEFT JOIN members m ON m.member_id = h.member_id
LEFT JOIN roles r ON r.role_id = h.role_id
WHERE m.exempt != 1
GROUP By h.member_id
ORDER BY h.date ASC

-- get members who haven't volunteered at all, or who volunteered least recently, excluding those who are exempt
SELECT m.member_id, m.first_name, m.last_name, h.history_id, MAX(h.date), h.role_id, h.served, r.role_name
FROM members m
LEFT JOIN history h ON h.member_id = m.member_id AND h.date = MAX(h.date)
LEFT JOIN roles r ON r.role_id = h.role_id
WHERE m.exempt = 0 AND (h.history_id IS NULL OR h.served = 1)
GROUP BY m.member_id
ORDER BY (h.history_id IS NULL) DESC, h.date ASC

-- Jim's better query
SELECT (select (@row:=@row+1) from (select @row := 0) s) as sequence, m.member_id, m.first_name, m.last_name, h.history_id, h.date, h.role_id, r.role_name
FROM members m
LEFT JOIN history h ON h.member_id = m.member_id
LEFT JOIN roles r ON r.role_id = h.role_id
INNER JOIN (
  SELECT x.member_id, MAX(x.date) as max_date
  FROM history x
  GROUP BY x.member_id
) AS y ON m.member_id = y.member_id AND h.date = y.max_date
WHERE m.exempt = 0
ORDER BY (h.history_id IS NULL) DESC, h.date ASC
LIMIT 12;

-- mcc wip
SELECT (SELECT (@row:=@row+1) FROM (SELECT @row := 0) s) AS sequence, m.member_id, m.first_name, m.last_name, y.history_id, y.max_date, y.role_id, r.role_name
FROM members m
LEFT JOIN (
  SELECT x.member_id, MAX(x.date) as max_date, MAX(x.history_id), x.role_id
  FROM history x
  WHERE x.served != 0
  GROUP BY x.member_id
) AS y ON m.member_id = y.member_id
LEFT JOIN roles r ON r.role_id = y.role_id
WHERE m.exempt = 0
ORDER BY (y.history_id IS NULL) DESC, y.max_date ASC
LIMIT 12;


select the member info from the members table
  and the history id, date and role id from the history table for the most recent history date for each member

SELECT m.member_id, m.first_name, m.last_name, h.history_id, h.date, h.role_id
FROM members m
LEFT JOIN history h ON h.member_id = m.member_id AND (h.history_id IN (SELECT t.history_id FROM (SELECT h1.member_id, h1.history_id, MAX(h1.date) AS last_date FROM history h1 GROUP BY h1.member_id HAVING h1.date = last_date) AS t))
WHERE m.exempt = 0
ORDER BY (h.history_id IS NULL) DESC, h.date ASC


LEFT JOIN roles r on r.role_id = h.role_id
, r.role_name



LEFT JOIN history h ON h.member_id = m.member_id
                     AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id) AS t))
