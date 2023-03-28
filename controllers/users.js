const mysql = require('mysql')
const db = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  let sql = "select * from users u "
  sql += "join usersAddress ua on u.id = ua.user_id "
  sql += "join usersContact uc on u.id = uc.user_id"

  // let sql = "SELECT * FROM users";

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error description ", err);
      res.sendStatus(500);
    } else {
      res.json(rows);
    }
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>

  let id = req.params.id;
  let params = [id];

  let sql = "select * from users u "
  sql += "join usersAddress ua on u.id = ua.user_id "
  sql += "join usersContact uc on u.id = uc.user_id "
  sql += "and u.id = ?";

  //let sql = "QUERY GOES HERE"
  // WHAT GOES IN THE BRACKETS

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("getUserById query failed ", err);
      res.sendStatus(400);
    } else {
      res.json(rows);
    }
  })
}

const createUser = async (req, res) => {
  let first = req.body.first_name;
  let last = req.body.last_name;

  let params = [first, last];
  let sql = "insert into users(first_name, last_name) values (?, ?)";

  let results;

  try {
    results = await db.querySync(sql, params);
  } catch (err) {
    console.log("insert user query failed ", err)
    res.sendStatus(500);
    return;
  }
  let id = results.insertId;

  let address = req.body.address;
  let city = req.body.city;
  let county = req.body.count;
  let state = req.body.state;
  let zip = req.body.zip;

  params = [id, address, city, county, state, zip];

  sql = "insert into usersAddress (user_id, address, city, county, state, zip) values (?, ?, ?, ?, ?, ?)"

  try {
    results = await db.querySync(sql, params);
  } catch (err) {
    console.log("insert usersAddress query failed ", err)
    res.sendStatus(500);
    return; // if this query didn't work, stop
  }

  // THIRD QUERY
  let phone1 = req.body.phone1;
  let phone2 = req.body.phone2;
  let email = req.body.email;

  params = [id, phone1, phone2, email];

  sql = "insert into usersContact (user_id, phone1, phone2, email) values (?, ?, ?, ?)"

  try {
    results = await db.querySync(sql, params);
  } catch (err) {
    console.log("insert usersContact query failed ", err)
    res.sendStatus(500);
    return; // if this query didn't work, stop
  }

}


const createUserCallbackHell = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = "insert into users (first_name, last_name) values (?, ?)";
  let first = req.body.first_name;
  let last = req.body.last_name;

  let params = [first, last];


  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("error message ", err);
      res.sendStatus(500);
    } else {
      sql = "select MAX(id) as id from users where first_name = ? and last_name = ?"
      db.query(sql, params, (err, rows) => {
        if (err) {
          console.log("get id query failed ", err)
          res.sendStatus(500)
        } else {
          //res.json(rows);
          let id = rows[0].id;
          let address = req.body.address;
          let city = req.body.city;
          let county = req.body.county;
          let state = req.body.state;
          let zip = req.body.zip;

          let params = [id, address, city, county, state, zip];

          sql = "insert into usersAddress (user_id, address, city, county, state, zip) values (?, ?, ?, ?, ?, ?)"

          db.query(sql, params, (err, rows) => {
            if (err) {
              console.log("insert address query failed ", err)
              res.sendStatus(500);
            } else {
              //res.json(rows)
              let phone1 = req.body.phone1;
              let phone2 = req.body.phone2;
              let email = req.body.email;

              params = [id, phone1, phone2, email];

              sql = "insert into usersContact (user_id, phone1, phone2, email) values (?, ?, ?, ?)";

              db.query(sql, params, (err, rows) => {
                if (err) {
                  console.log("insert contact query failed");
                  res.sendStatus(500);
                } else {
                  res.json(rows);
                }
              })
            }
          })
        }
      })
    }
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>

  let id = req.params.id;
  let first = req.body.first_name;
  let last = req.body.last_name;
  let params = [id, first, last];
  let sql = "update users set first_name = ?, last_name = ? where id = ?"

  if (!id) {
    res.sendStatus(400);
    return;
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("updateUserById query failed ", err);
      res.sendStatus(400);
    } else {
      res.json(rows);
    }
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let first = req.params.first_name;
  let params = [first];

  if (!first) {
    res.sendStatus(400);
    return;
  }

  let sql = " delete from users where first_name =?"


  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("deleteUserByFirstName query failed ", err);
    } else {
      res.json({ message: `Deleted ${rows.affectedRows} user(s)` });
    }
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}