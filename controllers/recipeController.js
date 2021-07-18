const Recipe = require('../models/recipeModel')
const uploadToS3 = require('../helpers/uploadToS3')

createRecipe = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({error: 'You must provide a recipe'})
    }

    const recipe = new Recipe({
        email: body.email,
        title: body.title,
        ingredients: body.ingredients, 
        instructions: body.instructions,
        hasImages: false
    });

    /** Saving recipe to DB */
    try {
        await recipe.save()
    } catch (error) {
        return res.status(400).json({error, message: 'Recipe not created!'})
    }
    /** Uploading images to AWS.S3 */
    try { 
        if(body.images)
            await uploadToS3(body.userId, recipe._id, body.images, 'recipes/')
    } catch (error) { //will add failure handling, and some retries in the future, maybe as a micro service
        return res.status(201).json({
            id: recipe._id,
            error,
            message: 'Recipe created, but there was a problem uploading your photos, please try uploading this recipe photos again later',
        })
    }
    /** Updating DB that image upload was successful */
    try { 
        if(body.images)
            await Recipe.findOneAndUpdate({_id: recipe._id}, {hasImages: true});
    } catch (error) {
        return res.status(400).json({error, message: 'Recipe created, but theres a problem with the DB'}) //handle later
    }

    return res.status(201).json({
        id: recipe._id,
        message: 'Recipe created!',
    })
}

updateRecipe = async (req, res) => {
    const body = req.body

    if (!body)
        return res.status(400).json({error: 'You must provide a body to update'});
    
    const recipe = {
        title: body.title,
        ingredients: body.ingredients, 
        instructions: body.instructions,
        hasImages: body.hasImages
    }

    try {
        await Recipe.findOneAndUpdate({ _id: req.params.id }, recipe)
        return res.status(200).json({id: recipe._id, message: 'Recipe updated!'})
    } catch(error) {
        console.log(error);
        return res.status(404).json({error, message: 'Recipe not updated!'})
    }
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
                .json({ success: false, error: `Recipe not found` })
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

module.exports = {
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    getUserRecipes,
}