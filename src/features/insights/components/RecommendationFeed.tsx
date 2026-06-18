import React from 'react';
import { motion } from 'framer-motion';
import { RecommendationCard } from './RecommendationCard';
import type { Insight } from '../utils/ruleEngine';

export interface RecommendationFeedProps {
  insights: Insight[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
} as const;

export const RecommendationFeed: React.FC<RecommendationFeedProps> = ({ insights }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 font-sans"
    >
      {insights.map((insight) => (
        <motion.div key={insight.id} variants={itemVariants}>
          <RecommendationCard insight={insight} />
        </motion.div>
      ))}
    </motion.div>
  );
};
export default RecommendationFeed;
