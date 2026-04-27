import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Handle auto-collapse on click outside
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden antialiased print:block print:overflow-visible print:bg-white print:h-auto">
      {/* Sidebar Overlay for mobile/outside clicks */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 backdrop-blur-[2px] transition-all"
          onClick={closeSidebar}
        />
      )}

      <div className="print:hidden">
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out h-screen print:h-auto print:ml-0 print:block print:overflow-visible overflow-hidden`}>
        {/* Hamburger Button Header (Fixed at top) */}
        <header className="p-4 flex items-center md:hidden no-print flex-shrink-0 bg-surface/80 backdrop-blur-md z-10 border-b border-outline-variant/10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-headline font-bold text-lg text-on-surface">NoteryXpert</span>
        </header>

        {/* Desktop Hamburger Button (Floating) */}
        <div className="hidden md:block absolute top-4 left-4 z-20 no-print">
           {!isSidebarOpen && (
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-colors bg-surface-container-low/80 backdrop-blur-sm shadow-sm border border-outline-variant/10"
             >
               <Menu size={24} />
             </button>
           )}
        </div>

        {/* Main Content Area - This should be scrollable */}
        <div className={`flex-1 overflow-y-auto transition-all ${isSidebarOpen && !isCollapsed ? "md:ml-64" : isSidebarOpen && isCollapsed ? "md:ml-20" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
