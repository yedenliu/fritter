import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * Defining all the data structures for Typscript use and "tables" for MongoDB
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string; 
  dateModified: Date;
  endTime: Date;
  usersLiked: Array<Types.ObjectId>;
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  endTime: Date;
  usersLiked: Array<Types.ObjectId>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB

const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  // Add end time for timed freet
  endTime: {
    type: Date,
    required: false,
    default: null
  },
  // Array of users liked 
  usersLiked: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'User',
    default: []
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
