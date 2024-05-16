const Book = require('../../models/book')
const fs = require('fs')


const updateBook = (req, res, next) => {
    let bookBody = {}
    Book.findOne( {_id: req.params.id } )
        .then(book => {
            if (req.file === undefined) {
                bookBody = req.body
            } else { 
                bookBody = JSON.parse(req.body.book)
                console.log(book.imageUrl)
                fs.unlink(`./images/${book.imageUrl.split('/images/')[1]}`, () => {})
                book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`
                console.log(book.imageUrl)
            }
            
            Book.updateOne( { _id: req.params.id }, { 
                title: bookBody.title,
                author: bookBody.author,
                imageUrl: book.imageUrl,
                year: bookBody.year,
                genre: bookBody.genre
             })
                .then(() => res.status(200).json({ message: 'Livre mis à jour' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
}

module.exports = { updateBook }