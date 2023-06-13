import { FC } from 'react';

type ButtonProps = {
  text: string;
  variant?: 'primary' | 'secondary' | 'cancelFull' | 'cancelOutline';
  onClick: () => void;
  buttonClassName?: string;
  textClassName?: string;
};

export const Button: FC<ButtonProps> = ({
  text,
  variant = 'primary',
  onClick,
  buttonClassName,
  textClassName,
}) => {
  const commonClasses =
    'w-full sm:w-auto px-4 py-2 rounded-lg shadow-md flex items-center justify-center';
  let variantClasses = '';
  // variant === 'primary'
  //   ? 'bg-green-500 text-white-500 hover:bg-white-500 hover:text-green-500 border-2 border-green-500'
  //   : 'bg-white-500 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white-500';

  switch (variant) {
    case 'primary':
      variantClasses =
        'bg-green-500 text-white-500 hover:bg-white-500 hover:text-green-500 border-2 border-green-500';
      break;
    case 'secondary':
      variantClasses =
        'bg-white-500 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white-500';
      break;
    case 'cancelFull':
      variantClasses =
        'bg-red-500 text-white-500 hover:bg-white-500 hover:text-red-500 border-2 border-red-500';
      break;
    case 'cancelOutline':
      variantClasses =
        'bg-white-500 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white-500';
      break;

    default:
      break;
  }

  return (
    <button
      className={`${buttonClassName} ${commonClasses} ${variantClasses}`}
      onClick={onClick}
    >
      <p
        className={`leading-custom text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl text-center ${textClassName}`}
      >
        {text}
      </p>
    </button>
  );
};
