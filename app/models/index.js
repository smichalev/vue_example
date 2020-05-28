const path = require('path');

module.exports = {
	User: require(path.join(__dirname, 'user.model')),
	Contacts: require(path.join(__dirname, 'contacts.model')),
};