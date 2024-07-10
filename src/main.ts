import Fastify from 'fastify';
import { createTrip } from './routes/create-trips';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export type TripInputDto = {
    destination: string,
    starts_at: Date,
    ends_at: Date
}



const app = Fastify({
    logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createTrip);

const main = async () => {


    try {
        await app.listen({ port: 8000 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

main()

