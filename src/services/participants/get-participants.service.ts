import { PrismaClient } from "@prisma/client";
import { ClientError } from "../../handlers/errors/client-erro";


export class GetParticipantsService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new GetParticipantsService(repository);
    }
    public async getParticipants(tripId: string) {

        const trip = await this.repository.trip.findUnique({
            where: { id: tripId },
            include: {
                participants: true
            }
        });

        if (!trip) throw new ClientError('Trip not found');

        return { participants: trip.participants };

    }


}

