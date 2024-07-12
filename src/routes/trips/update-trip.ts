import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import { prisma } from "../../lib/prisma";
import { TripUpdateService } from "../../services/trips/update-trip.service";



export const updateTrip = async (app: FastifyInstance) => {

    const serviceTrip = TripUpdateService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
            })
        }
    }, async (request, response) => {
        const { tripId } = request.params;
        const { destination, starts_at, ends_at } = request.body;

        if (dayjs(starts_at).isAfter(ends_at)) {
            response.code(400).send({ error: "Invalid strip start date.", code: 400 });
            return;
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            response.code(400).send({ error: "Invalid strip end date.", code: 400 });
            return;
        }

        const tripToUpdate = {
            tripId,
            destination,
            starts_at,
            ends_at,
        };
        const result = await serviceTrip.updateTripService(tripToUpdate);

        response.code(201).send(result);

    })


}