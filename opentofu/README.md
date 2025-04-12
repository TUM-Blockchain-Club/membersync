# MemberSync Cloud Function Deployment

This directory contains the OpenTofu configuration for deploying the MemberSync application as a Google Cloud Run function.

## Architecture

The deployment consists of:

1. A Google Cloud Storage bucket to store the function source code
2. A Cloud Run Function (2nd gen) to run the Node.js application
3. Appropriate service accounts and permissions

## Prerequisites

- Google Cloud Project with appropriate APIs enabled
  - Cloud Functions API
  - Cloud Build API
  - Cloud Run API
  - IAM API
- Service account with appropriate permissions
- GCS bucket for Terraform state

## Configuration Variables

The deployment can be customized through variables defined in `variables.tf`. Key variables include:

- `project_id`: The GCP project ID
- `region`: The GCP region for resources (default: europe-west3)
- `nodejs_version`: Node.js version for the function runtime (default: 22)
- `service_account_email`: Service account for the Cloud Function

## Deployment

To deploy the infrastructure:

```bash
# Initialize OpenTofu
terraform init

# Plan the deployment
terraform plan -out=tfplan

# Apply the deployment
terraform apply tfplan
```

## Outputs

After deployment, OpenTofu will output:

- `function_uri`: The URI of the deployed Cloud Run function
- `function_state`: The state of the Cloud Run function
- `storage_bucket`: The name of the storage bucket created for the function 