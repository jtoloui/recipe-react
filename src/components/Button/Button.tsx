import { FC } from 'react';

type ButtonProps = {
  text: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  className?: string;
};

export const Button: FC<ButtonProps> = ({
  text,
  variant = 'primary',
  onClick,
  className,
}) => {
  const commonClasses =
    'w-full sm:w-auto h-12 px-4 py-2 rounded-lg shadow-md flex items-center justify-center';
  const variantClasses =
    variant === 'primary'
      ? 'bg-green-500 text-white-500 hover:bg-white-500 hover:text-green-500'
      : 'bg-white-500 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white-500';

  return (
    <button
      className={`${commonClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      <p className="px-20 leading-custom font-nunito text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-center">
        {text}
      </p>
    </button>
  );
};
