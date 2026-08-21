import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: "blur(6px)",
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

  const linkVariants = {
    rest: {
      x: 0,
    },
    hover: {
      x: 5,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <footer
      className="
        relative overflow-hidden
        rounded-t-[2rem]
        bg-[#0a0a0a]
        text-white
        mt-20
      "
    >
      {/* Ambient background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          -top-40
          right-[-10%]
          w-[35rem]
          h-[35rem]
          rounded-full
          bg-white/[0.025]
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          relative z-10
          max-w-[88rem]
          mx-auto
          px-5 sm:px-8
          pt-20 lg:pt-24
          pb-10
        "
      >
        {/* =========================================
            CTA HEADER
        ========================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-100px",
          }}
          className="
            flex flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-8
            border-b border-white/10
            pb-16
          "
        >
          <motion.div
            variants={itemVariants}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="
                  w-1.5 h-1.5
                  rounded-full
                  bg-white/50
                "
              />

              <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                Let's build something
              </span>
            </div>

            <h2
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-semibold
                tracking-[-0.04em]
                leading-[0.98]
                max-w-[16ch]
              "
            >
              Have a project in mind? Let's get to work.
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
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
                bg-[#f1f0ee]
                text-[#111111]
                py-3.5
                pl-6
                pr-1.5
                text-sm
                font-medium
                whitespace-nowrap
              "
            >
              Start a project

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
                  flex items-center justify-center
                  rounded-full
                  bg-[#0a0a0a]
                  text-white
                "
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* =========================================
            FOOTER CONTENT
        ========================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-80px",
          }}
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-12
            py-16
          "
        >
          {/* Brand */}
          <motion.div
            variants={itemVariants}
            className="col-span-1"
          >
            <motion.div
              whileHover={{ x: 3 }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-2 mb-4 w-fit"
            >
              <span
                className="
                  text-2xl
                  font-extrabold
                  tracking-[-0.06em]
                  text-white
                "
              >
                DevApply.
              </span>
            </motion.div>

            <p
              className="
                text-sm
                text-white/50
                max-w-[20rem]
                leading-relaxed
              "
            >
              The AI-powered career assistant helping developers land their
              dream jobs. Optimize resumes, generate cover letters, and track
              applications.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div variants={itemVariants}>
            <h3
              className="
                text-xs
                uppercase
                tracking-[0.16em]
                text-white/35
                mb-6
                font-medium
              "
            >
              Product
            </h3>

            <ul className="flex flex-col gap-3 text-sm">
              {[
                ["Resume Analyzer", "/app/resumeanalyzer"],
                ["Cover Letter Generator", "/app/coverlettergenerator"],
                ["Project Bullet Enhancer", "/app/projectbulletgenerator"],
                ["Job Fit Scorer", "/app/jobfitanalyzer"],
                ["Pricing Plans", "/app/pricing"],
              ].map(([label, path]) => (
                <motion.li
                  key={path}
                  initial="rest"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link
                    to={path}
                    className="
                      inline-block
                      text-white/60
                      hover:text-white
                      transition-colors
                      duration-200
                    "
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants}>
            <h3
              className="
                text-xs
                uppercase
                tracking-[0.16em]
                text-white/35
                mb-6
                font-medium
              "
            >
              Connect
            </h3>

            <ul className="flex flex-col gap-3 text-sm">
              <motion.li
                initial="rest"
                whileHover="hover"
                variants={linkVariants}
              >
                <a
                  href="https://x.com/adityyaxb"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-white/60
                    hover:text-white
                    transition-colors
                    duration-200
                  "
                >
                  <Twitter size={15} />
                  Twitter
                </a>
              </motion.li>

              <motion.li
                initial="rest"
                whileHover="hover"
                variants={linkVariants}
              >
                <a
                  href="https://www.linkedin.com/in/adityabhosale22/"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-white/60
                    hover:text-white
                    transition-colors
                    duration-200
                  "
                >
                  <Linkedin size={15} />
                  LinkedIn
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3
              className="
                text-xs
                uppercase
                tracking-[0.16em]
                text-white/35
                mb-6
                font-medium
              "
            >
              Stay Updated
            </h3>

            {status === "success" ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  px-4
                  py-3.5
                  bg-[#b15f2c]/15
                  border border-[#b15f2c]/25
                  rounded-[0.875rem]
                  text-sm
                  text-white/90
                  text-center
                  font-medium
                "
              >
                🎉 Subscribed successfully!
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3"
              >
                <motion.input
                  whileFocus={{
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    w-full
                    px-4
                    py-3
                    bg-white/[0.04]
                    border border-white/10
                    rounded-[0.875rem]
                    text-sm
                    text-white
                    placeholder:text-white/35
                    focus:outline-none
                    focus:border-white/25
                    focus:bg-white/[0.07]
                    transition-all
                  "
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (status === "error") {
                      setStatus("");
                    }
                  }}
                />

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.015,
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
                    w-full
                    px-4
                    py-3
                    bg-[#b15f2c]
                    text-white
                    text-sm
                    font-medium
                    rounded-full
                  "
                >
                  Subscribe
                </motion.button>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-300"
                  >
                    Please enter a valid email address.
                  </motion.p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>

        {/* =========================================
            BOTTOM BAR
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
            margin: "-50px",
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
            border-t border-white/10
            pt-8
            text-xs
            text-white/40
          "
        >
          <p>
            © {new Date().getFullYear()} DevApply. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="
                hover:text-white
                transition-colors
                duration-200
              "
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="
                hover:text-white
                transition-colors
                duration-200
              "
            >
              Terms
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Giant Background Wordmark */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          margin: "-100px",
        }}
        transition={{
          duration: 1.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          inset-x-0
          -bottom-6
          z-0
          text-center
          pointer-events-none
          select-none
          font-bold
          leading-none
          text-[13rem]
          sm:text-[16rem]
          lg:text-[18rem]
          text-white/[0.035]
          tracking-[-0.08em]
          whitespace-nowrap
        "
      >
        DEVAPPLY
      </motion.div>
    </footer>
  );
};

export default Footer;