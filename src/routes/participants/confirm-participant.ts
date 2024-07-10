import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ParticipantsConfirmService } from "../../services/participants/confirm-participant";





export const confirmPartipant = async (app: FastifyInstance) => {

    const partcipant = ParticipantsConfirmService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirm', {
        schema:
        {
            params: z.object({
                participantId: z.string().uuid()
            })
        }
    }, async (request, reply) => {

        const { participantId } = request.params;

        const result = await partcipant.confirmParticipantService(participantId, reply)


        reply.code(201).send(result);

    })


}