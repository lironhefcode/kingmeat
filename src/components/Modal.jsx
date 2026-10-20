import { useEffect, useLayoutEffect, useRef } from "react";

// Native <dialog> as a modal: focus trapping, Esc and focus return come from the browser.
export function Modal({ open, onClose, className, labelledBy, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close before the node leaves the DOM so focus returns to the opener
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => dialog?.open && dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // The dialog element itself is only hit when clicking the backdrop
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {children}
    </dialog>
  );
}
