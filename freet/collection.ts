import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {Date} endTime - The end time of the timed freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, endTime?: Date | string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    if (endTime == ""){
      endTime = null;
    }
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      endTime: endTime,
      usersLiked: []
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a freet with the new content
   * This edit feature is different from the follow up feature because it has a 30 min time limit 
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} authorId - The id of the creater of the freet
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    // saving variables 
    const author = await UserModel.findOne({_id: authorId});
    const freet = await FreetModel.findOne({_id: freetId});
    const currentTime = new Date()
    const oldTime = freet.dateCreated
    var duration = (currentTime.getTime() - oldTime.getTime())/60000 // getting minutes

    // if user is verified OR time is within 30 min of posting, can update
    if (author.isVerified || duration <= 30) {
      freet.content = content;
      freet.dateModified = new Date();
      await freet.save();
      return freet.populate('authorId');
    }
    // if time is 30 min past time created, nothing happens (return old freet)
    // should never have to run this return because of middleware validation checks
    return freet.populate('authorId')
  
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all expired freetIDs
   */
   static async deleteExpires() {
    const allFreets = await FreetCollection.findAll();
    const date = new Date(); // current time 
    // for freet in all freets 
    for (var freet of allFreets) {
      // check if date is past endTime
      if ((freet.endTime < date) && (freet.endTime != null)) {
        await FreetModel.deleteOne({_id: freet._id});
      }
    }
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }

  /** 
   * Add like (freet-side, i.e., add userId to usersLiked array)
   * 
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of freet user wants to like
   * 
  */
   static async addLikedBy(userId: Types.ObjectId | string, freetId: Types.ObjectId | string) {
    FreetModel.updateOne(
      {_id: freetId},
      {$push: { usersLiked: userId } }
      );    
  }

  /**
   * Delete like given freetId (freet-side)
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of freet user wants to like
   */
   static async deleteLikedBy(userId: Types.ObjectId | string, freetId: Types.ObjectId | string) {
    FreetModel.updateOne(
      {_id: freetId},
      {$pull: { usersLiked: userId } }
      )
  }

  /** 
   * Find all users that have liked a freet
   * 
   * @param {string} freetId - The id of freet user wants to like
   * @return {Promise<boolean>} - true if the freet has been deleted, false otherwise

  */
   static async findLikes(freetId: Types.ObjectId | string): Promise<Array<Types.ObjectId | string>> {
    const freet = await FreetModel.findOne({_id: freetId});
    return freet.usersLiked;
  }

}
export default FreetCollection;
