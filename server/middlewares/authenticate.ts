// 用于验证身份的中间件
import { Context } from 'koa';
import User from '../models/users';

export default () => async (ctx: Context, next: Function) => {
  if (!ctx.state.user) {
    return ctx.throw(200, '用户未授权');
  }
  // 使用await
  await next();
};
