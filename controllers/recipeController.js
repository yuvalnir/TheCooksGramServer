const Recipe = require('../models/recipeModel')

createRecipe = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a recipe',
        })
    }

    const recipe = new Recipe(body)

    if (!recipe) {
        return res.status(400).json({ success: false, error: err })
    }

    recipe
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: recipe._id,
                message: 'Recipe created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Recipe not created!',
            })
        })
}

updateRecipe = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Recipe.findOne({ _id: req.params.id }, (err, recipe) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Movie not found!',
            })
        }
        recipe.name = body.name
        recipe.time = body.time
        recipe.rating = body.rating
        recipe
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: recipe._id,
                    message: 'Movie updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Movie not updated!',
                })
            })
    })
}

deleteRecipe = async (req, res) => {
    await Recipe.findOneAndDelete({ _id: req.params.id }, (err, recipe) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!recipe) {
            return res
                .status(404)
                .json({ success: false, error: `Recipe not found` })
        }

        return res.status(200).json({ success: true, data: recipe })
    }).catch(err => console.log(err))
}

getRecipeById = async (req, res) => {
    await Recipe.findOne({ _id: req.params.id }, (err, recipe) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!recipe) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: recipe })
    }).catch(err => console.log(err))
}

getUserRecipes = async (req, res) => {
    await Recipe.find({email: req.params.email}, (err, recipe) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!recipe.length) {
            return res
                .status(404)
                .json({ success: false, error: `User have no recipes` })
        }
        return res.status(200).json({ success: true, data: recipe })
    }).catch(err => console.log(err))
}

// getRecipe = async (req, res) => {
//     await Recipe.find({}, (err, recipe) => {
//         if (err) {
//             return res.status(400).json({ success: false, error: err })
//         }
//         if (!recipe.length) {
//             return res
//                 .status(404)
//                 .json({ success: false, error: `Movie not found` })
//         }
//         return res.status(200).json({ success: true, data: recipe })
//     }).catch(err => console.log(err))
// }


module.exports = {
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    getUserRecipes,
}