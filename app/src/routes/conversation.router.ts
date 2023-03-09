import { Router } from 'express';
import {
	createConversationController,
	deleteConversationController,
	getUserConversationController,
} from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import { createConversationSchema, deleteConversationSchema } from '../schemas';

const router = Router();

router.post(
	'/',
	validate(createConversationSchema),
	protectedRoute,
	createConversationController
);
router.get('/', protectedRoute, getUserConversationController);
router.delete(
	'/:id',
	validate(deleteConversationSchema),
	protectedRoute,
	deleteConversationController
);

export const conversationRouter = router;
