import nodeMailer, { createTransport, Transporter, TransportOptions } from "nodemailer";

export class MailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    } as TransportOptions);
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на" + process.env.API_URL,
      text: "",
      html: `
      <div>
        <h1>Для активации перейлите по ссылке</h1>
        <a href="${link}">${link}</a>
      </div>
      `,
    });
  }
}
