module.exports = {
    DB: "node_sequelize_api_db",
    HOST: "localhost",
    USER: "root",
    PASSWORD:"",
    dialect: "mysql",
    pool: {
        max: 5, 
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
}