import { Router } from 'express';
import {
	createGroupController,
	deleteGroupController,
	getGroupController,
	getUserGroupsController,
	updateGroupController,
} from '../controllers';
import { protectedRoute, validate } from '../middlewares';
import {
	createGroupSchema,
	deleteGroupSchema,
	getGroupSchema,
	updateGroupSchema,
} from '../schemas';

const router = Router();

router.get('/', protectedRoute, getUserGroupsController);
router.get(
	'/find/:search',
	validate(getGroupSchema),
	protectedRoute,
	getGroupController
);
router.post(
	'/',
	validate(createGroupSchema),
	protectedRoute,
	createGroupController
);
router.put(
	'/:id',
	validate(updateGroupSchema),
	protectedRoute,
	updateGroupController
);
router.delete(
	'/:id',
	validate(deleteGroupSchema),
	protectedRoute,
	deleteGroupController
);

export const groupRouter = router;
