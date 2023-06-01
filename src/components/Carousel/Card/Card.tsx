import { motion } from 'framer-motion';

type CardProps = {
  image: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
};

export const Card = ({ image, title, onClick, isSelected }: CardProps) => {
  return (
    <motion.div
      className={`rounded-lg max-w-[25.125rem] max-h-[11.688rem] relative overflow-hidden shadow-lg cursor-pointer transition-opacity duration-500 ease-in-out hover:opacity-100 ${
        isSelected ? 'border-4  border-green ' : ''
      }`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0.7 }}
      onClick={onClick} // Add onClick function to the Card component
    >
      <img src={image} alt={title} className="w-full h-2/3 object-cover" />
      <div className="bg-white w-full h-1/3 p-4">
        <h2 className="leading-tight text-center text-black text-base font-thin">
          {title}
        </h2>
      </div>
    </motion.div>
  );
};
