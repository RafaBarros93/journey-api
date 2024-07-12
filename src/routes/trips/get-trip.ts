import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { TripGetByIdService } from "../../services/trips/get-trip.service";



export const getTrip = async (app: FastifyInstance) => {

    const serviceTrip = TripGetByIdService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),

        }
    }, async (request, response) => {
        const { tripId } = request.params;

        const result = await serviceTrip.getTripService(tripId);

        response.code(200).send(result);

    })


}