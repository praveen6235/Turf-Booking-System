output "instance_id" {
  value       = aws_instance.k8s_node.id
  description = "The ID of the EC2 node"
}

output "public_ip" {
  value       = aws_instance.k8s_node.public_ip
  description = "Public IP address of the node for SSH and Egress allowlisting"
}
