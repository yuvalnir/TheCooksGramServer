const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({ 
    userId: String,
    title: String,
    ingredients: Array, 
    instructions: String,
    hasImages: Boolean,
    imagesNames: Array });

module.exports = mongoose.model('Recipe', recipeSchema)