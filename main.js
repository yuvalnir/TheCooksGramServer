const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config()

const userRouter = require('./routers/userRouter')
const recipeRouter = require('./routers/recipeRouter')
const db = require('./db/index')

const app = express()

app.use(cors()) //should be changed in the future to a specific address
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/userapi', userRouter)
app.use('/recipeapi', recipeRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`)
});