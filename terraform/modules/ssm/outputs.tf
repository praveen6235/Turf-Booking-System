output "jwt_secret_param_name" {
  value       = aws_ssm_parameter.jwt_secret.name
  description = "Name of the JWT Secret SSM Parameter"
}
