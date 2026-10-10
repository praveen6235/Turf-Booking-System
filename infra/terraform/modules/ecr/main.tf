variable "environment" {
  type        = string
  description = "Target deployment environment (dev/prod)"
}

variable "services" {
  type        = list(string)
  description = "List of microservices to create individual ECR repositories for"
  default     = [
    "api-gateway",
    "auth-service",
    "user-service",
    "turf-service",
    "booking-service",
    "media-service",
    "notification-service",
    "client"
  ]
}

resource "aws_ecr_repository" "microservices" {
  for_each             = toset(var.services)
  name                 = "turf-booking/${var.environment}/${each.value}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
    Microservice = each.value
    ManagedBy   = "Terraform"
  }
}

output "repository_urls" {
  value = { for k, v in aws_ecr_repository.microservices : k => v.repository_url }
  description = "Map of microservice names to ECR repository URLs"
}
