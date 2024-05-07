const express = require('express')
const router = express.Router()

const bookCtrl = require('../controllers/book')

const auth = require('../middlewares/auth')
const uploadImage = require('../middlewares/upload')
const parseRequest = require('../middlewares/parseRequest')

router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.get('/bestrating', bookCtrl.getBestRatedBooks)
router.post('/', auth, parseRequest, uploadImage, bookCtrl.createBook)
router.put('/:id', auth, bookCtrl.updateBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth, bookCtrl.rateBook)

module.exports = router