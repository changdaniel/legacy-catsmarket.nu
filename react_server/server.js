const express = require('express')
const cors = require('cors')
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const nodemaileraccount = require('./nodemaileraccount.json')


	// var mailOptions = {
	// from: 'catsmarkettest@gmail.com',
	// to: 'danielchang2022@u.northwestern.edu, changdaniel116@gmail.com',
	// subject: 'Sending Email using Node.js',
	// html: "<h3> REMEMBER! Stay safe when meeting to exchange this textbook.  Here are some tips: </h3>"
	// + "<p>1. Meet in a public place with people around, such as Norris, a library, or a coffee shop.  NUPD is a convenient off-campus location as well. </p>"
	// + "<p>2. Meet during the day.</p>"
	// + "<p>3. Confirm the price, book quality, and payment method before hand to avoid confusion.</p>"
	// };
  
  // transporter.sendMail(mailOptions, function(error, info){
	// if (error) {
	//   console.log(error);
	// } else {
	//   console.log('Email sent: ' + info.response);
	// }
  // });



let db = new sqlite3.Database('./data.db', (err) => {
	if (err) {
	  console.error(err.message);
	}
	console.log('Connected to data.db');
});

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: nodemaileraccount.user,
	  pass: nodemaileraccount.pass
	}
  });



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

app.post('/sell', (request, response) => {

	console.log(request)

	const isbn10 = request.body.isbn10;
	const term =  request.body.term;
	const school = request.body.school;
	const department = request.body.department;
	const course = request.body.course;
	const price = request.body.price;
	const title = request.body.title;
	const selleremail = request.body.selleremail;
	
	if(title == ""){

		

	}
	else{
	
		values = [term, school, department, course, selleremail, price, isbn10, title]
		db.run(`INSERT INTO catalog(ORDERID, TERM, SCHOOL, DEPARTMENT, COURSE, SELLEREMAIL, PRICE, ISBN10, TITLE, DATETIME) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME("now"));`, values, function (err) {
				if (err) {
					return console.log(err.message);
				}
				console.log(`A row has been inserted`);
				return;
			})

	}
})

app.post('/buy', (request, response) => {
	
		const isbn10 = request.body.isbn10;
		const price = request.body.price;
		const title = request.body.title;
		const buyeremail = request.body.buyeremail;
		

		values = [price, isbn10, title]

		let sql = "SELECT MIN(a.DATETIME), TITLE, PRICE, ISBN10, SELLEREMAIL from catalog a WHERE price = " + price + " AND ISBN10 = '" + isbn10 + "'";
		db.get(sql, [], (err, row) => {

			if (err) {
				return console.error(err.message);
			}
			else if(row == undefined){

			}
			else{
				console.log(row)
				buyConfirmed(row, buyeremail)
			}
		})
	
})


	


// app.get('/add-post', (request, response) => {
	
// 	app.render('add-post-page')
// 	posts.push({
// 		body: '' + Math.random(),
// 		date: 'just now'
// 	})
// })

function buyConfirmed(catalogrow, buyeremail){


	console.log(buyeremail)

	var mailOptions = {
	from: 'catsmarkettest@gmail.com',
	to: buyeremail +"," + catalogrow.SELLEREMAIL,
	subject: 'For video purposes',
	text: 
	"Title is " + catalogrow.TITLE 
	+ "\n\n and price is $" + (catalogrow.PRICE/100).toFixed(2) 
	+ "\n\n and ISBN10 is " + catalogrow.ISBN10
};
  
  transporter.sendMail(mailOptions, function(error, info){
		if(error) {
			res.send(500);
	} else {
			res.send(200);
	}

});

}

app.listen(8080, () => {
	console.log('Server listening at http://0.0.0.0:8080')
})

