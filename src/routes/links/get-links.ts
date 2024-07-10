import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { GetLinkService } from "../../services/links/get-links.service";



export const getLinks = async (app: FastifyInstance) => {

    const link = GetLinkService.build(prisma);

    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/links', {
        schema:
        {
            params: z.object({
                tripId: z.string().uuid()
            }),
        }
    }, async (request, response) => {
        const { tripId } = request.params;


        const result = await link.getById({ tripId });

        response.code(200).send(result);

    })


}