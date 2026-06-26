---
theme: ../../
layout: cover
talkTitle: Density Fixture
sectionBar: false
---

---
layout: content
density: normal
footer: false
---

<!-- slide 2: normal — baseline body font-size -->

# Normal

Body paragraph at normal density with <Badge variant="soft">normal badge</Badge>.

---
layout: content
density: compact
footer: false
---

<!-- slide 3: compact — middle tier, .compact class, body font between normal and dense -->

# Compact

Body paragraph at compact density with <Badge variant="soft">compact badge</Badge>.

---
layout: content
density: dense
footer: false
---

<!-- slide 4: dense — tightest, .dense class -->

# Dense

Body paragraph at dense density with <Badge variant="soft">dense badge</Badge>.

---
layout: content
footer: false
sectionBar: false
---

<!-- slide 5: ResultBox custom bg and borderColor props -->

# Box Color Props

<Box bg="#eef5ff" borderColor="#9333ea" radius="4px">

Box body.

</Box>

<br>

# ResultBox Props

<ResultBox title="Custom Result" bg="#ecfdf5" borderColor="#16a34a">

Custom result body.

</ResultBox>

<ResultBox title="Soft Gray Result" bg="gray-soft" borderColor="#d97706">

Token-resolved result body.

</ResultBox>

---
layout: content
footer: false
sectionBar: false
---

<!-- slide 6: top-level component flow spacing -->

# Component Flow Spacing

<div class="fixture-raw-grid">
  <div>Raw A</div>
  <div>Raw B</div>
</div>

| Metric | Value |
| --- | ---: |
| Initial pure Au target mass | 96600.34 ng/cm^2 |
| Final target total mass Kr+B+Au | 90487.35 ng/cm^2 |

<Takeaway>

Raw divs should not visually collide with a following component.

</Takeaway>

<Grid cols="2" gap="sm">
  <div class="fixture-cell">Grid A</div>
  <div class="fixture-cell">Grid B</div>
</Grid>

<Callout type="note" title="After grid">

Grid should leave breathing room before the next block component.

</Callout>

<FigureBlock
  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='64' viewBox='0 0 320 64'%3E%3Crect width='320' height='64' fill='%23e5eefb'/%3E%3C/svg%3E"
  caption="Fixture figure"
  width="45%"
/>

<ResultBox title="After figure">

Figures should also participate in the same top-level component rhythm.

</ResultBox>

<style>
.fixture-raw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.fixture-raw-grid > div,
.fixture-cell {
  border: 1px solid var(--ustc-blue-border);
  padding: 0.2rem 0.45rem;
}
</style>

---
layout: content
footer: false
sectionBar: false
---

<!-- slide 7: inline Badge visual alignment with surrounding CJK body text -->

# Badge Inline Alignment

行内对齐: 正文中嵌 <Badge variant="solid" color="#24292f"><mdi-github /> GitHub</Badge> 和 <Badge variant="soft" color="#16a34a"><mdi-check-circle /> verified</Badge>, icon 与文字基线对齐。

混合对齐: <Badge href="https://github.com" color="#24292f"><mdi-github /> GitHub</Badge> <Badge href="https://arxiv.org/abs/2509.20358" color="#b31b1b"><mdi-school /> arXiv</Badge> <Badge variant="outline" color="#16a34a">CERN Open Data</Badge>

<div class="badge-list-fixture">
  <div><Badge variant="soft" color="#16a34a">2026</Badge> <Badge variant="soft" color="#6b7280">CVPR</Badge> <b>方法 A</b> — 文本驱动的三维编辑 <Badge variant="solid" color="#c0392b">Oral</Badge></div>
  <div><Badge variant="soft" color="#3b82f6">2025</Badge> <Badge variant="soft" color="#6b7280">NeurIPS</Badge> <b>方法 B</b> — 组合式生成框架 <Badge variant="soft" color="#c0392b">CCF A</Badge></div>
</div>

<style>
.badge-list-fixture {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
