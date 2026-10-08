resource "aws_ssm_parameter" "jwt_secret" {
  name        = "/${var.environment}/turf-booking/jwt-secret"
  description = "JWT Secret Key for Turf Booking System"
  type        = "SecureString"
  value       = var.jwt_secret
}

resource "aws_ssm_parameter" "auth_mongo_uri" {
  name        = "/${var.environment}/turf-booking/auth-mongo-uri"
  description = "MongoDB URI for Auth Service"
  type        = "SecureString"
  value       = var.auth_mongo_uri
}

resource "aws_ssm_parameter" "turf_mongo_uri" {
  name        = "/${var.environment}/turf-booking/turf-mongo-uri"
  description = "MongoDB URI for Turf Service"
  type        = "SecureString"
  value       = var.turf_mongo_uri
}

resource "aws_ssm_parameter" "booking_mongo_uri" {
  name        = "/${var.environment}/turf-booking/booking-mongo-uri"
  description = "MongoDB URI for Booking Service"
  type        = "SecureString"
  value       = var.booking_mongo_uri
}
