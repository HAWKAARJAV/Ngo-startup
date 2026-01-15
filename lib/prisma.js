import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Append statement_cache_size=0 to fix Supabase transaction pooler "prepared statement" errors
    const url = process.env.DATABASE_URL;
    const connectionUrl = url?.includes('?')
        ? `${url}&pgbouncer=true`
        : `${url}?pgbouncer=true`;

    return new PrismaClient({
        datasources: {
            db: {
                url: connectionUrl
            }
        }
    })
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
