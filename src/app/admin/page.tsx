"use client";

import { useExpoStore } from "@/store/useExpoStore";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";

export default function AdminPage() {
  const isAdmin = useExpoStore((s) => s.isAdmin);

  return isAdmin ? <AdminPanel /> : <AdminLogin />;
}
