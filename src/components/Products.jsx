import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { github } from "../assets";

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
      viewport={{ once: true, amount: 0.25 }}
      className='w-full'>
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className='bg-[#1d1836] hover:bg-[#232631] hover:border-[#4a4a8f] border-2 border-transparent p-5 rounded-2xl w-full sm:w-[550px] md:w-[650px] lg:w-[800px] mx-auto transition-all duration-300'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className='w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-[#1d1836] to-[#232631] rounded-xl overflow-hidden relative group shadow-lg mb-8'
        >
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          {source_code_link !== "#" && (
            <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <img
                  src={github}
                  alt='source code'
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            </div>
          )}
        </motion.div>

        <div className='mt-5'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className="mb-6"
          >
            <h3 className='text-white text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-bold'>{name}</h3>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.4 }}
            className='mt-3 text-secondary text-[12px] sm:text-[13px] md:text-[14px] italic'
          >
            {subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.5 }}
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
          className="text-center"
        >
          <p className={styles.sectionSubText}>製品</p>
          <h2 className={styles.sectionHeadText}>Products.</h2>
        </motion.div>

        <div className='mt-12 flex flex-wrap gap-7 justify-center'>
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} index={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Products, "products");
