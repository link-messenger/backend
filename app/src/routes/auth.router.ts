import { Router } from 'express';
import {
	deleteAccountController,
	forgetPasswordController,
	loginController,
	logoutController,
	profileController,
	refreshTokenController,
	registerController,
	resetPasswordController,
	updateAccountController,
	verifyOtpController,
} from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import {
	forgetPasswordSchema,
	loginSchema,
	refreshTokenSchema,
	registerSchema,
	resetPasswordSchema,
	verifyOtpSchema,
} from '../validators';

const router = Router();

router.post('/login', validate(loginSchema), loginController);
router.post('/register', validate(registerSchema), registerController);

router.get('/me', protectedRoute, profileController);
router.delete('/me', protectedRoute, deleteAccountController);
router.put(
	'/me',
	validate(updateAccountController),
	protectedRoute,
	updateAccountController
);

router.post(
	'/token/refresh',
	validate(refreshTokenSchema),
	protectedRoute,
	refreshTokenController
);

router.post('/otp/verify', validate(verifyOtpSchema), verifyOtpController);

router.post(
	'/password/forget',
	validate(forgetPasswordSchema),
	protectedRoute,
	forgetPasswordController
);

router.post(
	'/password/reset',
	validate(resetPasswordSchema),
	protectedRoute,
	resetPasswordController
);

router.get('/logout', protectedRoute, logoutController);

export const authRouter = router;
