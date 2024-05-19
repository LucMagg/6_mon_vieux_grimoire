const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const env = require('dotenv').config()

const username = encodeURIComponent(process.env.MONGODB_USER)
const password = encodeURIComponent(process.env.MONGODB_PWD)
const cluster = process.env.MONGODB_CLUSTER
const clusterName = cluster.split('.')[0]

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`)
  .then(() => console.log(`Connexion au cluster ${clusterName} réussie :)`))
  .catch(() => console.log(`Connexion au cluster ${clusterName} échouée :(`))

const app = express()

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
  })

const bookRoutes = require('./routes/book')
app.use('/api/books', bookRoutes)

const userRoutes = require('./routes/user')
app.use('/api/auth', userRoutes)

module.exports = app