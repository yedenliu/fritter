import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import InteractionCollection from '../freet/collection';

/**
 * Checks if a like with freetId is req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const like = validFormat ? await InteractionCollection.findOne(req.params.freetId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        likeNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isLikeExists,
};
