import Koa from 'koa';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import routing from './routes';
import errorHandler from './middlewares/errorHandle';
import originController from './middlewares/originController';
import analyzeUser from './middlewares/analyzeUser';
import { port, bdUrl } from './config';

mongoose.connect(bdUrl);
mongoose.connection.on('error', console.error);

const app = new Koa();

app
  .use(logger())
  .use(originController())
  .use(errorHandler())
  .use(bodyParser())
  .use(helmet())
  .use(analyzeUser());

routing(app);

app.listen(port, () => {
  console.log(`✅  The server is running at http://localhost:${port}/`);
});

export default app;
