const User = require('../User');
const expect = require('chai').expect;

describe('6-module-1-task', () => {
  describe('модель пользователя', () => {
    it('у модели есть поля email и displayName', () => {
      const fields = User.schema.obj;

      expect(fields, 'у модели есть поле email').to.have.property('email');
      expect(fields, 'у модели есть поле displayName').to.have.property('displayName');
    });

    it('модель должна называться User, а коллекция - users', () => {
      expect(User.modelName, 'имя модели - User').to.equal('User');
      expect(User.collection.collectionName, 'название коллекции - users').to.equal('users');
    });

    it('поле email имеет правильную конфигурацию', () => {
      const email = User.schema.obj.email;

      expect(email.type, 'email - строковое поле').to.eql(String);
      expect(email.required, 'email - обязательное поле').to.be.true;
      expect(email.unique, 'email - уникальное поле').to.be.true;
      expect(email.validate, 'у поля email объявлены валидаторы').to.be.an('array');
      expect(email.lowercase, 'значение email приводится к нижнему регистру').to.be.true;
      expect(email.trim, 'у значения email обрезаются лишние пробелы').to.be.true;

      expect(
        email.validate[0].validator('mail@mail.com'),
        'валидный email проходит проверку'
      ).to.be.true;
      expect(
        email.validate[0].validator('wrongmail'),
        'невалидный email не проходит проверку'
      ).to.be.false;
    });

    it('поле displayName имеет правильную конфигурацию', () => {
      const displayName = User.schema.obj.displayName;

      expect(displayName.type, 'displayName - строковое поле').to.eql(String);
      expect(displayName.required, 'displayName - обязательное поле').to.be.true;
      expect(displayName.trim, 'у значения displayName обрезаются лишние пробелы').to.be.true;
    });
  });
});
