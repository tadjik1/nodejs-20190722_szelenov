const server = require('../server');
const request = require('request');
const expect = require('chai').expect;
const fse = require('fs-extra');
const path = require('path');
const http = require('http');

const filesFolder = path.resolve(__dirname, '../files');
const fixturesFolder = path.resolve(__dirname, './fixtures');

describe('4-module-2-task', () => {
  describe('тесты на файловый сервер', () => {
    before((done) => {
      fse.emptyDirSync(filesFolder);
      server.listen(3001, () => done());
    });
    after((done) => {
      fse.emptyDirSync(filesFolder);
      fse.writeFileSync(path.join(filesFolder, '.gitkeep'), '');
      server.close(done);
    });

    beforeEach(() => {
      fse.emptyDirSync(filesFolder);
    });

    describe('POST', () => {
      it('возвращается ошибка 409 при создании файла, который есть', (done) => {
        fse.copyFileSync(
            path.join(fixturesFolder, 'small.png'),
            path.join(filesFolder, 'small.png'),
        );

        const mtime = fse.statSync(path.join(filesFolder, 'small.png')).mtime;
        const req = request.post(
            'http://localhost:3001/small.png',
            (error, response, body) => {
              if (error) return done(error);

              const newMtime = fse.statSync(path.join(filesFolder, 'small.png')).mtime;

              expect(mtime, 'файл не должен перезаписываться').to.eql(newMtime);
              expect(response.statusCode, 'статус код ответа 409').to.equal(409);
              done();
            }
        );

        fse.createReadStream(path.join(fixturesFolder, 'small.png')).pipe(req);
      });

      it('если тело запроса пустое файл не перезаписывается', (done) => {
        fse.copyFileSync(
            path.join(fixturesFolder, 'small.png'),
            path.join(filesFolder, 'small.png'),
        );

        const mtime = fse.statSync(path.join(filesFolder, 'small.png')).mtime;

        const req = request.post('http://localhost:3001/small.png', (error, response, body) => {
          if (error) return done(error);

          const newMtime = fse.statSync(path.join(filesFolder, 'small.png')).mtime;

          expect(mtime, 'файл не должен перезаписываться').to.eql(newMtime);
          expect(response.statusCode, 'статус код ответа сервера 409').to.equal(409);
          done();
        });

        req.end();
      });

      it('при попытке создания слишком большого файла - ошибка 413', (done) => {
        const req = request(
            {uri: 'http://localhost:3001/big.png', method: 'POST'},
            (error, response, body) => {
              if (error) return done(error);

              expect(
                response.statusCode,
                'статус код ответа сервера 413'
              ).to.equal(413);
  
              setTimeout(() => {
                expect(
                  fse.existsSync(path.join(filesFolder, 'big.png')),
                  'файл big.png не должен оставаться на диске'
                ).to.be.false;
                done();
              }, 100);
            });

        req.on('error', (err) => {
          // EPIPE error should occur because we try to pipe after res closed
          if (err.code !== 'EPIPE') done(err);
        });

        fse.createReadStream(path.join(fixturesFolder, 'big.png'))
            .pipe(req);
      });

      it('успешное создание файла', (done) => {
        const req = request.post('http://localhost:3001/small.png', (error, response, body) => {
          if (error) return done(error);

          expect(
            response.statusCode,
            'статус код ответа сервера 201'
          ).to.equal(201);

          expect(
            fse.existsSync(path.join(filesFolder, 'small.png')),
            'файл small.png должен быть на диске'
          ).to.be.true;
          done();
        });

        fse.createReadStream(path.join(fixturesFolder, 'small.png'),)
            .pipe(req);
      });

      it('файл не должен оставаться на диске при обрыве соединения', (done) => {
        const req = http.request('http://localhost:3001/example.txt', {
          method: 'POST',
        });

        req.on('error', (err) => {
          if (err.code !== 'ECONNRESET') return done(err);

          setTimeout(() => {
            expect(
              fse.existsSync(path.join(filesFolder, 'example.txt')),
              'файл example.txt не должен оставаться на диске'
            ).to.be.false;

            done();
          }, 100);
        });

        req.on('response', (res) => {
          expect.fail('there should be no response');
        });

        req.write('content');

        setTimeout(() => {
          req.abort();
        }, 300);
      });
    });
  });
});
