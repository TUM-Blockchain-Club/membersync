variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "tbc-membersync"
}

variable "region" {
  description = "The GCP region for resources"
  type        = string
  default     = "europe-west3"
}

variable "function_name" {
  description = "Name of the Cloud Run function"
  type        = string
  default     = "member-sync-function"
}

variable "function_description" {
  description = "Description of the Cloud Run function"
  type        = string
  default     = "Function to sync Google Workspace admin users with Discord roles"
}

variable "function_memory" {
  description = "Memory allocated to the function"
  type        = string
  default     = "256M"
}

variable "function_timeout" {
  description = "Function timeout in seconds"
  type        = number
  default     = 60
}

variable "max_instance_count" {
  description = "Maximum number of function instances"
  type        = number
  default     = 1
}

variable "nodejs_version" {
  description = "Node.js version for the function runtime"
  type        = string
  default     = "22"
} 