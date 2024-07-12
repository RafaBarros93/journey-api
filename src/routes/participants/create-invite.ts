import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { CreateInviteService } from "../../services/participants/create.invite.service";





export const createInvite = async (app: FastifyInstance) => {

    const link = CreateInviteService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invites', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),

            body: z.object({
                email: z.string().email()
            })
        }
    }, async (request, response) => {
        const { email } = request.body;
        const { tripId } = request.params;


        const result = await link.create({ tripId, email });

        response.code(201).send(result);

    })


}