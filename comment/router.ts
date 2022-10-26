import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';

const router = express.Router();

/**
 * Get all the comments of a freet 
 *
 * @name GET /api/comment
 *
 * @return {Comment[]} - A list of all the comments attached to a freet
 * @throws {400} - If freetId is not given
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId !== undefined) {
      next();
      return;
    }
    const allComments = await CommentCollection.findAll();
    res.status(200).json(allComments);
  }
);

/**
 * Add a new comment
 *
 * @name POST /api/comment
 *
 * @return {FreetResponse} - The commented freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const commenterId = (req.session.userId);
    const freetId = (req.params.freetId);
    const content = (req.body.content);
    await CommentCollection.addOne(commenterId, freetId, content);
    res.status(201).json({
      message: 'You have successfully added your comment'
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comment
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

export {router as commentRouter};
