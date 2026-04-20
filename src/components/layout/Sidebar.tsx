import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Settings, CircleHelp, LogOut, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/clients", icon: Users, label: "Clients" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="bg-surface-container-low text-primary flex-col h-screen py-8 border-r-0 fixed left-0 top-0 w-64 z-20 hidden md:flex">
      <div className="px-8 mb-10 flex flex-col items-start">
        <h1 className="font-headline text-2xl font-bold text-on-surface">NoteryXpert</h1>
        <span className="font-label text-xs text-on-surface-variant mt-1 tracking-widest uppercase">Editorial Authority</span>
      </div>

      <div className="px-4 mb-8">
        <Link to="/documents/new" className="w-full gradient-primary text-on-primary rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-body font-medium shadow-sm">
          <Plus size={18} />
          New Document
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1 font-body font-medium text-sm w-full">
          {links.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));

            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "px-8 py-3 flex items-center gap-4 transition-all duration-200",
                    isActive
                      ? "bg-surface-container-lowest text-primary rounded-l-full ml-4 pl-4 font-bold border-l-0 translate-x-1"
                      : "text-on-surface hover:text-primary translate-x-1"
                  )}
                >
                  <link.icon className={cn(isActive ? "fill-primary/20" : "")} size={20} />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto">
        <ul className="space-y-1 font-body font-medium text-sm">
          <li>
            <a href="#" className="text-on-surface px-8 py-3 flex items-center gap-4 hover:text-primary transition-all translate-x-1 duration-200">
              <CircleHelp size={20} />
              Help Center
            </a>
          </li>
          <li>
            <a href="#" className="text-on-surface px-8 py-3 flex items-center gap-4 hover:text-primary transition-all translate-x-1 duration-200">
              <LogOut size={20} />
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
