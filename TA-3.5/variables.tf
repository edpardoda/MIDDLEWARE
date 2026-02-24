# =============================================================================
# Variables de entrada para parametrización
# =============================================================================

variable "nombre_contenedor" {
  description = "Nombre del contenedor Docker"
  type        = string
  default     = "nginx-terraform"
}

variable "puerto_interno" {
  description = "Puerto interno del contenedor"
  type        = number
  default     = 80
}

variable "puerto_externo" {
  description = "Puerto expuesto en el host"
  type        = number
  default     = 8080
}
