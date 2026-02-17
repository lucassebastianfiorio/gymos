"use client"

import React, { useMemo } from "react"
import { useAuthStore } from "@/lib/auth/store"
import { UserRole } from "@/contracts"

// Widgets
import { MemberProfile } from "../member/member-profile"
import { MemberAttendance } from "../member/member-attendance"
import { MemberTimer } from "../member/member-timer"
import { MemberRoutineView } from "../member/member-routine-view"
import { MemberProgress } from "../member/member-progress"
import { MemberClasses } from "../member/member-classes"
import { MemberDocs } from "../member/member-docs"
import { MemberNotes } from "../member/member-notes"
import { MessageList } from "../messaging/message-list"
import { SendMessageForm } from "../messaging/send-message-form"
import { mockMembers } from "@/data/members"

// Define registry type
export interface WidgetDefinition {
  id: string
  name: string
  component: React.ComponentType<any>
  defaultProps?: any
  roles: UserRole[]
  defaultSize?: "sm" | "md" | "lg"
  className?: string
}

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  // MEMBER WIDGETS
  {
    id: "member-profile",
    name: "Mi Perfil",
    component: MemberProfile,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-attendance",
    name: "Mi Asistencia",
    component: MemberAttendance,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-timer",
    name: "Cronómetro",
    component: MemberTimer,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-routine",
    name: "Mi Rutina",
    component: MemberRoutineView,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-progress",
    name: "Mi Progreso",
    component: MemberProgress,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-classes",
    name: "Mis Clases",
    component: MemberClasses,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-docs",
    name: "Documentación",
    component: MemberDocs,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "member-notes",
    name: "Notas",
    component: MemberNotes,
    roles: [UserRole.Member],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  {
    id: "message-list",
    name: "Mensajes",
    component: MessageList,
    roles: [UserRole.Member, UserRole.AdminGlobal, UserRole.AdminTenant, UserRole.Staff, UserRole.Trainer],
    defaultSize: "sm",
    className: "md:col-span-4",
  },
  
  // SHARED / ADMIN WIDGETS
  {
      id: "send-message",
      name: "Enviar Mensaje",
      component: SendMessageForm,
      roles: [UserRole.AdminGlobal, UserRole.AdminTenant, UserRole.Staff, UserRole.Trainer],
      defaultSize: "sm",
      className: "col-span-3"
  }
]

export const getWidgetsForRole = (role: UserRole) => {
  return WIDGET_REGISTRY.filter((w) => w.roles.includes(role))
}
