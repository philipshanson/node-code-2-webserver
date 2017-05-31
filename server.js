const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

//templating
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//Middleware
//Remember middleware is called in the order that you call app.use
app.use((request, response, next) => {
	var now = new Date().toString();
	var log = `${now}: ${request.method} ${request.url}`;

	console.log(log);
	fs.appendFile('server.log',log +'\n', (err) => {
		if(err) {
			console.log('unable to append to server.log');
		}
	});
	next();
});

//Will pause execution because we dont call next
// app.use((request, response, next) => {
// 	response.render('maintenance.hbs', {
// 		pageTitle: 'Maintenance',
// 	});
// });

app.use(express.static(__dirname + '/public'));


//handlebar helpers
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});


app.get('/', (request, response) =>{
	response.render('home.hbs', {
		welcomeMessage: 'Welcome to the site',
		pageTitle: 'Home'
	});
});

app.get('/about', (request, response) => {
	response.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (request, response) => {
	response.send({
		errorMessage: 'Bad URL'
	});
});

//use 300 locally
//on Heroku
//use herokus Environment variable
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});