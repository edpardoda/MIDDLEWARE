import { z } from 'zod';
import dotenv from 'dotenv';
import { parse } from 'path';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000').transform(val => parseInt(val, 10)),
    CORS: z.string().default('*'), // Estamos en desarrollo
    //BASE DE DATOS
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().default('3306'),
    DB_NAME: z.string().default('productos_db'),
    DB_USER: z.string().default('root'),
    DB_PASSWORD: z.string().default('root'),
})

export const env = envSchema.parse(process.env);