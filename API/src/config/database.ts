import { sequelize } from 'sequelize';
import { env } from './env.ts';
import { logger } from './logger.ts';
import { log } from 'console';

export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: {()}
}
)

export async function connectDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        logger.info('Conexión e MYSQL exitosa');
    } catch (error) {
        logger.error('Error al conectar a la base de datos:$ {error}');
    }
}