# Documento de Definición del Sistema: Gestión de Trabajos de Titulación

## 1. Introducción
Este documento define los requerimientos y el flujo de trabajo del sistema de gestión de trabajos de titulación para la carrera de Ingeniería y Tecnología de la Información, basado en la entrevista con la Directora de Carrera (Lorena Conte).

## 2. Actores y Roles
*   **Estudiante:** Inicia el proceso, sube propuestas, anteproyectos y avances.
*   **Director/a de Carrera:** Administra todo el proceso, valida requisitos (inglés, prácticas), asigna tutores y tribunales.
*   **Tutor:** Docente experto asignado para guiar al estudiante durante el desarrollo.
*   **Comité/Tribunal:** Grupo de docentes (mínimo 4) que revisan propuestas, anteproyectos y defensas.
*   **Coordinador:** Apoya en la revisión de anteproyectos y validaciones administrativas.

## 3. Flujo del Proceso (Workflow)

### Fase 1: Pre-selección y Propuestas (Séptimo Semestre)
1.  **Validación Automática:** El sistema verifica requisitos previos (Inglés, Prácticas Laborales, Vinculación). Si no cumple, el estudiante no puede iniciar.
2.  **Envío de Propuestas:** El estudiante envía **3 propuestas** de temas (Título, Objetivo, Problemática, Alcance).
3.  **Revisión Colaborativa:** El tribunal (4+ docentes) revisa las propuestas.
4.  **Retroalimentación:** Cada revisor deja observaciones (ej. "Mejorar alcance", "Usar IA"). El sistema consolida y muestra esto al estudiante.
5.  **Selección:** Se aprueba una propuesta o se solicita fusión/mejora.

### Fase 2: Anteproyecto
1.  **Elaboración:** El estudiante desarrolla el Anteproyecto formal basado en la propuesta aprobada.
2.  **Generación de Documento:** El sistema permite llenar los campos y exportar el PDF, o subir el documento final.
3.  **Aprobación:** Revisión por Director y Coordinador. Tras el "Visto Bueno", el estudiante pasa a desarrollo.

### Fase 3: Desarrollo de Tesis (Octavo Semestre - 16 semanas)
1.  **Asignación de Tutor:** El Director asigna un tutor experto en el área (ej. Ciberseguridad, Desarrollo).
2.  **Cronograma de Hitos:** Se establece un calendario de entregas.
3.  **Seguimiento Semanal:**
    *   Estudiante sube avances semanales.
    *   Tutor revisa y retroalimenta.
    *   **Alerta de Inactividad:** Si el tutor o estudiante no registran actividad, el sistema notifica al Director y envía alertas.
4.  **Generación de Entregables:** Artículos científicos, Manual de Usuario, Manual de Programador (ya no tesis extensa tradicional).

### Fase 4: Defensa
1.  **Pre-defensa (Semana 15):** Defensa ante el tribunal. Se valida el 100% del desarrollo y documentación.
2.  **Correcciones:** Semana 16 para ajustes finales.
3.  **Defensa Pública:** Acto formal de graduación.

## 4. Requerimientos Funcionales Clave

### Gestión de Usuarios y Datos
*   **Carga Masiva:** Capacidad de importar estudiantes desde Excel (migración de datos existentes).
*   **Checklist de Estudiante:** El estudiante marca sus hitos cumplidos (Inglés, Prácticas) y el Director valida/confirma.

### Notificaciones y Control
*   **Semaforización:** Indicadores visuales (Verde/Rojo) para el estado del estudiante.
*   **Alertas Automáticas:** Correos/notificaciones si se vencen fechas de entrega o no hay actividad en la plataforma.

## 5. Requerimientos No Funcionales
*   **Plataforma Web:** Accesible para docentes y estudiantes.
*   **Seguridad:** Roles y permisos claramente definidos.
*   **Usabilidad:** Interfaz limpia para la revisión rápida de propuestas (evitar burocracia de descargar/subir archivos constantemente si se puede revisar en línea).

## 6. Modelo de Datos (Recomendaciones)
Basado en el análisis técnico, el sistema requiere:
*   Tabla `Evaluacion` flexible para capturar feedback de múltiples revisores por propuesta.
*   Tabla `Avance` simplificada vinculada a la `Propuesta` y al `Cronograma`.
*   Catálogos editables para `Semestres` y `Áreas de Investigación`.
