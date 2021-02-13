import express from 'express'
const router = express.Router()
import { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } from '../controllers/userController.js'
import { protect, isAdmin } from '../middlewares/authMiddleware.js'

router.route('/login').post(authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/').post(registerUser)
router.route('/').get(protect, isAdmin, getUsers)


router.route('/:id').get(protect, isAdmin, getUserById)
router.route('/:id').delete(protect, isAdmin, deleteUser)
router.route('/:id').put(protect, isAdmin, updateUser)



export default router