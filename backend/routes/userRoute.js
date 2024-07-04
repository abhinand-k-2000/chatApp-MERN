
import express from 'express'
import { allUsers, authUser, registerUser } from '../controller/userController.js'
import { authentication } from '../middleware/authMiddleware.js'
const router = express.Router()



// router.post('/register', registerUser)
router.route('/').post(registerUser).get(authentication, allUsers)
router.route('/login').post(authUser)
     

export default router       