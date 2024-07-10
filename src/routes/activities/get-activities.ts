import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { GetActivityService } from "../../services/activities/get-activity.service";




export const getActivities = async (app: FastifyInstance) => {

    const activity = GetActivityService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),
        }
    }, async (request, response) => {
        const { tripId } = request.params;


        const result = await activity.getById({ tripId });

        response.code(200).send(result);

    })


}