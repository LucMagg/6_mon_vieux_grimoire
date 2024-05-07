const Book = require('../../models/book')

const { upperLower } = require('../../utils/books')

const bookCreated = 'Livre créé avec succès :)'
const bookAlreadyInDatabase = 'Livre déjà enregistré dans la base de données ;)'
const yearError = 'L\'année de publication ne peut pas être supérieure à l\'année actuelle'

exports.newBook = (req,res) => {
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

    book.year <= new Date().getFullYear() ?
        Book.find()
        .then(books => {
            let isInDatabase = books.some(browseBook => (browseBook.title === book.title && browseBook.author === book.author))
            if (isInDatabase) {
                res.status(401).json({ message: bookAlreadyInDatabase})
            } else {
                book.save()
                    .then(() => res.status(201).json({ message: bookCreated }))
                    .catch(error => res.status(400).json({ error }))
            }
        }):
        res.status(401).json({ message: yearError})
}