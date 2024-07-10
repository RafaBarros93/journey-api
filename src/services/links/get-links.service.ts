import { PrismaClient } from "@prisma/client";
import { dayjs } from "../../lib/days";

export type CreateActivityInput = {
    tripId: string
}

export class GetLinkService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new GetLinkService(repository);
    }
    public async getById({ tripId }: CreateActivityInput) {

        const trip = await this.repository.trip.findUnique(
            {
                where:
                    { id: tripId },
                include: {
                    links: true
                }
            }
        );

        if (!trip) throw new Error('Trip not found.');


        return { links: trip.links };
    }

}

