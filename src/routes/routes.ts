import Fastify from 'fastify';
import { createTrip } from './trips/create-trip';

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './trips/confirm-trip';
import { confirmParticipant } from './participants/confirm-participant';
import { createActivity } from './activities/create-activity';
import { getActivities } from './activities/get-activities';
import { createLink } from './links/create-link';
import { getLinks } from './links/get-links';
import { getParticipants } from './participants/get-participants';
import { createInvite } from './participants/create-invite';
import { updateTrip } from './trips/update-trip';
import { getTrip } from './trips/get-trip';
import { getParticipant } from './participants/get-participant';
import { errorHandler } from '../handlers/errors/error.handlers';

const app = Fastify({
    logger: true
})

const routes = [
    createTrip,
    confirmTrip,
    updateTrip,
    getTrip,
    confirmParticipant,
    createActivity,
    getActivities,
    createLink,
    getLinks,
    getParticipants,
    getParticipant,
    createInvite
];

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

routes.forEach(route => {
    app.register(route)
})


export default app;