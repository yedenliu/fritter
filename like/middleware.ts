import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

/**
 * Checks if a like with freetId is req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOne(req.params.likerId, req.params.freetId);
  if (!like) {
    res.status(404).json({
      error: {
        likeNotFound: `Like from user ID ${req.params.likerId} for freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isLikeExists,
};
