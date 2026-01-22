import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Append connection pool settings for Supabase
    const url = process.env.DATABASE_URL;
    const connectionUrl = url?.includes('?')
        ? `${url}&pgbouncer=true&connection_limit=10&pool_timeout=20`
        : `${url}?pgbouncer=true&connection_limit=10&pool_timeout=20`;

    return new PrismaClient({
        datasources: {
            db: {
                url: connectionUrl
            }
        },
        log: process.env.NODE_ENV !== 'production' ? ['warn', 'error'] : ['error'],
    })
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
