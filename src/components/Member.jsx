import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { members } from "../constants";

const MemberCard = ({ members }) => (
  <motion.div
    variants={fadeIn("up", "spring", 0.5, 0.75)}
    className='w-full p-[1px] rounded-[20px] shadow-card'
  >
    <div className='bg-[#003973] hover:bg-[#004483] p-7 rounded-[20px]'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {members.map((member, index) => (
          <div key={member.name} className='flex flex-col items-center text-center'>
            <div className='w-[250px] h-[250px] rounded-full bg-tertiary mb-5'>
              {/* Three.js model will be placed here */}
            </div>
            <h3 className='text-white font-bold text-[24px]'>{member.name}</h3>
            <p className='text-secondary text-[16px] mt-2'>
              {member.role} of {member.company}
            </p>
            <p className='mt-5 text-white tracking-wider text-[16px] leading-[28px]'>
              {member.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const Member = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>チームメンバー</p>
        <h2 className={styles.sectionHeadText}>Members.</h2>
      </motion.div>

      <div className='mt-20 max-w-7xl mx-auto'>
        <MemberCard members={members} />
      </div>
    </>
  );
};

export default SectionWrapper(Member, "member"); 