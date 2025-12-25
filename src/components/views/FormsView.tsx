import React from "react";
import { FORMS_DATA } from "../../constants";
import { FileText, Download, ShieldCheck } from "lucide-react";

const FormsView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto pt-32 pb-20 px-4 md:px-12 lg:px-20 animate-fade-in custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            Patient Forms
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            To save time during your appointment, please download and fill out
            the necessary forms below. Bring the completed forms with you to
            your visit.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {FORMS_DATA.map((form, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-blue-50/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {form.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {form.type} • {form.fileSize}
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-teal-700 bg-teal-50 rounded-full hover:bg-teal-600 hover:text-white transition-all">
                <Download size={16} />
                Download
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4 p-4 bg-blue-900/5 rounded-xl border border-blue-900/10">
          <ShieldCheck className="text-blue-900 flex-shrink-0" size={24} />
          <p className="text-sm text-blue-900/80">
            <strong>Your Privacy Matters:</strong> All forms are compliant with
            HIPAA regulations. We are committed to protecting your personal
            health information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormsView;
