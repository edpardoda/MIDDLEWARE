# =============================================================================
# Salidas del despliegue
# =============================================================================

output "container_id" {
  description = "ID del contenedor Docker"
  value       = docker_container.nginx.id
}

output "container_name" {
  description = "Nombre del contenedor"
  value       = docker_container.nginx.name
}

output "access_url" {
  description = "URL de acceso a la aplicación"
  value       = "http://localhost:${var.puerto_externo}"
}
