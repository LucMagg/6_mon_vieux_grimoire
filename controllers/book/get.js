const Book = require('../../models/book')


const getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => {
            res.status(200).json(books)
    })
    .catch(error => res.status(400).json({ error }))
}


const getOneBook = (req, res, next) => {
    Book.findOne( {_id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
}


const getBestRatedBooks = (req, res, next) => {
    Book.find()
    .then(books => {
        res.status(200).json(bestRatedBooks(books))
    })
    .catch(error => res.status(400).json({ error }))
}


const bestRatedBooks = (books) => {
    books.sort( (a, b) => { return b.averageRating - a.averageRating })
    let sliceToReturn = 0
    books.length > 2 ?
        sliceToReturn = 3 :
        sliceToReturn = books.length
    return books.slice(0, sliceToReturn)
}

module.exports = { getAllBooks, getOneBook, getBestRatedBooks }