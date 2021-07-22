const express = require('express')

const RecipeController = require('../controllers/recipeController')

const router = express.Router()

router.post('/recipe', RecipeController.createRecipe)
router.put('/recipe/:id', RecipeController.updateRecipe)
router.delete('/recipe/:id', RecipeController.deleteRecipe)
router.get('/recipe/:id', RecipeController.getRecipeById)
router.get('/userrecipes/:userId', RecipeController.getUserRecipes)

module.exports = router