const Book = require('../../models/book')

const checkKeys = (reqObject, keysToCheck) => {
    for (key of keysToCheck) {
        if (!Object.hasOwn(reqObject, key)) {
		    return [false, 400, {'error': `${key} manquant`}]
	    } else {
            if (reqObject[key] === ''){
                return [false, 400, {'error': `${key} vide`}]
            } 
        }
    }
    return [true]
}


const checkValues = (reqObject, keysToCheck) => {
    const charsToReplace = [['&','&amp;'],['<','&lt;'],['>','&gt;'],['"','&quot;'],['\'','&apos;'],['\\','\\\\']]
    for (key of keysToCheck) {
        if (typeof(reqObject[key]) === 'string') {
            for (char of charsToReplace) {
                reqObject[key] = reqObject[key].replaceAll(char[0],char[1])
            }
        }
    }
    return reqObject
}


const checkYear = (year) => {
    year = Number(year)
    if (isNaN(year)) {
        return [false, 400, {'error': 'L\'année de publication doit être un nombre'}] 
    }
    if (year > new Date().getFullYear() + 1) {
        return [false, 400, {'error': 'L\'année de publication ne peut pas être supérieure à l\'année actuelle + 1'}]
    }
    if (year < 1450) {
        return [false, 400, {'error': 'L\'année de publication ne peut pas être inférieure à l\'avènement de l\'imprimerie'}]
    }
    return [true]
}


const checkRating = (rating) => {
    rating = Number(rating)
    if (isNaN(rating)) {
        return [false, 400, {'error': 'La note du livre doit être un nombre'}]
    }
    if (rating < 0 || rating > 5) {
        return [false, 400, {'error': 'La note du livre doit être comprise entre 0 et 5'}]
    }
    return [true]
}


const checkAlreadyRatedBook = (book, userId) => {
    const alreadyRatedUsers = book.ratings.map(rating => rating.userId)
        if (alreadyRatedUsers.includes(userId)) {
            return [false, 409, {'error': 'Cet utilisateur a déjà noté ce livre'}]
        }
    return [true]
}


const checkImageFile = (req) => {
    if (req.file) {
        const mimeFileType = req.file.mimetype.split('/')
        if (mimeFileType[0] !== 'image') {
            return [false, 400, {'error': 'Le fichier uploadé n\'est pas une image'}]
        }
    } else {
        return [false, 400, {'error': 'Pas d\'image dans la requête'}]
    }
    return [true]
}


const checkUser = (req, userId) => {
    if (!req.auth.userId === userId) {
        res.status(403).json({ 'error': 'Un utilisateur n\'est pas autorisé à modifier ou supprimer le livre créé par un autre utilisateur'})
    }
    return [true]
}


const checkEmail = (req) => {
    emailRegEx = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (!emailRegEx.test(req.body.email)) {
        return [false, 400, {'error': 'email non valide'}]
    }
    return [true]
}


const checkIfBookExists = (book, id) => {
    Book.find()
        .then(books => {
            let isInDatabase = books.some(browseBook => (browseBook.title === book.title && browseBook.author === book.author && book._id === id))
            if (isInDatabase) {
                return [false, 400, {'error': 'Livre déjà enregistré dans la base de données'}]
            }
        })
        .catch(error => res.status(400).json({ error }))
    return [true]
}


module.exports = { checkKeys, checkValues, checkYear, checkRating, checkAlreadyRatedBook, checkImageFile, checkUser, checkEmail, checkIfBookExists }