terraform {
    backend "gcs" { 
        bucket = "terraform-state-bucket"
        prefix = "terraform/state"
    }
    
    required_providers {
        google = {
            source  = "hashicorp/google"
            version = "~> 4.0"
        }
    }
}

provider "google" {
    project = var.project_id
    region  = var.region
}

# Storage bucket to hold the function source code
resource "google_storage_bucket" "function_bucket" {
    name                        = local.storage_bucket_name
    location                    = var.region
    uniform_bucket_level_access = true
    force_destroy               = true
    
    labels = local.common_labels
    
    lifecycle_rule {
        condition {
            age = 30 // Delete files older than 30 days
        }
        action {
            type = "Delete"
        }
    }
}

# Upload the function source zip to the bucket
resource "google_storage_bucket_object" "function_zip" {
    name       = "function-source-${filesha256(local.zip_source_path)}.zip"
    bucket     = google_storage_bucket.function_bucket.name
    source     = local.zip_source_path
    depends_on = [null_resource.create_zip]
}

# Cloud Run function deployment
resource "google_cloudfunctions2_function" "member_sync_function" {
    name        = var.function_name
    location    = var.region
    description = var.function_description
    
    labels = local.common_labels
    
    build_config {
        runtime     = local.runtime
        entry_point = local.entry_point
        source {
            storage_source {
                bucket = google_storage_bucket.function_bucket.name
                object = google_storage_bucket_object.function_zip.name
            }
        }
    }

    service_config {
        max_instance_count    = var.max_instance_count
        available_memory      = var.function_memory
        timeout_seconds       = var.function_timeout
        
        environment_variables = {
            NODE_ENV = "production"
        }
    }
    
    depends_on = [google_storage_bucket_object.function_zip]
}

# Create the zip file containing the function code
resource "null_resource" "create_zip" {
    triggers = {
        source_code_hash = filesha256("../package.json")
        tsconfig_hash    = filesha256("../tsconfig.json")
    }

    provisioner "local-exec" {
        command = <<EOT
            cd ..
            npm run build
            zip -r function-source.zip dist package.json package-lock.json node_modules
        EOT
    }
}