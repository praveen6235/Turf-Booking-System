terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source              = "./modules/vpc"
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  public_subnet_cidrs = var.public_subnet_cidrs
}

module "security_groups" {
  source            = "./modules/security_groups"
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  allowed_ssh_cidrs = var.allowed_ssh_cidrs
}

module "iam" {
  source      = "./modules/iam"
  environment = var.environment
}

module "ec2_k3s" {
  source               = "./modules/ec2_k3s"
  environment          = var.environment
  instance_type        = var.instance_type
  subnet_id            = module.vpc.public_subnet_ids[0]
  security_group_id    = module.security_groups.security_group_id
  iam_instance_profile = module.iam.instance_profile_name
}

module "ecr" {
  source      = "./modules/ecr"
  environment = var.environment
  services    = var.services
}

module "s3" {
  source            = "./modules/s3"
  environment       = var.environment
  account_id_suffix = var.account_id_suffix
}

module "ssm" {
  source            = "./modules/ssm"
  environment       = var.environment
  jwt_secret        = var.jwt_secret
  auth_mongo_uri    = var.auth_mongo_uri
  turf_mongo_uri    = var.turf_mongo_uri
  booking_mongo_uri = var.booking_mongo_uri
}
