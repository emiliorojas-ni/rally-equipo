# Rally Equipo web

Web estática para coordinar el Rally Latinoamericano 2026. Publicada en https://emiliorojas-ni.github.io/rally-equipo/ .

## Ejecutar

Con Node.js instalado: `npm start`, luego abrir http://127.0.0.1:4173 . Sin dependencias de instalación. Pruebas: `npm test`.

## Funciones

Contador al inicio del 16 de octubre de 2026 a las 08:00 (UTC−06:00) y cierre después de 28 horas, el 17 de octubre a las 12:00. Tablero con edición y arrastre, filtros, responsables, revisor, deadlines en hora de Nicaragua, bloqueos y evidencia. Registro de ideas con procedencia, decisiones, enlaces y entregas. Respaldo JSON, importación aditiva y resumen para IA.

## Datos y colaboración

En localhost funciona en modo local. En la publicación usa GitHub compartido por defecto. Los datos persisten en localStorage de ese navegador y origen. No se sincronizan entre personas. Las pestañas del mismo navegador reciben cambios. Exportar respaldos antes de cambiar dispositivo u origen. El servidor escucha solo en localhost.

Está implementado un adaptador opcional a GitHub Issues, con repositorio propuesto `emiliorojas-ni/rally-equipo` en app.js. El repositorio está creado y contiene los registros iniciales compartidos. La lectura usa la API pública; crear o editar requiere un colaborador con token específico con acceso al repositorio y permiso Issues de escritura. El token se guarda solo en memoria y se borra al recargar. No se incluye ninguna credencial en el proyecto. No confundir el acceso al repositorio con el acceso a los archivos de Drive.

La publicación de código en Pages no convierte el almacenamiento local en colaborativo. Para colaboración activar y probar el repositorio y asignar colaboradores. Los registros de Issues del repositorio público serán públicos. No poner documentos privados ni datos sensibles en esos registros. La API aplica límites de solicitudes; usar Actualizar cuando sea necesario. La revisión de updated_at detecta cambios previos, pero no ofrece bloqueo atómico frente a dos escrituras simultáneas. Evitar editar el mismo registro a la vez; el historial de Issues permite revisar versiones.

No hay migración automática de datos locales a Issues. Al desplegar, se debe decidir y ejecutar la migración de registros aprobados; exportar primero el respaldo. Los nombres del Gantt son sugeridos y editables.

## Despliegue pendiente de instrucción del propietario

1. Confirmar cuenta y nombre de repositorio.
2. Crear repositorio solo con el contenido de esta carpeta; no subir documentos de la carpeta superior.
3. Subir a main y habilitar Pages desde la raíz de main. `.nojekyll` evita procesamiento Jekyll.
4. Verificar URL, contador, acceso móvil y flujo colaborativo con dos usuarios autorizados.
5. Actualizar repositorio configurado si cambia el destino.

Los enlaces de la interfaz apuntan al repositorio propuesto y solo funcionarán cuando sea creado. Drive y documentos se vinculan mediante URLs; no hay sincronización de contenido ni OAuth de Drive.

## Notitas y recursos
Las ideas nuevas se crean sin GitHub como notas personales del navegador. En el sitio publicado usan almacenamiento local separado y no se sincronizan entre integrantes. Exportar respaldo desde Inicio. Los documentos tienen categoría Documento o Contenido multimedia; los registros antiguos se clasifican por URL cuando no tienen categoría.


## Team of Legends
TOL incluye 20 tareas colectivas y por módulos con asignaciones sugeridas del Gantt, horarios relativos en su descripción y fechas límite. Los participantes son editables. Cada tarea admite un aporte por persona, texto, enlace de evidencia y check de su parte; esto no cierra automáticamente la tarea. Los aportes compartidos requieren acceso de escritura GitHub. La selección de nombre no verifica identidad. Evitar editar simultáneamente el mismo registro; el control de versión no es atómico. Mantener descansos escalonados.


## Separación de integraciones
El trabajo diario usa almacenamiento local sin GitHub, también en el sitio publicado. GitHub queda como pestaña de enlaces técnicos; los registros antiguos siguen en Issues. Drive permite vincular carpetas de documentos y multimedia; aún no hay OAuth, búsqueda, subida ni sincronización mediante Google API. Los permisos se administran en Drive. Los accesos de carpetas se guardan por navegador.


## Vistas de Drive
Las carpetas de documentos y multimedia del equipo están preconfiguradas. Se muestran con embeddedfolderview y se recargan cada 60 segundos mientras la sección está visible, o mediante el botón de recarga. Los enlaces individuales de Drive ofrecen preview en el detalle. No hay listado mediante API ni copia de archivos al repositorio; el contenido y sus permisos los sirve Google. La incrustación puede requerir sesión y estar limitada por cookies o políticas de Google. Las subidas se hacen en Drive y el procesamiento de miniaturas depende de Google. Pruebas de interfaz con respuestas simuladas y lectura de las carpetas reales verificadas: documentos vacía y multimedia con una imagen al momento de comprobar.

