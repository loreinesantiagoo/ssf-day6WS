require('dotenv').config();

const express = require('express'),
     bodyParser = require('body-parser'),
     mysql = require('mysql'),
     q = require('q');

//create instance of express
const app = express();
const NODE_PORT = process.env.PORT;

const sqlFindAllFilms = "SELECT * FROM film";

console.log("DB USER : " + process.env.DB_USER);
console.log("DB NAME : " + process.env.DB_NAME);

//driver
/**
 * DB_HOST="localhost"
 * DB_PORT=3360
 * user=root
 * password=password@123
 * database=sakila
 * 4
 */
const pool = mysql.createPool({
    host: "process.env.DB_HOST",
    port: "process.env.DB_PORT",
    user: "process.env.DB_USER",
    password: "process.env.DB_PASSWORD",
    database: "process.env.DB_NAME",
    connectionLimit : "process.env.DB_CONLIMIT"
    //,debug: true

});

//routes/query

var makeQuery = (sql, pool) =>{
    console.log(sql);

    return(args) =>{
        
        pool.getConnection((err, connection) =>{
            if (err) {
                defer.reject(err);
                return;
            }
        console.log(args);
        connection.query(sql, args || [], (err, results) =>{
            connection.release();
            if (err) {
                defer.reject(err);
                return;
            }
            console.log(">>>", + results);
            defer.resolve(results);
        })    
        })
        return defer.promise;
    }
}

var findAllFilms = makeQuery(sqlFindAllFilms, pool);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/films", (req, res)=>{
    findAllFilms().then((results)=>{
        res.json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    });
});

//start server
app.listen(NODE_PORT, ()=>{
    console.log(`Listening to server at ${NODE_PORT}`)
})