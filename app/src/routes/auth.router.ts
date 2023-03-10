import { Router } from 'express';
import { loginController, logoutController, profileController, registerController } from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import { loginSchema, registerSchema } from '../schemas';

const router = Router();

router.post('/login', validate(loginSchema), loginController);
router.post('/register', validate(registerSchema), registerController);
router.get('/me', protectedRoute, profileController);
router.get('/logout', protectedRoute, logoutController);
export const authRouter = router;