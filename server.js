// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require('mysql');

// Create an instance of the express app.
const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// MySQL DB Connection Information (remember to change this with our specific credentials)
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ice_creamdb"
  });
  
  // Initiate MySQL Connection.
connection.connect(function(err) {
if (err) {
    console.error("error connecting: " + err.stack);
    return;
}
console.log("connected as id " + connection.threadId);
});


app.use(express.static('public'))

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const icecreams = [
    {name: 'vanilla', price: 10, awesomeness: 3},
    {name: 'chocolate', price: 4, awesomeness: 8},
    {name: 'banana', price: 1, awesomeness: 1},
    {name: 'greentea', price: 5, awesomeness: 7},
    {name: 'jawbreakers', price: 6, awesomeness: 2},
    { name: "pistachio", price: 11, awesomeness: 15 }
  ];

app.get('/', (req, res) => {
    connection.query(
        `SELECT * FROM products`, 
        (err, result) =>  res.render('index',{ icecreams: result })
    )
})

app.get('/icecreams/:icecream', (req, res) => {
    connection.query(
        `SELECT * FROM products WHERE flavor = ?`, [req.params.icecream],
        (err, result) =>  {
            console.log(result)
            return res.render('single-icecream', result[0])
        }
    )

})

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });