import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

export function LibraryComparison() {
  return (
    <section className="library-section" aria-labelledby="comparison-title">
      <div className="section-header">
        <div>
          <p className="eyebrow">SOURCE REVIEW / 04</p>
          <h2 id="comparison-title">Compare with shadcn/ui</h2>
          <p className="section-description">The reference side uses Radix primitives through shadcn-style wrappers. Replace the wrappers with the official shadcn CLI output to finish the source-reading step.</p>
        </div>
        <span className="tag tag-purple">Library comparison</span>
      </div>
      <div className="compare-grid">
        <div className="compare-card">
          <div className="compare-top"><span className="compare-number">01</span><strong>Dialog primitive</strong></div>
          <p>Radix manages modal focus scope, dismissal, and the portal.</p>
          <Dialog>
            <DialogTrigger asChild><button className="button button-dark" type="button">Open reference dialog ↗</button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reference dialog</DialogTitle>
                <DialogDescription>Inspect the copied source and test keyboard handling against your hand-built version.</DialogDescription>
              </DialogHeader>
              <label className="field-label" htmlFor="comparison-name">Note title</label>
              <input id="comparison-name" className="text-input" placeholder="Tab to explore" />
              <DialogFooter>
                <DialogClose asChild><button className="button button-primary" type="button">Done</button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="compare-card">
          <div className="compare-top"><span className="compare-number">02</span><strong>Tabs primitive</strong></div>
          <p>Radix implements roving focus; compare RTL and manual activation options.</p>
          <Tabs defaultValue="first" className="reference-tabs">
            <TabsList aria-label="Reference tab topics">
              <TabsTrigger value="first">Behavior</TabsTrigger>
              <TabsTrigger value="second">Source</TabsTrigger>
            </TabsList>
            <TabsContent value="first">Arrow between tabs, then press Tab to enter the panel.</TabsContent>
            <TabsContent value="second">Inspect <code>src/components/ui/tabs.tsx</code> and the Radix primitive it wraps.</TabsContent>
          </Tabs>
        </div>
      </div>
      <p className="source-hint"><strong>Important distinction:</strong> the included wrappers are authored reference adapters, not evidence that shadcn CLI was run. Run <code>npx shadcn@latest add dialog tabs --overwrite --yes</code> locally to replace them with official generated source.</p>
    </section>
  );
}
