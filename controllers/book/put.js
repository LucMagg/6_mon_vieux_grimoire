const Book = require('../../models/book')
const fs = require('fs')


const updateBook = (req, res, next) => {
    const isValidRequest = checkUpdateReq(req)

    if (isValidRequest[0]) {
        let bookBody = {}
        Book.findOne( {_id: req.params.id } )
            .then(book => {
                if (req.auth.userId === book.userId) {
                    if (req.file === undefined) {
                        bookBody = req.body
                    } else { 
                        req.file.fileName = `${Date.now()}.webp`
                        bookBody = JSON.parse(req.body.book)
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
                        .then(() => res.status(200).json({ message: 'Livre mis à jour' }))
                        .catch(error => res.status(400).json({ error }))
                } else {
                    res.status(401).json({ 'error': 'Un utilisateur n\'est pas autorisé à modifier le livre créé par un autre utilisateur'})
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
        bookBody = bookBody = JSON.parse(req.body.book)
    }

    const keysToCheck = ['userId','title','author','year','genre']
    for (key of keysToCheck) {
        if (!Object.hasOwn(bookBody, key)) {
		    return [false, 400, {'error': `${key} manquant`}]
	    }
    }

    for (value of Object.values(bookBody)) {
        if (typeof(value) === String) {
            if (value.substring(0,1) === '<') {
                return [false, 400, {'error': 'tentative d\'injection de script détectée'}]
            }
        }
    }

    if (bookBody.year > new Date().getFullYear() + 1) {
       return [false, 400, {'error': 'L\'année de publication ne peut pas être supérieure à l\'année actuelle + 1'}]
    }
    if (bookBody.year < 1450) {
        return [false, 400, {'error': 'L\'année de publication ne peut pas être inférieure à l\'avènement de l\'imprimerie'}]
    }

	return [true]
}

module.exports = { updateBook }