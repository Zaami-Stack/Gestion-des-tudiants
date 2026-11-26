import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading = false,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/30 sm:grid sm:place-items-center sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) onCancel();
          }}
        >
          <motion.section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            className="w-full max-w-md rounded-t-[26px] bg-surface p-6 pb-[max(24px,env(safe-area-inset-bottom))] sm:rounded-[20px] sm:pb-6"
          >
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Fermer"
                disabled={loading}
                onClick={onCancel}
                className="!text-muted"
              >
                Fermer
              </Button>
            </div>
            <h2 id="confirm-title" className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
              {title}
            </h2>
            <p id="confirm-description" className="mt-2 text-[14px] leading-6 text-muted">
              {description}
            </p>
            <div className="mt-7 grid gap-2 sm:flex sm:justify-end">
              <Button type="button" variant="secondary" className="w-full !text-ink sm:w-auto" onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button type="button" variant="danger" className="w-full sm:w-auto" onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
