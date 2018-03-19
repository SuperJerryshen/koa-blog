import ArticleController from '../controllers/articles';
import authenticate from '../middlewares/authenticate';
import { Route, RouteConfig } from '../utils/routesLoader';

// 用户用户验证的中间件
const authMid = authenticate();

const routes: Array<Route> = [
  {
    url: '/:id',
    method: 'get',
    middlewares: null,
    controller: ArticleController.get,
  },
  {
    url: '/',
    method: 'get',
    middlewares: null,
    controller: ArticleController.getAll,
  },
  {
    url: '/user/:id',
    method: 'get',
    middlewares: null,
    controller: ArticleController.getAllUsers,
  },
  {
    url: '/edit',
    method: 'post',
    middlewares: [authMid],
    controller: ArticleController.edit,
  },
  {
    url: '/delete',
    method: 'post',
    middlewares: [authMid],
    controller: ArticleController.delete,
  },
  {
    url: '/make',
    method: 'post',
    middlewares: [authMid],
    controller: ArticleController.make,
  },
  {
    url: '/star',
    method: 'post',
    middlewares: [authMid],
    controller: ArticleController.star,
  },
];

const routeConfig: RouteConfig = {
  routes,
  prefix: 'article',
};

export default routeConfig;
