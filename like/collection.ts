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
  static async addOne(likerId: Types.ObjectId, freetId: Types.ObjectId): Promise<HydratedDocument<Like>> {
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
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves freets and sorts them from most to least recent
    return LikeModel.find({}).populate('likedId'); // agai, what is this?? 
  }

  /**
   * Delete a like with given freetId and userId.
   *
   * @param {string} freetId - The freetId of free to remove like from
   * @return {Promise<Boolean>} - true if the like has been removed, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await LikeModel.deleteOne({_id: freetId});
    return freet !== null;
  }
}

export default LikeCollection;
