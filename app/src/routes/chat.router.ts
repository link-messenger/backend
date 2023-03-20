import { Router } from 'express';
import {
	createConversationController,
	deleteConversationController,
	getUserChatList,
	getUserConversationController,
	getUserDetailController,
} from '../controllers';
import { protectedRoute } from '../middlewares';


const router = Router();


router.get('/', protectedRoute, getUserChatList);

export const chatRouter = router;
