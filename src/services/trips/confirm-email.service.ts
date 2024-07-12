import { PrismaClient } from "@prisma/client";
import { createEmailConfirm, Participants } from "../../handlers/confirm.email.handlers";
import { FastifyReply } from "fastify/types/reply";
import { env } from "../../../env";
import { dayjs } from "../../lib/days";
import { ClientError } from "../../handlers/errors/client-erro";



export type TripConfirmOutput = {
    id: string
}

export class TripConfirmEmailService {

    private constructor(readonly repository: PrismaClient) { }

    public static build(repository: PrismaClient) {
        return new TripConfirmEmailService(repository);
    }
    public async confirmEmailService(tripId: string, reply: FastifyReply): Promise<boolean> {

        const trip = await this.repository.trip.findUnique({
            where: {
                id: tripId
            },
            include: {
                participants: {
                    where: {
                        is_owner: false
                    }
                }
            }
        })

        if (!trip) throw new ClientError('Trip not found');

        if (trip.is_confirmed) return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);

        await this.repository.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true }
        })

        await Promise.all(
            trip.participants.map(async (participant) => {
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
            })
        )


        return true;

    }


}

