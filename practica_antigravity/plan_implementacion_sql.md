# Plan de Implementación: Ajustes al Modelo de Datos

Este plan detalla los cambios necesarios en el archivo `proyecto titulacion.sql` para alinear el modelo de datos con los requerimientos extraídos de la entrevista.

## Problemas Identificados
1.  **Tabla `Avance`**: Clave primaria excesivamente compleja y rígida.
2.  **Tabla `comite`**: Falta de campos para feedback individual.
3.  **Enums**: Valores insuficientes (`semestre`, `are_investigacion`).
4.  **Propuestas**: Falta de claridad en el estado de selección (candidata vs aprobada).

## Cambios Propuestos

### 1. Simplificar Tabla `Avance`
*   **Acción**: Modificar `CREATE TABLE Avance`.
*   **Detalle**:
    *   Eliminar la PK compuesta actual.
    *   Usar `idAvance` como PK simple (AUTO_INCREMENT si fuera posible, pero mantendremos `INT NOT NULL`).
    *   Mantener FKs a `Propuesta_tesis`, `tutor`, `Cordinador`, `Director` pero como columnas normales (NULLABLE si alguno no aplica obligatoriamente en cada avance).

### 2. Mejorar Feedback del Comité (`Evaluacion_Propuesta`)
*   **Acción**: Modificar `CREATE TABLE comite` (o renombrarla/crear nueva).
*   **Detalle**:
    *   Agregar campos: `comentarios` (TEXT), `calificacion` (DECIMAL/INT), `fecha_evaluacion` (DATE).
    *   Esto permitirá que cada miembro del comité registre su feedback específico para una propuesta.

### 3. Actualizar Enums y Tablas Catálogo
*   **Acción**: Modificar `Estudiante` y `Propuesta_tesis`.
*   **Detalle**:
    *   `Estudiante.semestre`: Agregar 'Octavo' al ENUM o cambiar a INT.
    *   `Propuesta_tesis.are_investigacion`: Agregar más áreas (ej. 'Seguridad', 'Desarrollo', 'Redes') o cambiar a VARCHAR para permitir flexibilidad.

### 4. Estado de Propuestas
*   **Acción**: Modificar `Propuesta_tesis`.
*   **Detalle**:
    *   Asegurar campo `estado` suficiente (ej. 'En Revision', 'Aprobada', 'Rechazada').
    *   Agregar campo `seleccionada` (TINYINT/BOOLEAN) para marcar cuál de las 3 es la elegida para el Anteproyecto.

## Plan de Verificación

### Verificación Estática
*   Revisar el archivo SQL resultante para asegurar:
    *   Sintaxis correcta de `CREATE TABLE`.
    *   Claves foráneas (Foreign Keys) correctamente definidas y referenciando las tablas ajustadas.
    *   Ausencia de errores de lógica relacional (ej. referencias circulares imposibles).

> [!NOTE]
> Al ser un archivo SQL de diseño (MySQL Workbench), la validación principal será visual y de sintaxis, ya que no ejecutaremos el script en un servidor MySQL activo en este entorno.
