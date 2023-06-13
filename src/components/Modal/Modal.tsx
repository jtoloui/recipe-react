import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { FC, useCallback, useEffect } from 'react';

import { Button } from '../Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  buttons?: {
    primary?: {
      label: string;
      onClick: () => void;
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
  children: React.ReactNode;
  title?: string;
};

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  buttons = {
    primary: {
      label: 'Submit',
      onClick: () => true,
    },
  },
  title = 'Modal Title',
}) => {
  const escFunction = useCallback(
    (event: DocumentEventMap['keydown']) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 bg-slate-400 opacity-5 z-[99]"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <div className="bg-white-500 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2/3 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-2xl flex-2">{title}</h3>
          <button
            className="text-black-500 close-modal justify-end"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faX} color="var(--charcoal)" />
          </button>
        </div>
        <div>{children}</div>
        {buttons && (
          <div className="flex justify-end">
            <div className=" items-center gap-3 mt-8 flex w-2/5">
              {buttons?.secondary && (
                <Button
                  buttonClassName="sm:w-full"
                  variant="cancelOutline"
                  onClick={buttons.secondary.onClick}
                  text={buttons.secondary.label}
                />
              )}
              {buttons?.primary && (
                <Button
                  buttonClassName="sm:w-full"
                  variant="primary"
                  onClick={buttons.primary.onClick}
                  text={buttons.primary.label}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
