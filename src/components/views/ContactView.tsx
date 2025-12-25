import React from "react";
import { Phone, Printer, Mail, MapPin } from "lucide-react";

const CONTACT_DATA = [
  {
    city: "Kettering",
    address: "500 Lincoln Park Blvd, Suite 100",
    phone: "(937) 222-3118",
    fax: "(937) 555-0199",
  },
  {
    city: "Centerville",
    address: "7700 Washington Village Dr, Suite 230",
    phone: "(937) 555-0102", // Dummy
    fax: "(937) 555-0299",
  },
  {
    city: "Huber Heights",
    address: "7231 Shull Road",
    phone: "(937) 555-0103", // Dummy
    fax: "(937) 555-0399",
  },
  {
    city: "Dayton",
    address: "455 Turner Road",
    phone: "(937) 555-0104", // Dummy
    fax: "(937) 555-0499",
  },
  {
    city: "Eaton",
    address: "450 Washington Jackson Rd",
    phone: "(937) 555-0105", // Dummy
    fax: "(937) 555-0599",
  },
  {
    city: "Greenville",
    address: "742 Sweitzer Street, Suite A",
    phone: "(937) 555-0106", // Dummy
    fax: "(937) 555-0699",
  },
];

const ContactView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto pt-32 pb-20 px-4 md:px-12 lg:px-20 animate-fade-in custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
            We are here to help. Please reach out to the office most convenient
            for you, or use our general contact information below.
          </p>
        </div>

        {/* General Inquiries Box */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Mail className="text-teal-400" /> General Inquiries
            </h3>
            <p className="text-blue-200">
              For non-medical questions, billing, or general information.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:info@daytonkidney.com"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-bold border border-white/20 transition-all text-center"
            >
              info@daytonkidney.com
            </a>
          </div>
        </div>

        {/* Office Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONTACT_DATA.map((office, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                {office.city}
                <MapPin
                  size={18}
                  className="text-teal-500 opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-slate-600 h-10">{office.address}</p>

                <div className="flex items-center gap-3 text-slate-700 bg-blue-50/50 p-3 rounded-lg">
                  <Phone size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                      Phone
                    </p>
                    <a
                      href={`tel:${office.phone.replace(/\D/g, "")}`}
                      className="font-bold hover:text-blue-800 transition-colors"
                    >
                      {office.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <Printer size={18} className="text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Fax
                    </p>
                    <span className="font-medium text-slate-600">
                      {office.fax}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactView;
