import nodemailer from "nodemailer";
import type { Watch } from "@prisma/client";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fmtDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export interface AlertEmailPayload {
  watch: Watch;
  currentFareINR: number;
  lowestFareSeen: number;
  triggerReason: string;
}

export async function sendAlertEmail(payload: AlertEmailPayload): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[mailer] SMTP not configured — set SMTP_HOST/PORT/USER/PASS in .env to enable email alerts");
    return;
  }

  const { watch, currentFareINR, lowestFareSeen, triggerReason } = payload;
  const travelDateFmt = fmtDate(watch.travelDate);
  const subject = `Flight Price Alert: ${watch.origin} → ${watch.destination} — ${inr(currentFareINR)} (Travel: ${travelDateFmt})`;

  const thresholdRow = watch.thresholdPrice
    ? `<tr><td style="padding:8px 0;color:#9ca3af">Threshold</td><td style="padding:8px 0;font-weight:600">${inr(watch.thresholdPrice)}</td></tr>`
    : "";

  const html = `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f172a;color:#e5e7eb;padding:28px;border-radius:12px">
  <h2 style="color:#60a5fa;margin:0 0 4px">✈ Flight Price Alert</h2>
  <p style="font-size:22px;font-weight:700;margin:0 0 20px">${watch.origin} → ${watch.destination}</p>
  <table style="width:100%;border-collapse:collapse;font-size:15px">
    <tr><td style="padding:8px 0;color:#9ca3af">Travel Date</td><td style="padding:8px 0;font-weight:600">${travelDateFmt}</td></tr>
    <tr><td style="padding:8px 0;color:#9ca3af">Current Fare</td><td style="padding:8px 0;font-weight:700;color:#34d399;font-size:18px">${inr(currentFareINR)}</td></tr>
    ${thresholdRow}
    <tr><td style="padding:8px 0;color:#9ca3af">Lowest Fare Seen</td><td style="padding:8px 0;font-weight:600;color:#34d399">${inr(lowestFareSeen)}</td></tr>
    <tr><td style="padding:8px 0;color:#9ca3af">Highest Fare Seen</td><td style="padding:8px 0;color:#f87171">${watch.highestFareSeen ? inr(watch.highestFareSeen) : "—"}</td></tr>
  </table>
  <div style="margin-top:20px;padding:14px 16px;background:#1e3a5f;border-radius:8px;border-left:4px solid #3b82f6">
    <p style="margin:0;color:#93c5fd;font-weight:600">Alert Triggered</p>
    <p style="margin:6px 0 0;font-size:14px">${triggerReason}</p>
  </div>
  <div style="margin-top:16px;padding:14px 16px;background:#064e3b;border-radius:8px;border-left:4px solid #10b981">
    <p style="margin:0;color:#6ee7b7;font-weight:600">Recommendation</p>
    <p style="margin:6px 0 0;font-size:14px">Current fare meets your alert criteria. Consider booking now.</p>
  </div>
  <p style="margin-top:24px;font-size:12px;color:#4b5563">Monitored by Flight Price Indicator · Monitoring started ${fmtDate(watch.monitoringStartDate)}</p>
</div>`;

  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
    to: watch.email,
    subject,
    html,
  });

  console.log(`[mailer] Alert email sent to ${watch.email} for watch ${watch.id}`);
}

// Phase 2 stub — WhatsApp via Twilio / Meta Cloud API / WhatsApp Business API
export async function sendWhatsAppAlert(phone: string, message: string): Promise<void> {
  console.log(`[whatsapp] Phase 2 (not yet implemented) — would send to ${phone}: ${message}`);
}
