# Reporte de Validación: Modelo de Datos vs Entrevista

Tras revisar el archivo `audio primera entrevista.txt` y el modelo `proyecto titulacion.sql`, se presenta el siguiente análisis de alineación y discrepancias.

## 1. Puntos Alineados (Correctos)

*   **Roles de Usuario:** La tabla `roles` incluye 'estudiante', 'tutor', 'Director', 'Coordinador', 'comite', lo cual coincide con los actores mencionados.
*   **Entregables Finales:** La tabla `Predefensa` incluye campos para `manual_usuario`, `manual_programador` y `articulo_cientifico`, tal como se solicitó.
*   **Prerrequisitos:** Existe una estructura para manejar prerrequisitos (`Prerequisitos` y tabla intermedia), lo cual permite validar Inglés, Vinculación y Prácticas.

## 2. Discrepancias y Áreas de Mejora

### A. Gestión de Propuestas (Crítico)
*   **Requerimiento:** El estudiante presenta *tres* propuestas iniciales. Luego se seleccionan/refinan. Varios profesores (mínimo 4) revisan y retroalimentan.
*   **Modelo Actual:** Existe `Propuesta_tesis`, pero la estructura de revisión (`comite`) solo vincula usuarios a la propuesta sin un campo para dejar **observaciones individuales** o **calificación**.
*   **Recomendación:** Agregar campos de feedback en la tabla `comite` o crear una tabla `Evaluacion_Propuesta` para que cada revisor guarde sus comentarios específicos por propuesta.

### B. Tabla de Avances (Crítico)
*   **Requerimiento:** Seguimiento semanal durante 16 semanas con el tutor/director.
*   **Modelo Actual:** La tabla `Avance` tiene una **Primary Key compuesta excesiva** (`idAvance` + todos los IDs de Coordinador, Tutor, Director, Propuesta). Esto hace que cada registro de avance dependa rígidamente de todos esos actores, dificultando la inserción de datos si uno no está presente o cambia.
*   **Recomendación:** Simplificar la tabla `Avance`. Debe relacionarse principalmente con la `Propuesta_tesis`. El tutor o revisor puede ser un atributo foráneo simple, no parte de la clave primaria compuesta.

### C. Enums Restrictivos
*   **Problema:**
    *   `semestre` solo permite 'Septimo'. Se menciona que el proceso continúa en Octavo.
    *   `are_investigacion` solo permite 'IA'.
*   **Recomendación:** Ampliar los ENUMs o convertirlos en tablas de catálogo si se espera que crezcan dinámicamente. Al menos añadir 'Octavo' y áreas generales.

### D. Cronograma (Faltante)
*   **Requerimiento:** Se menciona la necesidad de "señalar hitos" y subir un "cronograma" para controlar los avances (fecha planificada vs real).
*   **Modelo Actual:** No hay tabla explícita de Cronograma o Hitos, solo `Avance` con fechas.
*   **Recomendación:** Considerar una tabla `Hito` o asegurar que la tabla `Avance` soporte la planificación vs ejecución (fecha_limite vs fecha_entrega). (La tabla `Avance` actual tiene fechas, podría ser suficiente si se gestiona bien, pero falta la definición inicial del plan).

### E. Importación de Datos (Funcionalidad)
*   **Nota:** La directora mencionó migrar datos desde Excel de forma masiva. Esto es un requerimiento funcional para el backend, pero el modelo debe soportar la inserción de estudiantes con campos mínimos autogenerados si no tienen usuario aún.

## Conclusión
El modelo base es funcional pero necesita ajustes estructurales en la tabla `Avance` y en la gestión de `Evaluaciones` del comité para cumplir con el flujo de trabajo real descrito en la entrevista.
