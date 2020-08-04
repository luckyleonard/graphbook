import Sequelize from 'sequelize';
if (process.env.NODE_ENV === 'development') {
  require('babel-plugin-require-context-hook/register')();
}
//load 所有的models 返回一个db实例,操作可以使用sequelize init替换
export default (sequelize) => {
  let db = {};

  const context = require.context(
    '.',
    true,
    /^\.\/(?!index\.js).*\.js$/,
    'sync'
  );

  context
    .keys()
    .map(context)
    .forEach((module) => {
      const model = module(sequelize, Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  return db;
};
