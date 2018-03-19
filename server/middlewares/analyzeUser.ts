// 根据Authentication获取用户信息的中间件
import { Context } from 'koa';
import User from '../models/users';

export default () => async (ctx: Context, next: Function) => {
  if (ctx.state.user) {
    return await next();
  }
  const token = ctx.request.headers.authorization;

  if (!token) {
    return await next();
  }
  const user = await User.findOne({ token });

  if (user) {
    ctx.state.user = user;
  }
  // 使用await
  await next();
};
