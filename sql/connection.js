const mysql = require('mysql')
require('dotenv').config();

let connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
);

connection.connect();

//basic promise wrapper
connection.queryPromise = (sql, params) => {
  return new Promise( (resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};

// go farther and process the results of the promise and return the results
connection.querySync = async (sql, params) => {
  let promise = new Promise ( ( resolve, reject) => {
    console.log("Executing query: ", sql);
    connection.query(sql, params, (err, results) => {
      if(err) {
        console.log("rejecting");
        return reject(err);
      } else {
        console.log("resolving");
        return resolve(results);
    }
})
})
let results = await promise.then ( (results) => {
  console.log("results ", results);
  return results;
}).catch ( (err) => {
  throw err;
})
return results;
}
//connection.query(sql, callback-function)

//test to see if connection was made
connection.query("select now()", (err, rows) => {
  if (err) {
    console.log("Not connected", err);
  } else {
    console.log("Connected ", rows);
  }
});

module.exports = connection;

// class Connection {
//   constructor() {
//     if (!this.pool) {
//       console.log('creating connection...')
//       this.pool = mysql.createPool({
//         connectionLimit: 100,
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PWD,
//         database: process.env.DB_NAME
//       })

//       return this.pool
//     }

//     return this.pool
//   }
// }

// const instance = new Connection()

// module.exports = instance;