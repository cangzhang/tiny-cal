const childProcess = require('child_process')

module.exports = function getSha() {
  return childProcess
    .execSync('git rev-parse --short HEAD')
    .toString()
};
