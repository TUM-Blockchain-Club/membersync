locals {
  # Common tags to be assigned to all resources
  common_labels = {
    project     = "membersync"
    managed_by  = "opentofu"
  }
  
  # Storage-related configuration
  storage_bucket_name = "member-sync-function-${var.project_id}"
  zip_source_path     = "../function-source.zip"
  
  # Function configuration
  runtime     = "nodejs${var.nodejs_version}"
  entry_point = "syncAdminWorkspace"
} 