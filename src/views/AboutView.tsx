import React from 'react';
import { Target, Eye, ShieldAlert, Award, HelpingHand, HeartHandshake, Sparkles } from 'lucide-react';
import { TEAM_DATA } from '../data';

export default function AboutView() {
  const values = [
    {
      icon: Award,
      title: 'Decades of Awadhi Integrity',
      desc: 'Our constructions respect classical traditions and are built using steel, cement, and electrical cabling brands certified by standard Indian code audits.'
    },
    {
      icon: ShieldAlert,
      title: 'Zero Litigation Guarantee',
      desc: 'Our legal scrupulousness ensures that we only list properties featuring undisputed ancestral title lines and complete public ownership clearances.'
    },
    {
      icon: HeartHandshake,
      title: 'Customer-First Post Sales support',
      desc: 'Our engagement doesn\'t terminate with registry papers. We help set up electricity board, water connections, and local municipal property taxed databases.'
    }
  ];

  return (
    <div id="about-group-wrapper" className="font-sans dark:bg-navy-950 transition-colors">
      
      {/* 1. Header Hero Panel */}
      <section className="relative py-20 bg-navy-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
            alt="Swastik Tower"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            SWASTIK REAL ESTATE SOLUTIONS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight">
            The Gold Benchmark of Lucknow Realty
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Since inception, Swastik Group has envisioned, curated, and facilitated luxurious spaces for thousands of families and business corporate houses across Uttar Pradesh.
          </p>
        </div>
      </section>

      {/* 2. Brand Introduction Story */}
      <section className="py-20 bg-white dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-[4/3] bg-gray-100 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800"
              alt="Swastik office executive desk"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Embedded decorative stats count */}
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-navy-950/95 border border-gold-400/20 text-white flex justify-between items-center z-10">
              <div>
                <p className="font-display font-black text-3xl text-gold-450 leading-none">12+ Yrs</p>
                <p className="text-[10px] text-gray-450 uppercase font-mono tracking-widest mt-1">Lucknow Presence</p>
              </div>
              <div className="h-8 w-px bg-navy-800"></div>
              <div>
                <p className="font-display font-black text-3xl text-gold-450 leading-none">500+</p>
                <p className="text-[10px] text-gray-450 uppercase font-mono tracking-widest mt-1">Allotted Homes</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest">
                FOUNDER DESK NOTE
              </span>
              <h3 className="font-display font-black text-3xl text-navy-900 dark:text-white">
                Our Genesis &amp; Core Vision
              </h3>
            </div>

            <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed font-light">
              Founded under the simple tenet that Lucknow deserves world-class architectural construction combined with standard, clean legal titles, Swastik Group has grown to transcend standard property brokerage concepts. We are strategic asset partners for our customers.
            </p>
            <p className="text-sm text-gray-655 dark:text-gray-300 leading-relaxed font-light">
              Whether you are looking to build a multi-generation family villa on Sultanpur Road Expressway, lease commercial headquarters in Vibhuti Khand, or purchase high-end flats near Hazratganj lanes, we scrutinize every square inch so your future remains safe and profitable.
            </p>

            <blockquote className="border-l-4 border-gold-500 pl-4 py-1 italic text-xs font-bold text-gray-550 dark:text-gray-300 leading-relaxed bg-gold-50/20">
              &ldquo;In Lucknow, real estate isn&apos;t just brick and mortar. It represents family honor, sacred spaces, and hard-earned security. Our systems respect this Awadhi emotion above all business models.&rdquo;
              <span className="block text-[10px] text-gold-650 mt-1 font-mono tracking-wider">— SWASTIK GROUP BOARD OF DIRECTORS</span>
            </blockquote>
          </div>

        </div>
      </section>

      {/* 3. Core Values: Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Mission container */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-900 p-8 rounded-2xl shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-550 shrink-0">
                <Target className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-display font-black text-2xl text-navy-900 dark:text-white">Our Mission</h3>
              <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed font-light">
                To construct and facilitate real estate environments characterized by structural strength, architectural elegance, and legally impeccable titles. We enforce rigorous client protection and provide clear, fair commercial prices in every buy or sell engagement across Lucknow.
              </p>
            </div>

            {/* Vision container */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-900 p-8 rounded-2xl shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-550 shrink-0">
                <Eye className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-display font-black text-2xl text-navy-900 dark:text-white">Our Vision</h3>
              <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed font-light">
                To serve as the absolute gold trust standard in the Uttar Pradesh property sector, leading smart urban townships near expressway corridors and shaping clean luxury high-rises integrated with green building criteria and secure RERA standards.
              </p>
            </div>

          </div>

          <div className="space-y-4 text-center">
            <h4 className="font-display font-extrabold text-base text-gold-650 dark:text-gold-400 uppercase tracking-widest font-mono">
              OUR SERVICE PILLARS
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gold-550" />
                      <h4 className="font-display font-bold text-base text-navy-900 dark:text-white">{v.title}</h4>
                    </div>
                    <p className="text-xs text-gray-450 dark:text-gray-400 leading-relaxed font-light">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Active Team Selection */}
      <section className="py-20 bg-white dark:bg-navy-950 transition-colors text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-xs font-bold text-gold-650 dark:text-gold-400 uppercase tracking-widest">
            EXPERIENCED REALTORS
          </span>
          <h3 className="font-display font-black text-3xl sm:text-4xl text-navy-900 dark:text-white">
            Meet Our Senior Advisors
          </h3>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
            Our relationship leads have over combined 30 years of Lucknow property valuation, zoning checks, and loan liaison expertise.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TEAM_DATA.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 dark:bg-navy-900 border border-gray-100 dark:border-navy-850 p-5 rounded-2xl shadow-xs space-y-4 text-center group scale-on-hover hover:shadow-md transition-all"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform"
                />
              </div>

              <div className="space-y-1 text-left">
                <h4 className="font-display font-extrabold text-base text-navy-900 dark:text-white">
                  {member.name}
                </h4>
                <p className="text-xs text-gold-650 dark:text-gold-400 font-bold uppercase tracking-wider font-mono">
                  {member.role}
                </p>
                <p className="text-[11px] text-gray-450 font-semibold italic">
                  {member.experience}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
