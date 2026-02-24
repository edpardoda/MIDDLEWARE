# =============================================================================
# TA-3.5: Infraestructura Declarativa con Terraform + Docker Local
# Opción B: Terraform
# =============================================================================

# --- Configuración de Terraform y Provider ---
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# --- Red Docker ---
resource "docker_network" "app_network" {
  name = "terraform_network"
}

# --- Imagen Docker ---
resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}

# --- Contenedor Docker ---
resource "docker_container" "nginx" {
  name  = var.nombre_contenedor
  image = docker_image.nginx.image_id

  ports {
    internal = var.puerto_interno
    external = var.puerto_externo
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  restart = "unless-stopped"
}
