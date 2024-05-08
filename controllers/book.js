const Book = require('../models/book')
const fs = require('fs')

const { bestRatedBooks, upperLower } = require('../utils/books')
const { newBook } = require('./book/newBook')

const noBooksToGet = 'Aucun livre enregistré pour l\'instant ;)'
const bookUpdated = 'Livre mis à jour :)'

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
    Book.findOne( {_id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
}

exports.getBestRatedBooks = (req, res) => {
    console.log('here')
    Book.find()
    .then(books => {
        books.length > 0 ? 
            console.log(bestRatedBooks(books)) :
            res.status(404).json({message: noBooksToGet })
    })
    .catch(error => res.status(400).json({ error }))
}

exports.createBook = (req, res) => {
    newBook(req, res)
}

exports.updateBook = (req, res, next) => {
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
                title: upperLower(bookBody.title),
                author: upperLower(bookBody.author),
                imageUrl: book.imageUrl,
                year: bookBody.year,
                genre: upperLower(bookBody.genre)
             })
                .then(() => res.status(200).json({ message: bookUpdated }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
}

exports.deleteBook = (req, res, next) => {

}

exports.rateBook = (req, res, next) => {

}