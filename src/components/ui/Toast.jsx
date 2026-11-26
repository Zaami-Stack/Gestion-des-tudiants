import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, tone = "success") => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}${Math.random()}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+84px)] right-4 z-[200] flex w-[min(92vw,360px)] flex-col gap-2 sm:bottom-5 sm:right-5">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="surface pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <p className="flex-1 text-[13px] font-medium leading-5 text-ink">{toast.message}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Fermer la notification"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  className="!text-muted shrink-0"
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
