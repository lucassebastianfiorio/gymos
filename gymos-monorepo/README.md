# GymOS - Sistema de Gestión para Gimnasios

**GymOS** es una plataforma completa de gestión para gimnasios que soporta múltiples sedes (multi-tenant) con control de acceso basado en roles y funcionalidades diseñadas para administradores, entrenadores, staff y miembros.

## Características Principales

### 🏢 Arquitectura Multi-Tenant

- Gestión centralizada de múltiples gimnasios desde una sola plataforma
- Aislamiento de datos por gimnasio (tenant)
- **Feature Flags**: Activación/desactivación de módulos (ej. Pagos, Clases) por gimnasio
- Panel de administración global para supervisión de todos los gimnasios
- **AI-Powered Insights**: Análisis predictivo de crecimiento y retención (Beta)

### 👥 Control de Acceso Basado en Roles

- **AdminGlobal**: Gestión completa de la plataforma, tenants y feature flags
- **AdminTenant**: Administración total de su gimnasio, configuración financiera y sucursales
- **Trainer**: Gestión de rutinas, clases y seguimiento de miembros
- **Staff**: Registro de pagos, control de acceso y gestión de miembros
- **Member**: Portal personal para ver rutinas, historial de pagos y progreso

### 📊 Módulos Implementados

#### 📍 Gestión de Sucursales

- **Multi-sede**: Creación y gestión de múltiples ubicaciones físicas
- **Contexto de Trabajo**: Selector de sucursal persistente en el dashboard principal
- **Asignación de Staff**: Vinculación de personal a sedes específicas
- **Dashboard Dinámico**: Filtrado automático de métricas (Miembros, Clases, Ingresos) y listas de actividad según la sede seleccionada
- **Búsqueda Global**: Acceso rápido a cualquier módulo o sección mediante `⌘J`

#### 👥 Gestión de Miembros

- **Perfil Completo**: Datos personales, DNI, datos de contacto y sucursales habilitadas
- **Dashboard Interactivo**:
  - **Asistencia**: Seguimiento de racha y conteo mensual de visitas
  - **Timer Programable**: Cronómetro y Cuenta atrás con alarmas sonoras configurables
  - **Entrenamiento**: Visualización de rutinas cargadas por el entrenador (lectura protegida)
  - **Progreso**: Gráficos de frecuencia semanal y asistencia a clases
  - **Clases**: Calendario de clases disponibles con cupos en tiempo real
  - **Notificaciones**: Avisos de vencimientos y mensajes directos del gimnasio
  - **Documentación**: Acceso centralizado a reglamentos y aptos físicos
- **Estados**: Activo, Inactivo, Pendiente, Suspendido

#### 💰 Finanzas y Pagos

- **Registro de Pagos**: Interfaz para registrar transacciones por miembro con integración de sucursal
- **Pagos Parciales**: Soporte para cobrar señas o cuotas parciales, con seguimiento de saldo pendiente
- **Alertas Inteligentes**: Notificaciones de pagos vencidos y próximos vencimientos configurables
- **Auto-scroll**: Navegación fluida entre alertas y transacciones detalladas
- **Control de Mora**: Detección automática de pagos vencidos con intereses configurables
- **Analytics**: Gráficos interactivos de ingresos totales y distribución por sucursal
- **Dashboards**: Vistas comparativas del rendimiento financiero entre sedes
- **Configuración Financiera**: Ajuste de intereses diarios, días de gracia, multas fijas y avisos previos

#### 💵 Caja (Cash Register)

- **Control Diario**: Apertura y cierre de caja por sucursal y turno
- **Movimientos**: Registro detallado de Ingresos, Egresos y Gastos operativos
- **Retiros de Administración**: Flujo específico para retiro de fondos por parte de gerencia
- **Balance en Tiempo Real**: Cálculo automático de saldo esperado vs contado
- **Responsables**: Trazabilidad completa de quién realizó cada movimiento

#### 📧 Mensajería y Notificaciones (NUEVO)

- **Mensajería Multi-Rol**: Sistema de comunicación interna con segmentación por rol (Admin, Staff, Miembro)
- **Targeting Granular**: Posibilidad de enviar mensajes a todos los usuarios, a un gimnasio específico, a un rol determinado o a una persona puntual
- **Inbox Centralizado**: Bandeja de entrada integrada en los dashboards con prioridades (Baja, Media, Alta)
- **Acciones Rápidas**: Menú de creación rápida dinámico en el sidebar según el perfil logueado

#### 💪 Gestión de Rutinas y Ejercicios

- **Creador de Rutinas**: Interface drag & drop para armar planes de entrenamiento
- **Catálogo de Ejercicios**: Base de datos categorizada por grupo muscular
- **Asignación**: Vinculación directa de rutinas a miembros o planes

#### 📅 Gestión de Clases

- **Calendario Semanal**: Vista visual de todas las clases programadas
- **Programación Recurrente**: Configuración de horarios, cupos y entrenadores
- **Reservas**: Sistema de inscripción para miembros

#### 👥 Gestión de Personal

- **Roles y Permisos**: Perfiles para Entrenadores, Staff y Nutricionistas
- **Gestión de Disponibilidad**: Horarios de trabajo y sedes asignadas
- **Especialidades**: Registro de certificaciones y áreas de expertise

#### 📋 Planes de Suscripción

- **Creador de Planes**: Configuración de duración, precio y beneficios
- **Features**: Toggles para "Acceso Multisede", "Clases Incluidas", etc.
- **Ciclo de Vida**: Control de vigencia y renovaciones

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: Shadcn UI
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Estado**: Zustand
- **Tablas**: TanStack Table
- **Drag & Drop**: DND Kit
- **Íconos**: Lucide React
- **Tooling**: Biome, Husky

## Comenzar

### Requisitos Previos

- Node.js 18+
- pnpm (recomendado) o npm

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/lucassebastianfiorio/gymos.git
   cd gymos/gymos-monorepo
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Usuarios de Prueba

Para probar diferentes roles, utiliza estas credenciales (contraseña: `123456`):

- **Admin Global**: `admin@gymos.com`
- **Admin Tenant**: `admintenant@gymos.com`
- **Entrenador**: `trainer@gymos.com`
- **Staff**: `staff@gymos.com`
- **Miembro**: `member@gymos.com`

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Iniciar en producción
pnpm start

# Formatear código
pnpm format

# Verificar código (lint + format)
pnpm check
```

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js (App Router)
│   ├── (auth)/            # Páginas de autenticación
│   └── (main)/            # Páginas principales
│       ├── dashboard/     # Dashboards por rol y módulos
│       │   ├── features/  # Feature Flags (SuperAdmin)
│       │   ├── finance/   # Configuración financiera
│       │   ├── plans/     # Gestión de planes
│       │   └── ...
├── components/            # Componentes reutilizables
├── config/               # Configuración (navegación, rutas)
├── contracts/            # Interfaces y tipos TypeScript
├── data/                 # Datos mock para desarrollo
├── lib/                  # Utilidades y helpers
└── hooks/                # Custom React hooks
```

## Próximas Funcionalidades

- [ ] Integración con MercadoPago Real
- [ ] Sistema de Notificaciones (Email/WhatsApp)
- [ ] App Móvil para Miembros
- [ ] Reportes Exportables (PDF/Excel)
- [ ] Portal Público de Inscripción

## Contribuir

1. Abre un issue describiendo el cambio propuesto
2. Crea un fork del repositorio
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Lucas Sebastián Fiorio - [@lucassebastianfiorio](https://github.com/lucassebastianfiorio)

Link del Proyecto: [https://github.com/lucassebastianfiorio/gymos](https://github.com/lucassebastianfiorio/gymos)

---

**Desarrollado con ❤️ para la gestión moderna de gimnasios**
