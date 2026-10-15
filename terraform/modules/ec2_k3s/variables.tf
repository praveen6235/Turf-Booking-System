variable "environment" {
  type        = string
  description = "Environment name"
}

variable "instance_type" {
  type        = string
  default     = "t3.micro"
  description = "EC2 instance type (Free-tier eligible)"
}

variable "subnet_id" {
  type        = string
  description = "Public Subnet ID"
}

variable "security_group_id" {
  type        = string
  description = "Security Group ID"
}

variable "iam_instance_profile" {
  type        = string
  default     = null
  description = "IAM instance profile name"
}

variable "ami_id" {
  type        = string
  default     = "ami-0dee22c13ea7a9a67"
  description = "AMI ID for EC2 instance (Ubuntu 22.04 LTS in ap-south-1)"
}
