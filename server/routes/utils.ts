import Utils from '../controllers/utils';

// @types
import { Route, RouteConfig } from '../utils/routesLoader';

const routes: Array<Route> = [
  {
    url: '/qiniu.token',
    method: 'get',
    middlewares: null,
    controller: Utils.qiniuToken,
  },
];

const routeConfig: RouteConfig = {
  routes,
  prefix: 'utils',
};
export default routeConfig;
