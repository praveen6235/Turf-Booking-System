variable "environment" {
  type        = string
  description = "Environment name"
}

variable "services" {
  type        = list(string)
  default     = ["frontend-service", "auth-service", "turf-service", "booking-service", "api-gateway", "webhook-service"]
  description = "List of microservice repository names"
}
