const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== '' ? process.env.DB_PASSWORD : null;
const dbName = process.env.DB_NAME || 'kanchkura_college';

let isDbConnected = false;

const ensureDatabaseExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbHost === 'localhost' ? '127.0.0.1' : dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword || '',
      connectTimeout: 5000,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();
  } catch (err) {
    // Non-fatal, let Sequelize handle authenticate
  }
};

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost === 'localhost' ? '127.0.0.1' : dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 10000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  }
);

const connectDB = async () => {
  try {
    // Automatically create database if not exists
    await ensureDatabaseExists();

    await sequelize.authenticate();
    isDbConnected = true;
    console.log('✅ MySQL Database connected successfully.');

    await sequelize.sync({ alter: false });
    console.log('✅ Database models synced.');
    return true;
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MySQL Database not connected (${error.message}). Running in Standalone UI Mode.`);
    return false;
  }
};

module.exports = { sequelize, connectDB, ensureDatabaseExists, isDbConnected, Sequelize };
