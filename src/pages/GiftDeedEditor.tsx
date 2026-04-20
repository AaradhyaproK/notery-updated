import { Layout } from "../components/layout/Layout";
import { TopBar } from "../components/layout/TopBar";
import { Camera, Fingerprint, Gavel, Plus } from "lucide-react";

export function GiftDeedEditor() {
  return (
    <Layout>
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center pb-24 bg-surface-container">
        
        {/* Legal Paper Representation */}
        <article className="bg-surface-container-lowest w-full max-w-4xl paper-shadow rounded-sm relative min-h-[1056px] flex flex-col">
          
          {/* Fixed Header */}
          <header className="p-8 md:p-12 border-b-2 border-surface-container flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline font-bold text-2xl tracking-tight text-on-surface">Advocate John Doe</h2>
                <p className="font-label text-sm text-on-surface-variant mt-1">123 Legal Street, City</p>
              </div>
              <div className="text-right font-label text-sm text-on-surface-variant space-y-1">
                <p>Sr. No: <span className="inline-block border-b border-outline-variant w-24 ml-2"></span></p>
                <p>Date: <span className="inline-block border-b border-outline-variant w-24 ml-2"></span></p>
              </div>
            </div>
          </header>

          {/* Main Workspace */}
          <div className="flex-1 p-8 md:p-12 flex flex-col gap-10">
            <div className="text-center">
              <h1 className="font-headline font-bold text-4xl tracking-tight text-on-surface uppercase underline decoration-2 underline-offset-4">Gift Deed</h1>
            </div>

            {/* Person Block 1 (Donor) */}
            <div className="bg-surface p-6 rounded-lg ghost-border hover:bg-surface-bright transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-secondary-container text-on-secondary-container font-label text-xs uppercase tracking-wider px-3 py-1 rounded-full">Donor</span>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-8">
                {/* Left: Photo Box */}
                <div className="w-[100px] h-[120px] border-2 border-dashed border-outline-variant rounded flex items-center justify-center bg-surface-container-low text-on-surface-variant relative overflow-hidden group cursor-pointer">
                  <Camera size={24} className="absolute" />
                  <span className="font-label text-xs absolute bottom-2 opacity-60">PHOTO</span>
                </div>

                {/* Right: Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label text-xs text-on-surface-variant mb-1">Full Name</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-md text-sm py-2 px-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-colors" type="text" defaultValue="Richard Hendricks" />
                  </div>
                  <div>
                    <label className="block font-label text-xs text-on-surface-variant mb-1">Age</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-md text-sm py-2 px-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-colors" type="text" defaultValue="45" />
                  </div>
                  <div>
                    <label className="block font-label text-xs text-on-surface-variant mb-1">Aadhar No.</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-md text-sm py-2 px-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-colors" type="text" defaultValue="XXXX-XXXX-1234" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label text-xs text-on-surface-variant mb-1">Address</label>
                    <textarea className="w-full bg-surface-container-highest border-none rounded-md text-sm py-2 px-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-colors resize-none" rows={2} defaultValue="1450 Page Mill Road, Palo Alto, CA"></textarea>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Signatures */}
              <div className="mt-8 pt-4 border-t border-surface-container-high grid grid-cols-2 gap-8">
                <div className="flex flex-col justify-end">
                  <div className="border-b border-on-surface w-full mb-2"></div>
                  <p className="font-label text-sm text-on-surface-variant">Signature</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-24 border border-dashed border-outline-variant flex items-center justify-center mb-2">
                    <Fingerprint size={32} className="text-outline-variant opacity-50" />
                  </div>
                  <p className="font-label text-xs text-on-surface-variant">(Thumb Space)</p>
                </div>
              </div>
            </div>

            {/* Add Person Button */}
            <div className="flex justify-center">
              <button className="flex items-center gap-2 px-6 py-2 bg-surface-container-high text-primary rounded-full font-label text-sm hover:bg-surface-container transition-colors">
                <Plus size={16} />
                Add Person
              </button>
            </div>
          </div>

          {/* Fixed Footer */}
          <footer className="mt-auto p-8 md:p-12 bg-surface-container-low border-t-2 border-surface-container flex flex-col gap-8">
            <p className="font-body text-base text-on-surface leading-relaxed text-center max-w-2xl mx-auto">
              We have executed the annexed Gift Deed on <span className="inline-block border-b border-outline-variant w-32 mx-1"></span> The above persons have signed before me.
            </p>
            <div className="flex justify-between items-end mt-4">
              
              {/* Notary Stamp Space */}
              <div className="w-40 h-40 border-2 border-dashed border-outline-variant rounded-full flex flex-col items-center justify-center text-center p-4 bg-surface-container-lowest">
                <Gavel size={32} className="text-outline-variant mb-2" />
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">[NOTARY STAMP SPACE]</span>
              </div>
              
              {/* Notary Signature Line */}
              <div className="w-64 flex flex-col justify-end text-center">
                <div className="border-b border-on-surface w-full mb-2"></div>
                <p className="font-headline font-bold text-lg text-on-surface">Signature of Notary</p>
              </div>
            </div>
          </footer>

        </article>
      </main>
    </Layout>
  );
}
