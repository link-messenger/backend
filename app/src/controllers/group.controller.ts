import { Request, Response } from 'express';
import { GROUP_STATUS, GROUP_STATUS_MAP, ROLESMAP } from '../constants';
import { NotFoundError, ServerError } from '../errors';
import { hasUser } from '../guards/server.guard';
import { Group } from '../models';

export const createGroupController = async (req: Request, res: Response) => {
  if (!hasUser(req)) throw new ServerError('oops! something went wrong');
  const user = req.user;
	const { name, description, status,  } = req.body;
  const group = await Group.create({
		name,
		description,
    members: [{
      user: user._id,
      role: ROLESMAP.admin,
    }],
    status,
  });
  
  return res.status(201).json(group);
};

export const getGroupController = async (req: Request, res: Response) => {
  if (!hasUser(req)) throw new ServerError('oops! something went wrong');
  const user = req.user;
  const { search } = req.params;
  const group = await Group.find({
		$or: [
			{
				status: GROUP_STATUS_MAP.public,
				name: {
					$regex: '.*' + search + '.*',
				},
			},
			{
				link: search,
			},
		],
	});
  if (!group.length) throw new NotFoundError('Group not found');
  return res.status(200).json(group);
}

export const updateGroupController = async (req: Request, res: Response) => {
  if (!hasUser(req)) throw new ServerError('oops! something went wrong');
  const user = req.user;
  const { id } = req.params;
  const { name, description, status } = req.body;
  const group = await Group.findOneAndUpdate(
    {
      _id: id,
      members: {
        $elemMatch: {
          user: user._id,
          role: ROLESMAP.admin,
        },
      },
    },
    {
      name,
      description,
      status
    },
    {
      new: true,
    }
  );
  if (!group) throw new NotFoundError('Group not found');
  return res.status(200).json(group);
}

export const deleteGroupController = async (req: Request, res: Response) => {
  if (!hasUser(req)) throw new ServerError('oops! something went wrong');
  const user = req.user;
  const { id } = req.params;

  const group = await Group.findOneAndDelete({
    _id: id,
    members: {
      $elemMatch: {
        user: user._id,
        role: ROLESMAP.admin,
      },
    },
  });

  if (!group) throw new NotFoundError('Group not found');
  return res.status(200).json(group);
}

export const getGroupDetailController = async (req: Request, res: Response) => {
  if (!hasUser(req)) throw new ServerError('oops! something went wrong');
  const user = req.user;
  const { id } = req.params;
  const group = await Group.findOne({
    _id: id,
    members: {
      $elemMatch: {
        user: user._id,
      },
    },
  }).populate(['members.user']);

  if (!group) throw new NotFoundError('Group not found');
  return res.status(200).json(group);
}

export const getUserGroupsController = async (req: Request, res: Response) => {
  if (!hasUser(req)) throw new ServerError('oops! something went wrong');
  const user = req.user;
  const groups = await Group.find({
    members: {
      $elemMatch: {
        user: user._id,
      },
    },
  });
  return res.status(200).json(groups);
}

