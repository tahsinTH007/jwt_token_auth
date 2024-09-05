const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require("../DbConfig/dbConfig")

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        logging: true,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max, 
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
);

sequelize.authenticate()
               .then(() => console.log("connected"))
               .catch(err => console.log(err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);

db.sequelize.sync({force:false})
                .then(() => console.log("re-synce"))
                .catch(err => console.log(err));

module.exports = db;