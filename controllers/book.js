const Book = require('../models/book')

const { bestRatedBooks } = require('../utils/books')
const { newBook } = require('./book/newBook')

const noBooksToGet = 'Aucun livre enregistré pour l\'instant ;)'

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books => {
        books.length > 0 ? 
            res.status(200).json(books) :
            res.status(404).json({message: noBooksToGet })
    })
    .catch(error => res.status(400).json({ error }))
}

exports.getOneBook = (req, res) => {
    Book.findOne( {_id: req.params._id })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }))
}

exports.getBestRatedBooks = (req, res) => {
    Book.find()
    .then(books => {
        books.length > 0 ? 
            res.status(200).json(bestRatedBooks(books)) :
            res.status(404).json({message: noBooksToGet })
    })
    .catch(error => res.status(400).json({ error }))
}

exports.createBook = (req, res) => {
    newBook(req, res)
}

exports.updateBook = (req, res, next) => {

}

exports.deleteBook = (req, res, next) => {

}

exports.rateBook = (req, res, next) => {

}