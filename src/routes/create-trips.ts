import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { date, z } from "zod";
import { prisma } from "../lib/prisma";

export const createTrip = async (app: FastifyInstance) => {

    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema:
        {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date()
            })
        }
    }, async (request, response) => {

        const { destination, starts_at, ends_at } = request.body;

        const newTrip = {
            data: {
                destination,
                starts_at,
                ends_at
            }
        }

        const trip = await prisma.trip.create(newTrip);

        response.code(201).send({ id: trip.id });

    })


}