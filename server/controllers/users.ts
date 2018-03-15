/**
 * 用户 相关 Controller
 */

import jwt from 'jsonwebtoken';
import { secret } from '../config';
import User, { UserModel, UserDocument } from '../models/users';

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
   * 登录，刷新并获取token
   * @param ctx
   */
  async login<IMiddleware>(ctx: Context): Promise<any> {
    const { email, password } = ctx.request.body;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return ctx.throw(200, '该用户未注册');
    }

    // 检查密码是否正确
    const isMatch = await user.comparePassword(password);
    // 密码错误时，返回错误
    if (!isMatch) {
      return ctx.throw(200, '登录失败, 密码错误');
    }

    const token = jwt.sign({ email }, secret, {
      expiresIn: '7 days',
    });

    user.token = token;
    await user.save();
    ctx.body = {
      success: true,
      message: '登录成功!',
      data: {
        token,
        email,
        id: user._id,
      },
    };
  },
  /**
   * 验证token
   * @param ctx
   */
  async auth<IMiddleware>(ctx: Context): Promise<any> {
    const { user } = ctx.state;

    let token = user.token;
    let veri;
    try {
      veri = jwt.verify(token, secret, { ignoreExpiration: true });
    } catch (err) {
      ctx.throw(200, '登录已过期，请重新登录');
    }

    if (veri.email !== user.email) {
      ctx.throw(200, '验证失败，请确认填写信息无误');
    }

    ctx.body = {
      success: true,
      data: {
        nickname: user.nickname,
        id: user._id,
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
   * 获取我的信息
   * @param ctx
   */
  async getMyInfo<IMiddleware>(ctx: Context): Promise<any> {
    const { email, _id, nickname, avatar } = ctx.state.user;
    ctx.body = {
      success: true,
      data: {
        email,
        id: _id,
        nickname: nickname ? nickname : '',
        avatar,
      },
    };
  },
  /**
   * 获取用户信息
   * @param ctx
   */
  async getInfo<IMiddleware>(ctx: Context): Promise<any> {
    const { id } = ctx.params;
    const user: UserDocument = await User.hasId(id);
    ctx.assert(user, 200, '用户不存在');
    const { email, _id, nickname, avatar } = user;
    ctx.body = {
      success: true,
      data: {
        email,
        id: _id,
        nickname: nickname ? nickname : '无名氏',
        avatar,
      },
    };
  },
  /**
   * 测试接口
   * @param ctx
   */
  async test<IMiddleware>(ctx: Context): Promise<any> {
    console.log(ctx);
    console.log(ctx.cookies);
    ctx.body = {
      success: true,
      message: 'test接口',
    };
  },
};
