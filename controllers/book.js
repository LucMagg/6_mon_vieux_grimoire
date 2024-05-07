const Book = require('../models/book')
const { bestRatedBooks, upperLower } = require('../utils/books')


const noBooksToGet = 'Aucun livre enregistré pour l\'instant ;)'
const bookCreated = 'Livre créé avec succès :)'

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books => {
        books.length > 0 ? 
            res.status(200).json(books)
            : res.status(404).json({message: noBooksToGet })
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
            res.status(200).json(bestRatedBooks(books))
            : res.status(404).json({message: noBooksToGet })
    })
    .catch(error => res.status(400).json({ error }))
}

exports.createBook = (req, res) => {
    const bookBody = JSON.parse(req.body.book)
    console.log('here !')
    console.log(bookBody)
    const book = new Book({
        userId: req.auth.userId,
        title: upperLower(bookBody.title),
        author: upperLower(bookBody.author),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`,
        year: bookBody.year,
        genre: upperLower(bookBody.genre),
        ratings: [{
            userId: req.auth.userId, 
            grade: bookBody.ratings[0].grade
        }],
        averageRating: bookBody.averageRating
    })
    console.log(book)
    book.save()
    .then(() => res.status(201).json({ message: bookCreated }))
    .catch(error => res.status(400).json({ error }))
}

exports.updateBook = (req, res, next) => {

}

exports.deleteBook = (req, res, next) => {

}

exports.rateBook = (req, res, next) => {

}