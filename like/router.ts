import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';

const router = express.Router();

/**
 * Get all the likes of a freet 
 *
 * @name GET /api/freets
 *
 * @return {Like[]} - A list of all the likes attached to a freet
 * @throws {400} - If freetId is not given
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next();
      return;
    }
    const allLikes = await LikeCollection.findAll();
    res.status(200).json(allLikes);
  }
);

/**
 * Add a new like
 *
 * @name POST /api/freets
 *
 * @return {FreetResponse} - The liked freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const likerId = (req.session.userId);
    const freetId = (req.session.freetId);
    await LikeCollection.addOne(likerId, freetId);
    res.status(201).json({
      message: 'You have successfully'
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/freets/
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.likerId, req.params.freetId);
    res.status(200).json({
      message: 'Your like was removed successfully.'
    });
  }
);

export {router as likeRouter};
