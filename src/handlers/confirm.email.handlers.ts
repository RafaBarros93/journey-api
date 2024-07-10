
import { getEmailClient } from "../lib/mail";
import nodemailer from 'nodemailer';
import { env } from "../../env";
import { dayjs } from "../lib/days";

export type Participants = {
  starts_at: Date,
  ends_at: Date,
  trip_id: string,
  owner_name: string,
  owner_email: string
  destination: string
}


export const createEmailConfirm = async (participants: Participants) => {

  const formattedStartDate = dayjs(participants.starts_at).format('LL')
  const formattedEndDate = dayjs(participants.ends_at).format('LL')

  const confirmationLink = `${env.API_BASE_URL}/trips/${participants.trip_id}/confirm`


  const mail = await getEmailClient();

  const message = await mail.sendMail({
    from: {
      name: 'Equipe plann.er',
      address: 'oi@plann.er',
    },
    to: {
      name: participants.owner_name,
      address: participants.owner_email,
    },
    subject: `Confirme sua viagem para ${participants.destination} em ${formattedStartDate}`,
    html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${participants.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim(),
  })

  console.log(nodemailer.getTestMessageUrl(message))

}