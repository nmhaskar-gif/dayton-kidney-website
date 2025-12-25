import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  /** Optional: render into a specific element. Default is document.body */
  container?: Element | null;
};

export default function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const target = container ?? document.body;
  return createPortal(children, target);
}
