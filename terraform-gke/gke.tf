variable "gke_username" {
  default     = ""
  description = "gke-username"
}

variable "gke_password" {
  default     = ""
  description = "gke-password"
}

variable "gke_num_nodes" {
  default     = 1
  description = "number-of-gke-nodes"
}

# GKE cluster
resource "google_container_cluster" "primary" {
  project = "cloud-assignment-3-390202"
  name     = "cloud-assignment-3"
  location = "us-east1"
  remove_default_node_pool = true
  initial_node_count       = 1

  # network    = google_compute_network.vpc.name
  # subnetwork = google_compute_subnetwork.subnet.name
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  project = "cloud-assignment-3-390202"
  name       = "${google_container_cluster.primary.name}-node-pool"
  location   = "us-east1"
  cluster    = google_container_cluster.primary.name
  node_count = var.gke_num_nodes

  node_config {
    machine_type    = "e2-micro"
    disk_type  = "pd-standard"
    disk_size_gb = 10
    image_type      = "COS_CONTAINERD"
    preemptible     = false
   

    labels = {
      env = "cloud-assignment-3-390202"
    }
    # oauth_scopes = [
    # "https://www.googleapis.com/auth/logging.write",
    # "https://www.googleapis.com/auth/monitoring",
    # ]
    # preemptible  = true
    # machine_type = "n1-standard-1"
    # tags         = ["gke-node", "${var.project_id}-gke"]
    # metadata = {
    #   disable-legacy-endpoints = "true"
    # }
  }
}