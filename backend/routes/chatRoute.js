import express from 'express'
import { authentication } from '../middleware/authMiddleware.js'
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from '../controller/chatController.js'
const router = express.Router()


router.route('/').post(authentication, accessChat).get(authentication, fetchChats)
router.route('/group').post(authentication, createGroupChat)
router.route('/rename').put(authentication, renameGroup)
router.route('/groupadd').put(authentication, addToGroup)
router.route('/groupremove').put(authentication, removeFromGroup)


export default router
      