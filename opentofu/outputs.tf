output "function_uri" {
  description = "The URI of the deployed Cloud Run function"
  value       = google_cloudfunctions2_function.member_sync_function.service_config[0].uri
}

output "function_state" {
  description = "The state of the Cloud Run function"
  value       = google_cloudfunctions2_function.member_sync_function.state
}

output "storage_bucket" {
  description = "The storage bucket created for the function source code"
  value       = google_storage_bucket.function_bucket.name
} 