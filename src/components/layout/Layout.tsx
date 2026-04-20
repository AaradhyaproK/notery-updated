import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen overflow-hidden antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 h-screen">
        {children}
      </div>
    </div>
  );
}
