import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (label: string) => void;
}

const focusableSelector = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function visibleFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.getClientRects().length > 0 && !element.closest("[inert]")
  );
}

/** Custom implementation using DOM primitives only. No component library. */
export function ModalDialog({ open, onClose, onSave }: ModalDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef(onClose);
  const [label, setLabel] = useState("");

  // Keep a stable document listener while receiving the latest callback.
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const appRoot = document.getElementById("root");
    const priorInert = appRoot?.inert ?? false;
    const previousOverflow = document.body.style.overflow;
    if (appRoot) appRoot.inert = true;
    document.body.style.overflow = "hidden";

    // Focusing inside a portal avoids focusing an inert ancestor.
    inputRef.current?.focus();

    function enforceFocus(event: FocusEvent): void {
      const dialog = dialogRef.current;
      if (dialog && event.target instanceof Node && !dialog.contains(event.target)) {
        const first = visibleFocusableElements(dialog)[0];
        (first ?? dialog).focus();
      }
    }

    document.addEventListener("focusin", enforceFocus);
    return () => {
      document.removeEventListener("focusin", enforceFocus);
      if (appRoot) appRoot.inert = priorInert;
      document.body.style.overflow = previousOverflow;
      // The effect is disposed when the dialog closes; return focus to invoker.
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeRef.current();
      return;
    }
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const tabbables = visibleFocusableElements(dialog);
    if (tabbables.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div className="modal-layer" data-testid="handbuilt-modal-layer">
      <div className="modal-backdrop" aria-hidden="true" />
      <div
        ref={dialogRef}
        className="modal-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="modal-heading-row">
          <span className="small-kicker">HAND-BUILT DIALOG</span>
          <button className="icon-close" onClick={() => closeRef.current()} aria-label="Close dialog" type="button">×</button>
        </div>
        <h2 id={titleId} className="modal-title">Save a quick note</h2>
        <p id={descriptionId} className="modal-copy">Try Tab, Shift+Tab, and Escape. Focus stays here until you close.</p>
        <label htmlFor={`${titleId}-field`} className="field-label">Note title</label>
        <input
          id={`${titleId}-field`}
          ref={inputRef}
          className="text-input"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="e.g. Keyboard-tested modal"
        />
        <div className="modal-actions">
          <button className="button button-muted" type="button" onClick={() => closeRef.current()}>Cancel</button>
          <button className="button button-primary" type="button" onClick={() => { onSave(label.trim() || "Untitled note"); setLabel(""); }}>Save note</button>
        </div>
      </div>
    </div>, document.body
  );
}
