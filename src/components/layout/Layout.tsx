import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="bg-surface text-on-surface flex min-h-screen overflow-hidden antialiased print:block print:overflow-visible print:bg-white print:h-auto">
      <div className="print:hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div className={`flex-1 flex flex-col ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 ease-in-out h-screen print:h-auto print:ml-0 print:block print:overflow-visible`}>
        {children}
      </div>
    </div>
  );
}
