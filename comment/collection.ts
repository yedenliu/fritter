import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';

/**
 * This files contains a class for Comments
 */

class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {Types.ObjectId} commenterId - The id of the user commenting on the freet
   * @param {Types.ObjectId} freetId - The id of the freet the user is commenting on
   * @return {Promise<HydratedDocument<Comment>>} - The newly added comment
   */
  static async addOne(commenterId: Types.ObjectId | string, freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      commenterId,
      freetId,
      dateCreated: date,
      content
    });
    await comment.save(); // Saves freet to MongoDB
    return comment.populate('commenterId');
  }

  /**
   * Get all the comment of a freet
   *
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findAll(): Promise<HydratedDocument<Comment>[]>{
    return CommentModel.find({}).populate('commenterId'); 
  }

  /**
   * Get comment of a freet given the user ID of the commenter
   * 
   * @param {Types.ObjectId} commenterId - The id of the user commenting on the freet
   * @param {Types.ObjectId} freetId - The id of the freet the user is commenting on
   * @return {Promise<HydratedDocument<Comment>>} - Comment
   */
   static async findOne(commenterId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({'commenterId': commenterId, 'freetId': freetId}).populate('commenterId'); // again, what is this?? 
  }

  /**
   * Delete a comment with given freetId and userId.
   *
   * @param {Types.ObjectId} commentId - The id of the comment
   * @return {Promise<Boolean>} - true if the comment has been removed, false otherwise
   */
   static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
