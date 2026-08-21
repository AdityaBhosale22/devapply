// Testimonials.jsx
import React from "react";

const Testimonials = () => {
  const cardsData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@briarcodes",
      role: "Frontend Engineer",
      text: "The Cover Letter Generator is pure magic. It tailored my application perfectly to the job description and I landed an interview within 24 hours.",
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averydev",
      role: "Full Stack Developer",
      text: "DevApply's Resume Analyzer found critical keywords I was missing. My callback rate has jumped by at least 40% since I started using it.",
    },
    {
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordanbuilds",
      role: "Software Engineer",
      text: "The Project Bullet Enhancer transformed my weak bullet points into strong, metric-driven achievements. Highly recommend for any dev looking to level up.",
    },
    {
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Marcus Chen",
      handle: "@marcus_dev",
      role: "Junior Developer",
      text: "As a self-taught dev, I struggled with how to present my portfolio. DevApply guided me to position my skills perfectly and helped me land my first tech role.",
    },
    {
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60",
      name: "Sarah Jenkins",
      handle: "@sarahjtech",
      role: "React Developer",
      text: "I was tired of writing repetitive cover letters. DevApply automated the boring parts while keeping my personal voice intact. A total game changer.",
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-6 sm:p-8 rounded-[1.5rem] mr-4 sm:mr-6 w-[22rem] sm:w-[26rem] shrink-0 border border-[#e6e5e2] bg-white transition-colors duration-300 hover:bg-[#f1f0ee] flex flex-col justify-between gap-6 cursor-pointer">
      <p className="text-sm text-[#111111]/80 leading-relaxed font-medium">
        "{card.text}"
      </p>
      
      <div className="flex gap-4 items-center">
        <img
          className="w-12 h-12 rounded-full object-cover border border-[#e6e5e2]"
          src={card.image}
          alt={card.name}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-sm text-[#111111]">{card.name}</p>
            <span className="text-xs text-[#111111]/40">•</span>
            <span className="text-xs font-medium text-[#111111]/60">
              {card.handle}
            </span>
          </div>
          <span className="text-xs font-medium text-[#111111]/50 mt-0.5">{card.role}</span>
        </div>
      </div>
    </div>
  );

  return (
    /* Changed to full width background to block the dark canvas behind it */
    <section className="w-full bg-white py-20 overflow-hidden">
      
      {/* Inner container to hold the 88rem width limit */}
      <div className="max-w-[88rem] mx-auto px-5 sm:px-8">
        
        <div className="mb-12 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#111111]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/50"></span>
            Wall of Love
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] max-w-lg">
            Loved by builders
          </h2>
          <p className="text-sm font-medium text-[#111111]/60">
            Join thousands of developers landing their dream roles with AI.
          </p>
        </div>

        <style>{`
          @keyframes marqueeScroll {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
          }

          .marquee-inner {
              animation: marqueeScroll 35s linear infinite;
          }
          
          .marquee-inner:hover {
              animation-play-state: paused;
          }

          .marquee-reverse {
              animation-direction: reverse;
          }
        `}</style>

        {/* Marquee Container - explicitly hidden overflow so it clips at the edge */}
        <div className="relative w-full overflow-hidden">
          
          {/* Gradient Masks - Increased width for a smoother fade! */}
          <div className="absolute left-0 top-0 h-full w-24 sm:w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-24 sm:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>

          {/* Marquee Row 1 */}
          <div className="marquee-row w-full mb-4 sm:mb-6">
            <div className="marquee-inner flex transform-gpu min-w-[200%]">
              {[...cardsData, ...cardsData].map((card, index) => (
                <CreateCard key={`row1-${index}`} card={card} />
              ))}
            </div>
          </div>

          {/* Marquee Row 2 (Reversed) */}
          <div className="marquee-row w-full">
            <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%]">
              {[...cardsData, ...cardsData].reverse().map((card, index) => (
                <CreateCard key={`row2-${index}`} card={card} />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Testimonials;