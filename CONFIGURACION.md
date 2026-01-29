# Sistema de Gestión - Estudio Jurídico Conti

Sistema completo de gestión para estudios jurídicos con gestión de expedientes, tareas, calendario y empleados.

## Características Principales

### 1. Gestión de Expedientes
- Crear y editar expedientes con toda la información del caso
- Campos: Carátula, N° Expediente, CUIT/DNI, Teléfono, Tipo de Demanda, Monto, Prioridad
- Búsqueda y filtrado por nombre, expediente o urgencia
- Vista detallada con movimientos y tareas asociadas

### 2. Sistema de Procuración
- Barra global para registrar fecha y hora de procuración
- Se aplica a todos los expedientes simultáneamente
- Registro de cuándo fue guardada la procuración

### 3. Movimientos con Plazos
- Registrar movimientos procesales con descripción y fecha
- Cálculo automático de plazos en días hábiles
- Creación automática de tarea asociada al vencimiento
- Fecha estimada de vencimiento

### 4. Gestión de Tareas
- Crear tareas generales o asociadas a expedientes
- Estados: Pendiente, Completado, No Realizado
- Prioridades: Normal, Alta, Urgente
- Asignación a empleados
- Filtros por estado y expediente
- Fechas de vencimiento con hora opcional

### 5. Calendario
- Vista mensual de eventos y tareas
- Tipos de eventos: Reunión, Audiencia, Recordatorio, Evento General
- Duración configurable de eventos
- Asignación a empleados
- Asociación opcional a expedientes
- Organización por fecha

### 6. Gestión de Empleados
- Registro de empleados con roles
- Roles: Abogado, Procurador, Secretario, Asistente, Administrativo, Otro
- Información de contacto (email, teléfono)
- Estado activo/inactivo
- Los empleados activos aparecen en listas de asignación

## Configuración Inicial

### 1. Configurar Variables de Entorno

Edite el archivo `.env` en la raíz del proyecto con sus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_aqui
```

### 2. Base de Datos

La base de datos ya está configurada con las siguientes tablas:
- `expedientes`: Almacena información de causas/expedientes
- `empleados`: Lista de personal del estudio
- `movimientos`: Movimientos procesales con plazos
- `tareas`: Tareas y recordatorios
- `eventos_calendario`: Eventos del calendario

Todas las tablas tienen RLS (Row Level Security) habilitado para seguridad.

### 3. Instalación

Las dependencias ya están instaladas. Si necesita reinstalarlas:

```bash
npm install
```

### 4. Modo Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Build de Producción

Para crear una versión de producción:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Estructura del Proyecto

```
src/
├── components/
│   ├── Sidebar.tsx                    # Barra lateral de navegación
│   ├── ProcuracionBar.tsx            # Barra de procuración global
│   ├── ExpedientesView.tsx           # Vista de expedientes
│   ├── TareasView.tsx                # Vista de tareas
│   ├── CalendarioView.tsx            # Vista de calendario
│   ├── EmpleadosView.tsx             # Vista de empleados
│   └── modals/
│       ├── ExpedienteModal.tsx       # Modal crear/editar expediente
│       ├── DetalleExpedienteModal.tsx # Modal detalle expediente
│       ├── MovimientoModal.tsx       # Modal agregar movimiento
│       ├── TareaModal.tsx            # Modal crear tarea
│       ├── EventoCalendarioModal.tsx # Modal crear evento
│       └── EmpleadoModal.tsx         # Modal crear/editar empleado
├── lib/
│   └── supabase.ts                   # Cliente de Supabase
├── types/
│   ├── database.ts                   # Tipos de base de datos
│   └── index.ts                      # Tipos de la aplicación
├── App.tsx                           # Componente principal
├── main.tsx                          # Punto de entrada
└── index.css                         # Estilos globales
```

## Uso del Sistema

### Expedientes

1. **Crear expediente**: Click en "Nuevo Expediente"
2. **Editar expediente**: Click en el ícono de editar en cada expediente
3. **Ver detalle**: Click en el ícono de ojo para ver movimientos y tareas
4. **Buscar**: Use la barra de búsqueda para filtrar por nombre o número
5. **Ordenar**: Seleccione el criterio de ordenamiento

### Procuración

1. Ingrese la fecha y hora en la barra superior
2. Click en "Guardar Procuración"
3. Se aplicará a todos los expedientes del sistema

### Movimientos

1. Dentro del detalle de un expediente, click en "Agregar Movimiento"
2. Complete descripción, fecha y plazo en días
3. El sistema calcula automáticamente la fecha de vencimiento
4. Se crea una tarea asociada automáticamente

### Tareas

1. Click en "Nueva Tarea" desde la vista de Tareas o dentro de un expediente
2. Complete título, descripción, fecha de vencimiento
3. Opcionalmente asocie a un expediente y asigne a un empleado
4. Cambie el estado usando los botones de acción

### Calendario

1. Seleccione mes y año para ver eventos
2. Click en "Nuevo Evento" para crear eventos
3. Click en "Nueva Tarea" para crear tareas desde el calendario
4. Los eventos se organizan por día con códigos de color

### Empleados

1. Click en "Nuevo Empleado"
2. Complete nombre, rol y datos de contacto
3. Los empleados activos aparecen en listas de asignación
4. Desactive empleados en lugar de eliminarlos

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** para desarrollo y build
- **Tailwind CSS** para estilos
- **Supabase** para base de datos y autenticación
- **Lucide React** para iconos

## Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas configuradas para usuarios autenticados
- Variables de entorno para credenciales sensibles
- Validación de datos en frontend y backend

## Soporte

Para problemas o consultas sobre el sistema, contacte al desarrollador.
