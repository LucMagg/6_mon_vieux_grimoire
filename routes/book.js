const express = require('express')
const router = express.Router()

const getBookCtrl = require('../controllers/book/get')
const postBookCtrl = require('../controllers/book/post')
const putBookCtrl = require('../controllers/book/put')
const delBookCtrl = require('../controllers/book/delete')

const auth = require('../middlewares/auth')
const uploadImage = require('../middlewares/upload')
const parseRequest = require('../middlewares/parseRequest')

router.get('/', getBookCtrl.getAllBooks)
router.get('/bestrating', getBookCtrl.getBestRatedBooks)
router.get('/:id', getBookCtrl.getOneBook)

router.post('/', auth, parseRequest, uploadImage, postBookCtrl.createBook)
router.put('/:id', auth, parseRequest, uploadImage, putBookCtrl.updateBook)
router.delete('/:id', auth, delBookCtrl.deleteBook)
router.post('/:id/rating', auth, postBookCtrl.rateBook)

module.exports = router