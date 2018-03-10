/**
 * 用户 相关 Controller
 */

import jwt from 'jsonwebtoken';
import { secret } from '../config';
import User from '../models/users';

// 导入types
import { Context } from 'koa';
import { IMiddleware } from 'koa-router';

export default {
  /**
   * 注册账户
   * @param ctx
   */
  async signup<IMiddleware>(ctx: Context): Promise<any> {
    const { email, password, nickname, avatar } = ctx.request.body;
    const user = await User.findOne({ email });
    if (user) {
      return ctx.throw(200, '用户已存在');
    }

    const newUser = new User({
      email,
      password,
      nickname,
      avatar,
    });

    // 保存用户账号
    await newUser.save();
    ctx.body = { success: true, message: '成功创建新用户!' };
  },
  /**
   * 获取token
   * @param ctx
   */
  async accesstoken<IMiddleware>(ctx: Context): Promise<any> {
    const { email, password } = ctx.request.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return ctx.throw(404, '该用户未注册');
    }

    // 检查密码是否正确
    const isMatch = await user.comparePassword(password);
    // 密码错误时，返回错误
    if (!isMatch) {
      return ctx.throw(200, '认证失败, 密码错误');
    }
    const token = jwt.sign({ email }, secret, {
      expiresIn: 10080,
    });
    user.token = token;
    await user.save();
    ctx.body = {
      success: true,
      message: '验证成功!',
      data: {
        token,
        email,
      },
    };
  },
  /**
   * 编辑用户信息
   * @param ctx
   */
  async editInfo<IMiddleware>(ctx: Context): Promise<any> {
    const { phone } = ctx.request.body;
    const { user } = ctx.state;
    user.phone = phone;
    await user.save();
    ctx.body = {
      success: true,
      message: '修改用户信息成功',
    };
  },
  /**
   * 获取用户信息
   * @param ctx
   */
  async getInfo<IMiddleware>(ctx: Context): Promise<any> {
    const { email, _id, nickname, avatar } = ctx.state.user;
    ctx.body = {
      email,
      id: _id,
      nickname: nickname ? nickname : '',
      avatar,
    };
  },
};
