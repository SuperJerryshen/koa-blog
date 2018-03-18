import qiniu from 'qiniu';
import { qnKey } from '../config';

// 导入types
import { Context } from 'koa';
import { IMiddleware } from 'koa-router';

class Utils {
  /**
   * 获取七牛上传token
   * @param ctx
   */
  async qiniuToken<IMiddleware>(ctx: Context): Promise<any> {
    const { accessKey, secretKey } = qnKey;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    const options = {
      scope: 'koa-blog',
      expires: 7200,
    };

    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);

    ctx.body = {
      success: true,
      data: {
        token,
      },
    };
  }
}

export default new Utils();
