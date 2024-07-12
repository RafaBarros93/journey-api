import { PrismaClient } from "@prisma/client";
import { createEmailConfirm, Participants } from "../../handlers/confirm.email.handlers";
import { prisma } from "../../lib/prisma";
import { env } from "../../../env";
import { dayjs } from "../../lib/days";
import { ClientError } from "../../handlers/errors/client-erro";

export type UpdateTripInput = {
    tripId: string,
    destination: string,
    starts_at: Date,
    ends_at: Date,
}

export class TripUpdateService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new TripUpdateService(repository);
    }



    public async updateTripService({ tripId, destination, starts_at, ends_at }: UpdateTripInput)
        : Promise<boolean> {


        if (dayjs(starts_at).isAfter(ends_at)) throw new ClientError("Invalid strip start date.");

        if (dayjs(ends_at).isBefore(starts_at)) throw new ClientError("Invalid strip end date.");

        const trip = await this.repository.trip.findUnique({ where: { id: tripId } });

        if (!trip) throw new ClientError('Trip not found');


        await this.repository.trip.update({
            data: {
                destination,
                starts_at,
                ends_at,

            },
            where: {
                id: tripId
            }
        });


        return true;
    }

}

