const express = require('express')
const cors = require('cors')
const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const nodemaileraccount = require('./nodemaileraccount.json')
const priceapisecret = require('./priceapisecret.json')
const fetch = require("node-fetch");


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
		response.send(catalog)
	})

})


// app.post('/sell-from-isbn', (request, response) => {
	
// 	const term =  request.body.term;
// 	const school = request.body.school;
// 	const department = request.body.department;
// 	const course = request.body.course;

// 	const isbn10 = request.body.course;
// 	const selleremail = request.body.selleremail;

// 	// let sql = "SELECT ORDERID, TITLE, ISBN10, SELLEREMAIL, MIN(c.PRICE) PRICE, MIN(c.DATETIME) DATETIME FROM catalog c WHERE TERM = '" + term 
// 	// + "' AND SCHOOL = '" + school 
// 	// + "' AND DEPARTMENT = '" + department 
// 	// + "' AND COURSE = '" + course 
// 	// + "' GROUP BY c.SCHOOL,c.DEPARTMENT,c.COURSE,c.ISBN10";

// })

app.post('/sell', (request, response) => {

	const isbn10 = request.body.isbn10;
	const price = request.body.price;
	const title = request.body.title;

	const term =  request.body.term;
	const school = request.body.school;
	const department = request.body.department;
	const course = request.body.course;

	const selleremail = request.body.selleremail;

	//Sell by ISBN, no title
	if(title == ""){

		let sql = "SELECT MIN(a.price) PRICE, TITLE, ISBN10, TERM, SCHOOl, DEPARTMENT, COURSE FROM catalog a WHERE ISBN10 = ?";
		db.get(sql, [isbn10], (err, row) => {
			if(containsNull(row)){
				row = undefined;
			}
			if (err) {
				return console.error(err.message);
			}
			//No existing order with corresponding ISBN
			else if(row == undefined){
				
				//check past ISBN info for price
				db.get(`Select * FROM previous_books WHERE TERM = ? AND SCHOOL = ? and DEPARTMENT = ? and COURSE = ? and ISBN10 = ?`, [term, school, department, course, isbn10], (err, row) => {
					if (err) {
						return console.log(err.message);
					}
					//DNE, check current pending ISBN
					else if(row == undefined){
						db.get(`Select * FROM pending_orders WHERE TERM = ? AND SCHOOL = ? and DEPARTMENT = ? and COURSE = ? and ISBN10 = ?`, [term, school, department, course, isbn10], (err, row) => {
							if (err) {
								return console.log(err.message);
							}
							//None in pending orders, add to pending
							else if(row == undefined){

								db.run(`INSERT INTO pending_orders(TERM, SCHOOL, DEPARTMENT, COURSE, SELLEREMAIL, ISBN10) VALUES(?, ?, ?, ?, ?, ?);`, [term, school, department, course, selleremail, isbn10], function (err) {
									if (err) {
										return console.log(err.message);
									}
									console.log(`A row has been inserted into pending_orders via ISBN10`);
									response.send("Listing confirmed. When sold, connection email will be sent to: " + selleremail + ". Thank you for using Catsmarket!")	
									return;
				
								})
							}
							//One exists, add book to past books and also add orders to catalog
							else
							{
								addNewBook(row, selleremail);
								response.send("Listing confirmed. When sold, connection email will be sent to: " + selleremail + ". Thank you for using Catsmarket!")

							}
						})
					}
					//if exists, use that info and sell at list price (TODO: 90%)
					else{
						values = [row.TERM, row.SCHOOL, row.DEPARTMENT, row.COURSE, selleremail, row.PRICE, row.ISBN10, row.TITLE]	
						insertListingIntoCatalog(values);
						response.send("Listing confirmed. When sold, connection email will be sent to: " + selleremail + ". Thank you for using Catsmarket!")	
					}
				})

			}
			//Existing book under same search course exists, insert at same price.
			else
			{
				values = [row.TERM, row.SCHOOL, row.DEPARTMENT, row.COURSE, selleremail, row.PRICE, row.ISBN10, row.TITLE]
				insertListingIntoCatalog(values)
				console.log(`A row has been inserted into catalog via ISBN + listing`);
				response.send("Listing confirmed. When sold, connection email will be sent to: " + selleremail + ". Thank you for using Catsmarket!")

			}
		})

	}
	//Sell through listing, list normally
	else{
	
		values = [term, school, department, course, selleremail, price, isbn10, title]
		insertListingIntoCatalog(values)
		console.log(`A row has been inserted into catalog via listing`);
		response.send("Listing confirmed. When sold, connection email will be sent to: " + selleremail + ". Thank you for using Catsmarket!")



	}
})



function addNewBook(pendingrow, newselleremail){

	var isbn10 = pendingrow.ISBN10;
	var oldselleremail = pendingrow.SELLEREMAIL;

	db.run(`DELETE FROM pending_orders WHERE TERM = ? AND SCHOOL = ? and DEPARTMENT = ? and COURSE = ? and ISBN10 = ?`, [pendingrow.TERM, pendingrow.SCHOOL, pendingrow.DEPARTMENT, pendingrow.COURSE, pendingrow.ISBN10], function (err) {
		if (err) {
			return console.log(err.message);
		}
		console.log(`Row(s) deleted ${this.changes} from pending_orders`);
	});

	//add both orders to catalog
	//add to book database

	var body = "token=" +priceapisecret.secret +"&source=google_shopping&country=us&topic=product_and_offers&key=term&values=" + isbn10

	fetch("https://api.priceapi.com/v2/jobs", {
		body: body,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "POST"
			}).then((response) => {
						return response.json();
					}).then((data) => {
						fetchRepeat(data.job_id, pendingrow, newselleremail)
					})
					// .then((bookdata) => {

					// 	bookdata.price
					// 	bookdata.title
					// })

	
}

//  function test(){

// 	var isbn10 = "0134753119"
// 	var body = "token=" + priceapisecret.secret +"&source=google_shopping&country=us&topic=product_and_offers&key=term&values=" + isbn10

// 	fetch("https://api.priceapi.com/v2/jobs", {
// 			body: body,
// 			headers: {
// 				"Content-Type": "application/x-www-form-urlencoded"
// 			},
// 			method: "POST"
// 				}).then((response) => {
// 							return response.json();
// 						}).then((data) => {
							
// 							return fetchRepeat(data.job_id)
// 						})


// }

function fetchRepeat(id,pendingrow, newselleremail){
	
	fetch("https://api.priceapi.com/v2/jobs/"+ id +"/download.json?token=" + priceapisecret.secret)
	.then((response) => {
		return response.json()
	}).then((data) =>{
		if(data.status == "finished"){

			var bookdata = {
				title: data.results[0].content.name,
				price: data.results[0].content.price*100
			}
			insertListingIntoCatalog([pendingrow.TERM, pendingrow.SCHOOL, pendingrow.DEPARTMENT, pendingrow.COURSE, pendingrow.SELLEREMAIL, bookdata.price, pendingrow.ISBN10, bookdata.title])
			console.log(`A row has been inserted into catalog via pending_orders`);
			insertListingIntoCatalog([pendingrow.TERM, pendingrow.SCHOOL, pendingrow.DEPARTMENT, pendingrow.COURSE, newselleremail, bookdata.price, pendingrow.ISBN10, bookdata.title])
			console.log(`A row has been inserted into catalog via pending_orders`);

			db.run(`INSERT INTO previous_books(TERM, SCHOOL, DEPARTMENT, COURSE, PRICE, ISBN10, TITLE) VALUES(?, ?, ?, ?, ?, ?, ?);`, [pendingrow.TERM, pendingrow.SCHOOL, pendingrow.DEPARTMENT, pendingrow.COURSE,bookdata.price, pendingrow.ISBN10, bookdata.title], function (err) {
				if (err) {
					return console.log(err.message);
				}
				console.log(`A row has been inserted into previous_book`);
				
			})
		
			
			return bookdata;

			

		}
		else{
			fetchRepeat(id, pendingrow, newselleremail)
		}
	})
}


//Requires term, school, department, course, selleremail, price, isbn10, title
function insertListingIntoCatalog(values){

	console.log(values)

	db.run(`INSERT INTO catalog(ORDERID, TERM, SCHOOL, DEPARTMENT, COURSE, SELLEREMAIL, PRICE, ISBN10, TITLE, DATETIME) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME("now"));`, values, function (err) {
		if (err) {
			return console.log(err.message);
		}
		return;
	})
	
}

app.post('/buy', (request, response) => {
	
		const isbn10 = request.body.isbn10;
		const price = request.body.price;
		const title = request.body.title;
		const buyeremail = request.body.buyeremail;
		

		values = [price, isbn10, title]

		let sql = "SELECT MIN(a.DATETIME), TITLE, PRICE, ISBN10, SELLEREMAIL, ORDERID from catalog a WHERE price = " + price + " AND ISBN10 = '" + isbn10 + "'";
		db.get(sql, [], (err, row) => {

			if (err) {
				return console.error(err.message);
			}
			//No more listings at displayed price
			else if(row == undefined){

				let sql2 = "SELECT MIN(a.DATETIME), TITLE, MIN(a.PRICE) PRICE, ISBN10, SELLEREMAIL from catalog a WHERE ISBN10 = '" + isbn10 + "'";
				db.get(sql2, [], (err, row) => {

					if (err) {
						return console.error(err.message);
					}
					else if(row == undefined){
						response.send("Sorry, someone was quicker to confirm, and there are no more listings available for that book!")

					}
					//No more listings at displayed price. Go with lowest price.
					else
					{
						response.send("Order confirmed. Connection email will be sent to: " + buyeremail + ". Thank you for using Catsmarket!")
						buyConfirmed(row, buyeremail)
					}
					
				})
			}
			//Buy via listing at displayed price
			else{

				console.log(row)
				buyConfirmed(row, buyeremail)
				response.send("Order confirmed. Connection email will be sent to: " + buyeremail + ". Thank you for using Catsmarket!")
				return;
			}
		})
	
})

function containsNull(dict){
	for (var key in dict){
		if(dict[key] == null)
		{
			return true;
		}
	}
	return false;
}



function buyConfirmed(catalogrow, buyeremail){

	var mailOptions = {
	from: 'catsmarkettest@gmail.com',
	to: buyeremail +"," + catalogrow.SELLEREMAIL,
	subject: "Catsmarket Active Order: " + catalogrow.TITLE,
	html:
	"<h3>" + "Title: " + catalogrow.TITLE + "</h3>"
	+ "<h3>" + "ISBN10: " + catalogrow.ISBN10 + "</h3>"
	+ "<h3>" + "Guideline Price: $" + (catalogrow.PRICE/100).toFixed(2)  + "</h3>"
	+ "<br></br>"
	+ "<h3>Hit REPLY ALL to connect with the buyer/seller</h3>"
	+ "<h3> REMEMBER! Stay safe when meeting to exchange this textbook.  Here are some tips: </h3>"
	+ "<p>1. Meet in a public place with people around, such as Norris, a library, or a coffee shop.  NUPD is a convenient off-campus location as well. </p>"
	+ "<p>2. Meet during the day.</p>"
	+ "<p>3. Confirm the price, book quality, and payment method before hand to avoid confusion.</p>"
	}
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error) {
			res.send(500);
	} else {
			console.log("Message sent: %s", info.messageId)
			res.send(200);	
	}
	});

	db.run(`DELETE FROM catalog WHERE ORDERID = ?`, catalogrow.ORDERID, function (err) {
		if (err) {
			return console.log(err.message);
		}
		console.log(`Row(s) deleted ${this.changes} from catalog`);
	});
}


app.listen(8080, () => {
	console.log('Server listening at http://0.0.0.0:8080')
})
