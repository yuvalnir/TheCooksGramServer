const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 
    firstname: 'string',
    lastname: 'string',
    email: 'string', 
    password: 'string' });

module.exports = mongoose.model('User', userSchema)