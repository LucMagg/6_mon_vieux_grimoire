const Book = require('../../models/book')
const fs = require('fs')

const deleteBook = (req, res, next) => {
    Book.findOne( {_id: req.params.id } )
    .then(book => {
            fs.unlink(`./images/${book.imageUrl.split('/images/')[1]}`, () => {})  
            Book.deleteOne({ _id: req.params.id }) 
                .then(() => res.status(200).json({ message: 'Livre supprimé' }))
                .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
}

module.exports = { deleteBook }