import { Router } from 'express';
import { searchChatController } from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import { loginSchema, registerSchema, searchSchema } from '../schemas';

const router = Router();
router.get('/', validate(searchSchema), searchChatController);

export const searchRouter = router;