import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Settings, CircleHelp, LogOut, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/clients", icon: Users, label: "Clients" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className={cn(
      "bg-surface-container-low text-primary flex-col h-screen py-8 border-r-0 fixed left-0 top-0 z-20 hidden md:flex transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 bg-primary text-on-primary rounded-full p-1 shadow-md hover:scale-110 transition-transform z-30 border-2 border-surface"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={cn("px-4 mb-10 flex flex-col items-start transition-all", isCollapsed ? "items-center px-0" : "px-8")}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
             <FileText className="text-on-primary" size={24} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="font-headline text-xl font-bold text-on-surface whitespace-nowrap">NoteryXpert</h1>
              <span className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase">Editorial Authority</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mb-8">
        <Link 
          to="/documents/new" 
          className={cn(
            "gradient-primary text-on-primary rounded-xl py-3 flex items-center gap-2 hover:opacity-90 transition-all font-body font-medium shadow-sm",
            isCollapsed ? "justify-center px-0 h-12" : "px-4 justify-start"
          )}
          title={isCollapsed ? "New Document" : ""}
        >
          <Plus size={18} />
          {!isCollapsed && <span className="whitespace-nowrap">New Document</span>}
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
                  title={isCollapsed ? link.label : ""}
                  className={cn(
                    "py-3 flex items-center transition-all duration-200",
                    isCollapsed ? "px-0 justify-center" : "px-8 gap-4",
                    isActive
                      ? cn(
                          "text-primary font-bold",
                          !isCollapsed ? "bg-surface-container-lowest rounded-l-full ml-4 pl-4 translate-x-1" : ""
                        )
                      : "text-on-surface hover:text-primary translate-x-1"
                  )}
                >
                  <link.icon className={cn(isActive ? "fill-primary/20 text-primary" : "")} size={20} />
                  {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
                  {isCollapsed && isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto">
        <ul className="space-y-1 font-body font-medium text-sm">
          <li>
            <a href="#" className={cn("text-on-surface py-3 flex items-center hover:text-primary transition-all translate-x-1 duration-200", isCollapsed ? "px-0 justify-center" : "px-8 gap-4")}>
              <CircleHelp size={20} />
              {!isCollapsed && <span>Help Center</span>}
            </a>
          </li>
          <li>
            <button className={cn("w-full text-on-surface py-3 flex items-center hover:text-primary transition-all translate-x-1 duration-200", isCollapsed ? "px-0 justify-center" : "px-8 gap-4")}>
              <LogOut size={20} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
