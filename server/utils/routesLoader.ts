// 用于加载固定格式的路由配置

import Router, { IMiddleware } from 'koa-router';
import Koa from 'koa';
import { baseApi } from '../config';
import routeConfig from '../routes/users';
import errorHandler from '../middlewares/errorHandle';

export interface Route {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'head' | 'options' | 'patch';
  middlewares?: null | undefined | Array<IMiddleware>;
  controller: IMiddleware;
}

export interface RouteConfig {
  prefix: string;
  routes: Route[];
}

export default (routeConfig: RouteConfig, app: Koa) => {
  const { prefix, routes } = routeConfig;
  const router = new Router();

  // 接口前缀 例如 api/users
  router.prefix(`/${baseApi}/${prefix}`);

  // 遍历routes
  routes.forEach(route => {
    router[route.method](
      route.url,
      ...(route.middlewares ? route.middlewares : []),
      route.controller
    );
  });

  // 应用路由中间件
  app.use(router.routes()).use(router.allowedMethods());
};
