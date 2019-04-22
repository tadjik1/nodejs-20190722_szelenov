const LineSplitStream = require('../LineSplitStream');
const expect = require('chai').expect;
const sinon = require('sinon');
const os = require('os');

describe('2-module-2-task', () => {
  describe('LineSplitStream', () => {
    it('стрим разбивает данные по строкам', (done) => {
      const lines = new LineSplitStream({encoding: 'utf-8'});

      const onData = sinon.spy();

      lines.on('data', onData);
      lines.on('end', () => {
        expect(onData.calledTwice).to.be.true;
        expect(onData.firstCall.args[0]).to.equal('a');
        expect(onData.secondCall.args[0]).to.equal('b');

        done();
      });

      lines.write(`a${os.EOL}b`);
      lines.end();
    });

    it('стрим корректно передает данные даже если чанк не завершается переводом строки', (done) => {
      const lines = new LineSplitStream({encoding: 'utf-8'});

      const onData = sinon.spy();

      lines.on('data', onData);
      lines.on('end', () => {
        expect(onData.calledTwice).to.be.true;
        expect(onData.firstCall.args[0]).to.equal('ab');
        expect(onData.secondCall.args[0]).to.equal('c');

        done();
      });

      lines.write('a');
      lines.write(`b${os.EOL}c`);

      lines.end();
    });
  });
});
