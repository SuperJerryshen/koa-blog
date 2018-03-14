import UsersControllers from '../controllers/users';
import authenticate from '../middlewares/authenticate';
import { Route, RouteConfig } from '../utils/routesLoader';

// 用户用户验证的中间件
const authMid = authenticate();

const routes: Array<Route> = [
  {
    url: '/',
    method: 'post',
    middlewares: [authMid],
    controller: UsersControllers.getMyInfo,
  },
  {
    url: '/edit',
    method: 'post',
    middlewares: [authMid],
    controller: UsersControllers.editInfo,
  },
  {
    url: '/auth',
    method: 'post',
    middlewares: [authMid],
    controller: UsersControllers.auth,
  },
  {
    url: '/login',
    method: 'post',
    middlewares: null,
    controller: UsersControllers.login,
  },
  {
    url: '/signup',
    method: 'post',
    middlewares: null,
    controller: UsersControllers.signup,
  },
  {
    url: '/:id',
    method: 'get',
    middlewares: null,
    controller: UsersControllers.getInfo,
  },
  {
    url: '/test',
    method: 'post',
    middlewares: null,
    controller: UsersControllers.test,
  },
];

const routeConfig: RouteConfig = {
  routes,
  prefix: 'user',
};
export default routeConfig;
