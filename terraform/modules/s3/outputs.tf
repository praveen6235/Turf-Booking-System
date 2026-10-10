output "bucket_id" {
  value       = aws_s3_bucket.assets.id
  description = "The ID/Name of the S3 bucket"
}

output "bucket_arn" {
  value       = aws_s3_bucket.assets.arn
  description = "The ARN of the S3 bucket"
}
