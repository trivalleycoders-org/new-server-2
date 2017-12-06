# Server

## routes: members
### post('/')

#### Data expected
1. first_name
1. last_name
1. email
1. comment
1. phone_number
1. active (0/1)

#### Query
````
INSERT INTO members SET ?
````

#### Data returned
````
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 9,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}

````

### get('/')
#### Data expected
**none**

#### Query
````
SELECT * FROM members WHERE active != 0
````

#### Date returned
````
RowDataPacket {
   member_id: 8,
   first_name: 'first08',
   last_name: 'last08',
   email: 'email08@email.com',
   exempt: 0,
   comment: null,
   phone_number: '222-222-2228',
   active: 1
}
````

### put('/:id')
#### Data expected
````
{
  member_id: 9,
  first_name: 'kkk',
  last_name: 'dd',
  email: 'ee@dd',
  exempt: 0,
  comment: 'bla bla ',
  phone_number: '555-4444',
  active: 1
}
````

#### Query
````
UPDATE members SET ? WHERE member_id = ?
````

#### Data returned
````
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1
}
````

### delete('/:id')
**This seems to be legacy. We agreed to not do a delete but to set the active column to 0.**
#### Data expected
1. id (a valid member_id)

#### Query
````
DELETE FROM members WHERE member_id = ?
````

#### Data returned
**not working**


## routes: schedule

### get('/scheduleMembers')

#### Data expected
**none**

#### Query
````
SELECT (select (@row:=@row+1) FROM (select @row := 0) s) as sequence, m.member_id, m.first_name, m.last_name, h.history_id, h.date, h.role_id, r.role_name, m.comment
FROM members m
LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
LEFT JOIN roles r on r.role_id = h.role_id
WHERE m.exempt = 0
ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
LIMIT 12;
````

#### Data returned
````
[
  RowDataPacket {
    sequence: 9,
    member_id: 9,
    first_name: 'kkk',
    last_name: 'dd',
    history_id: null,
    date: null,
    role_id: null,
    role_name: null,
    comment: 'bla bla '
  },
  RowDataPacket {
    sequence: 4,
    member_id: 4,
    first_name: 'first04',
    last_name: 'last04',
    history_id: null,
    date: null,
    role_id: null,
    role_name: null,
    comment: ''
  },
]
````

### get('/roles')

#### Data expected
**none**

#### Query
````
SELECT * FROM roles
````

#### Data returned
````
[
  RowDataPacket {
    role_id: 1,
    role_name: 'role01',
    served: null
  },
  ...
  ...
  RowDataPacket {
    role_id: 6,
    role_name: 'role06',
    served: null
  }
]
````

### get('/exclusions')

#### Data expected
**none**

#### Query
````
SELECT * FROM exclusions
````

#### Data returned
````
[
  RowDataPacket {
    exclusion_id: 1,
    member_id: 5,
    role_id: 4
  },
  RowDataPacket {
    exclusion_id: 2,
    member_id: 5,
    role_id: 3
  },
  RowDataPacket {
    exclusion_id: 3,
    member_id: 3,
    role_id: 2
  }
]
````
