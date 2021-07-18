const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({ 
    email: String,
    title: String,
    ingredients: Array, 
    instructions: String,
    hasImages: Boolean });

module.exports = mongoose.model('Recipe', recipeSchema)