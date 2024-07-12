import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { GetParticipantService } from "../../services/participants/get-participant";




export const getParticipant = async (app: FastifyInstance) => {

    const partcipant = GetParticipantService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId', {
        schema:
        {
            params: z.object({
                participantId: z.string().uuid()
            }),
        }
    }, async (request, response) => {
        const { participantId } = request.params;


        const result = await partcipant.getParticipant(participantId);

        response.code(200).send(result);

    })


}