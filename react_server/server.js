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

	let sql = "SELECT * FROM catalog c WHERE TERM = '" + term 
	+ "' AND SCHOOL = '" + school 
	+ "' AND DEPARTMENT = '" + department 
	+ "' AND COURSE = '" + course 
	+ "' AND c.PRICE in (select min(PRICE) from catalog)";
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
