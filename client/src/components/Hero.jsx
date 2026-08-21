// Hero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  const contentVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      filter: "blur(7px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const backgroundTextVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.94,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.4,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      className="
        relative isolate
        h-[100svh]
        min-h-[680px]
        overflow-hidden
        bg-[#c9c9c9]
        rounded-b-[2rem]
        flex flex-col
      "
    >
      {/* Subtle atmospheric light */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="
          absolute inset-0 z-0
          pointer-events-none
          bg-[radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.32),transparent_40%)]
        "
      />

      {/* Legibility overlay */}
      <div
        className="
          absolute inset-0 z-[1]
          pointer-events-none
          bg-gradient-to-b
          from-white/35
          via-transparent
          to-white/35
        "
      />

      {/* =========================================
          MAIN HERO CONTENT
      ========================================== */}

      <div
        className="
          relative z-20
          max-w-[88rem]
          mx-auto
          w-full
          flex-1
          flex
          flex-col
          justify-center
          px-5 sm:px-8
          pt-24
          pb-4
        "
      >
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7 max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-[#111111]/70
            "
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="
                w-1.5 h-1.5
                rounded-full
                bg-[#111111]/50
              "
            />

            Independent Studio
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="
              text-5xl
              sm:text-6xl
              md:text-[4.5rem]
              lg:text-[5rem]
              font-semibold
              leading-[0.96]
              tracking-[-0.045em]
              text-[#111111]
              max-w-3xl
            "
          >
            Elevate your career with DevApply.
          </motion.h1>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 mt-3"
          >
            <motion.button
              onClick={() => navigate("/app/dashboard")}
              whileHover={{
                scale: 1.025,
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#0a0a0a]
                text-white
                py-3.5
                pl-6
                pr-1.5
                text-sm
                font-medium
                shadow-[0_12px_35px_rgba(0,0,0,0.12)]
              "
            >
              Start building

              <motion.span
                whileHover={{
                  rotate: 45,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  w-9 h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#0a0a0a]
                "
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* =========================================
          GIANT BRAND WORDMARK
      ========================================== */}

      <motion.div
        variants={backgroundTextVariants}
        initial="hidden"
        animate="show"
        className="
          relative z-[1]
          w-full
          text-center
          pointer-events-none
          select-none
          font-bold
          leading-none
          text-[15vw]
          lg:text-[13rem]
          text-white/50
          tracking-[-0.07em]
          -mb-3
        "
      >
        DEVAPPLY
      </motion.div>

      {/* =========================================
          BOTTOM INFORMATION BAR
      ========================================== */}

      <div
        className="
          relative z-20
          max-w-[88rem]
          mx-auto
          w-full
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-[#111111]/10
          p-5
          sm:px-8
          text-xs
          font-medium
          uppercase
          tracking-wider
          text-[#111111]/60
        "
      >
        {/* Left */}
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 1,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Working since 2025
        </motion.span>

        {/* Center */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.1,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="hidden sm:inline"
        >
          The all-in-one AI career assistant
        </motion.span>

        {/* Scroll indicator */}
        <motion.span
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 1.2,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-flex items-center gap-2"
        >
          Scroll to explore

          <motion.span
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-lg leading-none"
          >
            ↓
          </motion.span>
        </motion.span>
      </div>

      {/* Very subtle bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-30" />
    </section>
  );
};

export default Hero;