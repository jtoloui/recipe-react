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
      className={`flex items-center gap-2 rounded-lg border px-2 py-2 bg-gray2-100 dark:bg-slate-700/40 ${
        isDragging
          ? 'border-green-500 shadow-md'
          : 'border-gray2-400 dark:border-slate-700'
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none px-1 text-brownishGrey-600 hover:text-green-500 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        // aria-label after the spreads so dnd-kit's own attributes don't clobber it.
        aria-label="Drag to reorder"
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      {lead}
      {children}
    </div>
  );
};
