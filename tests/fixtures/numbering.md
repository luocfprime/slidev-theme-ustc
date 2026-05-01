---
theme: ../../
layout: cover
talkTitle: Numbering Fixture
figurePrefix: "Fig"
tablePrefix: "Tab"
sectionBar: false
---

---
layout: content
footer: false
---

<!-- slide 2: Fig 1, Tab 1 — independent counters -->

<FigureBlock wip caption="First figure" />

<TableBlock caption="First table">

| A |
|---|
| 1 |

</TableBlock>

---
layout: content
footer: false
---

<!-- slide 3: Fig 2, Tab 2 — cross-slide continuity -->

<FigureBlock wip caption="Second figure" />

<TableBlock caption="Second table">

| A |
|---|
| 1 |

</TableBlock>

---
layout: content
footer: false
---

<!-- slide 4: Scheme 3 — per-component prefix overrides global, number from global counter -->

<FigureBlock prefix="Scheme" wip caption="A scheme" />

---
layout: content
footer: false
---

<!-- slide 5: :numbered=false skips label and does not advance counter; next is Fig 4 -->

<FigureBlock :numbered="false" wip />

<FigureBlock wip caption="After opt-out" />

---
layout: content
footer: false
---

<!-- slide 6: manual :number=10 → Fig 10, next auto → Fig 11 -->

<FigureBlock :number="10" wip caption="Manual ten" />

<FigureBlock wip caption="After manual" />

---
layout: content
footer: false
---

<!-- slide 7: no caption → label has no suffix → "Fig 12" -->

<FigureBlock wip />

---
layout: backup
---

---
layout: content
footer: false
---

<!-- slide 9: appendix — counters reset, prefix becomes A. → "Fig A.1", "Tab A.1" -->

<FigureBlock wip caption="Appendix fig one" />

<TableBlock caption="Appendix tab one">

| A |
|---|
| 1 |

</TableBlock>

---
layout: content
footer: false
---

<!-- slide 10: appendix continues → Fig A.2 -->

<FigureBlock wip caption="Appendix fig two" />
