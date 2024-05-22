const Book = require('../../models/book')

const { checkKeys, checkValues, checkYear, checkRating, checkAlreadyRatedBook, checkImageFile, checkIfBookExists } = require('../utils/checks')


const createBook = (req, res, next) => {
    const isValidRequest = checkCreateReq(req)

    if (isValidRequest[0]) {
        const bookBody = isValidRequest[1]

        req.file.fileName = `${Date.now()}.webp`
        const book = new Book({
            userId: req.auth.userId,
            title: bookBody.title,
            author: bookBody.author,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`,
            year: bookBody.year,
            genre: bookBody.genre,
            ratings: [{
                userId: req.auth.userId, 
                grade: bookBody.ratings[0].grade
            }],
            averageRating: bookBody.ratings[0].grade
        })
        
        const bookAlreadyExists = checkIfBookExists(book)
        if (bookAlreadyExists[0]) {
            book.save()
                .then(() => {
                    res.status(201).json({ message: 'Livre créé avec succès' })
                    next()
                })
                .catch(error => res.status(400).json({ error }))
        } else {
            res.status(bookAlreadyExists[1]).json(bookAlreadyExists[2])
        }        
    } else {
        res.status(isValidRequest[1]).json(isValidRequest[2])
    }
}

const rateBook = (req, res, next) => {
    Book.findOne( {_id: req.params.id } )
        .then(book => {
            const isValidRequest = checkRateReq(req, book)

            if (isValidRequest[0]) {
                const rateBody = isValidRequest[1]
                book.ratings.push({
                    userId: req.auth.userId,
                    grade: rateBody.rating
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
            } else {
                res.status(isValidRequest[1]).json(isValidRequest[2])
            }
        })
        .catch(error => res.status(400).json({ error }))
}


const checkCreateReq = (req) => {
    const isImageValid = checkImageFile(req)
    if (!isImageValid[0]) {
        return isImageValid
    }
    
    let bookBody = JSON.parse(req.body.book)
    const keysToCheck = ['userId','title','author','year','genre']

    const hasValidKeys = checkKeys(bookBody, keysToCheck)
    if (!hasValidKeys[0]) {
        return hasValidKeys
    }

    bookBody = checkValues(bookBody, keysToCheck)

    const hasValidYear = checkYear(bookBody.year)
    if (!hasValidYear[0]) {
        return hasValidYear
    }

    const hasGrade = checkKeys(bookBody.ratings[0],['grade'])
    if (!hasGrade[0]) {
        return hasGrade
    }

    const hasValidGrade = checkRating(bookBody.ratings[0].grade)
    if (!hasValidGrade[0]) {
        return hasValidGrade
    }

	return [true, bookBody]
}


const checkRateReq = (req, book) => {
    let rateBody = req.body

    const keysToCheck = ['userId','rating']
    const hasValidKeys = checkKeys(rateBody, keysToCheck)
    if (!hasValidKeys[0]) {
        return hasValidKeys
    }

    rateBody = checkValues(rateBody, keysToCheck)

    const hasAlreadyRated = checkAlreadyRatedBook(book, req.auth.userId)
    if (!hasAlreadyRated[0]) {
        return hasAlreadyRated
    }

    const hasValidGrade = checkRating(rateBody.rating)
    if (!hasValidGrade[0]) {
        return hasValidGrade
    }

    return [true, rateBody]
}

module.exports = { createBook, rateBook }