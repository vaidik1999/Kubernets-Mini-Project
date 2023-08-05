output "region" {
  value       = "us-east1"
  description = "gcloud-region"
}

output "project_id" {
  value       = "cloud-assignment-3-390202"
  description = "gcloud-project-id"
}

output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "gke-cluster-name"
}

output "kubernetes_cluster_host" {
  value       = google_container_cluster.primary.endpoint
  description = "gke-cluster-host"
}