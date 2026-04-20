import { Layout } from "../components/layout/Layout";
import { TopBar } from "../components/layout/TopBar";
import { Camera, FileText, Folder, ClipboardList, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const recentDocuments = [
    { id: "NX-1042", client: "Eleanor Vance", date: "Oct 24, 2023", status: "DRAFT" },
    { id: "NX-1041", client: "Marcus Sterling", date: "Oct 23, 2023", status: "COMPLETED" },
    { id: "NX-1040", client: "Julian Crain", date: "Oct 21, 2023", status: "DRAFT" },
    { id: "NX-1039", client: "Sarah Connor", date: "Oct 20, 2023", status: "COMPLETED" },
  ];

  return (
    <Layout>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header & Quick Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-headline text-4xl font-bold text-on-surface leading-tight">Overview</h2>
              <p className="font-body text-on-surface-variant mt-2 text-lg">Your daily notarization summary.</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-surface-container-high text-primary rounded-xl py-2.5 px-6 font-body font-medium hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                <Camera size={18} />
                Scan ID
              </button>
              <Link to="/documents/new" className="gradient-primary text-on-primary rounded-xl py-2.5 px-6 font-body font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                <FileText size={18} />
                Create Document
              </Link>
            </div>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 editorial-shadow flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="font-label text-sm text-on-surface-variant font-medium">Total Documents</span>
                <span className="text-primary bg-primary/10 p-2 rounded-lg flex items-center justify-center">
                  <Folder size={20} className="fill-primary/20" />
                </span>
              </div>
              <div className="mt-4">
                <span className="font-headline text-4xl font-bold text-on-surface">1,248</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 editorial-shadow flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="font-label text-sm text-on-surface-variant font-medium">Pending Notarization</span>
                <span className="text-tertiary bg-tertiary/10 p-2 rounded-lg flex items-center justify-center">
                  <ClipboardList size={20} className="fill-tertiary/20" />
                </span>
              </div>
              <div className="mt-4">
                <span className="font-headline text-4xl font-bold text-on-surface">24</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 editorial-shadow flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="font-label text-sm text-on-surface-variant font-medium">Recent Clients</span>
                <span className="text-primary bg-primary/10 p-2 rounded-lg flex items-center justify-center">
                  <Users size={20} className="fill-primary/20" />
                </span>
              </div>
              <div className="mt-4">
                <span className="font-headline text-4xl font-bold text-on-surface">18</span>
              </div>
            </div>
          </div>

          {/* Recent Documents Section */}
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-6">Recent Documents</h3>
            <div className="bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden">
              <div className="w-full">
                <div className="grid grid-cols-12 bg-surface-container-low px-6 py-4 font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:grid">
                  <div className="col-span-2">Sr. No</div>
                  <div className="col-span-4">Client Name</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-3">Status</div>
                </div>
                <div className="divide-y divide-outline-variant/15">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-5 hover:bg-surface-bright transition-colors gap-y-2">
                      <div className="col-span-1 md:col-span-2 font-label text-sm text-on-surface-variant"><span className="md:hidden font-semibold mr-2">ID:</span>{doc.id}</div>
                      <div className="col-span-1 md:col-span-4 font-body text-sm font-medium text-on-surface"><span className="md:hidden font-semibold mr-2 text-on-surface-variant">Client:</span>{doc.client}</div>
                      <div className="col-span-1 md:col-span-3 font-label text-sm text-on-surface-variant"><span className="md:hidden font-semibold mr-2">Date:</span>{doc.date}</div>
                      <div className="col-span-1 md:col-span-3 mt-2 md:mt-0">
                        <span className={`font-label text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase ${
                          doc.status === "DRAFT" 
                            ? "bg-secondary-container text-on-surface" 
                            : "bg-surface-container-highest text-on-surface/70"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
