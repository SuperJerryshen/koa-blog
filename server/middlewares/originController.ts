import { Context } from 'koa';

export default () => async (ctx: Context, next: Function) => {
  await next();
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};
