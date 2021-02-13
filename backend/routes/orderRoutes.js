import express from 'express'
const router = express.Router()
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } from '../controllers/orderController.js'
import { isAdmin, protect } from '../middlewares/authMiddleware.js'

router.route('/').post(protect, addOrderItems)
router.route('/').get(protect, isAdmin, getOrders)
router.route('/myorders').get(protect, getMyOrders)


router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered)
router.route('/:id').get(protect, getOrderById)


export default router;