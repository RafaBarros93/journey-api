import { PrismaClient } from "@prisma/client";


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


        return { participant };

    }


}

