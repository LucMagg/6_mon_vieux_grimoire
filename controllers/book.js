const Book = require('../models/book')
const fs = require('fs')


const createBook = (req, res, next) => {
    const bookBody = JSON.parse(req.body.book)
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

    book.year <= new Date().getFullYear() + 1 ?
        Book.find()
        .then(books => {
            let isInDatabase = books.some(browseBook => (browseBook.title === book.title && browseBook.author === book.author))
            if (isInDatabase) {
                res.status(401).json({ message: 'Livre déjà enregistré dans la base de données'})
            } else {
                book.save()
                    .then(() => res.status(201).json({ message: 'Livre créé avec succès' }))
                    .catch(error => res.status(400).json({ error }))
            }
        }):
        res.status(400).json({ message: 'L\'année de publication ne peut pas être supérieure à l\'année actuelle'})
}


const updateBook = (req, res, next) => {
    let bookBody = {}
    Book.findOne( {_id: req.params.id } )
        .then(book => {
            if (req.file === undefined) {
                bookBody = req.body
            } else { 
                bookBody = JSON.parse(req.body.book)
                fs.unlink(`./images/${book.imageUrl.split('/images/')[1]}`, () => {})
                book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`
            }
            
            Book.updateOne( { _id: req.params.id }, { 
                title: upperLower(bookBody.title),
                author: upperLower(bookBody.author),
                imageUrl: book.imageUrl,
                year: bookBody.year,
                genre: upperLower(bookBody.genre)
             })
                .then(() => res.status(200).json({ message: 'Livre mis à jour' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
}

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

const rateBook = (req, res, next) => {
    Book.findOne( {_id: req.params.id } )
    .then(book => {
            book.ratings.push({
                userId: req.body.userId,
                grade: req.body.rating
            })
            book.averageRating = (book.ratings.reduce((acc, value) => {
                return acc + value.grade
            },0) / book.ratings.length).toFixed(1)

            Book.updateOne({ _id: req.params.id }, { 
                ratings: book.ratings,
                averageRating: book.averageRating
            })
                .then(() => res.status(200).json(book))
                .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
}

module.exports = { createBook, updateBook, deleteBook, rateBook }