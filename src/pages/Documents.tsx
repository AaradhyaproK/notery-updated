import { Layout } from "../components/layout/Layout";
import { TopBar } from "../components/layout/TopBar";
import { Search, ChevronDown, Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Documents() {
  const documents = [
    {
      id: "NX-2023-8941",
      clientInitials: "ER",
      clientName: "Eleanor Roosevelt Trust",
      type: "Irrevocable Gift Deed",
      date: "Oct 24, 2023",
      status: "Completed",
      statusColor: "bg-primary",
      statusBg: "bg-surface-container-highest",
      statusText: "text-on-surface"
    },
    {
      id: "NX-2023-8942",
      clientInitials: "VM",
      clientName: "Vanguard Management LLC",
      type: "Power of Attorney (Financial)",
      date: "Oct 26, 2023",
      status: "Pending Sig",
      statusColor: "bg-tertiary",
      statusBg: "bg-surface-container-highest",
      statusText: "text-tertiary",
      initialsColor: "bg-tertiary-container text-on-tertiary-container"
    },
    {
      id: "NX-2023-8945",
      clientInitials: "JD",
      clientName: "John Doe",
      type: "Affidavit of Support",
      date: "--",
      status: "Draft",
      statusColor: "bg-outline",
      statusBg: "bg-surface-container",
      statusText: "text-on-surface-variant",
      isDraft: true
    }
  ];

  return (
    <Layout>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface tracking-tight">Document Archive</h1>
              <p className="font-body text-on-surface-variant text-base md:text-lg max-w-2xl">A comprehensive ledger of all notarized instruments, drafts, and pending executions.</p>
            </div>
            <Link to="/documents/new" className="flex items-center gap-2 gradient-primary text-on-primary px-6 py-3 rounded-xl font-medium shadow-[0_4px_20px_-4px_rgba(0,99,156,0.3)] hover:opacity-90 transition-opacity whitespace-nowrap">
              <Plus size={18} />
              New Instrument
            </Link>
          </div>

          {/* Filter & Search Bar Area */}
          <div className="flex flex-col lg:flex-row gap-4 w-full bg-surface-container-lowest p-4 rounded-xl editorial-shadow border border-outline-variant/15">
            <div className="flex-grow relative group w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full bg-surface-container-highest focus:bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/70 rounded-md py-3 pl-12 pr-4 border-none focus:ring-2 focus:ring-primary/30 transition-all font-body text-sm" 
                placeholder="Search by Client, ID, or Subject..." 
                type="text"
              />
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-3 items-center w-full lg:w-auto">
              <div className="relative min-w-[140px] flex-grow lg:flex-grow-0">
                <select className="w-full appearance-none bg-surface-container-highest focus:bg-surface-container-lowest text-on-surface rounded-md py-3 pl-4 pr-10 border-none focus:ring-2 focus:ring-primary/30 transition-all font-body text-sm cursor-pointer">
                  <option value="">All Types</option>
                  <option value="deed">Gift Deed</option>
                  <option value="poa">Power of Attorney</option>
                  <option value="affidavit">Affidavit</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
              <div className="relative min-w-[140px] flex-grow lg:flex-grow-0">
                <select className="w-full appearance-none bg-surface-container-highest focus:bg-surface-container-lowest text-on-surface rounded-md py-3 pl-4 pr-10 border-none focus:ring-2 focus:ring-primary/30 transition-all font-body text-sm cursor-pointer">
                  <option value="">Any Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
              <button className="flex items-center justify-center gap-2 bg-surface-container-highest hover:bg-surface-variant text-primary px-4 py-3 rounded-md font-medium transition-colors text-sm whitespace-nowrap flex-grow lg:flex-grow-0">
                <Calendar size={16} />
                Date Range
              </button>
            </div>
          </div>

          {/* Data Table / List Area */}
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow border border-outline-variant/15 overflow-hidden flex flex-col">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low/50 text-on-surface-variant font-label text-xs uppercase tracking-wider font-semibold">
              <div className="col-span-2">Document ID</div>
              <div className="col-span-3">Client Name</div>
              <div className="col-span-3">Document Type</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="flex flex-col">
              {documents.map((doc, i) => (
                <div key={doc.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 px-6 py-5 hover:bg-surface-bright transition-colors group cursor-pointer items-center border-t border-outline-variant/15 md:border-none relative ${i % 2 !== 0 ? 'bg-surface-container-low/30' : ''}`}>
                  <div className="hidden md:block absolute bottom-0 left-6 right-6 h-[1px] bg-surface-container-low group-last:hidden"></div>
                  
                  <div className="col-span-1 md:col-span-2 flex flex-col md:block">
                    <span className="md:hidden text-xs text-on-surface-variant font-label uppercase tracking-wider mb-1">ID</span>
                    <span className={`font-body text-sm font-medium ${doc.isDraft ? 'text-on-surface-variant/70' : 'text-on-surface'}`}>{doc.id}</span>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 flex flex-col md:block">
                    <span className="md:hidden text-xs text-on-surface-variant font-label uppercase tracking-wider mb-1">Client</span>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${doc.initialsColor || "bg-secondary-container text-on-secondary-container"}`}>
                        {doc.clientInitials}
                      </div>
                      <span className="font-body text-sm text-on-surface font-medium truncate">{doc.clientName}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 flex flex-col md:block">
                    <span className="md:hidden text-xs text-on-surface-variant font-label uppercase tracking-wider mb-1">Type</span>
                    <span className="font-body text-sm text-on-surface">{doc.type}</span>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex flex-col md:block">
                    <span className="md:hidden text-xs text-on-surface-variant font-label uppercase tracking-wider mb-1">Date</span>
                    <span className="font-label text-sm text-on-surface-variant">{doc.date}</span>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end mt-2 md:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full ${doc.statusBg} ${doc.statusText} font-label text-xs uppercase tracking-[0.1em] font-semibold whitespace-nowrap`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.statusColor} mr-2`}></span>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/15 flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest">
              <span className="text-sm text-on-surface-variant font-body">Showing 1 to 3 of 124 entries</span>
              <div className="flex gap-1">
                <button className="p-2 rounded-md text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-md bg-primary-container text-on-primary-container font-medium text-sm flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-md text-on-surface hover:bg-surface-container-high font-medium text-sm flex items-center justify-center transition-colors">2</button>
                <button className="w-8 h-8 rounded-md text-on-surface hover:bg-surface-container-high font-medium text-sm flex items-center justify-center transition-colors">3</button>
                <button className="p-2 rounded-md text-on-surface hover:bg-surface-container-high transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
