
import { getEmailClient } from "../lib/mail";
import nodemailer from 'nodemailer';

export type Participants = {
  owner_name?: string,
  owner_email: string
  html: string,
  subject: string
}


export const createEmailConfirm = async (participants: Participants) => {


  const mail = await getEmailClient();

  const message = await mail.sendMail({
    from: {
      name: 'Equipe plann.er',
      address: 'oi@plann.er',
    },
    to: {
      name: participants.owner_name || '',
      address: participants.owner_email,
    },
    subject: participants.subject,
    html: participants.html.trim(),
  })

  console.log(nodemailer.getTestMessageUrl(message))

}