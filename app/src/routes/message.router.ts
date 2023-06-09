import { Router } from 'express';
import { getLastMessages } from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import { lastMessagesSchema } from '../validators';

const router = Router();

router.get('/:id', validate(lastMessagesSchema) , protectedRoute, getLastMessages);

export const messageRouter = router;