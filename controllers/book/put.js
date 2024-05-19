const Book = require('../../models/book')
const fs = require('fs')

const { checkKeys, checkValues, checkYear, checkImageFile, checkUser } = require('../utils/checks')

const updateBook = (req, res, next) => {
    const isValidRequest = checkUpdateReq(req)

    if (isValidRequest[0]) {
        let bookBody = isValidRequest[1]
        
        Book.findOne( {_id: req.params.id } )
            .then(book => {
                const isAuthorizedUser = checkUser(req, book.userId)

                if (!isAuthorizedUser[0]) {
                    res.status(isAuthorizedUser[1]).json(isAuthorizedUser[2])
                } else {
                    if (req.file !== undefined) {
                        req.file.fileName = `${Date.now()}.webp`
                        fs.unlink(`./images/${book.imageUrl.split('/images/')[1]}`, () => {})
                        book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`
                    }

                    
                    Book.updateOne( { _id: req.params.id }, { 
                        title: bookBody.title,
                        author: bookBody.author,
                        imageUrl: book.imageUrl,
                        year: bookBody.year,
                        genre: bookBody.genre
                    })
                        .then(() => {
                            res.status(200).json({ message: 'Livre mis à jour' })
                            next()
                    })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    } else {
        res.status(isValidRequest[1]).json(isValidRequest[2])
    }
    
}

const checkUpdateReq = (req) => {
    let bookBody = {}
    if (req.file === undefined) {
        bookBody = req.body
    } else {
        const isImageValid = checkImageFile(req)
        if (!isImageValid[0]) {
            return isImageValid
        }
        bookBody = JSON.parse(req.body.book)
    }

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

	return [true, bookBody]
}

module.exports = { updateBook }