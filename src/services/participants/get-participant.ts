import { PrismaClient } from "@prisma/client";
import { ClientError } from "../../handlers/errors/client-erro";


export class GetParticipantService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new GetParticipantService(repository);
    }
    public async getParticipant(participantId: string) {

        const participant = await this.repository.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true
            },
            where: { id: participantId }
        });

        if (!participant) throw new ClientError('Participat not found');


        return { participant };

    }


}

