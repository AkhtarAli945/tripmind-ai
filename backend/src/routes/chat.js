import express from 'express';
import { startChat, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/message', startChat);
router.get('/history/:sessionId', getChatHistory);

export default router;
