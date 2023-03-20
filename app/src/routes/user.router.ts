import { Router } from 'express';

import { getUserProfile } from '../controllers';
import { validate, protectedRoute } from '../middlewares';
import { userProfileSchema } from '../validators';

const router = Router();

router.get('/:id', validate(userProfileSchema), protectedRoute, getUserProfile);

export const userRouter = router;
