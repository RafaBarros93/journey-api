import cors from '@fastify/cors';
import app from './routes/routes';
import { env } from '../env';


const start = async () => {
    try {
        app.register(cors, {
            origin: "*"
        })

        await app.listen({ port: 8000 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()

