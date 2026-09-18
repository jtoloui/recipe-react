import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

type Props = {
  id: string;
  children: ReactNode;
  /** Optional leading node rendered between the grab handle and the children (e.g. a step number badge). */
  lead?: ReactNode;
};

/**
 * A draggable, reorderable row shell. Renders a grab handle (the only drag
 * activator, so inputs inside stay fully interactive), an optional lead slot,
 * and its children. Wrap the list in a dnd-kit SortableContext.
 */
export const SortableRow = ({ id, children, lead }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 bg-white-500 dark:bg-slate-800/50 transition-shadow ${
        isDragging
          ? 'border-green-400 shadow-lg ring-2 ring-green-500/20 opacity-90'
          : 'border-gray2-500 dark:border-slate-600 hover:border-brownishGrey-400 dark:hover:border-slate-500 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-brownishGrey-400 hover:text-green-500 hover:bg-green-500/10 active:cursor-grabbing transition-colors"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
      </button>
      {lead}
      {children}
    </div>
  );
};
