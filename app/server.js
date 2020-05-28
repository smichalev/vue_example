const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const md5 = require('md5');
const {User} = require(path.join(__dirname, 'models'));
const config = require(path.join(__dirname, 'config'));

(async () => {
	await mongoose.connect(config.database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	
	try {
		let admin = await User.findOne({login: 'admin'});
		
		if (!admin) {
			const profile = new User({login: 'admin', password: md5('admin')});
			await profile.save();
			console.log('Пользователь создан! admin | admin');
		} else {
			console.log('Пользователь уже есть, создавать не потребовалось :)')
		}
	}
	catch (e) {
		console.error('Пользователь по каким то причинам не создался :(');
	}
	
	app.listen(config.port, () => {
		console.log('Go to http://' + config.host + ':' + config.port);
	});
})();


const app = express();

app.use(cors({
	origin: ['http://' + config.host + ':' + config.port, 'http://localhost:' + config.port],
	credentials: true,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static('assets'));

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'secret',
	cookie: {maxAge: 24 * 60 * 60 * 1000},
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./routes')(app);