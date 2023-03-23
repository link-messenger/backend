import { Router } from 'express';

import { getUserChatList } from '../controllers';
import { protectedRoute } from '../middlewares';

const router = Router();

router.get('/', protectedRoute, getUserChatList);

export const chatRouter = router;
