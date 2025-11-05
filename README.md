This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Bostadsbokningssystem

Detta projekt är en fullstack-applikation där användare kan:
- Skapa konto och logga in
- Lägga upp egna boenden (Properties)
- Boka andras boenden (Bookings)
- Se, redigera och avboka sina bokningar

Applikationen är byggd med **Next.js**, **React** och **TypeScript** i frontend, samt **Hono** + **TypeScript** i backend.  
**Supabase** används för databas, autentisering och sessioner (via HttpOnly cookies).

---

## Teknisk översikt

| Del | Teknik | Beskrivning |
|----|--------|-------------|
| Frontend | Next.js (React) + TypeScript | Bygger UI och skickar API-anrop |
| Backend | Hono + TypeScript | API-rutter (CRUD) och affärslogik |
| Databas | Supabase PostgreSQL | Lagrar användare, boenden och bokningar |
| Autentisering | Supabase Auth (HttpOnly cookies) | Inloggning + sessionshantering |

## Projektstruktur 

/backend
/src
/routes # API-rutter (property.ts, booking.ts, user.ts)
/middleware # requireAuth
/validators # zod validators
/frontend
/app # Next.js pages & UI
/components # UI-komponenter
/utils # fetch helpers (med credentials: "include")

# Klona projektet
git clone <repo-url>
cd projektmapp

# Installera beroenden
cd frontend
npm install
