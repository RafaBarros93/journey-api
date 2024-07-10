import { createEmailConfirm } from "../handlers/confirm.email.handlers";
import { prisma } from "../lib/prisma";

export type TripCreateInput = {
    destination: string,
    starts_at: Date,
    ends_at: Date,
    owner_name: string,
    owner_email: string,
    emails_to_invite: string[]
}

export type TripCreateOutput = {
    id: string
}

export class TripCreateService {

    public static build() {
        return new TripCreateService();
    }


    public async createTripService({ destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite }: TripCreateInput): Promise<TripCreateOutput> {

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participants: {
                    createMany: {

                        data: [
                            {
                                name: owner_name,
                                email: owner_email,
                                is_confirmed: true,
                                is_owner: true
                            },
                            ...emails_to_invite.map((email) => (
                                { email }
                            ))
                        ]

                    }
                }
            }
        });

        const participants = {
            destination,
            starts_at,
            ends_at,
            trip_id: trip.id,
            owner_name,
            owner_email,
        }

        await createEmailConfirm(participants);

        const output: TripCreateOutput = {
            id: trip.id
        }

        return output;
    }

}

