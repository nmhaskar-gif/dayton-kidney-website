import React, { useEffect, useRef, useState } from "react";
import { ASSETS } from "../../constants";
import {
  Flag,
  Handshake,
  Stethoscope,
  Users,
  Building2,
  TrendingUp,
  Activity,
  UserCheck,
} from "lucide-react";

/** --- CUSTOM HOOK FOR SCROLL ANIMATION --- */
const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect(); // Only trigger once
      }
    }, options);

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
};

const FadeInItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
};

interface TimelineNodeProps {
  date: string;
  title: string;
  children: React.ReactNode;
  align?: "left" | "right";
  icon: any;

  /** NEW: optional image fields (so the node can do text-left / image-right, etc.) */
  imgSrc?: string;
  imgAlt?: string;
}

/**
 * WIDE TIMELINE NODE (NO IMAGE CROPPING)
 * - Keeps your card opacity: bg-white/80 + backdrop-blur-md
 * - Alternates image side using align (left/right)
 * - Images use object-contain (never cropped)
 */
const TimelineNode: React.FC<TimelineNodeProps> = ({
  date,
  title,
  children,
  align = "left",
  icon: Icon,
  imgSrc,
  imgAlt,
}) => {
  const isReversed = align === "right";

  return (
    <FadeInItem>
      <div className="relative mb-16 md:mb-24 w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div
            className={`flex flex-col ${
              isReversed ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* TEXT SIDE */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-teal-50/80 border border-teal-100 text-teal-900 text-sm font-bold rounded-full shadow-sm">
                  {date}
                </span>
              </div>

              <h3 className="text-3xl font-bold text-blue-900 mb-6">{title}</h3>

              <div className="space-y-4">{children}</div>
            </div>

            {/* IMAGE SIDE (NO CROP) */}
            {imgSrc && (
              <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white/40">
                <img
                  src={imgSrc}
                  alt={imgAlt || title}
                  className="max-w-full max-h-[420px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeInItem>
  );
};

const AboutView: React.FC = () => {
  const [lineActive, setLineActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLineActive(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto pt-32 pb-20 px-4 md:px-12 lg:px-20 animate-fade-in custom-scrollbar relative">
      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-6 drop-shadow-sm">
            Our Legacy
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Over 50 years of compassion, innovation, and unwavering dedication
            to the kidney health of the Dayton community.
          </p>
        </div>

        {/* Optional center line (kept from your original; hides on mobile) */}
        <div
          className={`absolute left-1/2 top-40 bottom-20 w-1 bg-gradient-to-b from-teal-200 via-teal-400 to-blue-600 rounded-full transform -translate-x-1/2 origin-top transition-transform duration-1000 ease-in-out hidden md:block ${
            lineActive ? "scale-y-100" : "scale-y-0"
          }`}
        />
        <div
          className={`absolute left-6 top-40 bottom-20 w-1 bg-gradient-to-b from-teal-200 via-teal-400 to-blue-600 rounded-full origin-top transition-transform duration-1000 ease-in-out md:hidden ${
            lineActive ? "scale-y-100" : "scale-y-0"
          }`}
        />

        {/* --- 1972 --- */}
        <TimelineNode
          date="1972"
          title="The Foundation"
          align="left"
          icon={Flag}
          imgSrc="https://i.ibb.co/8nNgTh39/IMG-2793.jpg"
          imgAlt="Dr. Allen Feller"
        >
          <p className="text-slate-700 leading-relaxed">
            <strong className="text-teal-700">Dr. Allen Feller</strong> founded
            Renal Physicians, planting the seed for nephrology care in the
            region by bringing life-saving dialysis treatments to Dayton for the
            first time.
          </p>

          {/* Blue Box */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <TrendingUp
              size={24}
              className="text-teal-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-blue-900 font-medium leading-relaxed">
                The practice grew rapidly, becoming the largest nephrology group
                in the region by the early 2000s.
              </p>
            </div>
          </div>
        </TimelineNode>

        {/* --- 1980 --- */}
        <TimelineNode
          date="1980"
          title="A New Standard"
          align="right"
          icon={Users}
          imgSrc="https://i.ibb.co/V001RYv1/Gemini-Generated-Image-hlu7yxhlu7yxhlu7.png"
          imgAlt="Nephrology Associates Team"
        >
          <p className="text-slate-700 leading-relaxed">
            <strong className="text-teal-700">Dr. Larry Klein</strong>{" "}
            established Nephrology Associates of Dayton. Joined later by{" "}
            <strong className="text-teal-700">Dr. Mark Oxman</strong>, their
            tireless work ethic and commitment to patient care fueled incredible
            growth.
          </p>

          {/* Blue Box */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <TrendingUp
              size={24}
              className="text-teal-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-blue-900 font-medium leading-relaxed">
                By the 2010s, the group had grown to equal prominence, serving
                thousands of patients across the Miami Valley.
              </p>
            </div>
          </div>
        </TimelineNode>

        {/* --- 2000s --- */}
        <TimelineNode
          date="2000s"
          title="Strategic Partnerships"
          align="left"
          icon={Building2}
          imgSrc="https://i.ibb.co/6chSQW89/587178581e6b3.webp"
          imgAlt="Dialysis Treatment"
        >
          <p className="text-slate-700 leading-relaxed">
            Along the way, both groups partnered with industry leaders{" "}
            <strong>DaVita</strong> and <strong>Fresenius</strong> to provide
            comprehensive dialysis care, ranging from in-center hemodialysis to
            advanced home modalities.
          </p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <Stethoscope
              size={24}
              className="text-teal-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-blue-900 font-medium leading-relaxed">
                Today, Dayton Kidney physicians are medical directors at over 15
                in-center and home dialysis units across the Miami Valley.
              </p>
            </div>
          </div>
        </TimelineNode>

        {/* --- 1970-2013 --- */}
        <TimelineNode
          date="1970–2013"
          title="Transplant Legacy"
          align="right"
          icon={Stethoscope}
          imgSrc="https://i.ibb.co/vG3ZFX0/Gemini-Generated-Image-413xb7413xb7413x.png"
          imgAlt="Kidney Transplant Program"
        >
          <p className="text-slate-700 leading-relaxed">
            Renal Physicians partnered with Miami Valley Hospital to provide
            life-saving kidney transplants until 2013, under the leadership of{" "}
            <strong>Dr. Augustus Eduafo</strong> who served as transplant
            medical director.
          </p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <Building2
              size={24}
              className="text-teal-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-blue-900 font-medium leading-relaxed">
                Dayton Kidney physicians continue to work closely with regional
                transplant centers including{" "}
                <strong className="text-teal-700">
                  University of Cincinnati
                </strong>{" "}
                and{" "}
                <strong className="text-teal-700">Ohio State University</strong>{" "}
                to help our patients receive transplants.
              </p>
            </div>
          </div>
        </TimelineNode>

        {/* --- 2010s --- */}
        <TimelineNode
          date="2010s"
          title="Interventional Nephrology"
          align="left"
          icon={Activity}
          imgSrc="https://i.ibb.co/5XM5599k/Gemini-Generated-Image-qvtduaqvtduaqvtd.png"
          imgAlt="Interventional Nephrology Procedure"
        >
          <p className="text-slate-700 leading-relaxed">
            Both groups jointly began providing dialysis vascular access
            services, initially led by <strong>Dr. Adedayo Odunsi</strong> and{" "}
            <strong>Dr. Chukwuma Eze</strong>.
          </p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <UserCheck
              size={24}
              className="text-teal-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-blue-900 font-medium leading-relaxed">
                Today, <strong>Dr. Chukwuma Eze</strong> serves as the Medical
                Director of our new partnership with{" "}
                <span className="text-teal-700 font-bold">
                  Azura Vascular Care
                </span>
                .
              </p>
            </div>
          </div>
        </TimelineNode>

        {/* --- 2025: CENTERPIECE --- */}
        <FadeInItem>
          <div className="relative flex flex-col items-center mt-24 mb-24">
            {/* Mask/eraser behind card to hide line */}
            <div className="absolute top-10 bottom-[-100px] left-1/2 -translate-x-1/2 w-6 bg-blue-50 z-0 hidden md:block" />

            <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-teal-800 rounded-full shadow-2xl flex items-center justify-center text-white z-10 mb-8 border-4 border-white/50 relative">
              <Handshake size={32} />
            </div>

            <div className="bg-white/100 backdrop-blur-xl border-2 border-white shadow-2xl rounded-3xl p-8 md:p-12 text-center max-w-2xl w-full relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-900 via-teal-500 to-blue-900" />

              <div className="mb-6 flex justify-center">
                <span className="px-4 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-bold uppercase tracking-widest">
                  2025 • Present Day
                </span>
              </div>

              <div className="w-full flex justify-center mb-0 mt-4 md:-mt-40">
                <img
                  src={ASSETS.logo}
                  alt="Dayton Kidney"
                  className="w-full max-w-lg h-auto object-contain drop-shadow-lg"
                />
              </div>

              <h3 className="text-4xl font-extrabold mb-4 -mt-20 bg-gradient-to-r from-blue-900 to-teal-600 bg-clip-text text-transparent">
                Better Together.
              </h3>

              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Recognizing that we could achieve more by uniting our strengths,
                Renal Physicians and Nephrology Associates have merged to form{" "}
                <strong>Dayton Kidney</strong>.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                Today, we stand as the premier provider of kidney care in the
                region—offering an expanded network, more locations, and
                cutting-edge treatments while maintaining the personal touch you
                have come to expect from us.
              </p>
            </div>
          </div>
        </FadeInItem>
      </div>
    </div>
  );
};

export default AboutView;
