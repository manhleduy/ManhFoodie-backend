'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
const customizeConfig={
  host:process.env.BD_HOST,
  dialect: 'postgres',
  logging: false
  
}


sequelize= new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.BD_USERNAME,
  process.env.BD_PASSWORD,
  customizeConfig
);
/*if (config.use_env_variable) {
  sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  dialectModule: require('mysql2'),
});
} else {
  sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  dialectModule: require('mysql2'),
});
}*/

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
