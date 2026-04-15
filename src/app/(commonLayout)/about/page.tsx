// src/app/(commonLayout)/about/page.tsx
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  HeartPulse,
  Users,
  Store,
  BadgeCheck,
  ArrowRight,
  Package,
  Star,
  Clock,
} from "lucide-react";

function Stat({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: string;
}) {
  return (
    <div
      className="about-fadein flex flex-col items-center text-center"
      style={{ animationDelay: delay }}
    >
      <span className="text-5xl font-display font-bold text-[#0b1f3a] dark:text-white tracking-tight">
        {value}
      </span>
      <span className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  delay: string;
}) {
  return (
    <div
      className="about-fadein group relative bg-white dark:bg-[#0e1f35] border border-slate-100 dark:border-slate-700/60 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: delay }}
    >
      {/* accent line */}
      <span className="absolute top-0 left-8 right-8 h-[2px] bg-[#2ecc8a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="w-12 h-12 bg-[#edfaf3] dark:bg-[#14332a] rounded-2xl flex items-center justify-center mb-5">
        <Icon size={22} className="text-[#27ae72]" />
      </div>
      <h3 className="font-display text-[#0b1f3a] dark:text-white text-lg font-semibold mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function TeamMember({
  name,
  role,
  initial,
  color,
  delay,
}: {
  name: string;
  role: string;
  initial: string;
  color: string;
  delay: string;
}) {
  return (
    <div
      className="about-fadein flex flex-col items-center text-center gap-3"
      style={{ animationDelay: delay }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-display font-bold text-white shadow-lg"
        style={{ background: color }}
      >
        {initial}
      </div>
      <div>
        <p className="font-semibold text-[#0b1f3a] dark:text-white text-sm">{name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

function TimelineStep({
  year,
  title,
  body,
  isLast,
  delay,
}: {
  year: string;
  title: string;
  body: string;
  isLast?: boolean;
  delay: string;
}) {
  return (
    <div
      className="about-fadein relative flex gap-5"
      style={{ animationDelay: delay }}
    >
      {/* line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700" />
      )}
      {/* dot */}
      <div className="shrink-0 w-10 h-10 rounded-full bg-[#edfaf3] dark:bg-[#14332a] border-2 border-[#2ecc8a] flex items-center justify-center z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#27ae72]" />
      </div>
      <div className="pb-10">
        <span className="text-xs font-bold text-[#27ae72] uppercase tracking-widest">{year}</span>
        <h4 className="font-display font-semibold text-[#0b1f3a] dark:text-white mt-0.5 text-base">
          {title}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .font-display { font-family: 'DM Serif Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes aboutFade {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-fadein {
          opacity: 0;
          animation: aboutFade 0.6s ease forwards;
        }

        .dot-grid {
          background-image: radial-gradient(circle, #94a3b820 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .dark .dot-grid {
          background-image: radial-gradient(circle, #ffffff0f 1px, transparent 1px);
        }
      `}</style>

      <main className="font-body bg-[#f8fafd] dark:bg-[#060e1a] min-h-screen text-[#0b1f3a] dark:text-white">

        <section className="relative overflow-hidden bg-[#0b1f3a] dark:bg-[#04101e] text-white">
          <div className="absolute inset-0 dot-grid opacity-40" />
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#2ecc8a] rounded-full blur-[120px] opacity-10" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#1a7faf] rounded-full blur-[100px] opacity-10" />

          <div className="relative container mx-auto max-w-6xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="about-fadein inline-flex items-center gap-2 bg-[#2ecc8a]/10 border border-[#2ecc8a]/30 text-[#2ecc8a] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
                style={{ animationDelay: "0.1s" }}
              >
                <HeartPulse size={13} /> About MediStore
              </div>
              <h1
                className="about-fadein font-display text-5xl md:text-6xl font-bold leading-tight mb-6"
                style={{ animationDelay: "0.2s" }}
              >
                Your Trusted
                <br />
                <em className="text-[#2ecc8a] not-italic">Online Medicine</em>
                <br />
                Shop
              </h1>
              <p
                className="about-fadein text-slate-300 text-lg leading-relaxed max-w-md mb-8"
                style={{ animationDelay: "0.35s" }}
              >
                MediStore connects customers with verified OTC medicines and trusted sellers —
                making healthcare more accessible, transparent, and convenient for everyone.
              </p>
              <div
                className="about-fadein flex gap-3 flex-wrap"
                style={{ animationDelay: "0.5s" }}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#2ecc8a] hover:bg-[#27b87c] text-[#0b1f3a] font-semibold px-6 py-3 rounded-2xl transition"
                >
                  Browse Shop <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-2xl transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div
              className="about-fadein hidden md:flex justify-center"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="relative w-72">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-4">
                  {[
                    { icon: BadgeCheck, label: "Verified Sellers", color: "#2ecc8a" },
                    { icon: Package,    label: "1,200+ Medicines",  color: "#60a5fa" },
                    { icon: Truck,      label: "Fast Delivery",      color: "#f59e0b" },
                    { icon: ShieldCheck,label: "Secure & Trusted",   color: "#c084fc" },
                  ].map(({ icon: Icon, label, color }, i) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: color + "22" }}
                      >
                        <Icon size={16} style={{ color }} />
                      </div>
                      <span className="text-sm font-medium text-white/90">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-10 bg-[#2ecc8a]/20 rounded-full blur-sm" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1628]">
          <div className="container mx-auto max-w-5xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
            <Stat value="1,200+"  label="Medicines"      delay="0.1s" />
            <Stat value="340+"    label="Active Sellers"  delay="0.2s" />
            <Stat value="18,000+" label="Happy Customers" delay="0.3s" />
            <Stat value="4.9★"    label="Avg. Rating"     delay="0.4s" />
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="about-fadein relative hidden md:block" style={{ animationDelay: "0.15s" }}>
            <div className="bg-[#edfaf3] dark:bg-[#0a1e16] rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ecc8a]/10 rounded-full translate-x-10 -translate-y-10" />
              <HeartPulse size={48} className="text-[#27ae72] mb-6 relative z-10" />
              <blockquote className="font-display text-2xl text-[#0b1f3a] dark:text-white leading-snug relative z-10">
                "Healthcare should be <em>accessible</em> to everyone, not just a privileged few."
              </blockquote>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 relative z-10">
                — The MediStore Team
              </p>
            </div>
          </div>

          <div>
            <p
              className="about-fadein text-xs font-bold text-[#27ae72] uppercase tracking-widest mb-3"
              style={{ animationDelay: "0.1s" }}
            >
              Our Mission
            </p>
            <h2
              className="about-fadein font-display text-4xl font-bold leading-tight mb-5"
              style={{ animationDelay: "0.2s" }}
            >
              Making Medicine
              <br />Accessible for All
            </h2>
            <div className="space-y-4">
              {[
                { delay: "0.3s", text: "MediStore was built with a single purpose: to bridge the gap between people who need everyday OTC medicines and the sellers who provide them — all within a platform that prioritises safety, transparency, and ease of use." },
                { delay: "0.4s", text: "We verify every seller, ensure medicine listings are accurate and detailed, and provide customers with the confidence they need to make informed health decisions from home." },
                { delay: "0.5s", text: "Our three-role platform — Customer, Seller, and Admin — ensures that every interaction is accountable, every order is traceable, and every product meets our standards." },
              ].map(({ delay, text }) => (
                <p
                  key={delay}
                  className="about-fadein text-slate-500 dark:text-slate-400 leading-relaxed"
                  style={{ animationDelay: delay }}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f0f4f9] dark:bg-[#070f1c] py-20">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <p
                className="about-fadein text-xs font-bold text-[#27ae72] uppercase tracking-widest mb-3"
                style={{ animationDelay: "0.1s" }}
              >
                What We Stand For
              </p>
              <h2
                className="about-fadein font-display text-4xl font-bold"
                style={{ animationDelay: "0.2s" }}
              >
                Our Core Values
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ValueCard icon={ShieldCheck}  title="Safety First"           body="Every medicine and seller goes through a rigorous verification process before appearing on the platform. Your safety is non-negotiable."        delay="0.1s" />
              <ValueCard icon={BadgeCheck}   title="Verified Sellers"       body="We onboard only trusted, licensed sellers. Each listing is reviewed to ensure accuracy — no misleading claims, ever."                           delay="0.2s" />
              <ValueCard icon={Truck}        title="Reliable Delivery"      body="Fast, trackable deliveries with real-time order updates so you always know exactly where your medicines are."                                     delay="0.3s" />
              <ValueCard icon={HeartPulse}   title="Customer Wellbeing"     body="We're not just an e-commerce platform. We care about the people behind every order and strive to make healthcare less stressful."                delay="0.4s" />
              <ValueCard icon={Users}        title="Seller Empowerment"     body="Independent medicine sellers get powerful tools to manage inventory, track orders, and grow their business — without the big-platform fees."     delay="0.5s" />
              <ValueCard icon={Star}         title="Transparent Reviews"    body="Every review is from a verified purchaser. Honest feedback builds trust and helps future customers make the right decisions."                    delay="0.6s" />
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-14">
            <p
              className="about-fadein text-xs font-bold text-[#27ae72] uppercase tracking-widest mb-3"
              style={{ animationDelay: "0.1s" }}
            >
              The Platform
            </p>
            <h2
              className="about-fadein font-display text-4xl font-bold"
              style={{ animationDelay: "0.2s" }}
            >
              Built for Three Roles
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                role: "Customer",
                color: "bg-blue-50 dark:bg-blue-900/20",
                iconColor: "text-blue-500",
                delay: "0.1s",
                steps: [
                  "Browse medicines by category or search",
                  "Add items to cart and manage quantities",
                  "Place secure orders and track delivery",
                  "Leave verified reviews after purchase",
                ],
              },
              {
                icon: Store,
                role: "Seller",
                color: "bg-[#edfaf3] dark:bg-[#0a1e16]",
                iconColor: "text-[#27ae72]",
                delay: "0.25s",
                steps: [
                  "Create and manage medicine listings",
                  "Set pricing, stock levels, and images",
                  "Receive and fulfil customer orders",
                  "Track sales performance on dashboard",
                ],
              },
              {
                icon: ShieldCheck,
                role: "Admin",
                color: "bg-purple-50 dark:bg-purple-900/20",
                iconColor: "text-purple-500",
                delay: "0.4s",
                steps: [
                  "Oversee all users, sellers & listings",
                  "Approve or reject seller applications",
                  "Manage categories and platform config",
                  "Monitor orders and resolve disputes",
                ],
              },
            ].map(({ icon: Icon, role, color, iconColor, steps, delay }) => (
              <div
                key={role}
                className={`about-fadein rounded-3xl p-6 ${color} border border-slate-100 dark:border-slate-700/40`}
                style={{ animationDelay: delay }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Icon size={22} className={iconColor} />
                  <span className="font-display font-semibold text-lg text-[#0b1f3a] dark:text-white">
                    {role}
                  </span>
                </div>
                <ul className="space-y-3">
                  {steps.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2ecc8a] shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-[#0a1628] py-20">
          <div className="container mx-auto max-w-3xl px-6">
            <div className="text-center mb-14">
              <p
                className="about-fadein text-xs font-bold text-[#27ae72] uppercase tracking-widest mb-3"
                style={{ animationDelay: "0.1s" }}
              >
                Our Journey
              </p>
              <h2
                className="about-fadein font-display text-4xl font-bold"
                style={{ animationDelay: "0.2s" }}
              >
                How We Got Here
              </h2>
            </div>
            <div>
              <TimelineStep year="2024 Q1" title="The Idea"            body="Frustrated by unreliable, cluttered medicine apps, our founding team set out to build something better — transparent, fast, and trustworthy."  delay="0.1s" />
              <TimelineStep year="2024 Q3" title="Development Begins"  body="Built on Next.js, Express, and Prisma with Better Auth powering secure multi-role authentication across customers, sellers, and admins."         delay="0.2s" />
              <TimelineStep year="2025 Q1" title="Beta Launch"         body="Launched a closed beta with 50 verified sellers and 500 early adopters. Gathered crucial feedback on UX, cart flows, and order management."       delay="0.3s" />
              <TimelineStep year="2025 Q3" title="Public Launch"       body="MediStore opens to the public. Over 1,200 medicines listed. Real-time order tracking and seller dashboards go live."                               delay="0.4s" />
              <TimelineStep year="2026 →"  title="What's Next"         body="Prescription medicine partnerships, live pharmacist chat support, mobile apps, and expanded delivery networks across the UK."                       delay="0.5s" isLast />
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-12">
            <p
              className="about-fadein text-xs font-bold text-[#27ae72] uppercase tracking-widest mb-3"
              style={{ animationDelay: "0.1s" }}
            >
              The People
            </p>
            <h2
              className="about-fadein font-display text-4xl font-bold"
              style={{ animationDelay: "0.2s" }}
            >
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
            <TeamMember name="Alex Mercer"    role="Founder & CEO"       initial="A" color="linear-gradient(135deg,#0b1f3a,#1a4a7a)" delay="0.1s" />
            <TeamMember name="Sara Okafor"    role="Head of Product"     initial="S" color="linear-gradient(135deg,#27ae72,#1a7a52)" delay="0.2s" />
            <TeamMember name="James Liu"      role="Lead Engineer"       initial="J" color="linear-gradient(135deg,#1a7faf,#0d4f6e)" delay="0.3s" />
            <TeamMember name="Priya Sharma"   role="UX & Design"         initial="P" color="linear-gradient(135deg,#7c3aed,#4c1d95)" delay="0.4s" />
            <TeamMember name="Tom Fitzgerald" role="Seller Relations"    initial="T" color="linear-gradient(135deg,#d97706,#92400e)" delay="0.5s" />
          </div>
        </section>

        <section className="bg-[#0b1f3a] dark:bg-[#04101e] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2ecc8a] rounded-full blur-[120px] opacity-10" />
          <div className="relative container mx-auto max-w-3xl px-6 text-center">
            <div
              className="about-fadein w-16 h-16 bg-[#2ecc8a]/10 border border-[#2ecc8a]/30 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ animationDelay: "0.1s" }}
            >
              <HeartPulse size={28} className="text-[#2ecc8a]" />
            </div>
            <h2
              className="about-fadein font-display text-4xl md:text-5xl font-bold mb-4"
              style={{ animationDelay: "0.2s" }}
            >
              Ready to get started?
            </h2>
            <p
              className="about-fadein text-slate-400 text-lg mb-8 max-w-xl mx-auto"
              style={{ animationDelay: "0.3s" }}
            >
              Browse over 1,200 OTC medicines, compare sellers, and get fast delivery — all in one trusted platform.
            </p>
            <div
              className="about-fadein flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#2ecc8a] hover:bg-[#27b87c] text-[#0b1f3a] font-semibold px-8 py-4 rounded-2xl transition text-base"
              >
                Shop Now <ArrowRight size={17} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition text-base"
              >
                Become a Seller <Store size={17} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}