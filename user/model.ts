import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

// =====================================================================
/**
 * FOR ADMIN: List of verified users 
 * Used in setter for isVerifed property
 */
 let verifiedList: Array<Types.ObjectId | string> = [];
// =====================================================================

/**
 * This file defines the properties stored in a User
 */
// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  allLikes: Array<Types.ObjectId>;
  isVerified: boolean;
};

// make sure every value is equal to "something"
function verify(val: Types.ObjectId | string) {
  return verifiedList.includes(val);
}

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: [true, 'username is required']
  },
  // The user's password
  password: {
    type: String,
    required: [true, 'password is require']
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  // Array of users liked 
  allLikes: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'Freet' 
  },
  // Boolean determining is/not verified status
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
    set: verify
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
