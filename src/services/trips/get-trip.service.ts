import { PrismaClient } from "@prisma/client";
import { ClientError } from "../../handlers/errors/client-erro";


export type GetTripOutput = {
    trip: {
        id: string,
        destination: string,
        starts_at: Date,
        ends_at: Date,
        is_confirmed: boolean
    }
}


export class TripGetByIdService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new TripGetByIdService(repository);
    }



    public async getTripService(tripId: string): Promise<GetTripOutput> {

        const trip = await this.repository.trip.findUnique({
            select: {
                id: true,
                destination: true,
                starts_at: true,
                ends_at: true,
                is_confirmed: true
            },
            where: { id: tripId }
        });

        if (!trip) throw new ClientError('Trip not found');

        const output: GetTripOutput = {
            trip: {
                id: trip.id,
                destination: trip.destination,
                starts_at: trip.starts_at,
                ends_at: trip.ends_at,
                is_confirmed: trip.is_confirmed
            }

        }

        return output;
    }

}

