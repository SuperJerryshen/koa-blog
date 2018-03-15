import { Schema, Document, model, Model } from 'mongoose';
import { ObjectID } from 'bson';
import User from './users';

export interface ArticleTypes {
  title: string;
  content: string;
  created_time: Date;
  last_update_time: Date;
  author: ObjectID;
  stared_user: Array<ObjectID>;
}

export interface ArticleModelInterface extends Model<Document> {
  hasId(id: string): Promise<any>;
  getAllWithAuthor(limit: number, page: number): Promise<any>;
}

const { ObjectId } = Schema.Types;

// 评论 Schema
const commentSchema = new Schema({
  user: ObjectId,
  created_time: Date,
  content: String,
});

// 文章 Schema
const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_time: {
    type: Date,
    required: true,
  },
  last_update_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  stared_user: {
    type: [ObjectId],
    default: [],
  },
  viewed_times: {
    type: Number,
    default: 0,
  },
  comment: {
    type: [commentSchema],
    default: [],
  },
});

articleSchema.statics.hasId = function(id) {
  return new Promise((res, rej) => {
    this.findById(id)
      .populate('author', 'nickname avatar _id')
      .exec(function(err, art) {
        if (err) {
          res(null);
        } else {
          res(art);
        }
      });
  });
};
articleSchema.statics.getAllWithAuthor = async function(
  limit: number,
  page: number
) {
  const arts = await this.find()
    .sort({ last_update_time: -1 })
    .skip(limit * (page - 1))
    .limit(limit);
  arts.forEach(async art => {
    const user = await User.findById(art.author);
    art.author = user;
  });
  return arts;
};

export default model<Document, ArticleModelInterface>('Article', articleSchema);
