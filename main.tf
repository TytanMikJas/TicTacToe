# Define the AWS provider and specify the region as us-east-1
provider "aws" {
  region = "us-east-1"
}

# Create a VPC with the specified CIDR block, enable DNS support and hostnames, and assign tags
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "app_vpc"
  }
}

# Create an internet gateway and attach it to the VPC, and assign tags
resource "aws_internet_gateway" "app_gateway" {
  vpc_id = aws_vpc.app_vpc.id
  tags = {
    Name = "app_gateway"
  }
}

# Create a subnet within the VPC, specify its CIDR block, availability zone, and assign tags
resource "aws_subnet" "app_subnet" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "app_subnet"
  }
}



# Create a route table within the VPC, specify a default route to the internet gateway, and assign tags
resource "aws_route_table" "app_route_table" {
  vpc_id = aws_vpc.app_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app_gateway.id
  }
  tags = {
    Name = "app_route_table"
  }
}

# Associate the subnet with the route table
resource "aws_route_table_association" "my_route_table_association" {
  subnet_id      = aws_subnet.app_subnet.id
  route_table_id = aws_route_table.app_route_table.id
}

# Create a security group to control inbound and outbound traffic, and assign tags
resource "aws_security_group" "app_sg" {
  name        = "app_sg"
  description = "Allow web and db traffic"
  vpc_id      = aws_vpc.app_vpc.id

  # Allow SSH, HTTP, and custom ports 3000 and 5000 inbound traffic
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app_sg"
  }
}

resource "aws_elastic_beanstalk_application" "app_eba" {
  name        = "app_eba"
  description = "Chmura app"
}

resource "aws_elastic_beanstalk_environment" "app_ebe" {
  name                = "appebeenv"
  application         = aws_elastic_beanstalk_application.app_eba.name
  solution_stack_name = "64bit Amazon Linux 2 v3.3.0 running ECS"
  version_label       = aws_elastic_beanstalk_application_version.app_v.name
  cname_prefix        = "tytan-chmura"

  # Set the IAM instance profile for EC2 instances in the environment
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "LabInstanceProfile"
  }

  # Specify the ID of the VPC where the Elastic Beanstalk environment will be launched
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.app_vpc.id
  }

  # Assign the subnet IDs for the instances in the Elastic Beanstalk environment
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = aws_subnet.app_subnet.id
  }

  # Enable or disable public IP assignment for instances (enabled here)
  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }

  # Define the environment type as a single instance for simplicity and cost-saving
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  # Set the service role that Elastic Beanstalk uses to create AWS resources for the environment
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "arn:aws:iam::612310298487:role/LabRole"
  }

  # Specify the architecture type supported by the EC2 instances in the environment
  setting {
    namespace = "aws:ec2:instances"
    name      = "SupportedArchitectures"
    value     = "x86_64"
  }

  # Define the instance type to be used for the EC2 instances in the environment
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.small"
  }

  # Associate the created security group with the EC2 instances in the environment
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.app_sg.id
  }
}

# Create a version for the Elastic Beanstalk application
resource "aws_elastic_beanstalk_application_version" "app_v" {
  name        = "app_v1"
  application = aws_elastic_beanstalk_application.app_eba.name
  description = "application version created by terraform"
  bucket      = aws_s3_bucket.app_bucket.bucket
  key         = aws_s3_object.app_s3o.key
}

# Create an S3 bucket to store application versions
resource "aws_s3_bucket" "app_bucket" {
  bucket = "appbuckettytan"
}

# Create an S3 object for deployment
resource "aws_s3_object" "app_s3o" {
  bucket = aws_s3_bucket.app_bucket.bucket
  key    = "dep.zip"
  source = "dep.zip"
}

# Output the URL of the Elastic Beanstalk application
output "elastic_beanstalk_app_url" {
  value = "http://${aws_elastic_beanstalk_environment.app_ebe.cname}:5000"
}