import Fastify from 'fastify';
import { createTrip } from './trips/create-trip';

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './trips/confirm-trip';
import { confirmPartipant } from './participants/confirm-participant';
import { createActivity } from './activities/create-activity';
import { getActivities } from './activities/get-activities';
import { createLink } from './links/create-link';
import { getLinks } from './links/get-links';

const app = Fastify({
    logger: true
})

const routes = [createTrip, confirmTrip, confirmPartipant, createActivity, getActivities, createLink, getLinks];

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

routes.forEach(route => {
    app.register(route)
})


export default app;