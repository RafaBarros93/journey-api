import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/prisma";
import { TripConfirmEmailService } from "../../services/trip/confirm-email.service";



export const confirmTrip = async (app: FastifyInstance) => {

    const serviceTrip = TripConfirmEmailService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            })
        }
    }, async (request, reply) => {

        const { tripId } = request.params;

        const result = await serviceTrip.confirmEmailService(tripId, reply)


        reply.code(201).send(result);

    })


}