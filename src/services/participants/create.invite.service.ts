import { PrismaClient } from "@prisma/client";
import { createEmailConfirm, Participants } from "../../handlers/confirm.email.handlers";
import { dayjs } from "../../lib/days";
import { env } from "../../../env";


export type CreateInviteInput = {
    tripId: string
    email: string,

}

export type CreateInviteOutput = {
    id: string
}

export class CreateInviteService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new CreateInviteService(repository);
    }
    public async create({ tripId, email }: CreateInviteInput): Promise<CreateInviteOutput> {

        const trip = await this.repository.trip.findUnique({ where: { id: tripId } });

        if (!trip) throw new Error('Trip not found.');

        const participant = await this.repository.participant.create({
            data: {
                email,
                trip_id: tripId

            }
        })

        const output: CreateInviteOutput = {
            id: participant.id
        }

        const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`

        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(trip.ends_at).format('LL')


        const html = ` <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                                <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                                <p></p>
                                <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                                <p></p>
                                <p>
                                    <a href="${confirmationLink}">Confirmar viagem</a>
                                </p>
                                <p></p>
                                <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                                 </div>`

        const subject = `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`

        const participants: Participants = {
            owner_email: participant.email,
            html,
            subject
        }

        await createEmailConfirm(participants);


        return output;

    }


}

