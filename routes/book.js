const express = require('express')
const router = express.Router()

const bookCtrl = require('../controllers/book')

const auth = require('../auth/auth')

router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.get('/bestrating', bookCtrl.getBestRatedBooks)
router.post('/', auth, bookCtrl.createBook)
router.put('/:id', auth, bookCtrl.updateBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth, bookCtrl.rateBook)

module.exports = router