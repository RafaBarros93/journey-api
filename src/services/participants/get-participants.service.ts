import { PrismaClient } from "@prisma/client";


export class GetParticipantsService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new GetParticipantsService(repository);
    }
    public async getParticipants(tripId: string) {

        const participants = await this.repository.participant.findMany({ where: { trip_id: tripId } });


        return { participants };

    }


}

