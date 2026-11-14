# Varchasv print agent

A browser cannot send the cutter or cash drawer commands that a receipt printer understands. This small program, run on the counter computer, receives them from the app and
passes them to the printer. The Flutter apps will send the same bytes straight to the printer and will not need it.

1. Install Node 18 or later.
2. In this folder run `node agent.mjs` (keep it running; add it to start-up on the counter computer).
3. In the app open Settings > Print > Thermal printer. Set Printing type to "Direct to printer", fill in the printer address, and use "Send a test print".

Printer address: `192.168.1.50:9100` (network printer), `usb:POS-80` (USB printer shared on Windows as POS-80: Control Panel > Devices and Printers > Printer properties > Sharing),
or `file:/dev/usb/lp0` (Linux).

If the app is on a public address, start the agent with `ALLOW_ORIGINS=https://your-app.example.com node agent.mjs`. Only text is printed (English letters and digits; the rupee sign is printed as Rs.).
