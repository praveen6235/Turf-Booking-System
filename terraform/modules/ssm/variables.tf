variable "environment" {
  type        = string
  description = "Environment name"
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "JWT Secret"
}

variable "auth_mongo_uri" {
  type        = string
  sensitive   = true
  description = "Auth MongoDB URI"
}

variable "turf_mongo_uri" {
  type        = string
  sensitive   = true
  description = "Turf MongoDB URI"
}

variable "booking_mongo_uri" {
  type        = string
  sensitive   = true
  description = "Booking MongoDB URI"
}
