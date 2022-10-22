import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from 'freet/model';

/**
 * Define the properties stored in a Like
 */
export type Like = {
  _id: Types.ObjectId; 
  likerId: Types.ObjectId;
  freetId: Types.ObjectId;
};



// export type Comment = {
//   _id: Types.ObjectId; 
//   authorId: User;
//   freetId: Freet;
//   dateCreated: Date;
//   content: string;
//   dateModified: Date;
// };

// export type Refreet = {
//   _id: Types.ObjectId; 
//   authorId: User;
//   freetId: Freet;
//   dateCreated: Date;
//   content: string;
//   dateModified: Date;
// };

const LikeSchema = new Schema<Like>({
  likerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },

});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
