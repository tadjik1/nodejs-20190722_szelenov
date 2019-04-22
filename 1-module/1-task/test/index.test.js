const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');
const expect = require('chai').expect;

describe('1-module-1-task', () => {
  describe('Порядок вывода сообщений', () => {
    it('файл с решением должен быть в папке с задачей', () => {
      const isExists = fs.existsSync(path.join(__dirname, '../solution.txt'));
      expect(isExists).to.be.true;
    });

    it('порядок вывода совпадает', () => {
      const solution = fs.readFileSync(
          path.join(__dirname, '../solution.txt'),
          {
            encoding: 'utf-8',
          }
      );

      const output = execSync(`node ${path.join(__dirname, '../index.js')}`, {
        encoding: 'utf-8',
      });

      expect(solution.trim()).to.equal(output.trim());
    });
  });
});
