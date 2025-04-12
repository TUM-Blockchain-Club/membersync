# MemberSync

A Google Cloud Run function that synchronizes Google Workspace admin user data with Discord roles.

## Environment Variables

Make sure to set the following environment variables:

```
GOOGLE_WORKSPACE_EMAIL=<service-account-email>
GOOGLE_WORKSPACE_KEY=<service-account-private-key>
DISCORD_BOT_TOKEN=<discord-bot-token>
DISCORD_GUILD_ID=<discord-server-id>
AUTH_TOKEN=<optional-auth-token-for-webhook-security>
```

## Deployment

### Prerequisites

1. Install Google Cloud SDK
2. Initialize and authenticate your gcloud CLI
3. Make sure you have a Google Cloud project set up

### Deploy the Cloud Run function

```bash
# Build and deploy the function
gcloud functions deploy syncAdminWorkspace \
  --gen2 \
  --runtime=nodejs20 \
  --region=europe-west3 \
  --source=. \
  --entry-point=syncAdminWorkspace \
  --trigger-http \
  --allow-unauthenticated

# Or if you want to secure it with Google Cloud IAM
gcloud functions deploy syncAdminWorkspace \
  --gen2 \
  --runtime=nodejs20 \
  --region=europe-west3 \
  --source=. \
  --entry-point=syncAdminWorkspace \
  --trigger-http
```

## Setting up a schedule

You can set up a scheduler to call your function regularly:

```bash
# Create a service account for the scheduler
gcloud iam service-accounts create scheduler-sa \
  --display-name="Scheduler Service Account"

# Grant the service account permission to invoke the function
gcloud functions add-iam-policy-binding syncAdminWorkspace \
  --member="serviceAccount:scheduler-sa@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.invoker"

# Create a Cloud Scheduler job to run the function daily
gcloud scheduler jobs create http workspace-sync-daily \
  --schedule="0 2 * * *" \
  --uri="https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/syncAdminWorkspace" \
  --http-method=GET \
  --oidc-service-account-email="scheduler-sa@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --oidc-token-audience="https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/syncAdminWorkspace"
```

## Testing

You can test the function by making a POST request to its URL:

```bash
curl -X POST https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/syncAdminWorkspace \
  -H "Authorization: Bearer YOUR-AUTH-TOKEN"
```

If you've deployed with `--allow-unauthenticated`, you can simply call the URL, but using an AUTH_TOKEN is still recommended for security. 