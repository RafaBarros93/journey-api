import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import { TripCreateService } from "../../services/trips/create-trip.service";
import { prisma } from "../../lib/prisma";



export const createTrip = async (app: FastifyInstance) => {

    const serviceTrip = TripCreateService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema:
        {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email()),
            })
        }
    }, async (request, response) => {

        const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body;

        if (dayjs(starts_at).isAfter(ends_at)) {
            response.code(400).send({ error: "Invalid strip start date.", code: 400 });
            return;
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            response.code(400).send({ error: "Invalid strip end date.", code: 400 });
            return;
        }

        const newTrip = {
            destination,
            starts_at,
            ends_at,
            owner_name,
            owner_email,
            emails_to_invite
        };
        const result = await serviceTrip.createTripService(newTrip);

        response.code(201).send(result);

    })


}