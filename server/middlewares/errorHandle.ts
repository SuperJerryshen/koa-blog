import { Context } from 'koa';

export default () => async (ctx: Context, next: Function) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = typeof err.status === 'number' ? err.status : 500;
    ctx.body = {
      success: false,
      message: err.message,
    };

    // if (err.name === 'UnauthorizedError') {
    //   ctx.body.message = '未授权，拒绝访问';
    // } else if (err.name === 'NotFoundError') {
    //   ctx.body.message = err.message;
    // } else {
    //   ctx.body.message = '服务器错误';
    // }
  }
};
