import { PrismaClient } from "@prisma/client";
import { createEmailConfirm, Participants } from "../../handlers/confirm.email.handlers";
import { prisma } from "../../lib/prisma";
import { env } from "../../../env";
import { dayjs } from "../../lib/days";
import { ClientError } from "../../handlers/errors/client-erro";

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

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new TripCreateService(repository);
    }



    public async createTripService({ destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite }: TripCreateInput)
        : Promise<TripCreateOutput> {


        if (dayjs(starts_at).isAfter(ends_at)) throw new ClientError("Invalid strip start date.");

        if (dayjs(ends_at).isBefore(starts_at)) throw new ClientError("Invalid strip end date.");


        const trip = await this.repository.trip.create({
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

        const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;
        const formattedStartDate = dayjs(starts_at).format('LL')
        const formattedEndDate = dayjs(ends_at).format('LL')


        const html = `<div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>`

        const subject = `Confirme sua viagem para ${destination} em ${formattedStartDate}`


        const participants: Participants = {
            owner_name,
            owner_email,
            html,
            subject
        }

        await createEmailConfirm(participants);

        const output: TripCreateOutput = {
            id: trip.id
        }

        return output;
    }

}

