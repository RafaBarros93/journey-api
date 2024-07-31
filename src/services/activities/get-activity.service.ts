import { PrismaClient } from "@prisma/client";
import { dayjs } from "../../lib/days";
import { ClientError } from "../../handlers/errors/client-erro";

export type CreateActivityInput = {
    tripId: string
}

export class GetActivityService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new GetActivityService(repository);
    }
    public async getById({ tripId }: CreateActivityInput) {

        const trip = await this.repository.trip.findUnique(
            {
                where:
                    { id: tripId },
                include: {
                    activities: {
                        orderBy: {
                            occurs_at: 'asc'
                        }
                    },
                }
            }
        );

        if (!trip) throw new ClientError('Trip not found.');

        const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(trip.starts_at, 'days');

        const activities = Array.from({ length: differenceInDaysBetweenTripStartAndEnd + 1 }).map((_, index) => {
            const date = dayjs(trip.starts_at).add(index, 'days');

            return {
                date: date.toDate(),
                activities: trip.activities.filter((activity) => {
                    return dayjs(activity.occurs_at).isSame(date, 'day')
                })
            }

        });

        return { listActivities: activities };
    }

}

