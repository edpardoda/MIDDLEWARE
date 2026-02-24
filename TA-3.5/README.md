# TA-3.5 — Infraestructura Declarativa con Terraform

## Opción B: Terraform con Docker Local

### Descripción

En esta actividad elegí la **Opción B: Terraform** para demostrar el concepto de infraestructura declarativa. Utilicé Terraform junto con el provider de Docker para provisionar un contenedor Nginx de forma local, aplicando buenas prácticas de parametrización y gestión de configuración.

### ¿Qué hice?

1. **Creé el proyecto Terraform** con la siguiente estructura:

```
TA-3.5/
├── main.tf            # Configuración principal
├── variables.tf       # Variables de entrada
├── terraform.tfvars   # Valores de las variables
└── outputs.tf         # Salidas del despliegue
```

2. **En `main.tf`** declaré:
   - El **provider** `kreuzwerker/docker` para gestionar recursos Docker locales.
   - Una **red Docker** (`terraform_network`) para la comunicación del contenedor.
   - Una **imagen Docker** de `nginx:latest`.
   - Un **contenedor Docker** con el nombre y puertos parametrizados mediante variables.

3. **En `variables.tf`** definí tres variables de entrada para demostrar la parametrización:
   - `nombre_contenedor` — Nombre del contenedor Docker.
   - `puerto_interno` — Puerto interno del contenedor (80).
   - `puerto_externo` — Puerto expuesto en el host (8080).

4. **En `terraform.tfvars`** asigné los valores a cada variable.

5. **En `outputs.tf`** definí las salidas del despliegue: ID del contenedor, nombre y URL de acceso.

### Comandos ejecutados

```bash
# 1. Inicialicé el proyecto (descarga del provider)
terraform init

# 2. Validé la sintaxis del código HCL
terraform validate
# Resultado: Success! The configuration is valid.

# 3. Generé el plan de ejecución
terraform plan
# Resultado: Plan: 3 to add, 0 to change, 0 to destroy

# 4. Apliqué la infraestructura
terraform apply -auto-approve
# Resultado: Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

# 5. Verifiqué que el contenedor esté corriendo
curl localhost:8080
# Resultado: Página "Welcome to nginx!" respondiendo correctamente
```

### Resultados

| Comando | Estado |
|---|---|
| `terraform init` | ✅ Provider `kreuzwerker/docker v3.6.2` instalado |
| `terraform validate` | ✅ Configuración válida |
| `terraform plan` | ✅ 3 recursos planificados |
| `terraform apply` | ✅ Infraestructura desplegada |
| `curl localhost:8080` | ✅ Nginx respondiendo |

### Justificación

Elegí Terraform con Docker local porque me permite demostrar el concepto de **infraestructura como código (IaC)** sin depender de servicios en la nube. Docker como provider es ideal para un entorno de desarrollo local, ya que permite crear, gestionar y destruir contenedores de forma declarativa. La parametrización con variables (`variables.tf` y `terraform.tfvars`) demuestra cómo se puede reutilizar la misma configuración con diferentes valores según el entorno (desarrollo, staging, producción), lo cual es una buena práctica fundamental de IaC.

### Tecnologías utilizadas

- **Terraform** — Herramienta de infraestructura como código
- **Docker** — Plataforma de contenedores
- **Nginx** — Servidor web utilizado como recurso de cómputo
- **HCL** — HashiCorp Configuration Language
