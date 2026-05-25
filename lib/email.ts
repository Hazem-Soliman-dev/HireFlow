import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  try {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    });
  } catch (err) {
    console.error("Failed to initialize Nodemailer transport:", err);
    return null;
  }
}

export async function sendInterviewEmail(input: {
  candidateEmail: string;
  candidateName: string;
  interviewerEmail: string;
  interviewerName: string;
  jobTitle: string;
  scheduledAt: Date;
  meetingLink?: string | null;
  location?: string | null;
  durationMinutes: number;
}) {
  const from = process.env.SMTP_FROM || "HireFlow <no-reply@hireflow.demo>";
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const when = input.scheduledAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const locationLine = input.meetingLink
    ? `Meeting link: ${input.meetingLink}`
    : input.location
      ? `Location: ${input.location}`
      : "Location: To be confirmed";

  const text = `Interview scheduled for ${input.candidateName}.\nRole: ${input.jobTitle}\nWhen: ${when}\nDuration: ${input.durationMinutes} minutes\n${locationLine}\nInterviewer: ${input.interviewerName}\n`;

  const isConfigured = !!(host && port && user && pass && process.env.SMTP_FROM);

  if (!isConfigured) {
    console.log("\n=================== [SANDBOX MOCK EMAIL SENT] ===================");
    console.log(`From: ${from}`);
    console.log(`To: ${input.candidateEmail}, ${input.interviewerEmail}`);
    console.log(`Subject: Interview scheduled: ${input.jobTitle}`);
    console.log(`Body:\n${text}`);
    console.log("=================================================================\n");
    return;
  }

  const transport = getTransport();
  if (!transport) {
    console.warn("SMTP settings configured but transport initialization failed. Logging email to console:\n", text);
    return;
  }

  try {
    await transport.sendMail({
      from,
      to: [input.candidateEmail, input.interviewerEmail],
      subject: `Interview scheduled: ${input.jobTitle}`,
      text
    });
  } catch (err) {
    console.error("Nodemailer failed to dispatch real email. Logging body as fallback:\n", err);
    console.log("\n=================== [MOCK FALLBACK EMAIL BODY] ===================");
    console.log(text);
    console.log("==================================================================\n");
  }
}
