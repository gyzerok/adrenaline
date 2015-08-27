global.__CLIENT__ = false;
require('babel/register')({
  stage: 0,
});
require('./src/server');
