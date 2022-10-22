import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from 'freet/model';

/**
 * Define the properties stored in a Like
 */
export type Comment = {
  _id: Types.ObjectId; 
  commenterId: Types.ObjectId | string;
  freetId: Types.ObjectId | string;
  dateCreated: Date;
  content: string;
};

const CommentSchema = new Schema<Comment>({
  // ID of person leaving commet 
  commenterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  // ID of freet being commented on
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },

  // The date the comment was created
  dateCreated: {
    type: Date,
    required: true
  },

  // The content of the comment
  content: {
    type: String,
    required: true
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
