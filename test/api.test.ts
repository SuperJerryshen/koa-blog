import supertest from 'supertest';
import { should } from 'chai';
import app from '../server/';

const temp = {};
const request = supertest.agent(app.listen());
should();

describe('POST api/users/token', () => {
  it('得到token值', done => {
    request
      .post('/api/users/token')
      .set('Accept', 'application/json')
      .send({
        email: '327538014@qq.com',
        password: '123456',
      })
      .expect(200, (err, res) => {
        temp.token = res.body.token;
        done();
      });
  });
});
