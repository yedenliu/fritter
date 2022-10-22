import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';
import { User } from 'user/model';

/**
 * This files contains a class for Likes
 */

class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {Types.ObjectId} likerId - The id of the user liking the freet
   * @param {Types.ObjectId} freetId - The id of the freet the user is liking
   * @return {Promise<HydratedDocument<Like>>} - The newly added like
   */
  static async addOne(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      likerId,
      freetId
    });
    await like.save(); // Saves freet to MongoDB
    return like.populate('likerId'); // what would this do??? 
  }

  /**
   * Get all the likes of a freet
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({}).populate('likerId'); // again, what is this?? 
  }

  /**
   * Get like of a freet given the user ID of the liker
   *
   * @return {Promise<HydratedDocument<Like>>} - An array of all of the freets
   */
   static async findOne(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.findOne({'likerId': likerId, 'freetId': freetId}).populate('likerId'); // again, what is this?? 
  }

  /**
   * Delete a like with given freetId and userId.
   *
   * @param {Types.ObjectId} likerId - The id of the liker 
   * @param {Types.ObjectId} freetId - The id of the the freet
   * @return {Promise<Boolean>} - true if the like has been removed, false otherwise
   */
  static async deleteOne(likerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({'likerId': likerId, 'freetId': freetId});
    return like !== null;
  }
}

export default LikeCollection;
