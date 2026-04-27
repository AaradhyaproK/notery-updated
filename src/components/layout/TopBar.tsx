import { useNavigate } from "react-router-dom";


export function TopBar() {
  const navigate = useNavigate();


  return (
    <header className="bg-surface text-primary flex justify-between items-center w-full px-8 py-5 z-10 sticky top-0">
      <div className="flex-1"></div>
      <div className="flex items-center gap-6">
        {/* Navigation options removed as per request */}
      </div>

    </header>
  );
}
