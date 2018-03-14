import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { Document, Model } from 'mongoose';

export interface UserDocument extends Document {
  comparePassword(password: string): boolean;
  password?: string;
  token?: string;
  email: string;
  nickname: string;
  avatar: string;
}

export interface UserModel extends Model<UserDocument> {
  hasId(id: string): any;
}

const { Schema } = mongoose;

const userSchema = new Schema({
  // 邮箱，及账号名
  email: {
    type: String,
    unique: true,
    require: true,
  },
  // 密码
  password: {
    type: String,
    require: true,
  },
  // 昵称
  nickname: {
    type: String,
    required: true,
  },
  // 头像
  avatar: {
    type: String,
  },
  token: String,
});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
userSchema.pre('save', function(this: UserDocument, next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// 校验用户输入密码是否正确
userSchema.methods.comparePassword = function(passw: string) {
  return bcrypt.compare(passw, this.password);
};

userSchema.statics.hasId = function(id) {
  return new Promise((res, rej) => {
    this.findById(id, function(err, user) {
      if (err) {
        res(null);
      } else {
        res(user);
      }
    });
  });
};

export default mongoose.model<UserDocument, UserModel>('User', userSchema);
