output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC"
}

output "ec2_public_ip" {
  value       = module.ec2_k3s.public_ip
  description = "Public IP address of the EC2 node (for SSH and MongoDB Atlas Egress allowlisting)"
}

output "ecr_repository_urls" {
  value       = module.ecr.repository_urls
  description = "ECR Repository URLs for microservice Docker images"
}

output "s3_assets_bucket" {
  value       = module.s3.bucket_id
  description = "S3 Assets Bucket Name"
}

output "estimated_monthly_cost" {
  value       = "$0.00 (AWS Free Tier) or ~$15.00/month (t3.small EC2 + S3/ECR standard usage)"
  description = "Estimated Monthly Running Cost in ap-south-1"
}
