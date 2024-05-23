const Book = require('../../models/book')
const fs = require('fs').promises

const { checkKeys, checkValues, checkYear, checkImageFile, checkUser, checkIfBookExists } = require('../utils/checks')
const uploadImage = require('../utils/upload')

const updateBook = async (req, res, next) => {
    const isValidRequest = checkUpdateReq(req)

    if (isValidRequest[0]) {
        let bookBody = isValidRequest[1]
        
        try {
            const book = await Book.findOne( {_id: req.params.id } )
            if (!book) {
                return res.status(404).json({ message: `Aucun livre référencé avec l'id ${req.params.id}` });
            }

            const isAuthorizedUser = checkUser(req, book.userId)
            if (isAuthorizedUser[0]) {
                let updatedBook
                if (req.file !== undefined) {
                    req.file.fileName = `${Date.now()}.webp`
                    await fs.unlink(`./images/${book.imageUrl.split('/images/')[1]}`)
                    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.fileName}`
                    updatedBook = {
                        title: bookBody.title,
                        author: bookBody.author,
                        imageUrl: imageUrl,
                        year: bookBody.year,
                        genre: bookBody.genre
                    }
                } else {
                    updatedBook = {
                        title: bookBody.title,
                        author: bookBody.author,
                        year: bookBody.year,
                        genre: bookBody.genre
                    }
                }
                console.log(updatedBook)
                await updateMyBook(updatedBook, req, res, next)                
                res.status(200).json({ message: 'Livre mis à jour' })
            } else {
                res.status(isAuthorizedUser[1]).json(isAuthorizedUser[2])
            }
        } catch(error) { res.status(400).json({ error }) }
    } else {
        res.status(isValidRequest[1]).json(isValidRequest[2])
    }
}


const updateMyBook = async (updatedBook, req, res, next) => {
    const bookAlreadyExists = checkIfBookExists(updatedBook, req.params.id)
    if (bookAlreadyExists[0]) {
        try {
            await Book.updateOne( { _id: req.params.id }, updatedBook )
            await uploadImage(req, res, next)
        } catch(error) {
            res.status(400).json({ error })
        } 
    } else {
        res.status(bookAlreadyExists[1]).json(bookAlreadyExists[2])
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