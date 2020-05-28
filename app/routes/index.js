const path = require('path');
const {User, Contacts} = require(path.join(__dirname, '..', 'models'));
const Errors = require(path.join(__dirname, '..', 'errors'));
const md5 = require('md5');

module.exports = (app) => {
	app.get('/', (req, res, next) => {
		res.render('index');
	});
	app.get('/login', (req, res, next) => {
		res.render('index');
	});
	
	app.get('/api/profile', (req, res, next) => {
		return res.status(200).json({profile: !req.session.user ? null : req.session.user});
	});
	
	app.post('/api/login', async (req, res, next) => {
		try {
			if (!req.body.login || !req.body.password) {
				throw new Errors(Errors.CODES.NOT_CORRECT_QUERY);
			}
			
			let profile = await User.findOne({login: req.body.login, password: md5(req.body.password)});
			
			if (!profile) {
				throw new Errors(Errors.CODES.BAD_PASSWORD_OR_LOGIN);
			}
			
			req.session.user = profile;
			req.session.save();
			
			return res.status(200).json({profile});
		}
		catch (err) {
			next(err);
		}
	});
	
	app.post('/api/logout', (req, res, next) => {
		try {
			req.session.user = null;
			req.session.save();
			
			return res.status(200).send('ok');
		}
		catch (err) {
			next(err);
		}
	});
	
	app.get('/api/list', async (req, res, next) => {
		try {
			if (!req.session.user) {
				throw new Errors(Errors.CODES.NOT_CORRECT_QUERY);
			}
			
			let contacts = await Contacts.find({author: req.session.user._id});
			
			return res.status(200).json({contacts});
		}
		catch (err) {
			next(err);
		}
	});
	
	app.delete('/api/list/:id', async (req, res, next) => {
		try {
			if (!req.session.user || !req.params.id) {
				throw new Errors(Errors.CODES.NOT_CORRECT_QUERY);
			}
			
			let contacts = await Contacts.findOne({_id: req.params.id, author: req.session.user._id});
			
			if (!contacts) {
				throw new Errors(Errors.CODES.NOT_FOUND);
			}
			
			await contacts.remove();
			
			return res.status(200).json({contacts});
		}
		catch (err) {
			next(err);
		}
	});
	
	app.post('/api/list', async (req, res, next) => {
		try {
			if (!req.session.user || !req.body.name) {
				throw new Errors(Errors.CODES.NOT_CORRECT_QUERY);
			}
			
			const contacts = new Contacts({name: req.body.name, author: req.session.user._id});
			
			await contacts.save();
			
			return res.status(200).json({contacts});
		}
		catch (err) {
			next(err);
		}
	});
	
	app.use((err, req, res, next) => {
		if (!err) {
			return next();
		}
		
		let response = {};
		
		if (err.code !== null && err.code !== 'undefined') {
			response.code = err.code;
		}
		
		let message = err.message || 'Неизвестная ошибка';
		
		response.message = message;
		
		return res.status(err.status).json({error: response});
	});
	
	app.use((err, req, res, next) => {
		let error = new Errors(Errors.CODES.NOT_FOUND);
		
		return res.status(404).json({error});
	});
};