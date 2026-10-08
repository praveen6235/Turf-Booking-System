output "security_group_id" {
  value       = aws_security_group.web_k8s_sg.id
  description = "The ID of the main security group"
}
