import { PrismaClient } from "@prisma/client";
import { FastifyReply } from "fastify/types/reply";
import { env } from "../../../env";



export type TripConfirmOutput = {
    id: string
}

export class ParticipantsConfirmService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new ParticipantsConfirmService(repository);
    }
    public async confirmParticipantService(participantID: string, reply: FastifyReply): Promise<boolean> {

        const participant = await this.repository.participant.findUnique({ where: { id: participantID } });

        if (!participant) throw new Error('Participant not found;');

        if (participant.is_confirmed) reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);

        await this.repository.participant.update({
            where: { id: participant.id },
            data: { is_confirmed: true }
        })


        return true;

    }


}

