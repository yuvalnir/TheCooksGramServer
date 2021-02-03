const mongoose = require('mongoose')
const connectionString = require('./config.properties')

mongoose
    .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
