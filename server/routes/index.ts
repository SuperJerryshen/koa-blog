import Koa from 'koa';
import routesLoader from '../utils/routesLoader';

import userRouteConfig from './users';
import articleRouteConfig from './articles';

export default (app: Koa) => {
  routesLoader(userRouteConfig, app);
  routesLoader(articleRouteConfig, app);
};
