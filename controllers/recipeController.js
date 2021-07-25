const Recipe = require('../models/recipeModel')
const {uploadToS3, getFromS3} = require('../helpers/s3Handler')

createRecipe = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({error: 'You must provide a recipe'})
    }

    const recipe = new Recipe({
        userId: body.userId,
        title: body.title,
        ingredients: body.ingredients, 
        instructions: body.instructions,
        hasImages: false,
        imagesNames: []
    });

    /** Saving recipe to DB */
    try {
        await recipe.save()
        console.log('Recipe created');
    } catch (error) {
        console.log('Recipe not created');
        return res.status(400).json({error, message: 'Recipe not created!'})
    }
    /** Uploading images to AWS.S3 */
    let namesArr = []
    try { 
        body.images ? console.log('Theres images to upload') : console.log('No images to upload');
        if(body.images)
            namesArr = await uploadToS3(body.userId, recipe._id, body.images, 'recipes/')
    } catch (error) { //will add failure handling, and some retries in the future, maybe as a micro service
        console.log('Recipe created, but photos did not upload successfully', error);
        return res.status(201).json({
            id: recipe._id,
            error,
            message: 'Recipe created, but there was a problem uploading your photos, please try uploading this recipe photos again later',
        })
    }
    /** Updating DB that image upload was successful */
    try { 
        if(body.images)
            await Recipe.findOneAndUpdate({_id: recipe._id}, {hasImages: true, imagesNames: namesArr});
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
    let recipes = null
    try {
        recipes = await Recipe.find({userId: req.params.userId})
    } catch(error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }
        
    if (!recipes.length) {
        return res.status(404).json({ error: `User have no recipes` })
    }

    /** Getting images from s3 */
    const imagesArr = []
    try {
        for(let i = 0 ; i < recipes.length ; i++) {
            if(recipes[i].hasImages) {
                imagesArr[i] = await getFromS3(req.params.userId, 'recipes/', recipes[i])
            } else {
                imagesArr[i] = null
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: err })
    }
    // console.log('recipes', recipes);
    return res.status(200).json({ data: {recipes, imagesArr} })
}

module.exports = {
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    getUserRecipes,
}