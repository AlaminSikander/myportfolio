import "server-only";
import nodemailer from "nodemailer";
import type { ContactInput } from "@/lib/validation";
import { person } from "@/data/site";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
};

export class MailerNotConfiguredError extends Error {
  constructor(missing: string[]) {
    super(`SMTP is not configured. Missing: ${missing.join(", ")}`);
    this.name = "MailerNotConfiguredError";
  }
}

function readConfig(): SmtpConfig {
  const env = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  };
  const missing = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) throw new MailerNotConfiguredError(missing);

  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) throw new MailerNotConfiguredError(["SMTP_PORT (invalid)"]);

  return {
    host: env.SMTP_HOST!,
    port,
    user: env.SMTP_USER!,
    pass: env.SMTP_PASS!,
    from: process.env.SMTP_FROM || env.SMTP_USER!,
    to: process.env.CONTACT_EMAIL || person.email,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripLineBreaks(value: string) {
  return value.replace(/[\r\n]+/g, " ");
}

export async function sendContactEmail(input: ContactInput) {
  const config = readConfig();

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const subject = stripLineBreaks(`[Portfolio] ${input.subject}`);
  const text = [`Name: ${input.name}`, `Email: ${input.email}`, `Subject: ${input.subject}`, "", input.message].join(
    "\n",
  );

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0b1230;line-height:1.6">
      <h2 style="margin:0 0 12px">New portfolio enquiry</h2>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin:0"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
      <div style="white-space:pre-wrap;border-left:3px solid #f05a24;padding-left:12px">${escapeHtml(input.message)}</div>
    </div>`;

  const info = await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: { name: stripLineBreaks(input.name), address: input.email },
    subject,
    text,
    html,
  });

  const accepted = Array.isArray(info.accepted) && info.accepted.length > 0;
  if (!accepted) {
    throw new Error("SMTP server did not accept the message.");
  }

  return { messageId: info.messageId };
}
