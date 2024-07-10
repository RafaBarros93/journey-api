import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { CreateActivityService } from "../../services/activities/create-activity.service";




export const createActivity = async (app: FastifyInstance) => {

    const activity = CreateActivityService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),

            body: z.object({
                title: z.string().min(4),
                occurs_at: z.coerce.date(),
            })
        }
    }, async (request, response) => {
        const { title, occurs_at } = request.body;
        const { tripId } = request.params;


        const result = await activity.create({ tripId, title, occurs_at });

        response.code(201).send(result);

    })


}