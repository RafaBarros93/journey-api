import Fastify from 'fastify';
import { createTrip } from './trip/create-trip';

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './trip/confirm-trip';
import { confirmPartipant } from './participants/confirm-participant';

const app = Fastify({
    logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createTrip);
app.register(confirmTrip);
app.register(confirmPartipant);

export default app;