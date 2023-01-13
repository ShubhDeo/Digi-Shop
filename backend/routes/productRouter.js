import express from 'express'
const router = express.Router()
import {  getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts } from '../controllers/productController.js'
import { protect, isAdmin } from '../middlewares/authMiddleware.js'

router.route('/').get(getProducts)
router.route('/').post(protect, isAdmin, createProduct)
router.route('/top').get(getTopProducts)


router.route('/:id').put(protect, isAdmin, updateProduct)
router.route('/:id').get(getProductById)
router.route('/:id').delete(protect, isAdmin, deleteProduct)


router.route('/:id/reviews').post(protect, createProductReview)


export default router