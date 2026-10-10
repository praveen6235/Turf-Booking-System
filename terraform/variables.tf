variable "aws_region" {
  type        = string
  default     = "ap-south-1"
  description = "AWS Region (Mumbai)"
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Environment name (dev/staging/prod)"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "VPC CIDR block"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
  description = "Public Subnet CIDRs"
}

variable "availability_zones" {
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
  description = "Availability Zones"
}

variable "allowed_ssh_cidrs" {
  type        = list(string)
  default     = ["0.0.0.0/0"]
  description = "Allowed SSH CIDRs"
}

variable "instance_type" {
  type        = string
  default     = "t3.micro"
  description = "EC2 Instance Type for low cost / free tier"
}

variable "services" {
  type        = list(string)
  default     = ["frontend-service", "auth-service", "turf-service", "booking-service", "api-gateway", "webhook-service"]
  description = "List of microservices"
}

variable "account_id_suffix" {
  type        = string
  default     = "turf2026"
  description = "Unique suffix for S3 buckets"
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  default     = "super_secret_jwt_key_for_turf_booking_system_2026"
  description = "JWT Secret Key"
}

variable "auth_mongo_uri" {
  type        = string
  sensitive   = true
  default     = "mongodb://mongodb:27017/turf_auth"
  description = "Auth MongoDB URI"
}

variable "turf_mongo_uri" {
  type        = string
  sensitive   = true
  default     = "mongodb://mongodb:27017/turf_turf"
  description = "Turf MongoDB URI"
}

variable "booking_mongo_uri" {
  type        = string
  sensitive   = true
  default     = "mongodb://mongodb:27017/turf_booking"
  description = "Booking MongoDB URI"
}
