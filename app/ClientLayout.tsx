"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Sidebar />
      <Header />
      {children}
    </AuthProvider>
  );
}
