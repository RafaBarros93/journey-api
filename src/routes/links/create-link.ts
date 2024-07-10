import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { CreateLinkService } from "../../services/links/create-link.service";




export const createLink = async (app: FastifyInstance) => {

    const link = CreateLinkService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/links', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),

            body: z.object({
                title: z.string().min(4),
                url: z.string().url(),
            })
        }
    }, async (request, response) => {
        const { title, url } = request.body;
        const { tripId } = request.params;


        const result = await link.create({ tripId, title, url });

        response.code(201).send(result);

    })


}