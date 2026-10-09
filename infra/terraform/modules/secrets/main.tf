variable "environment" {
  type        = string
  description = "Deployment environment (dev/prod)"
}

variable "services" {
  type        = list(string)
  description = "Microservices requiring secret storage"
  default     = [
    "auth-service",
    "user-service",
    "turf-service",
    "booking-service",
    "media-service",
    "api-gateway",
    "notification-service"
  ]
}

# AWS Secrets Manager Secret per Microservice
resource "aws_secretsmanager_secret" "service_secrets" {
  for_each                = toset(var.services)
  name                    = "turf-booking/${var.environment}/${each.value}"
  description             = "Application secrets for ${each.value} in ${var.environment}"
  recovery_window_in_days = 0

  tags = {
    Environment  = var.environment
    Microservice = each.value
    ManagedBy    = "Terraform"
  }
}

# Placeholder JSON Secret Version structure (to be populated manually or via CI/CD secrets manager)
resource "aws_secretsmanager_secret_version" "service_secrets_placeholder" {
  for_each      = toset(var.services)
  secret_id     = aws_secretsmanager_secret.service_secrets[each.value].id
  secret_string = jsonencode(
    each.value == "auth-service" ? {
      MONGODB_URI      = "mongodb://mongodb-service:27017/turf_auth"
      JWT_SECRET       = "REPLACE_WITH_REAL_JWT_SECRET"
      GOOGLE_CLIENT_ID = "REPLACE_WITH_REAL_GOOGLE_CLIENT_ID"
    } :
    each.value == "user-service" ? {
      MONGODB_URI = "mongodb://mongodb-service:27017/turf_user"
      JWT_SECRET  = "REPLACE_WITH_REAL_JWT_SECRET"
    } :
    each.value == "turf-service" ? {
      MONGODB_URI = "mongodb://mongodb-service:27017/turf_turf"
      JWT_SECRET  = "REPLACE_WITH_REAL_JWT_SECRET"
    } :
    each.value == "booking-service" ? {
      MONGODB_URI         = "mongodb://mongodb-service:27017/turf_booking"
      JWT_SECRET          = "REPLACE_WITH_REAL_JWT_SECRET"
      RAZORPAY_KEY_ID     = "REPLACE_WITH_REAL_RAZORPAY_KEY_ID"
      RAZORPAY_KEY_SECRET = "REPLACE_WITH_REAL_RAZORPAY_KEY_SECRET"
    } :
    each.value == "media-service" ? {
      JWT_SECRET            = "REPLACE_WITH_REAL_JWT_SECRET"
      CLOUDINARY_CLOUD_NAME = "REPLACE_WITH_REAL_CLOUDINARY_NAME"
      CLOUDINARY_API_KEY    = "REPLACE_WITH_REAL_CLOUDINARY_KEY"
      CLOUDINARY_API_SECRET = "REPLACE_WITH_REAL_CLOUDINARY_SECRET"
    } :
    each.value == "notification-service" ? {
      EMAIL_USERNAME = "REPLACE_WITH_REAL_EMAIL_USER"
      EMAIL_PASSWORD = "REPLACE_WITH_REAL_EMAIL_PASS"
    } :
    {
      JWT_SECRET = "REPLACE_WITH_REAL_JWT_SECRET"
    }
  )
}

output "secret_arns" {
  value       = { for k, v in aws_secretsmanager_secret.service_secrets : k => v.arn }
  description = "Map of microservice secret ARNs in AWS Secrets Manager"
}
