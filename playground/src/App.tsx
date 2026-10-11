import { useState } from "react";
import { AccessibleTabs } from "./components/handbuilt/AccessibleTabs";
import { Disclosure } from "./components/handbuilt/Disclosure";
import { ModalDialog } from "./components/handbuilt/ModalDialog";
import { LibraryComparison } from "./components/LibraryComparison";

type DemoItem = { index: string; name: string; keys: string; detail: string };
const demos: DemoItem[] = [
  { index: "01", name: "Modal dialog", keys: "Tab · Shift+Tab · Esc", detail: "Focus management & return" },
  { index: "02", name: "Tabs", keys: "← → · Home · End", detail: "Roving keyboard focus" },
  { index: "03", name: "Disclosure", keys: "Enter · Space", detail: "Expandable, announced content" },
];

function Icon({ kind }: { kind: "dialog" | "tabs" | "disclosure" }) {
  if (kind === "dialog") return <span className="demo-icon" aria-hidden="true">▣</span>;
  if (kind === "tabs") return <span className="demo-icon" aria-hidden="true">▤</span>;
  return <span className="demo-icon" aria-hidden="true">⌄</span>;
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <>
      <div className="app-shell">
        <aside className="side-panel" aria-label="Playground information">
          <div className="brand-line"><span className="brand-mark" aria-hidden="true">✳</span><div><strong>access<span>lab.</span></strong><small>FRONTEND AI ENGINEERING</small></div></div>
          <div className="side-main">
            <p className="side-label">YOUR ASSIGNMENT</p>
            <h1>Build it.<br /><em>Understand it.</em><br />Compare it.</h1>
            <p>Three accessible React components written by hand, then reviewed against real library primitives.</p>
            <div className="side-divider" />
            <p className="side-label">THE PATTERNS</p>
            <ol className="side-menu">{demos.map((item) => <li key={item.index}><span>{item.index}</span><strong>{item.name}</strong><span className="side-tick" aria-hidden="true">↗</span></li>)}</ol>
          </div>
          <div className="sidebar-footer"><span className="online-dot" /> W3C ARIA practice · Week exercise</div>
        </aside>
        <main className="main-area">
          <header className="topbar"><span>THE ACCESSIBILITY PLAYGROUND <span className="topbar-separator">/</span> FOUNDATION LAB</span><a href="https://www.w3.org/WAI/ARIA/apg/patterns/" target="_blank" rel="noreferrer">W3C Patterns ↗</a></header>
          <div className="main-container">
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-heading"><div><span className="section-pill"><span className="online-dot"/> Accessibility, from first principles</span><h2 id="hero-title">Good interfaces work<br /><span>without a mouse.</span></h2><p>Build the mechanics before trusting an abstraction. Every pattern below supports meaningful keyboard interaction, predictable focus, and accessible roles.</p></div><div className="hero-decoration" aria-hidden="true"><div className="rings">✳</div></div></div>
              <div className="hero-stat"><div><strong>03</strong><span>Hand-built patterns</span></div><div><strong>100%</strong><span>Keyboard-oriented</span></div><div><strong>TS</strong><span>Typed props</span></div></div>
            </section>
            <section aria-labelledby="lab-heading" className="lab-section">
              <div className="section-header"><div><p className="eyebrow">LIVE PATTERNS / 01–03</p><h2 id="lab-heading">Hand-built components</h2><p className="section-description">Use the keyboard to inspect focus and interaction. No UI component library powers these three.</p></div><span className="tag tag-blue">Interactive playground</span></div>
              <div className="patterns-grid">
                <article className="pattern-card" aria-labelledby="modal-pattern-title"><div className="pattern-number"><Icon kind="dialog" /><span>01 / MODAL DIALOG</span></div><h3 id="modal-pattern-title">Keep focus in view.</h3><p>Open the dialog, cycle focus, and close it. Your cursor should return to the opener.</p><div className="card-demo-area"><button className="button button-primary" type="button" onClick={() => setModalOpen(true)}>Open hand-built modal <span aria-hidden="true">↗</span></button>{saved && <p role="status" className="save-message">Saved: {saved}</p>}</div><div className="pattern-footer"><strong>KEYBOARD</strong><span>Tab · Shift+Tab · Escape</span></div></article>
                <article className="pattern-card" aria-labelledby="tabs-pattern-title"><div className="pattern-number"><Icon kind="tabs" /><span>02 / TABS</span></div><h3 id="tabs-pattern-title">Move with intention.</h3><p>Focus the current tab. Arrow keys automatically select the next panel.</p><div className="card-demo-area tab-demo-area"><AccessibleTabs /></div><div className="pattern-footer"><strong>KEYBOARD</strong><span>← → · Home · End</span></div></article>
                <article className="pattern-card" aria-labelledby="disclosure-pattern-title"><div className="pattern-number"><Icon kind="disclosure" /><span>03 / DISCLOSURE</span></div><h3 id="disclosure-pattern-title">Make meaning visible.</h3><p>A true button expands content and tells assistive tech when it is open.</p><div className="card-demo-area disclosure-demo-area"><Disclosure /></div><div className="pattern-footer"><strong>KEYBOARD</strong><span>Enter · Space</span></div></article>
              </div>
            </section>
            <LibraryComparison />
            <section className="audit-band" aria-labelledby="audit-heading"><div><span className="eyebrow">YOUR REVIEW CHECKLIST</span><h2 id="audit-heading">Read the source. Test the keys. Note the gaps.</h2><p>Use <code>NOTES.md</code> to record what your implementation misses and what the library abstracts for you.</p></div><div className="audit-points"><span>✓ Correct ARIA roles</span><span>✓ Predictable focus</span><span>✓ No <code>any</code> props</span></div></section>
            <footer className="page-footer"><span>FlyRank · Frontend AI Engineering</span><span>Accessible by design, not by assumption.</span></footer>
          </div>
        </main>
      </div>
      <ModalDialog open={modalOpen} onClose={() => setModalOpen(false)} onSave={(value) => { setSaved(value); setModalOpen(false); }} />
    </>
  );
}
