output "instance_profile_name" {
  value       = aws_iam_instance_profile.profile.name
  description = "Name of the instance profile"
}

output "role_arn" {
  value       = aws_iam_role.ec2_role.arn
  description = "ARN of the IAM role"
}
