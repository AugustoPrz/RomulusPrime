# Instrucciones para Configurar Supabase

## Paso 1: Obtener las Credenciales de Supabase

1. Vaya a [https://supabase.com](https://supabase.com)
2. Inicie sesión o cree una cuenta
3. Acceda a su proyecto o cree uno nuevo
4. En el panel lateral, vaya a **Settings** (Configuración)
5. Click en **API**
6. Copie los siguientes valores:
   - **Project URL**: Esta es su `VITE_SUPABASE_URL`
   - **anon/public key**: Esta es su `VITE_SUPABASE_ANON_KEY`

## Paso 2: Configurar el Archivo .env

1. Abra el archivo `.env` en la raíz del proyecto
2. Reemplace los valores con sus credenciales:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI...
```

## Paso 3: Verificar la Base de Datos

La migración de la base de datos ya fue aplicada automáticamente. Puede verificarla en Supabase:

1. Vaya a **Table Editor** en el panel de Supabase
2. Debería ver las siguientes tablas:
   - expedientes
   - empleados
   - movimientos
   - tareas
   - eventos_calendario

## Paso 4: Verificar las Políticas de Seguridad (RLS)

1. En Supabase, vaya a **Authentication** > **Policies**
2. Todas las tablas deben tener RLS habilitado
3. Cada tabla debe tener políticas para SELECT, INSERT, UPDATE, DELETE

## Paso 5: Autenticación (Opcional)

Si desea agregar autenticación de usuarios:

1. Vaya a **Authentication** en Supabase
2. Configure los métodos de autenticación deseados
3. Las políticas RLS ya están configuradas para usuarios autenticados

## Paso 6: Iniciar la Aplicación

Una vez configuradas las credenciales:

```bash
npm run dev
```

La aplicación iniciará en `http://localhost:5173`

## Solución de Problemas

### Error: "Invalid Supabase URL"
- Verifique que la URL tenga el formato: `https://xxx.supabase.co`
- No incluya barras finales

### Error: "Invalid API Key"
- Asegúrese de usar la clave **anon/public**, no la clave de servicio
- La clave debe empezar con `eyJhbG...`

### Error: "Failed to fetch"
- Verifique su conexión a Internet
- Asegúrese de que el proyecto de Supabase esté activo
- Revise las políticas RLS en las tablas

### No aparecen datos
- Las tablas están vacías inicialmente
- Comience creando empleados y expedientes
- Verifique que las políticas RLS permitan acceso

## Notas Importantes

1. **Seguridad**: La clave anon/public es segura para uso en el frontend porque RLS protege los datos
2. **Backup**: Haga copias de seguridad regulares de su base de datos
3. **Límites**: Revise los límites de su plan de Supabase
4. **Monitoreo**: Use el panel de Supabase para monitorear uso y errores
