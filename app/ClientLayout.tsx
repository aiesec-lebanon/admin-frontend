"use client";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    console.log("logout");
    // clear auth, redirect, etc.
  };

  return (
    <>
      <Sidebar />
      <Header
        userName="Tharindu"
        profileImageUrl="/profile.jpg"
        onLogout={handleLogout}
      />
      {children}
    </>
  );
}
