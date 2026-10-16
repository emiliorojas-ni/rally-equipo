# Activar sincronización compartida de TOL

El código está preparado, pero no está activo hasta desplegarlo en una cuenta Google. GitHub Pages sirve los archivos; este servicio almacena el estado en Google Sheets. Los siete usan el mismo enlace privado de equipo sin cuenta de GitHub. No se hacen públicos la hoja ni los archivos de Drive.

## Configuración única por el propietario

1. Abrir https://script.google.com/home/start y crear un proyecto `TOL Sincronización`.
2. Reemplazar el contenido de `Code.gs` por el archivo `backend/Code.gs` de este repositorio.
3. En Configuración del proyecto, activar mostrar `appsscript.json` y reemplazar su contenido por `backend/appsscript.json`. El alcance solicitado es Google Sheets; no Gmail ni archivos de Drive.
4. Guardar. Seleccionar la función `setup` y ejecutarla. Autorizar el acceso de Google Sheets en la cuenta que guardará la hoja. Se crea `TOL Estado compartido`. El registro de ejecución muestra la URL de esa hoja y una clave larga de equipo. No publicar la clave en GitHub ni enviarla en este chat.
5. Implementar → Nueva implementación → Aplicación web. Ejecutar como el propietario; acceso `Cualquier persona`. Esto expone el endpoint, pero el servicio exige la clave de equipo para leer o escribir. No abre la hoja de cálculo al público. Si una política de Workspace impide acceso anónimo, este método no funcionará para la web de GitHub Pages; usar un backend autorizado alternativo.
6. Copiar la URL terminada en `/exec`. En la web TOL → Sincronización, pegar URL y clave. La clave permanece en sessionStorage de la pestaña, no en el código público. El enlace de equipo la contiene en el fragmento, por lo que quienes reciban ese enlace podrán leer y editar todos los registros. Compartir únicamente con el equipo.
7. Pulsar `Cargar plan inicial si falta` una sola vez. Los IDs deterministas impiden duplicar o reemplazar el plan al repetir esa operación.
8. Pulsar `Copiar enlace para el equipo` y compartir ese mismo enlace. Quienes entren a la web sin él no se conectarán al estado compartido y verán un aviso de modo local.
9. Abrir el enlace en dos navegadores, crear una nota y esperar hasta diez segundos en el otro. Probar check individual y confirmar persistencia después de recargar. Este paso verifica el despliegue real; las pruebas automáticas locales no sustituyen autorización y cuotas de Google.

## Datos existentes

Cada integrante que tenga notas o tareas locales debe abrir el acceso compartido en ese mismo navegador y origen, ir a Sincronización y usar `Compartir mis registros locales`. Se conserva el respaldo local. La migración puede generar tareas de planificación duplicadas si varios integrantes migran copias iniciales: migrar primero desde el navegador elegido como base y luego solo las notas necesarias de los demás mediante copias individuales. No hay borrado automático.

## Funcionamiento y límites

Consulta cada diez segundos mientras la web esté visible y no haya un formulario abierto. Guardar confirma la respuesta del servidor; no se muestra éxito si falla. Un cambio de tarea con versión antigua se rechaza para evitar perder trabajo ajeno. Los aportes de personas distintas se fusionan dentro de un bloqueo de servidor. El nombre declarado no verifica identidad; cualquiera con el enlace del equipo puede elegirlo. Dos ediciones del aporte de una misma persona conservan la última guardada.

No es un sistema para información sensible. Apps Script tiene cuotas y puede responder con retraso. Un fallo deja visibles los datos de caché y el aviso, pero no confirma guardados. Adjuntar archivos a través de sus enlaces de Drive; el servicio solo guarda metadatos y texto. Se necesitan permisos de Drive para ver las vistas previas.

Para revocar el enlace, cambiar `TEAM_KEY` en las propiedades del script y generar un nuevo acceso para el equipo. La clave nunca se incluye en el repositorio. La función `setup` conserva la clave y hoja existentes si se vuelve a ejecutar.

## Proyecto preparado en esta sesión
El editor con el código ya guardado está en https://script.google.com/home/projects/1kx1SiZ571ci5n6emNi5GFViGokHNOFdh0uVOVep13M50OtTO5OptGFVZ/edit . Google pidió autorización al ejecutar setup. El navegador integrado no abrió la ventana de consentimiento. La autorización y el despliegue todavía están pendientes; no hay endpoint activo configurado en la web.

