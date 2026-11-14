import { env } from "./env.js";
import { createRuntime } from "./runtime.js";
import { sealAllTenants } from "./services/auditchain.js";
import { runDueBackups } from "./services/backups.js";
import { runDueScheduledChanges } from "./services/scheduledchanges.js";
import { runDueReports } from "./services/reportbuilder.js";
import { demoPush, demoSms } from "./integrations/channels.js";
import { messenger } from "./integrations/messaging.js";
import { runDueComms } from "./services/comms.js";
import { runDueReminders } from "./services/commreminders.js";
import { runDueConsigneeStatements } from "./services/consignment.js";

const { app, db, mailer, close } = await createRuntime();

// Scheduled reports: once a minute, send whatever is due (one pass at a time).
let busy = false;
const scheduler = setInterval(async () => {
  if (busy) return;
  busy = true;
  try {
    const sent = await runDueReports(db, mailer);
    if (sent) app.log.info({ sent }, "scheduled reports sent");
    const changed = await runDueScheduledChanges(db);
    if (changed) app.log.info({ changed }, "scheduled changes applied");
    const backed = await runDueBackups(db, mailer);
    if (backed) app.log.info({ backed }, "scheduled backups run");
    const texted = await runDueComms(db, { whatsapp: messenger, sms: demoSms, push: demoPush, email: mailer });
    if (texted) app.log.info({ texted }, "messages sent");
    // Reminders go out in the 10 o'clock hour (Indian time); each carries a key, so a run twice in the hour sends nothing twice.
    if (new Date(Date.now() + 330 * 60_000).getUTCHours() === 10) {
      const reminded = await runDueReminders(db);
      if (reminded) app.log.info({ reminded }, "reminders queued");
    }
    const stated = await runDueConsigneeStatements(db, mailer);
    if (stated) app.log.info({ stated }, "consignee statements sent");
    const sealed = await sealAllTenants(db);
    if (sealed) app.log.info({ sealed }, "audit entries sealed");
  } catch (err) {
    app.log.error(err, "scheduled reports failed");
  } finally {
    busy = false;
  }
}, 60_000);

const shutdown = async () => {
  clearInterval(scheduler);
  await app.close();
  await close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
