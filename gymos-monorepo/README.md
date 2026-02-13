# GymOS - Sistema de Gestión para Gimnasios 🏋️‍♂️

GymOS es una plataforma SaaS moderna diseñada para la administración integral de gimnasios y centros deportivos. Construido con tecnología de punta, ofrece una experiencia de usuario premium y herramientas robustas para administradores globales y locales.

## 🚀 Tecnologías

Este proyecto es un **Monorepo** basado en [Turborepo](https://turbo.build/).

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Estado Global**: [Zustand](https://docs.pmnd.rs/zustand)
- **Formularios**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Tablas**: [TanStack Table](https://tanstack.com/table/v8)

---

## 🛠 Instalación y Uso

### Prerrequisitos

- Node.js (v18+)
- pnpm (recomendado)

### Pasos

1. **Instalar dependencias**:

   ```bash
   pnpm install
   ```

2. **Ejecutar en desarrollo**:

   ```bash
   pnpm dev
   ```

   El sitio estará disponible en `http://localhost:3000`.

3. **Construir para producción**:
   ```bash
   pnpm build
   ```

---

## 🌟 Funcionalidades Implementadas

### 🔐 Autenticación y Seguridad

- **Sistema de Roles (RBAC)**: Soporte para `AdminGlobal`, `AdminTenant`, `Trainer`, `Staff`, `Member`.
- **Login Mock**: Sistema de autenticación simulado para desarrollo rápido.
- **Protección de Rutas**: Redirección automática a login si no hay sesión.
- **Cambiador de Roles (Dev Tool)**: Herramienta en el sidebar para probar diferentes roles al instante.
- **Credenciales por defecto**:
  - Contraseña Maestra: `123456`
  - Usuario Admin Global: `admin@gymos.com`
  - Usuario Admin Sede: `admintenant@gymos.com`

### 🏢 Admin Global (Super Admin)

- **Gestión de Sedes (Tenants)**:
  - Listado completo de gimnasios registrados.
  - Creación y edición de sedes con validación.
  - Gestión de planes de suscripción (Enterprise, Pro, Standard).
- **Features Globales**:
  - Catálogo de funcionalidades del sistema.
  - Toggles para activar/desactivar features globalmente.

### 🏋️‍♂️ Admin Tenant (Administrador de Sede)

- **Dashboard Operativo**: Métricas clave en tiempo real.
- **Gestión de Miembros**:
  - Base de datos de clientes con búsqueda y filtros.
  - Perfiles detallados con avatares.
  - Estados de membresía (Activo, Inactivo, Pendiente).
- **Gestión de Staff**:
  - Administración de entrenadores y personal.
  - Asignación de especialidades y horarios.
- **Clases y Agenda**:
  - **Definición de Clases**: Configuración de tipos de actividades (Yoga, CrossFit, Spinning), duración y capacidad.
  - **Agenda Semanal**: Calendario visual interactivo para programar sesiones con instructores asignados.

---

## 📂 Estructura del Proyecto

```
gymos-monorepo/
├── apps/
│   └── web/              # Aplicación Frontend Next.js
│       ├── src/app/      # Rutas (App Router)
│       │   ├── (main)/   # Layout principal con Sidebar
│       │   └── auth/     # Layout de autenticación
│       ├── src/components/ # Componentes UI compartidos
│       └── src/lib/      # Lógica de negocio y stores
├── packages/
│   └── contracts/        # Interfaces y tipos compartidos (TypeScript)
└── README.md             # Esta documentación
```
