const path = require('path');
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, '../config');

const request = require('request-promise').defaults({
  resolveWithFullResponse: true,
  simple: false,
  json: true,
});

const expect = require('chai').expect;
const connection = require('../libs/connection');

const User = require('../models/User');
const app = require('../app');

function getURL(path) {
  return `http://localhost:3000${path}`;
}

describe('6-module-2-task', () => {
  describe('User REST API', async function() {
    const existingUserData = {
      email: 'john@test.ru',
      displayName: 'John',
    };
    const newUserData = {
      email: 'alice@test.ru',
      displayName: 'Alice',
    };
    let existingUser;
    let server;

    before((done) => {
      server = app.listen(3000, done);
    });

    after(async () => {
      await User.deleteMany({});
      connection.disconnect();
      server.close();
    });

    beforeEach(async function() {
      // load fixtures
      await User.deleteMany({});
      existingUser = await User.create(existingUserData);
    });

    describe('POST /users', function() {
      it('creates a user', async function() {
        const response = await request({
          method: 'post',
          uri: getURL('/users'),
          body: newUserData,
        });
        const user = await User.findById(response.body._id);

        expect(response.body.displayName).to.equal(user.displayName);
        expect(response.body.email).to.equal(user.email);
      });

      it('возвращается ошибка если email уже занят', async function() {
        const response = await request({
          method: 'post',
          uri: getURL('/users'),
          body: existingUserData,
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.errors.email).to.equal('Такой email уже существует');
      });

      it('возвращается ошибка если email невалидный', async function() {
        const response = await request({
          method: 'post',
          uri: getURL('/users'),
          body: {
            email: 'invalid',
          },
        });
        expect(response.statusCode).to.equal(400);
        expect(response.body.errors.email).to.equal('Некорректный email');
      });
    });

    describe('PATCH /users/:id', () => {
      it('изменяет пользователя с заданным id', async () => {
        const response = await request({
          method: 'patch',
          uri: getURL(`/users/${existingUser.id}`),
          body: {
            email: 'newemail@mail.com',
            displayName: 'newName',
          },
        });

        const user = await User.findById(response.body._id);

        expect(response.body.displayName).to.equal(user.displayName);
        expect(response.body.email).to.equal(user.email);
      });

      it('служебные поля игнорируются', async () => {
        await request({
          method: 'patch',
          uri: getURL(`/users/${existingUser.id}`),
          body: {
            _id: '111',
            createdAt: new Date(),
          },
        });

        const user = await User.findById(existingUser.id);

        expect(user.id).to.equal(existingUser.id);
        expect(user.createdAt).to.deep.equal(existingUser.createdAt);
      });

      it('возвращается 400 если email невалидный', async () => {
        const response = await request({
          method: 'patch',
          uri: getURL(`/users/${existingUser.id}`),
          body: {
            email: 'invalid',
          },
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.errors.email).to.equal('Некорректный email');
      });

      it('возвращается 400 если email уже занят', async () => {
        const newUser = await User.create(newUserData);

        const response = await request({
          method: 'patch',
          uri: getURL(`/users/${existingUser.id}`),
          body: {
            email: newUser.email,
          },
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.errors.email).to.equal('Такой email уже существует');
      });
    });

    describe('GET /users/:userById', function() {
      it('возвращает пользователя по id', async function() {
        const response = await request.get(getURL('/users/' + existingUser._id));

        expect(response.body.email).to.equal(existingUser.email);
        expect(response.body._id).to.equal(existingUser.id);
        expect(response.statusCode).to.equal(200);
        expect(/application\/json/.test(response.headers['content-type'])).to.be.true;
      });

      it('возвращается статус 404 если пользователя нет', async function() {
        const response = await request.get(getURL('/users/55b693486e02c26010ef0000'));
        expect(response.statusCode).to.equal(404);
      });

      it('возвращается 400 если id невалидный', async function() {
        const response = await request.get(getURL('/users/kkkkk'));
        expect(response.statusCode).to.equal(400);
      });
    });

    describe('DELETE /users/:userById', function() {
      it('удаляет пользователя из базы', async function() {
        const response = await request.del(getURL('/users/' + existingUser._id));
        const user = await User.findById(existingUser._id);

        expect(response.statusCode).to.equal(200);
        expect(user).to.be.null;
      });

      it('возвращает статус 404 если пользователя нет при удалении', async function() {
        const response = await request.del(getURL('/users/55b693486e02c26010ef0000'));
        expect(response.statusCode).to.equal(404);
      });
    });

    it('возвращает всех пользователей из базы', async function() {
      const response = await request.get(getURL('/users'));

      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(1);
      expect(response.body[0]._id).to.equal(existingUser.id);
    });
  });
});
