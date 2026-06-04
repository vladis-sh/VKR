import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Thin wrapper around nodemailer.
 *
 * If SMTP_HOST is configured, a real SMTP transport is used. Otherwise the
 * service lazily creates an Ethereal test account: emails are not delivered,
 * but every send logs a one-click preview URL — ideal for local dev / demos.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporterPromise: Promise<nodemailer.Transporter> | null = null;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.from =
      this.configService.get<string>('mail.from') ||
      'InterviewPrep <no-reply@interviewprep.local>';
  }

  private getTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporterPromise) {
      this.transporterPromise = this.createTransporter();
    }
    return this.transporterPromise;
  }

  private async createTransporter(): Promise<nodemailer.Transporter> {
    const host = this.configService.get<string>('mail.host');

    if (host) {
      this.logger.log(`Mail transport: SMTP ${host}`);
      return nodemailer.createTransport({
        host,
        port: this.configService.get<number>('mail.port'),
        secure: this.configService.get<boolean>('mail.secure'),
        auth: {
          user: this.configService.get<string>('mail.user'),
          pass: this.configService.get<string>('mail.pass'),
        },
        connectionTimeout: 7000,
        greetingTimeout: 7000,
        socketTimeout: 10000,
      });
    }

    // No SMTP configured — fall back to an Ethereal test account.
    const testAccount = await nodemailer.createTestAccount();
    this.logger.warn(
      `No SMTP_HOST configured — using Ethereal test inbox (login: ${testAccount.user}). ` +
        'Emails are NOT delivered; open the preview URL printed on each send.',
    );
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 10000,
    });
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<void> {
    const transporter = await this.getTransporter();
    const info = await transporter.sendMail({ from: this.from, to, subject, html, text });

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      this.logger.log(`Email "${subject}" → ${to}. Preview: ${preview}`);
    } else {
      this.logger.log(`Email "${subject}" → ${to} (id: ${info.messageId})`);
    }
  }

  async sendEmailVerification(to: string, link: string): Promise<void> {
    const html = this.layout(
      'Подтверждение email',
      'Спасибо за регистрацию в InterviewPrep! Подтвердите свой адрес, нажав на кнопку ниже.',
      'Подтвердить email',
      link,
      'Ссылка действительна 24 часа. Если вы не регистрировались — просто проигнорируйте это письмо.',
    );
    const text = `Подтвердите ваш email, перейдя по ссылке:\n${link}\n\nСсылка действительна 24 часа.`;
    await this.send(to, 'Подтвердите ваш email', html, text);
  }

  async sendPasswordReset(to: string, link: string): Promise<void> {
    const html = this.layout(
      'Сброс пароля',
      'Вы запросили сброс пароля. Нажмите на кнопку ниже, чтобы задать новый пароль.',
      'Сбросить пароль',
      link,
      'Ссылка действительна 1 час. Если вы не запрашивали сброс — проигнорируйте письмо, пароль останется прежним.',
    );
    const text = `Сбросьте пароль по ссылке:\n${link}\n\nСсылка действительна 1 час.`;
    await this.send(to, 'Сброс пароля', html, text);
  }

  private layout(
    heading: string,
    body: string,
    button: string,
    link: string,
    note: string,
  ): string {
    return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
    <h2 style="margin: 0 0 12px; font-size: 20px;">${heading}</h2>
    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; color: #374151;">${body}</p>
    <p style="margin: 0 0 24px;">
      <a href="${link}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 600; font-size: 15px;">${button}</a>
    </p>
    <p style="margin: 0 0 16px; font-size: 13px; color: #6b7280;">
      Если кнопка не работает, скопируйте ссылку в браузер:<br />
      <a href="${link}" style="color: #4f46e5; word-break: break-all;">${link}</a>
    </p>
    <p style="margin: 0; font-size: 13px; color: #9ca3af;">${note}</p>
  </div>`;
  }
}
