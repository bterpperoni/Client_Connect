import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export interface AnimatedPercentageProps {
  percentage: number;
  classList: string; // Le pourcentage à afficher
}

const AnimatedPercentage: React.FC<AnimatedPercentageProps> = ({
  percentage,
  classList,
}) => {
  // Crée une valeur de motion pour stocker le pourcentage
  const motionValue = useMotionValue(0);

  // On transforme la valeur de motion en une valeur entière affichable
  const roundedPercentage = useTransform(motionValue, (value) =>
    Math.round(value)
  );

  // Anime la valeur chaque fois que le pourcentage change
  useEffect(() => {
    const controls = animate(motionValue, percentage, {
      duration: 1.2,
      ease: "easeInOut",
    });
    return controls.stop;
  }, [percentage, motionValue]);

  return (
    <motion.div className={`text-2xl text-black ${classList} `}>
      <motion.span>{roundedPercentage}</motion.span>%
    </motion.div>
  );
};

export default AnimatedPercentage;
