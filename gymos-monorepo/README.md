# GymOS - Sistema de Gestión para Gimnasios

**GymOS** es una plataforma completa de gestión para gimnasios que soporta múltiples sedes (multi-tenant) con control de acceso basado en roles y funcionalidades diseñadas para administradores, entrenadores, staff y miembros.

## Características Principales

### 🏢 Arquitectura Multi-Tenant

- Gestión centralizada de múltiples gimnasios desde una sola plataforma
- Aislamiento de datos por gimnasio (tenant)
- Panel de administración global para supervisión de todos los gimnasios

### 👥 Control de Acceso Basado en Roles

- **AdminGlobal**: Gestión completa de la plataforma y todos los gimnasios
- **AdminTenant**: Administración del gimnasio específico
- **Trainer**: Gestión de rutinas, clases y miembros asignados
- **Staff**: Control de acceso y asistencia
- **Member**: Acceso personal a rutinas, clases y progreso

### 📊 Módulos Implementados

#### Gestión de Miembros

- CRUD completo de miembros
- Estados: Activo, Inactivo, Pendiente
- Planes de membresía: Basic, Premium, VIP
- Historial de visitas y asistencia

#### Gestión de Ejercicios

- Catálogo de ejercicios personalizable
- Clasificación por grupos musculares
- Descripciones y notas técnicas
- Vinculación con rutinas

#### Gestión de Rutinas

- Creador de rutinas con drag & drop
- Asignación de ejercicios con sets, reps y descansos
- Niveles de dificultad: Principiante, Intermedio, Avanzado
- Asignación de rutinas a miembros
- Búsqueda y filtrado de ejercicios

#### Gestión de Clases

- Programación de sesiones
- Control de capacidad
- Asignación de entrenadores
- Reservas de miembros

#### Control de Acceso

- Check-in por QR, DNI o manual
- Validación de estado de membresía
- Registro de asistencias
- Control de morosos

#### Finanzas

- Registro de pagos
- Estados: Pagado, Pendiente, Vencido, Fallido
- Métodos de pago: Efectivo, Transferencia, Tarjeta, MercadoPago
- Dashboard financiero con métricas

#### Gestión de Personal

- Registro de entrenadores y staff
- Especialidades y certificaciones
- Horarios y disponibilidad
- Biografías profesionales

#### Planes de Suscripción

- Planes configurables (Basic, Pro, Enterprise)
- Límites de staff y miembros
- Funcionalidades incluidas
- Precios y monedas

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

# Corregir automáticamente
pnpm check:fix
```

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js (App Router)
│   ├── (auth)/            # Páginas de autenticación
│   └── (main)/            # Páginas principales
│       └── dashboard/     # Dashboards por rol y módulos
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   └── ui/               # Componentes UI de Shadcn
├── config/               # Configuración (navegación, rutas)
├── contracts/            # Interfaces y tipos TypeScript
├── data/                 # Datos mock para desarrollo
├── lib/                  # Utilidades y helpers
└── hooks/                # Custom React hooks
```

## Próximas Funcionalidades

- [ ] Integración con APIs reales
- [ ] Sistema de notificaciones
- [ ] Análisis y reportes avanzados
- [ ] App móvil (React Native)
- [ ] Integración con pasarelas de pago
- [ ] Sistema de reservas online
- [ ] Gestión de inventario
- [ ] Portal público del gimnasio

## Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

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
