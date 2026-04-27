import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Settings, CircleHelp, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/clients", icon: Users, label: "Clients" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const isExpanded = !isCollapsed || isHovered;

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      setIsHovered(false);
    }
  };

  return (
    <nav 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-surface-container-low text-primary flex-col h-screen py-8 border-r-0 fixed left-0 top-0 z-40 flex transition-all duration-300 ease-in-out shadow-xl",
        isOpen ? (isExpanded ? "w-64" : "w-20") : "w-0 overflow-hidden -translate-x-full"
      )}
    >
      {/* Header with Close button for mobile */}
      <div className={cn("px-4 mb-10 flex flex-col items-start transition-all", !isExpanded ? "items-center px-0" : "px-8")}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
               <FileText className="text-on-primary" size={24} />
            </div>
            {isExpanded && (
              <div className="flex flex-col">
                <h1 className="font-headline text-xl font-bold text-on-surface whitespace-nowrap">NoteryXpert</h1>
                <span className="font-label text-[10px] text-on-surface-variant tracking-widest uppercase">Editorial Authority</span>
              </div>
            )}
          </div>
          {isExpanded && (
            <button onClick={() => setIsOpen(false)} className="md:hidden p-2 hover:bg-surface-container-high rounded-full">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle (Manual override) - Only show if sidebar is open */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
          setIsHovered(false);
        }}
        className={cn(
          "absolute -right-3 top-12 bg-primary text-on-primary rounded-full p-1 shadow-md hover:scale-110 transition-transform z-50 border-2 border-surface",
          !isOpen && "hidden"
        )}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Close button for Desktop (Optional, but good for UX) */}
      {isOpen && isExpanded && (
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-2 hover:bg-surface-container-high rounded-full md:flex hidden"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div className="px-4 mb-8">
        <Link 
          to="/documents/new" 
          className={cn(
            "gradient-primary text-on-primary rounded-xl py-3 flex items-center gap-2 hover:opacity-90 transition-all font-body font-medium shadow-sm",
            !isExpanded ? "justify-center px-0 h-12" : "px-4 justify-start"
          )}
          title={!isExpanded ? "New Document" : ""}
          onClick={() => setIsOpen(false)}
        >
          <Plus size={18} />
          {isExpanded && <span className="whitespace-nowrap">New Document</span>}
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
                  title={!isExpanded ? link.label : ""}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "py-3 flex items-center transition-all duration-200",
                    !isExpanded ? "px-0 justify-center" : "px-8 gap-4",
                    isActive
                      ? cn(
                          "text-primary font-bold",
                          isExpanded ? "bg-surface-container-lowest rounded-l-full ml-4 pl-4 translate-x-1" : ""
                        )
                      : "text-on-surface hover:text-primary translate-x-1"
                  )}
                >
                  <link.icon className={cn(isActive ? "fill-primary/20 text-primary" : "")} size={20} />
                  {isExpanded && <span className="whitespace-nowrap">{link.label}</span>}
                  {!isExpanded && isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto">
        <ul className="space-y-1 font-body font-medium text-sm">
          <li>
            <a href="#" className={cn("text-on-surface py-3 flex items-center hover:text-primary transition-all translate-x-1 duration-200", !isExpanded ? "px-0 justify-center" : "px-8 gap-4")}>
              <CircleHelp size={20} />
              {isExpanded && <span>Help Center</span>}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
