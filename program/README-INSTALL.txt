Open Source Barware - Chrome Program v1.5.1
==========================================
July 10, 2026 public release · Free · GPL-3.0-or-later

WHAT YOU DOWNLOADED
-------------------
A self-contained bar inventory program. It runs on YOUR computer in Chrome
at http://localhost:5052/ — no subscription, no cloud account required.

Voice walks, counts, spreadsheets, PAR levels, and weekly Process all work
without AI. Optional AI (in setup or Settings) is only for reading invoice
photos from your phone — you can always type numbers yourself.

NEW IN V1.5 (public drop)
-------------------------
• Spanish + English inventory notes — walks and counts understand Spanish
  station and level words (e.g. barra, pozo, fila, medio, tres cuartos)
  alongside English. Notes can be mixed EN/ES; full Spanish UI is next.
• Employee communications — managers upload or paste walks and inventory
  notes for the house (local-only staff board; works with PIN managers)
• Mobile count view — large taps, presets, optional weigh, camera barcode
• Smart orders → purchase orders (copy, email, CSV, receive workflow)
• POS import with review step — sales feed variance and reorder suggestions
• Recipe builder + menu costing
• Shift reports — plain-English weekly story + export
• Multi-venue + stock transfers
• Team PIN logins (optional — open until you create the first admin PIN)
• Coming soon panel (Settings) — full Spanish UI, restaurant package, 2.0
• Bottle-weight table for optional scale weighing mode

LICENSE: GNU GPL v3 or later. See LICENSE.txt in this folder.


MAC INSTALL (5 minutes)
-----------------------
1. Double-click the downloaded .zip once to unzip it.
2. Open the folder "open-source-barware-program".
3. Double-click START-HERE-MAC.html (opens in your browser — no Mac block).
   Or read step 4 here if you prefer.
4. macOS will block a normal double-click on Install.command ("unidentified
   developer"). That is expected for free software without an Apple cert.
   FIX: Right-click Install.command → Open → Open (confirm once).
   Terminal option:
     cd ~/Downloads/open-source-barware-program
     xattr -cr .
     chmod +x Install.command
     ./Install.command
5. Wait for "Setup complete!" — Chrome opens to your program.
6. Bookmark http://localhost:5052/ in Chrome. That bookmark IS the software.

The program installs to:  ~/osb-program
It starts automatically when you log in.


WINDOWS INSTALL (5–10 minutes)
------------------------------
1. Right-click the .zip → Extract All.
2. Open the folder "open-source-barware-program".
3. Double-click Install.bat  (do not double-click install.ps1)
4. If SmartScreen warns: More info → Run anyway
5. If Python is missing: install from https://www.python.org/downloads/
   Check "Add python.exe to PATH" during setup, then run Install.bat again.
6. Wait for "Setup complete!" - your browser opens to the program.
7. Bookmark http://localhost:5052/ in Chrome or Edge.

If Install.bat dies with "The string is missing the terminator":
you have the July 10 zip. Download a fresh Windows zip from
https://opensourcebarware.com/download and run Install.bat again.
Python and PATH were never the problem.

The program installs to:  %USERPROFILE%\osb-program
It starts automatically when you log in (Startup folder shortcut).


FIRST RUN
---------
The welcome screen walks you through mapping your bar. AI connection is
optional — skip it and use the full program immediately. Add AI later in
Settings only if you want invoice photos read automatically.

Language tip: speak or type the walk in English, Spanish, or mixed. Station
words (barra / bar, pozo / well, fila / row) and levels (lleno, medio, vacío)
are recognized in inventory notes today. The full Spanish interface ships next.


DAILY USE
---------
Open your bookmark: http://localhost:5052/

Manual start:
  Mac:     double-click Start.command (in ~/osb-program)
  Windows: double-click Start.bat (in %USERPROFILE%\osb-program)

Stop:
  Mac:     Stop.command
  Windows: Stop.bat


VERIFY IT WORKS
---------------
Open in your browser: http://localhost:5052/ping
You should see JSON with "status": "ok" and version "1.5.0-…"

If not, check the log:
  Mac:     ~/osb-program/data/osb_server.log
  Windows: %USERPROFILE%\osb-program\data\osb_server.log


CLEAN UP YOUR DOWNLOADS FOLDER (after install succeeds)
-------------------------------------------------------
Once Install finishes and the program opens in your browser, you do NOT
need the download files anymore. The live program is in ~/osb-program (Mac)
or %USERPROFILE%\osb-program (Windows).

Safe to delete:
  • The .zip file in Downloads (e.g. open-source-barware-program-mac.zip)
  • The unzipped "open-source-barware-program" folder on Desktop or Downloads

Keep (already copied for you):
  • Everything in ~/osb-program or %USERPROFILE%\osb-program
  • Your Chrome bookmark to http://localhost:5052/


UNINSTALL
---------
1. Run Stop.command (Mac) or Stop.bat (Windows)
2. Mac: delete ~/Library/LaunchAgents/com.opensourcebarware.program.plist
        then: launchctl bootout gui/$(id -u) com.opensourcebarware.program
3. Windows: delete the shortcut "Open Source Barware" from your Startup folder
4. Delete the install folder:
   Mac:     rm -rf ~/osb-program
   Windows: delete %USERPROFILE%\osb-program


UPDATES
-------
Check https://opensourcebarware.com/download every few weeks for updates.
Join the release list on the download page for email when new builds ship.
Re-run Install.command or Install.bat over your existing install — your
bar data in the data/ folder is preserved.


SUPPORT & SOURCE
----------------
Guide:    https://opensourcebarware.com/the-process
Email:    richard@opensourcebarware.com
Source:   https://github.com/RichardBJamison/open-source-barware
Website:  https://opensourcebarware.com
