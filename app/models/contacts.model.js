const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactsScheme = new Schema({
	name: String,
	author: String
});

const Contacts = mongoose.model("Contacts", contactsScheme);

module.exports = Contacts;