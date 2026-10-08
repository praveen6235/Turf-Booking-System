variable "environment" {
  type        = string
  description = "Environment name"
}

variable "account_id_suffix" {
  type        = string
  default     = "0123"
  description = "Suffix to ensure unique S3 bucket name"
}
