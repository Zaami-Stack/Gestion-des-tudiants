import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1];

export function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, to, className = "", duration = 1.2 }) {
  const target = value ?? to;
  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) => Math.round(latest).toLocaleString("fr-FR"));

  useEffect(() => {
    if (typeof target !== "number") return undefined;
    const controls = animate(count, target, { duration, ease: easeOut });
    return () => controls.stop();
  }, [count, duration, target]);

  if (typeof target !== "number") {
    return <motion.span className={className}>{target ?? "—"}</motion.span>;
  }

  return <motion.span className={className}>{formatted}</motion.span>;
}
