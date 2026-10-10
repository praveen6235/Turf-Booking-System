terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "turf-booking-tfstate-prod-2026"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "turf-booking-tflocks-prod"
  }
}

provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source      = "../../modules/vpc"
  environment = "prod"
}

module "eks" {
  source       = "../../modules/eks"
  cluster_name = "turf-eks-prod"
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.private_subnets
  use_spot     = false
}

module "ecr" {
  source      = "../../modules/ecr"
  environment = "prod"
}

module "secrets" {
  source      = "../../modules/secrets"
  environment = "prod"
}

output "kubeconfig_cmd" {
  value = "aws eks update-kubeconfig --region us-east-1 --name ${module.eks.cluster_name}"
}

output "ecr_repository_urls" {
  value = module.ecr.repository_urls
}

output "secret_arns" {
  value = module.secrets.secret_arns
}
