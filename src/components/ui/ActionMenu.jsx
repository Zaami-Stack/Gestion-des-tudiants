import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import { cn } from "../../utils/format";

export default function ActionMenu({ items = [], label = "Actions" }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  function toggle() {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ top: rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right) });
    }
    setOpen((current) => !current);
  }

  return (
    <div ref={rootRef} className="relative flex justify-end">
      <Button
        type="button"
        variant={open ? "subtle" : "ghost"}
        size="sm"
        onClick={toggle}
        aria-expanded={open}
        className={cn(!open && "!text-muted")}
      >
        {label}
      </Button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.14 }}
              style={{ position: "fixed", top: position.top, right: position.right }}
              className="z-[70] w-52 origin-top-right overflow-hidden rounded-[14px] border border-line bg-surface p-1"
              role="menu"
            >
              <div className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <Button
                    key={item.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      item.onClick();
                    }}
                    className={cn(
                      "w-full !justify-start",
                      item.tone === "danger" ? "!text-danger" : "!text-ink"
                    )}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
