import express from 'express'
import { authentication } from '../middleware/authMiddleware.js'
import {allMessages, sendMessage} from '../controller/messageController.js'
const router = express.Router()

router.route('/').post(authentication, sendMessage)
router.route('/:chatId').get(authentication, allMessages)


export default router