import { PrismaClient } from "@prisma/client";
import { dayjs } from "../../lib/days";

export type CreateActivityInput = {
    tripId: string
    title: string,
    occurs_at: Date
}


export type CreateActivityOutput = {
    id: string
}

export class CreateActivityService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new CreateActivityService(repository);
    }
    public async create({ title, tripId, occurs_at }: CreateActivityInput): Promise<CreateActivityOutput> {

        const trip = await this.repository.trip.findUnique({ where: { id: tripId } });

        if (!trip) throw new Error('Trip not found.');

        if (dayjs(occurs_at).isBefore(trip.starts_at)) throw new Error('Invalid activity date.');

        if (dayjs(occurs_at).isAfter(trip.ends_at)) throw new Error('Invalid activity date.');

        const newActivity = await this.repository.activity.create({
            data: {
                title,
                occurs_at,
                trip_id: tripId
            }
        })

        const output: CreateActivityOutput = {
            id: newActivity.id
        }

        return output;

    }


}

