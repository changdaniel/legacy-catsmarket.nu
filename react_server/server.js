const express = require('express')
const cors = require('cors')

const app = express()

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

app.set('view engine', 'pug')


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

app.listen(7777, () => {
	console.log('Server listening at http://0.0.0.0:7777')
})
