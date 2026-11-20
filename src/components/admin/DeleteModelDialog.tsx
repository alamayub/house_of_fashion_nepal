import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDeleteModelMutation } from '../../features/models/modelsApi.ts';
import type { Model } from '../../types/index.ts';

interface DeleteModelDialogProps {
  model: Model | null;
  onClose: () => void;
}

export function DeleteModelDialog({ model, onClose }: DeleteModelDialogProps) {
  const [deleteModel, { isLoading }] = useDeleteModelMutation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setDeleteError(null);
    if (!model) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [model, onClose]);

  const handleConfirm = async () => {
    if (!model) return;
    setDeleteError(null);
    try {
      await deleteModel(model.id).unwrap();
      onClose();
    } catch {
      setDeleteError('Unable to remove profile right now. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {model && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Confirm deletion of ${model.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F4] text-[#101010] max-w-md w-full p-6 sm:p-7 border border-[#101010]/20 relative space-y-5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close confirmation dialog"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#101010]/60 hover:text-[#101010] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pr-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#632B37] mb-1">
                Confirm Roster Removal · {model.id}
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl">Delete {model.name}?</h3>
            </div>

            <p className="text-sm text-[#101010]/75 leading-relaxed">
              This will permanently remove {model.name}’s portfolio, measurements, photos, and videos from the active agency roster.
            </p>

            {deleteError && (
              <p className="text-xs text-[#632B37]" role="alert">
                {deleteError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-[#101010]/25 text-xs uppercase tracking-[0.16em] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-[#632B37] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#101010] transition-colors cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Removing...' : 'Delete Profile'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
