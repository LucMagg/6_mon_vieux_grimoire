const Book = require('../../models/book')
const fs = require('fs')

const { checkUser } = require('../utils/checks')

const deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id })
        .then(book => {
            if (book) {
                const isAuthorizedUser = checkUser(req, book.userId)
                if (!isAuthorizedUser[0]) {
                    res.status(isAuthorizedUser[1]).json(isAuthorizedUser[2])
                } else {
                    fs.unlink(`./images/${book.imageUrl.split('/images/')[1]}`, () => {
                        Book.deleteOne({ _id: req.params.id }) 
                            .then(() => res.status(200).json({ message: 'Livre supprimé' }))
                            .catch(error => res.status(400).json({ error }))
                    })
                }
            } else {
                res.status(404).json( {message : `Aucun livre référencé avec l'id ${req.params.id}`})
            }   
        })
    .catch(error => res.status(400).json({ error }))
}

module.exports = { deleteBook }