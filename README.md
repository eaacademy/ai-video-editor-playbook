# Build Your Own AI Video Editor (members site)

Hana Marigmen's interactive beginner playbook, sold through Stripe and protected with a personal login for every buyer.

## How it works

1. A customer pays through the playbook's **Stripe Payment Link**.
2. Stripe tells this site (webhook). The site asks **Clerk** to email the buyer an invitation.
   If they already have an account, access is simply switched on.
3. The buyer creates their own login from the invitation and lands in the playbook.
4. The playbook and videos are only served to signed-in buyers. A shared link shows a sign-in page.

You manage people in the **Clerk dashboard**: see every buyer, and remove access any time.

## Project layout

| Path | What it is |
| --- | --- |
| `content/playbook.html` | The playbook itself (unchanged design and features). Never public. |
| `content/videos/` | Welcome and ending videos and cover images. Never public. |
| `app/playbook/route.ts` | Serves the playbook to signed-in buyers only |
| `app/media/[file]/route.ts` | Serves the videos to signed-in buyers only (streamed in pieces) |
| `app/api/stripe/webhook/route.ts` | Receives Stripe payments and grants access |
| `app/page.tsx`, `app/sign-in`, `app/sign-up`, `app/sign-out`, `app/no-access` | The pages around the playbook |
| `lib/` | Access rule, access granting, video byte ranges |
| `scripts/build-content.py` | Regenerates `content/playbook.html` from the playbook source page |

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (see `.env.example`). Never commit real values.

| Name | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk → API keys (starts `pk_live_`) |
| `CLERK_SECRET_KEY` | Clerk → API keys (starts `sk_live_`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (a restricted key is fine) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → your endpoint → Signing secret (`whsec_`) |
| `STRIPE_PAYMENT_LINK_ID` | The playbook Payment Link's ID (`plink_…`). Only that link grants access. |
| `APP_URL` | The site's address, e.g. `https://playbook.eaacademy.online` (no trailing slash) |
| `NEXT_PUBLIC_BUY_URL` | The Payment Link URL (`https://buy.stripe.com/…`) for "Get the playbook" buttons |

## One-time setup

### 1. Clerk
1. Create an application at dashboard.clerk.com (sign-in with email; add Google if you like).
2. **Restrictions → Sign-up mode → Restricted**, so only invited buyers can create accounts.
3. Create a **production instance** and add your domain when ready; Clerk lists the DNS records to add.
4. Copy the API keys into Vercel.

### 2. Stripe
1. Create the product and a **Payment Link**. After payment: show a confirmation message such as
   "You're in! Check your email for your invitation to create your login."
2. **Developers → Webhooks → Add endpoint**: `https://YOUR-DOMAIN/api/stripe/webhook`
   with events `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
3. Copy the signing secret, the Payment Link ID and a restricted API key into Vercel.

### 3. Vercel
Import the GitHub repository. Framework preset **Next.js** (detected automatically). No build settings to change.
Selling requires the **Pro** plan (Hobby is for non-commercial use).

## Managing access

- **See buyers:** Clerk dashboard → Users (pending invitations are under Users → Invitations).
- **Remove access:** open the user → Metadata → set public metadata `{"playbook": false}`, or delete or ban the user.
- **Give free access:** Clerk → Users → Invitations → invite with public metadata `{"playbook": true}`,
  or use a 100%-off Stripe promotion code on the Payment Link.

## Updating the playbook

Edit the playbook source page, then run `python3 scripts/build-content.py <source.html>` to regenerate
`content/playbook.html`, commit and push. Vercel redeploys automatically.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in test keys
npm run dev
```
