import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';

/**
 * Checks if a comment with freetId is req.params exists
 */
const isCommentExists = async (req: Request, res: Response, next: NextFunction) => {
  const like = await CommentCollection.findOne(req.params.commenterId, req.params.freetId);
  if (!like) {
    res.status(404).json({
      error: {
        commentNotFound: `Comment from user ID ${req.params.commenter} for freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isCommentExists,
};
