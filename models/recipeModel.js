const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({ 
    email: 'string',
    title: 'string',
    ingredients: Array, 
    instructions: 'string' });

module.exports = mongoose.model('Recipe', recipeSchema)