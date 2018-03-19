import Article from '../models/articles';
import User from '../models/users';

// 导入types
import { Context } from 'koa';
import { IMiddleware } from 'koa-router';
import { ObjectId } from 'bson';

class articleController {
  /**
   * 新建文章
   * @param ctx
   */
  async make<IMiddleware>(ctx: Context): Promise<any> {
    const { title, content } = ctx.request.body;
    const { user } = ctx.state;
    const now = new Date();

    ctx.assert(title, 200, '文章标题不能为空');

    const article = new Article({
      title,
      content: content ? content : '',
      author: user._id,
      created_time: now,
      updated_time: now,
    });

    await article.save();

    ctx.body = {
      success: true,
      message: '创建成功',
      data: {
        article_id: article._id,
      },
    };
  }

  /**
   * 编辑文章
   * @param ctx
   */
  async edit<IMiddleware>(ctx: Context): Promise<any> {
    const { article_id, title, content } = ctx.request.body;

    let article = await Article.findByIdAndUpdate(article_id, {
      title,
      content,
      last_update_time: new Date(),
    });

    ctx.assert(article, 200, '该文章不存在');

    ctx.body = {
      success: true,
      message: '修改文章成功',
    };
  }

  /**
   * 删除文章
   * @param ctx
   */
  async delete<IMiddleware>(ctx: Context): Promise<any> {
    const { article_id } = ctx.request.body;

    let article = await Article.findByIdAndRemove(article_id);

    ctx.assert(article, 200, '该文章不存在');

    ctx.body = {
      success: true,
      message: '删除文章成功',
    };
  }

  /**
   * 获取某篇文章
   * @param ctx
   */
  async get<IMiddleware>(ctx: Context): Promise<any> {
    const { id } = ctx.params;

    // TODO 让ts兼容 mongoose 的 statics 上的属性
    const article = await Article.hasId(id);

    ctx.assert(article, 200, '文章不存在');

    article.viewed_times += 1;

    await article.save();

    ctx.body = {
      success: true,
      data: article,
    };
  }

  /**
   * 获取全部文章列表，分页
   * @param ctx
   */
  async getAll<IMiddleware>(ctx: Context): Promise<any> {
    let { limit, page } = ctx.request.query;
    if (!limit) {
      limit = 20;
    }
    if (!page) {
      page = 1;
    }
    const articles = await Article.find()
      .sort({ last_update_time: -1 })
      // .skip(limit * (page - 1))
      // .limit(limit)
      .populate('author', 'nickname avatar _id');

    ctx.body = {
      success: true,
      data: articles,
    };
  }

  /**
   * 获取某一个用户的全部文章列表，分页
   * @param ctx
   */
  async getAllUsers<IMiddleware>(ctx: Context): Promise<any> {
    const { id } = ctx.params;

    const user = await User.findById(id);

    ctx.assert(user, 200, '用户不存在');

    const articles = await Article.find({
      author: id,
    });

    ctx.body = {
      success: true,
      data: articles,
    };
  }

  /**
   * 喜欢或取消喜欢文章
   * @param ctx
   */
  async star<IMiddleware>(ctx: Context): Promise<any> {
    const { article_id } = ctx.request.body;
    const { user } = ctx.state;

    let article = await Article.hasId(article_id);

    ctx.assert(article, 200, '该文章不存在');

    let isStared = true;

    // 如果用户喜欢列表中含有该文章
    if (user.stared_articles.indexOf(article_id) > -1) {
      // 过滤
      user.stared_articles = user.stared_articles.filter(
        id => id.toString() !== article_id
      );
      article.stared_users = article.stared_users.filter(
        id => id.toString() !== user.id
      );
      isStared = false;
    } else {
      user.stared_articles.push(article_id);
      article.stared_users.push(user.id);
    }

    // 保存
    await article.save();
    await user.save();

    ctx.body = {
      success: true,
      data: {
        isStared,
      },
      message: isStared ? '喜欢文章成功' : '取消喜欢文章成功',
    };
  }
}

export default new articleController();
