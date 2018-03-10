import UsersControllers from '../controllers/users';
import authenticate from '../middlewares/authenticate';
import { Route, RouteConfig } from '../utils/routesLoader';

// 用户用户验证的中间件
const authMid = authenticate();

const routes: Array<Route> = [
  {
    url: '/',
    method: 'get',
    middlewares: [authMid],
    controller: UsersControllers.getInfo,
  },
  {
    url: '/edit',
    method: 'post',
    middlewares: [authMid],
    controller: UsersControllers.editInfo,
  },
  {
    url: '/token',
    method: 'post',
    middlewares: null,
    controller: UsersControllers.accesstoken,
  },
  {
    url: '/signup',
    method: 'post',
    middlewares: null,
    controller: UsersControllers.signup,
  },
];

const routeConfig: RouteConfig = {
  routes,
  prefix: 'user',
};
export default routeConfig;
