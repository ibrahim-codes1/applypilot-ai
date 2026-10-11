import { useId, useRef, useState, type KeyboardEvent } from "react";

type TabKey = "overview" | "keys" | "markup";
interface TabDefinition { key: TabKey; title: string; heading: string; description: string; bullets: string[]; }
const tabDefinitions: TabDefinition[] = [
  { key: "overview", title: "Overview", heading: "A single stop in the Tab order", description: "Only the selected tab uses tabIndex=0; the others are reachable with arrow keys.", bullets: ["role=tablist and role=tab", "The visible panel has role=tabpanel", "Focus and selection move together"] },
  { key: "keys", title: "Keyboard", heading: "Arrow keys move and activate", description: "The panels are instant, so this example uses the W3C's automatic activation pattern.", bullets: ["Left and Right wrap around", "Home jumps to first, End to last", "Tab exits the tab list into the panel"] },
  { key: "markup", title: "ARIA map", heading: "Labels, states and relationships", description: "Each tab has a stable ID and refers to its matching panel with aria-controls.", bullets: ["aria-selected communicates the current tab", "aria-labelledby names the panel", "Inactive panels use the native hidden attribute"] },
];

export function AccessibleTabs() {
  const [active, setActive] = useState<TabKey>("overview");
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = tabDefinitions.findIndex((tab) => tab.key === active);

  function focusAndActivate(index: number) {
    setActive(tabDefinitions[index].key);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabDefinitions.length;
    if (event.key === "ArrowLeft") nextIndex = (index + tabDefinitions.length - 1) % tabDefinitions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabDefinitions.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    focusAndActivate(nextIndex);
  }

  return (
    <div className="tabs-widget">
      <div className="tab-list" role="tablist" aria-label="ARIA pattern concepts">
        {tabDefinitions.map((tab, index) => (
          <button
            key={tab.key}
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`${baseId}-tab-${tab.key}`}
            role="tab"
            type="button"
            aria-selected={active === tab.key}
            aria-controls={`${baseId}-panel-${tab.key}`}
            tabIndex={active === tab.key ? 0 : -1}
            className={`tab-button${active === tab.key ? " is-active" : ""}`}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => setActive(tab.key)}
          >{tab.title}</button>
        ))}
      </div>
      {tabDefinitions.map((tab, index) => (
        <div
          key={tab.key}
          id={`${baseId}-panel-${tab.key}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.key}`}
          tabIndex={0}
          className="tab-panel"
          hidden={index !== activeIndex}
        >
          <div className="panel-eyebrow">TAB {String(index + 1).padStart(2, "0")}</div>
          <h3>{tab.heading}</h3>
          <p>{tab.description}</p>
          <ul className="check-list">{tab.bullets.map((text) => <li key={text}>{text}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
