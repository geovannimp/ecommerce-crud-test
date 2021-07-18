import { prepareConnection } from "../../lib/database"
import * as nodemailer from 'nodemailer';
import { EmailQueue } from "../../entities/EmailQueue"
import SMTPTransport from "nodemailer/lib/smtp-transport";

const Email = require('email-templates');
const email = new Email();

export enum EmailTypes {
  AccountConfirmation = 'account-confirmation'
}

class MailServiceImpl {

  private readonly EMAIL_TRANSPORTER: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

  constructor() {
    this.EMAIL_TRANSPORTER = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });
  }

  async addEmailToQueue(emailType: EmailTypes, to: string, data: Record<string, string>)  {
    await prepareConnection()
    const emailContent = await this.getEmailContent(emailType, data)
    const newEmail = new EmailQueue()
    newEmail.to = to
    newEmail.body = emailContent
    return await newEmail.save()
  }

  private async getEmailContent(emailType: EmailTypes, data: Record<string, string>): Promise<string> {
    return email.render(`templates/${emailType}`, data)
  }

  async sendQueuedEmail(email: EmailQueue): Promise<EmailQueue> {
    return new Promise((resolve, reject) => {
      this.EMAIL_TRANSPORTER.sendMail({
        to: email.to,
        html: email.body,
      }, (err, success) => {
        if (err) {
          reject(err)
        } else {
          email.isSent = true
          email.save().then((savedEmail) => {
            resolve(savedEmail)
          })
        }
      })

    })
  }
}

export const MailService = new MailServiceImpl()
