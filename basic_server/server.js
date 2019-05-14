const express = require('express')
const app = express()

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

exports.index = function(req, res){
    res.render('index', { title: 'ejs' });};

var selleremail = "";
var buyeremail = "";

app.get('/', function (request, response) {

  response.render('home')
})

app.get('/buy-search', function (request, response) {

  response.render('buy-search')
})

app.get('/buy-search-resolved', function (request, response) {

    response.render('buy-search-resolved')
})

app.get('/order', function (request, response) {

  response.render('order')
})

app.get('/buyer-email-processing', function (request, response) {

  buyeremail = request.query.email
  response.render('order-confirmed', 
  {buyeremail:buyeremail,
  selleremail:selleremail})
})


app.get('/sell-search', function (request, response) {

    response.render('sell-search')
})

app.get('/sell-search-resolved', function (request, response) {

    response.render('sell-search-resolved')
})

app.get('/list', function (request, response) {

    response.render('list')
})

app.get('/seller-email-processing', function (request, response) {

  selleremail = request.query.email;
  console.log(selleremail)
  response.render('listing-confirmed', {selleremail:selleremail});

})


app.listen(8080, function () {

  console.log('Server listening on port 8080');

});