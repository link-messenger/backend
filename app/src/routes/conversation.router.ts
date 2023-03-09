import { Router } from 'express';
import {
	createConversationController,
	deleteConversationController,
	getUserConversationController,
	getUserDetailController,
} from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import {
	createConversationSchema,
	deleteConversationSchema,
	getGroupDetailSchema,
	getUserDetailSchema,
} from '../schemas';

const router = Router();

router.post(
	'/',
	validate(createConversationSchema),
	protectedRoute,
	createConversationController
);
router.get('/', protectedRoute, getUserConversationController);
router.get(
	'/:id',
	validate(getUserDetailSchema),
	protectedRoute,
	getUserDetailController
);
router.delete(
	'/:id',
	validate(deleteConversationSchema),
	protectedRoute,
	deleteConversationController
);

export const conversationRouter = router;
