module.exports = {
  development: {
    database: "db_h3o_HTAP",
    username: "postgres",
    password: "A3jkHtyUyh!78k",
    host: "htap-dev-11092022.cw14djtrv8xq.us-east-1.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
    protocol: "postgres",
    // If you want to keep the information in the database
    "seederStorage": "sequelize",
    // Use a different table name. Default: SequelizeData
    "seederStorageTableName": "SequelizeData"
  },
  production: {
    dialect: process.env.DB_DIALECT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.MYSQL_DOCKER_PORT,
  },
  licence:{
    licenseName: "Trial Edition", 
    licensePeriod:2,    
    noOfInformationSystem: 2,
    noOfTargets:40
  }
};
