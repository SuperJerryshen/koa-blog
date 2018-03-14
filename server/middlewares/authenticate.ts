// 用于验证身份的中间件
import { Context } from 'koa';
import User from '../models/users';

export default () => async (ctx: Context, next: Function) => {
  const token = ctx.request.headers.authorization;
  const user = await User.findOne({ token });
  // 如果user为null
  if (!user) {
    return ctx.throw(200, '用户未授权');
  }
  // 将user赋值于本次请求的req上, 以便后面的中间件访问
  ctx.state.user = user;
  // 使用await
  await next();
};
