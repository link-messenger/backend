import { Router } from 'express';

import {
	createStreamController,
	getOnlineStreamListController,
	getUserStreams,
	getOnlineStream,
} from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import {
	createStreamSchema,
	getOnlineStreamSchema,
	getUserStreamsSchema,
} from '../validators';

const router = Router();
router.post(
	'/',
	validate(createStreamSchema),
	protectedRoute,
	createStreamController
);

router.get('/', protectedRoute, getOnlineStreamListController);
router.get(
	'/user/:username',
	validate(getUserStreamsSchema),
	protectedRoute,
	getUserStreams
);
router.get(
	'/:id',
	validate(getOnlineStreamSchema),
	protectedRoute,
	getOnlineStream
);


export const streamRouter = router;
