import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { GetParticipantsService } from "../../services/participants/get-participants.service";




export const getParticipants = async (app: FastifyInstance) => {

    const partcipant = GetParticipantsService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/participants', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),
        }
    }, async (request, response) => {
        const { tripId } = request.params;


        const result = await partcipant.getParticipants(tripId);

        response.code(200).send(result);

    })


}