# Event publishing integration — remaining backend and console work

## Current state (17 October 2026)

The public `eventsite` loads from the Firebase callable `getPublishedEvents` at
`https://europe-west1-vertex-ai-1618.cloudfunctions.net/getPublishedEvents`.
The free registration form calls `registerForEvent`, and the ticket verification
page calls its own verification endpoint. The site deliberately does **not** serve
`js/legacy-events.js` as a fallback: static events would misrepresent publication,
availability, cancellation, and ticket counts.

At inspection time, these event-specific callable handlers were not present among
the exports of `VertexCorporation/Fulcrum/functions/index.js` on `main`. There
was no events management module in the current source for
`VertexCorporation/adminsite` (`main`). No changes have been pushed to either
repository. Live deployed functions/database contents were **not** verified by this
source-only inspection, so do not assume the production backend is absent.

## Backend work (Fulcrum — separate approved change/deployment required)

- Define Firestore `events/{eventId}` records managed server-side, with stable IDs,
  title/description/translations, canonical `date` (YYYY-MM-DD), `startsAt`,
  `endsAt`, `timeZone`, location, media URLs, optional schedule and speakers,
  `status` (draft/published/cancelled), `salesStatus`, `capacity`, and
  `registeredCount`. Validate URLs and rich HTML on the server.
- Add privileged create/update/publish/archive/cancel functions with Firebase Auth,
  App Check as appropriate, granular console authorization, change audit metadata,
  and verification of protected fields. Never accept client-provided counts as truth.
- Expose `getPublishedEvents` with Firebase callable response
  `{result:{events:[...]}}`. It must return only intentionally public events,
  accurately reflect cancellations and ticket inventory, and never include contact
  records, draft content, Stripe secrets, or private organizer notes.
- Implement `registerForEvent` for free events with validation, atomic capacity
  reservation, deduplication/idempotency, rate limiting and server-issued
  `registrationId`. The public site expects `{result:{registrationId:"..."}}`.
  Require a verifiable ticket record before claiming registration succeeded.
- Implement and test the existing `validate.html` ticket-verification contract.
  For paid events, Stripe Payment Links must not imply payment success until a
  verified Stripe webhook associates the payment with a server-issued ticket.
- Keep Firestore rules deny-by-default for public event edits; expose public listing
  through the safe backend, not a public writeable collection.
- Add emulator integration tests for authorization, publication visibility,
  paid/free separation, concurrency at capacity, cancellations, replay handling,
  CORS origins, and verification. Deploy only after an explicit Fulcrum authorization.

## Console work (adminsite — separate approved change required)

Add an Events management view with list/draft/editor, preview, publish/unpublish,
schedule/timezone, translations, media and ticket tiers, inventory, registrations,
attendance check-in, and role-restricted audit history. Use the Fulcrum callables
rather than writes directly from browser Firestore SDK. If the event already exists,
adopt/migrate the stable event ID; never silently duplicate existing registrations
or payment links.

## Contract supported by eventsite

The frontend reads event data dynamically every 60 seconds and on window focus.
It shows a localized service-error message if loading fails and an empty state when
the backend explicitly returns an empty array. The existing legacy file remains a
migration reference and is never a runtime fallback. The public code continues to
call `registerForEvent` only for free tickets and to open Stripe links for paid
tickets. No new privileged backend functions or admin management controls were
deployed as part of this eventsite-only update.
