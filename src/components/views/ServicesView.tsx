import React from "react";
import {
  Activity,
  HeartPulse,
  Stethoscope,
  Microscope,
  Hospital,
  Droplet,
  ExternalLink,
  BedDouble,
  PillBottle,
  LucidePillBottle,
  LucideStethoscope,
  FlaskConical,
  Scale,
} from "lucide-react";

const ServicesView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto pt-32 pb-20 px-4 md:px-12 lg:px-20 animate-fade-in custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
            Comprehensive Kidney Care
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            From early diagnosis to advanced interventions, we provide the full
            spectrum of renal health services using the latest medical
            advancements and a compassionate, patient-centered approach.
          </p>
        </div>

        {/* Core Services Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <ServiceCard
            icon={Stethoscope}
            title="Chronic Kidney Disease"
            description="Expert management of CKD stages 1-5, focusing on slowing progression through medication, diet, and lifestyle changes."
          />
          <ServiceCard
            icon={HeartPulse}
            title="Hypertension Management"
            description="Specialized care for difficult-to-control high blood pressure, a leading cause and complication of kidney disease."
          />
          <ServiceCard
            icon={LucidePillBottle}
            title="Post-Transplant Care"
            description="Comprehensive long-term follow-up for kidney transplant recipients to ensure graft health and medication management."
          />
          <ServiceCard
            icon={Droplet}
            title="Dialysis Services"
            description="Medical Directors for over 15 units. We see patients at both DaVita and Fresenius facilities, managing In-Center, PD, and Home Therapies."
          />
          <ServiceCard
            icon={BedDouble}
            title="Post-Acute Care"
            description="In-person care at Post Acute Medical IPR/LTAC, Kindred LTAC, RIO, Carillon, Daysprings, Laurels of Huber Heights, and Oaks of West Kettering."
          />
          <ServiceCard
            icon={Scale}
            title="Electrolyte Disorders"
            description="Diagnosis and treatment of abnormalities of electrolytes and minerals like sodium, potassium, calcium, and magnesium."
          />
        </div>

        {/* Hospital Affiliations (Full Width & Centered) */}
        <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
            <Hospital size={24} className="text-teal-400" />
            Hospital Affiliations
          </h3>
          <p className="text-blue-200 mb-8 text-sm max-w-2xl mx-auto">
            We serve as medical directors for inpatient kidney care at the
            region's leading medical centers, ensuring continuity of care when
            you need it most.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl w-full">
            <div className="flex flex-col items-center">
              <h4 className="text-teal-400 font-bold mb-4 border-b border-white/10 pb-2 inline-block px-8">
                Kettering Health
              </h4>
              <ul className="space-y-3 text-sm md:text-base font-medium flex flex-col items-center">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                  Main Campus
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                  Miamisburg
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                  Dayton
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-teal-400 font-bold mb-4 border-b border-white/10 pb-2 inline-block px-8">
                Miami Valley
              </h4>
              <ul className="space-y-3 text-sm md:text-base font-medium flex flex-col items-center">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                  Main
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                  North
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                  South
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Featured Specialty: Vascular Access */}
        <div className="bg-white/90 backdrop-blur-[1px] rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-6">
                Strategic Partnership
              </div>

              {/* Azura Logo */}
              <div className="mb-6 h-16">
                <img
                  src="https://i.ibb.co/S1qtNJs/Screenshot-2025-12-04-at-10-43-28-PM.png"
                  alt="Azura Vascular Care"
                  className="h-full w-auto object-contain"
                />
              </div>

              <h3 className="text-3xl font-bold text-blue-900 mb-4">
                Vascular Access Center
              </h3>
              <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                We have partnered with <strong>Azura Vascular Care</strong> to
                provide premier access management. Our physicians work alongside
                highly trained surgeon <strong>Dr. Kabithe</strong> to offer a
                full range of interventional procedures.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <ul className="space-y-3">
                  <ListItem>Tunneled Catheter Placement</ListItem>
                  <ListItem>AV Fistula Creation</ListItem>
                </ul>
                <ul className="space-y-3">
                  <ListItem>PD Catheter Placements</ListItem>
                  <ListItem>Angiograms & Angioplasties</ListItem>
                </ul>
              </div>

              <a
                href="https://centers.azuravascularcare.com/oh/dayton/azura-vascular-care-greater-dayton"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-lg transform hover:-translate-y-0.5"
              >
                Visit Azura Website <ExternalLink size={16} />
              </a>
            </div>

            <div className="relative h-full flex flex-col gap-4 justify-center">
              {/* Pre-Op Area Photo - No Overlay */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white/50 bg-white">
                <img
                  src="https://i.ibb.co/Tq0w6qN7/Screenshot-2025-12-04-at-10-44-34-PM.png"
                  alt="Vascular Access Center Pre-Op Area"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plasmapheresis Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50 flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img
              src="https://i.ibb.co/jZDFxdSp/SWAP1.png"
              alt="Southwest Ohio Apheresis"
              className="max-h-32 w-auto object-contain mix-blend-multiply"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              Plasmapheresis
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Through our sister organization,{" "}
              <strong>Southwest Ohio Apheresis Services</strong>, we provide
              specialized therapeutic plasma exchange treatments for a variety
              of autoimmune and neurologic conditions.
            </p>
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg">
              Therapeutic Plasma Exchange
            </div>
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg ml-2">
              Red Cell Exchange
            </div>
          </div>
        </div>

        {/* Research (Moved to Bottom) */}
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-10 shadow-xl border border-teal-100 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
            <FlaskConical size={40} />
          </div>
          <h3 className="text-3xl font-bold text-blue-900 mb-4">
            Future Innovations
          </h3>
          <p className="text-slate-700 text-lg leading-relaxed mb-8 max-w-2xl">
            We are dedicated to advancing the field of nephrology. We aim to
            launch a dedicated{" "}
            <span className="font-bold text-teal-700">Research Division</span>{" "}
            soon to participate in clinical trials and further our knowledge in
            kidney care treatments, ensuring our patients have access to the
            therapies of tomorrow.
          </p>
          <div className="h-1.5 w-32 bg-teal-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ServiceCard: React.FC<{
  icon: any;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all hover:-translate-y-1">
    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-center gap-3 text-slate-700 font-medium">
    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
    </div>
    {children}
  </li>
);

export default ServicesView;
