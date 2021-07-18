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
