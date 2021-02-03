const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const userRouter = require('./routers/userRouter')
const recipeRouter = require('./routers/recipeRouter')
const db = require('./db/index')

const app = express()
const port = 8081

app.use(cors()) //should be changed in the future to a specific address
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/userapi', userRouter)
app.use('/recipeapi', recipeRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});