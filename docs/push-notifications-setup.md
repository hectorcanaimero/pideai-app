# Push Notifications Setup Guide

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- EAS CLI installed (`npm install -g eas-cli`)
- Physical device for testing (push doesn't work on simulators)

## Step 1: Create the device_tokens table

Run the migration on your Supabase database:

```bash
# Option A: Via Supabase CLI
supabase db push

# Option B: Via Supabase Dashboard
# Go to SQL Editor → paste contents of supabase/migrations/20260403_create_device_tokens.sql → Run
```

## Step 2: Deploy the Edge Function

```bash
cd ~/project/pideai/mobile
supabase functions deploy send-push-notification --project-ref YOUR_PROJECT_REF
```

The function automatically has access to `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Step 3: Create the Database Webhook

In Supabase Dashboard:

1. Go to **Database → Webhooks**
2. Click **Create webhook**
3. Configure:
   - **Name:** `on-new-order-push`
   - **Table:** `orders`
   - **Events:** `INSERT` only
   - **Type:** Supabase Edge Functions
   - **Edge Function:** `send-push-notification`
4. Click **Create webhook**

## Step 4: Configure EAS Project

```bash
cd ~/project/pideai/mobile
eas build:configure
```

This creates a project on Expo's servers and generates a `projectId` in `app.json` under `extra.eas.projectId`. This ID is required for `getExpoPushTokenAsync()`.

## Step 5: Test

1. Run the app on a physical device
2. Login → app requests notification permission → accept
3. Check `device_tokens` table in Supabase — token should be saved
4. Create a test order from the web admin
5. You should receive a push notification on the device
6. Tap the notification → should open the order detail screen

## Architecture

```
New Order INSERT → DB Webhook → Edge Function → Expo Push API → Device
                                                                  ↑
                     App also polls every 5s as fallback ─────────┘
```

## Troubleshooting

### No notification received
1. Check `device_tokens` table has a token for your user/store
2. Check Edge Function logs: Supabase Dashboard → Edge Functions → Logs
3. Verify webhook is active: Database → Webhooks
4. Test the Edge Function directly: `supabase functions invoke send-push-notification --body '{"record":{"id":"test","store_id":"...","customer_name":"Test","total_amount":10,"status":"pending"}}'`

### Token registration fails
- Push tokens only work on physical devices, not simulators
- iOS requires explicit notification permission
- Check that `eas.projectId` exists in `app.json`

### Badge count wrong
- Badge updates on every poll (5s) and on every push
- Kill and reopen app to see updated badge
