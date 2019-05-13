const express = require('express')
const app = express()

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

exports.index = function(req, res){
    res.render('index', { title: 'ejs' });};

app.get('/', function (request, response) {

  response.render('home')
})

app.get('/buy-search', function (request, response) {

  response.render('buy-search')
})

app.get('/buy-search-resolved', function (request, response) {

    response.render('buy-search-resolved')
})

app.get('/sell-search', function (request, response) {

    response.render('sell-search')
})

app.get('/sell-search-resolved', function (request, response) {

    response.render('sell-search-resolved')
})

app.get('/list-1', function (request, response) {

    response.render('list-1')
})


app.listen(8080, function () {
  console.log('Server listening on port 8080');

});