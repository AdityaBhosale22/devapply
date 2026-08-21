import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      filter: "blur(7px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const contentVariants = {
    rest: {
      x: 0,
    },
    hover: {
      x: 6,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const numberVariants = {
    rest: {
      opacity: 0.35,
      x: 0,
    },
    hover: {
      opacity: 0.85,
      x: 2,
      transition: {
        duration: 0.3,
      },
    },
  };

  const arrowVariants = {
    rest: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
    },
    hover: {
      x: 3,
      y: -3,
      scale: 1.08,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 18,
      },
    },
  };

  return (
    <section
      id="ai-tools"
      className="
        relative
        w-full
        bg-white
        px-5
        sm:px-8
        pt-28
        sm:pt-36
        pb-28
        sm:pb-36
        overflow-hidden
      "
    >
      <div className="max-w-[88rem] mx-auto">

        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            filter: "blur(7px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            margin: "-120px",
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-8
            mb-16
            sm:mb-20
          "
        >
          {/* Heading */}
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#111111]/55
                mb-5
              "
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.15,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#111111]/45
                "
              />

              AI-powered tools
            </div>

            <h2
              className="
                text-4xl
                sm:text-5xl
                lg:text-[4.2rem]
                font-semibold
                tracking-[-0.045em]
                leading-[0.98]
                text-[#111111]
                max-w-2xl
              "
            >
              Everything you need to
              <span className="text-[#111111]/35"> move forward.</span>
            </h2>
          </div>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-sm
              text-sm
              sm:text-base
              leading-relaxed
              text-[#111111]/50
              lg:pb-1
            "
          >
            From improving your resume to finding the right opportunities,
            DevApply gives you the tools to build a stronger job search.
          </motion.p>
        </motion.div>

        {/* =========================================
            TOOLS LIST
        ========================================== */}

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-100px",
          }}
          className="
            border-t
            border-[#111111]/10
          "
        >
          {AiToolsData.map((tool, index) => {
            const isDisabled = tool.path === "#";

            return (
              <motion.li
                key={index}
                variants={rowVariants}
                initial="rest"
                whileHover={!isDisabled ? "hover" : "rest"}
                className={`
                  group
                  relative
                  border-b
                  border-[#111111]/10
                  ${isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                  }
                `}
                onClick={() => {
                  if (user && !isDisabled) {
                    navigate(tool.path);
                  }
                }}
              >
                {/* Hover surface */}
                {!isDisabled && (
                  <motion.div
                    className="
                      absolute
                      inset-0
                      bg-[#f5f5f3]
                      pointer-events-none
                    "
                    initial={{
                      opacity: 0,
                      scaleY: 0.7,
                    }}
                    variants={{
                      rest: {
                        opacity: 0,
                        scaleY: 0.7,
                      },
                      hover: {
                        opacity: 1,
                        scaleY: 1,
                        transition: {
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                    style={{
                      transformOrigin: "center",
                    }}
                  />
                )}

                {/* Accent line */}
                {!isDisabled && (
                  <motion.div
                    className="
                      absolute
                      left-0
                      top-0
                      bottom-0
                      w-[2px]
                      bg-[#111111]
                      pointer-events-none
                    "
                    variants={{
                      rest: {
                        scaleY: 0,
                        opacity: 0,
                      },
                      hover: {
                        scaleY: 1,
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                    style={{
                      transformOrigin: "center",
                    }}
                  />
                )}

                {/* Row */}
                <div
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-between
                    gap-6
                    py-7
                    sm:py-9
                    lg:py-10
                  "
                >
                  {/* Left */}
                  <div className="flex items-center gap-5 sm:gap-8 min-w-0">

                    {/* Number */}
                    <motion.span
                      variants={numberVariants}
                      className="
                        w-7
                        sm:w-10
                        shrink-0
                        text-xs
                        sm:text-sm
                        font-medium
                        tabular-nums
                        text-[#111111]
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.span>

                    {/* Content */}
                    <motion.div
                      variants={contentVariants}
                      className="
                        flex
                        flex-col
                        gap-2
                        min-w-0
                      "
                    >
                      <h3
                        className="
                          text-xl
                          sm:text-2xl
                          lg:text-[1.7rem]
                          font-semibold
                          tracking-[-0.025em]
                          text-[#111111]
                        "
                      >
                        {tool.title}
                      </h3>

                      <p
                        className="
                          hidden
                          sm:block
                          max-w-lg
                          text-sm
                          leading-relaxed
                          text-[#111111]/45
                        "
                      >
                        {tool.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    variants={arrowVariants}
                    className="
                      relative
                      shrink-0
                      w-11
                      h-11
                      sm:w-14
                      sm:h-14
                      rounded-full
                      bg-[#0a0a0a]
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ArrowUpRight
                      className="
                        w-5
                        h-5
                        sm:w-6
                        sm:h-6
                      "
                    />
                  </motion.div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* =========================================
            BOTTOM MICRO CTA
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            items-center
            justify-between
            pt-7
            text-xs
            uppercase
            tracking-[0.14em]
            text-[#111111]/35
          "
        >
          <span>
            Built for ambitious developers
          </span>

          <motion.span
            animate={{
              x: [0, 4, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden sm:inline"
          >
            Explore tools →
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default AiTools;