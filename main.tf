provider "aws" {
  region = "eu-central-1"
}

resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "app_vpc"
  }
}

resource "aws_subnet" "app_subnet" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-central-1a"
  tags = {
    Name = "app_subnet"
  }
}

resource "aws_internet_gateway" "app_gateway" {
  vpc_id = aws_vpc.app_vpc.id
  tags = {
    Name = "app_gateway"
  }
}

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

resource "aws_route_table_association" "my_route_table_association" {
  subnet_id      = aws_subnet.app_subnet.id
  route_table_id = aws_route_table.app_route_table.id
}

resource "aws_security_group" "app_sg" {
  name        = "tic_tac_toe_sg"
  description = "Allow web and db traffic"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
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

resource "aws_instance" "app_instance" {
  ami                         = "ami-0a44aefa5a8df82eb" // Przykładowy AMI, zastąp odpowiednim
  instance_type               = "t2.small"
  subnet_id                   = aws_subnet.app_subnet.id
  security_groups             = [aws_security_group.app_sg.id]
  key_name                    = "deployer-key" # Replace with your SSH key pair name if you plan to SSH into your instance
  associate_public_ip_address = true
  tags = {
    Name = "TicTacToeServer"
  }
}

resource "aws_key_pair" "my_key_pair" {
  key_name   = "deployer-key"
  public_key = file("~/.ssh/chmura.pub")
}
