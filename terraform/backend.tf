# Remote State Configuration Template
# To activate remote state locking:
# 1. Create S3 bucket: turf-booking-tfstate-ap-south-1
# 2. Create DynamoDB table: turf-booking-tfstate-locks (Partition key: LockID [String])
# 3. Uncomment the backend block below.

# terraform {
#   backend "s3" {
#     bucket         = "turf-booking-tfstate-ap-south-1"
#     key            = "dev/terraform.tfstate"
#     region         = "ap-south-1"
#     dynamodb_table = "turf-booking-tfstate-locks"
#     encrypt        = true
#   }
# }
