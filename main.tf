terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    random = {
      source = "hashicorp/random"
    }
  }

  backend "remote" {
    organization = "geovannimp-org"

    workspaces {
      name = "ecommerce-crud-test-gh-actions"
    }
  }
}

provider "aws" {
  region = "us-west-1"
}

resource "aws_s3_bucket" "b" {
  bucket = "ecommerce-crud-geovannimp-bucket-2"
  acl    = "private"
}
