const Book = require('../../models/book')


const createBook = (req, res, next) => {
    const isValidRequest = checkCreateReq(req)

    if (isValidRequest[0]) {
        const bookBody = JSON.parse(req.body.book)

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
        Book.find()
            .then(books => {
                let isInDatabase = books.some(browseBook => (browseBook.title === book.title && browseBook.author === book.author))
                if (isInDatabase) {
                    res.status(400).json({ message: 'Livre déjà enregistré dans la base de données'})
                } else {
                    book.save()
                        .then(() => res.status(201).json({ message: 'Livre créé avec succès' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    } else {
        res.status(isValidRequest[1]).json(isValidRequest[2])
    }
    next()
}

const rateBook = (req, res, next) => {
    Book.findOne( {_id: req.params.id } )
        .then(book => {
            const isValidRequest = checkRateReq(req, book)

            if (isValidRequest[0]) {
                book.ratings.push({
                    userId: req.auth.userId,
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
            } else {
                res.status(isValidRequest[1]).json(isValidRequest[2])
            }
        })
        .catch(error => res.status(400).json({ error }))
    next()
}


const checkCreateReq = (req) => {
    const bookBody = JSON.parse(req.body.book)

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

    if (!req.hasOwnProperty('file')) {
		return [false, 400, {'error': 'image manquante'}]
	}
    if (!bookBody.ratings[0].hasOwnProperty('grade')) {
		return [false, 400, {'error': 'note manquante'}]
	}
    if (bookBody.year > new Date().getFullYear() + 1) {
       return [false, 400, {'error': 'L\'année de publication ne peut pas être supérieure à l\'année actuelle + 1'}]
    }
    if (bookBody.year < 1450) {
        return [false, 400, {'error': 'L\'année de publication ne peut pas être inférieure à l\'avènement de l\'imprimerie'}]
    }
    if (bookBody.ratings[0].grade < 0 || bookBody.ratings[0].grade > 5) {
        return [false, 400, {'error': 'La note du livre doit être comprise entre 0 et 5'}]
    }

	return [true]
}


const checkRateReq = (req, book) => {
    const keysToCheck = ['userId','grade']
    for (key of keysToCheck) {
        if (!Object.hasOwn(req.body, key)) {
		    return [false, 400, {'error': `${key} manquant`}]
	    }
    }

    for (value of Object.values(req.body)) {
        if (typeof(value) === String) {
            if (value.substring(0,1) === '<') {
                return [false, 400, {'error': 'tentative d\'injection de script détectée'}]
            }
        }
    }

    const alreadyRatedUsers = book.ratings.map(rating => rating.userId)
    if (alreadyRatedUsers.includes(req.auth.userId)) {
        return [false, 400, {'error': 'Cet utilisateur a déjà noté le livre'}]
    }        

    if (req.body.rating < 0 || req.body.rating > 5) {
        return [false, 400, {'error': 'La note du livre doit être comprise entre 0 et 5'}]
    }

    return [true]
}

module.exports = { createBook, rateBook }