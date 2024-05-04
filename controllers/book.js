const Book = require('../models/book')

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneBook = (req, res, next) => {

}

exports.getBestRatedBooks = (req, res, next) => {

}

exports.createBook = (req, res, next) => {

}

exports.updateBook = (req, res, next) => {

}

exports.deleteBook = (req, res, next) => {

}

exports.rateBook = (req, res, next) => {

}