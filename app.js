const express = require('express')
const mongoose = require('mongoose')

const app = express()

const username = encodeURIComponent('lucmaggiotto')
const password = encodeURIComponent('NzYJ5fBkkvj43T8h')
const cluster = 'monvieuxgrimoire.xqsmp6c.mongodb.net'
const clusterName = cluster.split('.')[0]

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log(`Connexion au cluster ${clusterName} réussie :)`))
  .catch(() => console.log(`Connexion au cluster ${clusterName} échouée :(`))

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' })
})

module.exports = app;