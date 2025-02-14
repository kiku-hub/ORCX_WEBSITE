import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  subtitle,
  description,
  image,
  source_code_link,
}) => {
  return (
    <motion.div 
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className='w-full'>
      <motion.div
        className='bg-[#1d1836] border-2 border-transparent p-5 rounded-2xl w-full sm:w-[550px] md:w-[650px] lg:w-[800px] mx-auto'
      >
        <motion.div
          variants={fadeIn("", "", index * 0.2, 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className='w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-gradient-to-br from-[#1d1836] to-[#232631] rounded-xl overflow-hidden relative group shadow-lg mb-8'
        >
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />
        </motion.div>

        <div className='mt-5'>
          <motion.div
            variants={fadeIn("", "", index * 0.3, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-1"
          >
            <h3 className='text-white text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold'>{name}</h3>
          </motion.div>

          <motion.p
            variants={fadeIn("", "", index * 0.4, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className='mt-2 text-secondary text-[12px] sm:text-[13px] md:text-[14px] italic'
          >
            {subtitle}
          </motion.p>

          <motion.p
            variants={fadeIn("", "", index * 0.5, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className='mt-4 text-white-100 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed'
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Products = () => {
  return (
    <section className={`relative w-full h-screen mx-auto bg-gradient-to-b from-transparent to-[#0a0a0a]`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <motion.div
        className="absolute inset-0 from-[#00a8ff]/5 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 1, 0.3],
          filter: ["blur(4px)", "blur(2px)", "blur(4px)"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className={`absolute inset-0 top-[40%] -translate-y-1/2 max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-center justify-center`}>
        <motion.div 
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-2"
        >
          <p className={styles.sectionSubText}>製品</p>
          <h2 className={styles.sectionHeadText}>Products.</h2>
        </motion.div>

        <div className='mt-2 flex flex-wrap gap-7 justify-center'>
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} index={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Products, "products");
