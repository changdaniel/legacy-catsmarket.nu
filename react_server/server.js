const express = require('express')
const cors = require('cors')
const app = express()
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let db = new sqlite3.Database('./data.db', (err) => {
	if (err) {
	  console.error(err.message);
	}
	console.log('Connected to data.db');
  });


const posts = [
	{
		body: 'Hello world',
		date: '2/17/19'
	},
	{
		body: 'Brutal and Extended Cold Blast could shatter ALL RECORDS - Whatever happened to Global Warming?',
		date: '2/16/19'
	},

]

app.use(cors())

app.post('/get-catalog', (request, response) => {
	
	var catalog = [];
	const term =  request.body.term;
	const school = request.body.school;
	const department = request.body.department;
	const course = request.body.course;

	let sql = "SELECT ORDERID, TITLE, ISBN10, MIN(a.PRICE) PRICE, (SELECT MIN(b.DATETIME) FROM catalog b "
	+ "WHERE b.TERM = '" + term
	+ "' AND b.SCHOOL = '" + school 
	+ "' AND b.DEPARTMENT = '" + department 
	+ "' AND b.COURSE = '" + course 
	+ "' AND b.ISBN10 = a.ISBN10 AND b.PRICE = MIN(a.PRICE)) DATETIME FROM catalog a "
	+ "WHERE a.TERM = '" + term 
	+ "' AND a.SCHOOL = '" + school 
	+ "' AND a.DEPARTMENT = '" + department 
	+ "' AND a.COURSE = '" + course 
	+ "' GROUP BY a.SCHOOL,a.DEPARTMENT,a.COURSE,a.ISBN10";


	console.log(sql)

	db.all(sql, [], (err, rows) => {


		if (err) {
		  return console.error(err.message);
		}
		
		rows.forEach((row) => {

			catalog.push(row)
		})
		console.log(catalog)

		response.send(catalog)

	})

})

app.post('/sell-from-isbn', (request, response) => {
	
	const term =  request.body.term;
	const school = request.body.school;
	const department = request.body.department;
	const course = request.body.course;

	let sql = "SELECT ORDERID, TITLE, ISBN10, SELLEREMAIL, MIN(c.PRICE) PRICE, MIN(c.DATETIME) DATETIME FROM catalog c WHERE TERM = '" + term 
	+ "' AND SCHOOL = '" + school 
	+ "' AND DEPARTMENT = '" + department 
	+ "' AND COURSE = '" + course 
	+ "' GROUP BY c.SCHOOL,c.DEPARTMENT,c.COURSE,c.ISBN10";




	// let sql = "SELECT ORDERID, TITLE, MIN(a.PRICE) PRICE, "
	// +"SUBSTRING (CAST ((SELECT MIN(CAST(b.DATETIME as DATETIME)) DATETIME FROM catalog b"
	// console.log(sql)

	// if(){

	// }
	// else{

	// }

})


app.post('/sell-from-listing', (request, response) => {
	
	const orderid = request.body.orderid;




	// let sql = "SELECT ORDERID, TITLE, MIN(a.PRICE) PRICE, "
	// +"SUBSTRING (CAST ((SELECT MIN(CAST(b.DATETIME as DATETIME)) DATETIME FROM catalog b"
	// console.log(sql)

	// if(){

	// }
	// else{

	// }

})




app.get('/posts', (request, response) => {
	response.json(posts)
})


// app.get('/add-post', (request, response) => {
	
// 	app.render('add-post-page')
// 	posts.push({
// 		body: '' + Math.random(),
// 		date: 'just now'
// 	})
// })


app.get('/add-post', function (request, response) {

  response.render('add-post-page')
})

app.get('/add-post-process', function (request, response) {

  const message = request.query.message
  var today = new Date();

  const time = (today.getHours() - 12) + ":" + today.getMinutes() + ":" + today.getSeconds()

  posts.push({
	  body: message,
	  date: time
  })

  response.redirect("/posts")

})

app.listen(8080, () => {
	console.log('Server listening at http://0.0.0.0:8080')
})
