import { useId, useState } from "react";

export function Disclosure() {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  return (
    <div className="disclosure-widget">
      <button
        type="button"
        className="disclosure-trigger"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span className="disclosure-title"><span className="disclosure-spark">✦</span> What makes a disclosure accessible?</span>
        <span className={`chevron${expanded ? " is-open" : ""}`} aria-hidden="true">⌄</span>
      </button>
      <div id={contentId} hidden={!expanded} className="disclosure-content">
        <p>A native <code>button</code> supports <kbd>Enter</kbd> and <kbd>Space</kbd> without a custom keyboard listener.</p>
        <ul>
          <li><strong>aria-expanded</strong> reflects whether content is visible.</li>
          <li><strong>aria-controls</strong> links the button to this region.</li>
          <li>The <strong>hidden</strong> attribute removes collapsed content from the tab order.</li>
        </ul>
        <a className="inline-link" href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" target="_blank" rel="noreferrer">Read the W3C disclosure pattern ↗</a>
      </div>
    </div>
  );
}
