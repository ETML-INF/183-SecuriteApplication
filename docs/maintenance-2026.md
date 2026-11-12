# ICT-183 update plan (2026) - task list for fresh sessions

Work happens directly on `main`. Each task below is self-contained: start a new
session and say "do task T<n> from docs/maintenance-2026.md". Update the status
column and commit when a task is done.

Ground rules (apply to every task)
- Do not push; commit locally, one commit per task.
- PPTX/DOCX are binary: do not run two tasks touching the same file in parallel.
- Edit pptx via python zipfile on `ppt/slides/slideN.xml` `<a:t>` runs (see git log
  0d76acd for the approach). Keep original files until Slidev conversion is validated.
- Verify visually: `soffice --headless --convert-to pdf`, then `pdftoppm -r 40`.
- Reference lists (verified Oct 2026):
  - OWASP Top 10:2025: A01 Broken Access Control (incl. SSRF), A02 Security Misconfiguration,
    A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection,
    A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures,
    A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions.
  - OWASP LLM Top 10 (2025): LLM01 Prompt Injection, 02 Sensitive Information Disclosure,
    03 Supply Chain, 04 Data and Model Poisoning, 05 Improper Output Handling,
    06 Excessive Agency, 07 System Prompt Leakage, 08 Vector and Embedding Weaknesses,
    09 Misinformation, 10 Unbounded Consumption. (A 2026 edition may exist: check genai.owasp.org.)
  - OWASP Top 10 for Agentic Applications 2026 (published 2025-12-09): ASI names are in the PDF
    on genai.owasp.org, not yet retrieved.

| # | Task | Status |
|---|------|--------|
| T0 | Merge owasp-2025 branch + slide fixes (SSRF under A01, Alerting, stats, Superman) | done (401d753, 0d76acd) |
| T1 | Docker stacks: test and fix | done (see T1 result) |
| T2 | Broken links and repo hygiene | done (see T2 result) |
| T3 | Re-export 01-Owasp.pdf, check hidden slides and notes | partly done (see T3 result); PDF re-export still manual |
| T4 | Juice Shop: pin version, re-test challenges, map to Top10:2025 | done (see T4 result) |
| T5 | Other decks and docx: dates, wording, 2025 mapping | done (see T5 result) |
| T6 | AI security block (LLM Top 10 + agentic) | done (see T6 result) |
| T7 | Slidev conversion | todo |
| T8 | Student confidence: intro page, smoke tests, hints | done (see T8 result) |
| T9 | Oral questions (40) and written exam alignment | done in repo, pending colleagues' agreement (see T9 result) |
| T10 | Review `supports/01-superman.pptx` story order vs Top10:2025 | done (slides reordered A01..A10, notes renamed; open points below) |

## T1 Docker stacks (exercices/**.zip)
Zips: `auth/02-auth.zip`, `auth/02X-auth-solution.zip`, `auth/03X-token-solution.zip`,
`db-audit/docker-views-stored-procedure.zip`, `xss/docker-xss-http-payload.zip`,
`xss/docker-xss-stored.zip`. Unzip each into the scratchpad, never in the repo.
Known issues:
- `FROM node:20` is EOL (Apr 2026) -> node 22 or 24 LTS (5 Dockerfiles).
- `mysql:8.0.30` -> 8.4 LTS (5 compose files). Check `mysql2` auth and the SQL init scripts still work.
- Obsolete `version: '2'` and `links:` keys in compose files.
- Port collisions: phpMyAdmin 8082 in both auth stacks; 02X app 8084 vs views phpMyAdmin 8084.
- XSS Dockerfiles `EXPOSE 8083` but apps listen on 8086/8087.
- Auth app: concatenated SQL is intentional; add a comment saying so. App connects as root/root
  (intended "before" state, docx point 4 fixes it).
- Views exercise data and question use Feb 2024 (works, decide: keep or shift to 2026).
- Label 02X as teacher solution.
Result (2026-10-31): all five stacks rebuilt and smoke-tested (docker compose up, HTTP checks, SQL init,
SQLi login on 02, register/login/cookie on 02X, comment POST/GET on xss-stored).
- node:20 -> node:24 (5 Dockerfiles); mysql:8.0.30 -> 8.4, phpmyadmin 5.2.0 -> 5.2; `version:` and `links:` removed.
- 02X was broken: stray `z` on line 1 of `app/controllers/HomeController.js` (app crashed at start). Fixed.
- Ports: 02X phpMyAdmin 8082 -> 8088 and app 8084 -> 8089 (02 keeps 8082/8083, views keeps 8084).
- EXPOSE fixed (8087 http-payload, 8086 stored). Comments added in 02 `Auth.mjs` (intentional SQLi) and `dbUtils.mjs` (root/root).
- 02X labelled SOLUTION in its compose header (solutions stay public in the repo, by choice). Views data kept at 2024 (works, dates are only data).
- Not done: the docx may mention the old 02X ports (not found by text search, check screenshots).
Update (2026-11-12): auth solutions rewritten on top of the 02 starter (ESM, JSON API, same files, `SOLUTION étape N`
comments) so students can diff file by file; the old EJS/CommonJS 02X (and its "cookie on 02X") is gone.
- `02X-auth-solution.zip` -> folder `auth-solution/`, project `auth-solution`, ports 8088/8089: validation + prepared
  statement, `app_user` (SELECT, INSERT on t_users), scrypt(HMAC-SHA256(pepper, pwd), salt), `/auth/register`.
- `03X-token-solution.zip` -> folder `token-solution/`, project `token-solution`, ports 8090/8091: 02X + JWT HS256
  (`algorithms` pinned, 1 h) in httpOnly/SameSite cookie, `requireAuth` on `/user`, `/auth/logout`.
- Distinct folders and compose project names: unzipping a solution no longer overwrites the student's `auth/`, and
  volumes are not shared (before: same `auth_dbdata`, init script skipped, "access denied for app_user").
- Starter hint fixed (SQL TODO said sha256; now slow hash, scrypt/Argon2id, as in the slides).
- DB in all three auth stacks: `tmpfs` by default (re-initialised from `db_authentication.sql` at every db start,
  `docker compose restart db` applies SQL edits, API data lost). Opt-in persistence: rename
  `docker-compose.persist.yml` -> `docker-compose.override.yml` (auto-loaded; uses `tmpfs: !reset []`, needs
  Compose >= 2.24). Warned in each zip's `README.md`, compose comments, theme 02/03 pages, indices.
- db healthcheck (`mysqladmin ping -h 127.0.0.1`, TCP so not "healthy" during init) + `depends_on: service_healthy`
  for nodejs and phpMyAdmin: `up -d` returns when MySQL is ready, no more first-request 500.
- npm deps: the anonymous `node_modules` volume hid packages added later (`up --build` without `-V` ->
  ERR_MODULE_NOT_FOUND, verified). Now `app/nodemon.json` watches `*.json` too and runs
  `npm install && node server.mjs` on every (re)start: adding a package from the host (`npm install x` in app/),
  in the container (`compose exec`) or by hand is picked up in ~4 s, no docker command, no `-V`.
  No-op install ~0.9 s per code-change restart. A preinstall warning was rejected: npm does not run root
  lifecycle scripts for `npm install <pkg>`. Host node_modules stays masked (Linux native builds in the container).
- `.dockerignore` (`**/node_modules`) added: without it, `COPY app/ ./` baked the host node_modules into the image
  (seeds the anon volume). Verified: a same-version host module (= Windows native build) broke the app; with
  `.dockerignore` the container keeps its own Linux build. A local `npm install` can no longer break the container.
- Local run option (auth stacks): DB published on 127.0.0.1 (6031 / 6033 / 6034), `DB_HOST`, `DB_PORT`, `PORT` read
  from env (defaults = Docker), `app/.env` holds the local values commented out, loaded with
  `node --env-file-if-exists=.env` (Node >= 22.9). Compose sets DB_HOST/DB_PORT/PORT itself, so an uncommented
  `app/.env` does not affect the container (verified). Use 127.0.0.1, not localhost (Node on Windows tries ::1 first).
  Verified with Windows Node 24: starter SQLi and 03X JWT flow against the Docker DB.
- All published ports bound to 127.0.0.1 (auth stacks and 05): vulnerable app and root/root DB not reachable from LAN.
- Stack 05 (`docker-views-stored-procedure.zip`): folder `docker/` -> `docker-views-stored-procedure/` (same convention
  as xss zips). SQL scripts moved to `sql/`. Only `1_` is mounted ON PURPOSE: mounting 2_/3_ is a student task
  (Views docx: "Modifiez le fichier docker-compose.yml pour que le script 2_create_views.sql soit automatiquement
  appelé"); a `TODO` marks the spot, hint 05.3 points to the existing 1_ mount. 2_/3_ now have a header and
  `USE db_students;` (init scripts run without a default DB: `No database selected` otherwise, the X- solution's
  unprefixed CREATE VIEW would fail). Persistent volume kept as default (students work in the phpMyAdmin console;
  tmpfs would lose it), reset = `down -v`. Healthcheck + depends_on added. README added. Verified: console work
  survives restart, scripts replay only after reset, DELIMITER procedure + GRANT on view work, a broken script gives
  `dependency failed ... unhealthy` then a half-initialised "healthy" DB -> README/theme say: fix, then reset.
- Smoke-tested all three side by side: SQLi works on 02 and fails on 02X, app_user DROP/TRUNCATE denied,
  register 201/409, 03X 401 without token, 200 with cookie, forged/`alg:none` token 401, logout.
Update 2 (2026-11-12), after review:
- 02X/03X hashing switched to Argon2id (`argon2` ^0.45.1, prebuilt binaries, no compile): OWASP minimum
  m=19456 KiB, t=2, p=1, pepper = Argon2 `secret` option. `useSalt` column KEPT (matches the docx diagram and the
  scrypt variant): the app generates the salt (`generateSalt`) and passes it as Argon2's `salt` option (Argon2 also
  copies it into the PHC string). `usePassword` widened to varchar(255). `hashPasswordScrypt(password, salt)` kept as
  the no-dependency variant (N=2^17, r=8, p=1, HMAC pepper, 128 hex chars); `verifyPassword(password, salt, stored)`
  picks the algorithm from the `$argon2` prefix, so both can coexist (= migration pattern). Signatures unchanged vs
  the scrypt version. `john` keeps his salt, hash recomputed with the compose PEPPER (wrong pepper -> false, verified).
  Grading: a student solution without salt column (Argon2 drawing its own salt) is also correct.
- Starter TODOs (SQL, `Auth.mjs`, `generateSalt.mjs`) and hint 02.4 now Argon2id first, scrypt as alternative.
  New hint: how to get `john`'s hash into the SQL (register route or temporary console.log) + "changing PEPPER
  invalidates every hash".
- Starter closes its DB connection on `finish` (was one leaked connection per request; also removes noise from the
  02 -> 02X diff). Starter `.env` normalised (`COMPOSE_PROJECT_NAME=auth`).
- READMEs: service table no longer split by a blank line; local run needs Node >= 22.9 (`--env-file-if-exists`).
- `e-183-ALL-Views.docx` patched (run-level XML edits, formatting kept): source archive name, step 2 asks to mount
  both `2_` and `3_`, `2_`/`3_` prefixes and `.sql` everywhere, "qui puisse aussi consulter".
Acceptance (original): each stack runs from `docker compose up -d` on a clean machine and each docx
exercise can be followed start to finish. Re-zip into the same filenames and commit.

## T2 Broken links and hygiene
- `thematiques/04-hacker.md` links `../exercices/audit/JuiceShop.docx`, real path `exercices/hack/JuiceShop.docx`.
- `README.md` links `sequences/`, which does not exist.
- `exercices/auth/03-jwt.docx` links a GitHub URL to the handbook PDF that is probably not a valid blob/raw link.
- Delete `README.md~`, `idees.md~`; decide what to do with `idees.md` (unfinished katana tutorial).
- Update `thematiques/01-dangers.md` to mention the Top10:2025 deck.
Result (2026-10-31):
- `04-hacker.md` link fixed to `exercices/hack/JuiceShop.docx`; `README.md` dead `sequences/` link replaced by a list of the 7 thematiques pages.
- `03-jwt.docx`: handbook link now `.../blob/main/supports/02-jwt-handbook-v0_14_2.pdf` (2 occurrences in the rels/xml).
- Removed `README.md~`, `idees.md~` (ignored backups) and `idees.md` (katana idea moved to T4 above).
- `01-dangers.md` now says the OWASP deck is Top 10:2025.
- All relative links in README and thematiques/*.md checked: none missing.

## T3 PDF and hidden slides (manual)
Re-export `supports/01-Owasp.pdf` from PowerPoint (current one has the old SSRF position).
LibreOffice exported 75 pages for 79 slides: find the hidden slides and confirm intent.
SSRF slides' speaker notes still link to a stationx XSS-vs-CSRF article: replace.
Result (2026-10-31):
- Hidden slides (4): 29, 30, 31 (A01 "Principe" animation build-ups) and 41 (cryptographic failures,
  second "Est-ce que les donnees sensibles..." slide). 79 - 4 = 75 pages, which explains the LibreOffice count.
  Confirm in PowerPoint that these should stay hidden.
- Notes of SSRF slides 32-33 now link the OWASP SSRF Prevention Cheat Sheet instead of stationx.
- Still manual: re-export `01-Owasp.pdf` from PowerPoint (File > Export > PDF, hidden slides excluded,
  notes not included) and commit it.

## T4 Juice Shop
`exercices/hack/JuiceShop.docx` uses unpinned `bkimminich/juice-shop`. Pin a tag, re-run the
challenges in `supports/04-Juiceshop.pptx` (score-board, DOM XSS, confidential document,
error handling `/rest/qwertz`, admin login, Jim, Bender) and fix any changed hints.
Add a column "Top 10:2025 category" per challenge (error handling -> A10).
Idea (from the removed `idees.md`): optional recon tutorial on the running Juice Shop:
`katana -v -u http://127.0.0.1:3000 -o katana.txt -store-response -jc`, then prettier on the
JS bundle and `rg -i score` to find the score-board route.
Result (2026-10-31):
- Pinned `bkimminich/juice-shop:v20.3.0` (latest tag as of today) in `JuiceShop.docx`, both the
  `docker pull` and `docker run` commands.
- Re-ran every challenge from the docx/pptx against a throwaway container
  (`docker run -d -p 3100:3000 bkimminich/juice-shop:v20.3.0`, port 3000 was already taken
  locally): score-board hidden page, DOM XSS tutorial payload
  (`<iframe src="javascript:alert(\`xss\`)">` in the search bar), Confidential document
  (`/ftp/` directory listing -> `acquisitions.md`), Error handling (`/rest/qwertz` -> 500
  "Unexpected path"), Login Admin (`' or 1=1--` SQLi), and checked View Basket/Login
  Jim/Login Bender are still present at the same difficulty (2-3 stars). No hints changed;
  all URLs, payloads and challenge names in the pptx/docx match v20.3.0.
- Student worksheet (`JuiceShop.docx`) keeps blank answer lines ("Quelle est le type de faille
  du Top 10:2025 ?" - wording updated from "top 10" to "Top 10:2025", answer still left for
  students to fill in). The mapping below is the instructor answer key for that column:

| Challenge | Juice Shop key | Top 10:2025 category |
|---|---|---|
| Score Board (hidden page) | `scoreBoardChallenge` | A02 Security Misconfiguration (undocumented/hidden endpoint) |
| DOM XSS | `localXssChallenge` | A05 Injection |
| Bonus Payload | `xssBonusChallenge` | A05 Injection |
| Confidential Document | `directoryListingChallenge` | A02 Security Misconfiguration (directory listing) |
| Error Handling (`/rest/qwertz`) | `errorHandlingChallenge` | A10 Mishandling of Exceptional Conditions |
| Login Admin | `loginAdminChallenge` | A05 Injection |
| View Basket | `basketAccessChallenge` | A01 Broken Access Control |
| Login Jim | `loginJimChallenge` | A05 Injection |
| Login Bender | `loginBenderChallenge` | A05 Injection |

- Katana recon idea not implemented (optional, left for a future task if wanted).

## T5 Other decks
Dates in 02-Auth, 04, 05, 06 decks (still 2025 dates). Re-check `02-Auth.pptx` against
OWASP Password Storage Cheat Sheet (Argon2id/scrypt/bcrypt, salt/pepper); `05-db_audit`
objective slides are repeated; `06-xss` CSP and `escape-html` still valid.
Result (2026-10-31):
- Dates: the footer date is a PowerPoint auto-update field (`datetime1`); cached text in 02, 04, 05, 06
  set to 31.10.2026 (PowerPoint refreshes it on open anyway).
- `02-Auth.pptx` slide 13: added "Algorithme de hachage lent" with Argon2id (recommended), scrypt, bcrypt,
  and "no plain MD5/SHA-256". Salt (per user, stored) and pepper (global, outside the DB) slides match the cheat sheet.
- `05-db_audit.pptx`: the 4 objective slides were animation build-ups of the same list; slides 2-4 removed
  from `sldIdLst` (parts left orphaned, PowerPoint drops them on save), slide 5 kept. 29 -> 26 slides.
- `06-xss.pptx` slide 16: `string.escapeHTML()` does not exist in vanilla JS (it was Prototype.js);
  replaced by "replace & < > \" ' by HTML entities". `escape-html` (npm, v1.0.3, stable) and the CSP
  meta example (`default-src 'self'`) are still valid; `textContent` slide fine.
- `04-Juiceshop.pptx`: dates only (content verified in T4). docx files not touched (no dated wording found).
- Not done: Word docx were not re-read for 2025 wording beyond the earlier tasks.

## T6 AI block
45-60 min. Focus: LLM01 Prompt Injection, LLM05 Improper Output Handling, LLM06 Excessive
Agency; link to A05 Injection and XSS they already know. Hands-on: a prompt-injection game
(e.g. Gandalf) or a small local chatbot lab; 5 minutes on agentic risks at the end.
Create it as a Slidev deck (T7 style) plus a one-page exercise sheet.
Result (2026-10-31):
- `slides/07-ia-securite.md`: Slidev deck (LLM01, LLM05, LLM06, 5 min agentic slide, links to A05/XSS/A01/A09).
- `exercices/ia/ia-exercice.md`: one-page sheet (Agent Breaker, innerHTML fix, classification) with teacher answers.
- Not verified: deck not rendered (no Slidev setup/package.json in repo yet, see T7); Agent Breaker (ex-Gandalf, play.lakera.ai/agent-breaker) read via browser but not played.
  Agentic slide is generic because the OWASP ASI names were not retrieved. Optional local chatbot lab not built.

## T7 Slidev conversion
Use the `slidev` skill. Order: OWASP deck first, then the others. Keep the PPTX until validated.

## T8 Student confidence
One-page "what we do, in what order, how it is graded" up front; a smoke-test URL after each
`docker compose up`; hints and solutions for each exercise.
Result (2026-11-01):
- `thematiques/00-parcours.md`: one-page overview (order, durations, deliverables, grading 50/50, what to do when stuck), linked first in `README.md`.
- "Vérifier que ça marche" section (URL/command + expected result) added to thematiques 02, 03, 04, 05, 06.
  Verified by running: auth stack (8082 pma 200, 8083 `/user` 200, `/auth` 401 JSON) and both XSS stacks (8087 `/search-results`, 8086, 8085).
  Views stack (8084) and Juice Shop (3000) URLs come from T1/T4 tests, not re-run.
- `exercices/indices.md`: student hints per exercise (directions only, no answers).
- `docs/corriges-enseignant.md`: where each solution lives (02X, X-OWASP docx, X-views md, Juice Shop table, IA sheet).
- Not done: XSS and Juice Shop solution files added later (`exercices/xss/X-xss-solution.md`, `exercices/hack/X-JuiceShop.md`); the hint docx files themselves were not edited; duration column in 00-parcours is indicative and should be confirmed.

## T9 Oral questions
`exercices/ListeDesQuestions.md` (was a 2024 PDF): align with Top10:2025 and AI content.
Changes the evaluation, so agree with colleagues first.
Result (2026-11-01):
- Compared with the 2026 evaluation material (outside the repo: card set `E-183-ALL01-cards-sorted.md`,
  `EvalQuestions-26-*.xlsm`, `eval1/183-eval1-scenario1.docx`, grading app `cartes_outil_evaluation/`, card PDFs `cartes/`).
  The 2026 oral used a 30-card set on the 2025 list; the repo still shipped the 2024 PDF (OWASP 2021 wording, no A07-A10, no AI).
- New list of 46 questions, balanced on what is taught (oral draws 3: 1 main x2 + 2 auxiliary):
  OWASP1-13 (org, top 5 in order, A01..A10 one by one, pick a risk), LOGIN1-5, HASH1-3, AUTH1-3 (MFA, cookie attributes,
  authn vs authz), JWT1-2, TOKEN1-2, ISQL1-4, XSS1-4, MISC1-3 (incl. CVE/CWE), IA1-3, HACK1-2 (Juice Shop approach and
  a solved challenge), DB1-2 (least privilege/views, stored procedures). HACK and DB cover the longest and a full block
  that had no question. IA kept to 3 (30 min block).
- Removed (not taught): MAIL1/2/4, DDOS1-3, OUTIL1-4 (Metasploit etc.), mongodb, password-entropy proof.
  Merged/fixed: duplicated ISQL3 (now prepared statements), duplicated HASH1, TOKEN ids swapped to match the cards.
- Old PDF removed (git history keeps it); links in `00-parcours.md` and `08-questions.md` point to the .md.
- Outside the repo (OneDrive `c-Evaluation`) updated the same day: `cartes/ex_sources/E-183-TS2.md`, `cartes/ex_pdfs/E-183-TS2(.print).pdf`
  (46 cards), `cartes_outil_evaluation/questions.js` and `questions_sorted.js` (46 questions with 3/2/1/0 hints; hints are the
  answer key, keep them out of the repo). Question ids of OWASP and TOKEN changed, old grading exports keep the question text.
- Not done: needs colleague agreement (new IA/HACK/DB questions, 14 removals); `EvalQuestions-26-*.xlsm` not updated;
  written exam scenario (MusiqueStream, 2024 dates, SHA1, IDOR, admin page) not edited: still fits A01/A02/A04/A09
  but reads as 2024, consider mentioning A03/A10.

## T10 Review 01-superman.pptx (story order)
The story is a mnemonic for the Top 10 and its order was built on the 2021 list, so it may no
longer follow the 2025 order. Current slide order and the category each keyword stands for:
1. intro / 2. "cassé par Banes" (setup)
3. CRYPTOnite, INJECTée -> A04 Cryptographic Failures, A05 Injection
4. DÉFAUT -> A06 Insecure Design
5. CONFIGURATION erronée -> A02 Security Misconfiguration
6. PÉREMPTION du venin -> outdated components, now part of A03 Supply Chain Failures
7. S'INTRODUIRE dans le labo -> A01 Broken Access Control / A07 Authentication Failures
8. INTÉGRER une molécule -> A08 Integrity Failures
9. sans ALERTE (caméras) -> A09 Logging and Alerting (edited in 0d76acd)
10. PANNE, la porte S'OUVRAIT -> A10 Mishandling of Exceptional Conditions (edited in 0d76acd; the old SSRF acronym "Seul Superman Reviendra Fièrement" was removed)
Result (2026-10-31):
- Slide 2 "CASSÉ" is A01 Broken Access Control (the slide notes say so), so every category is
  covered exactly once; slide 7 is only A07. No slide had to be added.
- Slides reordered to the 2025 order: 1, 2 (A01), 5 (A02), 6 (A03), 3 (A04+A05), 4 (A06),
  7 (A07), 8 (A08), 9 (A09), 10 (A10). Only `p:sldIdLst` changed; no section list exists.
- Speaker notes renamed: slide 6 "Supply chain failures (outdated components)",
  slide 9 "Logging and alerting", slide 10 "Mishandling of exceptional conditions" (was "ssrf").
- Slide 6 keeps PÉREMPTION and its expired-label picture (fits "outdated components").
- Used by `thematiques/01-dangers.md` as a link only; nothing to update there.
Open: check in PowerPoint that the story still reads well (slide 3 "De la CRYPTOnite..." now
follows the venin slide), and the oral questions (T9) if they quote the story order.
