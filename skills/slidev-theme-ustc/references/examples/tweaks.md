---
theme: ../
layout: cover
conference: "USTC Slidev 主题"
talkTitle: "Hacky Tweaks"
subtitle: "可维护的局部 hack：wrapper、变量、作用域"
date: "2026 年 4 月 26 日"
sectionBar: true
sectionBarMode: full
---

`examples/tweaks.md` — 展示常规 layouts / components 之外的局部调整技巧。

运行方式：`slidev examples/tweaks.md`

---
layout: toc
columns: 1
highlight: 0
---

# 目录

---
layout: section
---

# §1. Wrapper Hack
把主题组件包进普通 `<div>`，让 wrapper 变成布局控制点。

---
layout: content
subtitle: "两个 Block 同内容，右侧由 wrapper 控制宽度"
---

# Wrapper 限宽

看点：右侧外框明显变窄并居中；左侧仍撑满 Grid 列宽。

<Grid cols="2" gap="lg">

<Block title="默认：撑满列宽">

- Point-E, Shap-E, 3DGen, Get3D
- few-second generation
- needs large 3D datasets

</Block>

<div style="justify-self:center;max-width:12rem;">

<Block title="wrapper 限宽">

- Point-E, Shap-E, 3DGen, Get3D
- few-second generation
- needs large 3D datasets

</Block>

</div>

</Grid>

为什么这是推荐 hack：wrapper 是普通 DOM，也是 Grid item；`justify-self` / `max-width` 一定落到正确元素上，不依赖主题组件的 attribute passthrough。

---
layout: content
subtitle: "用 gutter columns 做稳定版心"
---

# Gutter Columns

看点：内容整体收进中间，两侧出现对称空白；不需要给每个组件单独设宽度。

<Grid cols="1 7 7 1" gap="md" alignY="top">

<div></div>

<Block title="Model Family A">

- compact
- fast
- lower fidelity

</Block>

<Block title="Model Family B">

- slower
- better geometry
- more expensive

</Block>

<div></div>

</Grid>

为什么这是推荐 hack：当多页都需要同一版心时，gutter columns 比散落的 `max-width` 更稳定。

---
layout: content
subtitle: "不用覆盖 Grid 的 inline style"
---

# 原生 Grid 等高

看点：三个盒子的外框同高；短内容盒子底部会留白。

<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;">

<Block title="短">

一行。

</Block>

<Callout type="tip" title="中">

- 两条
- 要点

</Callout>

<ResultBox title="长">

- 第一条
- 第二条
- 第三条
- 第四条

</ResultBox>

</div>

为什么这是推荐 hack：主题 `<Grid>` 默认顶对齐；需要 stretch 时直接用原生 CSS Grid，不用 `!important` 去打架。

---
layout: section
---

# §2. Typography Hacks
局部 dense、局部字号、subtitle、段落节奏、重点放大。

---
layout: split
ratio: "1:1"
---

# Split 局部 dense

看点：右栏正文、列表、表格整体按 dense 缩放；左栏保留默认字号，h1、subtitle、footer 都不变。

为什么这是推荐 hack：`<div class="dense">` 一次性切换所有 dense 字号、行高、表格与组件变量，套在 `::right::` 槽里等同于 `density: dense` 但作用域只到这个子树——比逐个覆盖 `--ustc-fs-*` 稳。

::left::

**Default density**

- 信号选择：$p_T > 25\,\text{GeV}$
- 信号区间：$m_{bb} \in [100, 140]\,\text{GeV}$
- 系统误差：JES $3\%$, JER $2\%$, $b$-tag $5\%$

| metric | value |
| --- | ---: |
| Accuracy | 97.1% |
| Latency | 18 ms |

::right::

<div class="dense">

**Dense scope**

- 信号选择：$p_T > 25\,\text{GeV}$
- 信号区间：$m_{bb} \in [100, 140]\,\text{GeV}$
- 系统误差：JES $3\%$, JER $2\%$, $b$-tag $5\%$

| metric | value |
| --- | ---: |
| Accuracy | 97.1% |
| Latency | 18 ms |

</div>

---
layout: content
subtitle: "右侧 block 标题、正文、表格一起缩小"
---

# 局部小字块

看点：右侧 Block 的标题、正文、表格都明显小一档；页面 subtitle 和左侧不变。

<Grid cols="2" gap="lg">

<Block title="默认字号">

主体结论保持正常字号，适合直接讲给听众。

| metric | value |
| --- | ---: |
| Accuracy | 97.1% |
| Latency | 18 ms |

</Block>

<div class="tiny-block">

<Block title="小字参数块">

补充说明、参数列表、实验设置可以局部压缩。

| metric | value |
| --- | ---: |
| Accuracy | 97.1% |
| Latency | 18 ms |

</Block>

</div>

</Grid>

为什么这是推荐 hack：用主题变量一起缩标题、正文、表格，比例不容易散；直接写 `p { font-size: ... }` 只会改一部分。

<style>
.tiny-block {
  --ustc-fs-block-title: 0.78rem;
  --ustc-fs-block-body: 0.68rem;
  --ustc-fs-table-cell: 0.62rem;
  --ustc-lh: 1.18;
}
</style>

---
layout: content
subtitle: "本页 subtitle 也被一起缩小"
---

# 整页小字模式

看点：subtitle、正文、表格、组件文字都变小；h1 仍保持标题层级。

<Grid cols="2" gap="lg">

<Block title="Compact Notes">

- long configuration list
- auxiliary evidence
- slide-level appendix details

| key | value |
| --- | --- |
| batch | 256 |
| warmup | 1k |

</Block>

<Callout type="note" title="Scope">

This slide uses `.slidev-layout` variables, so all body-level theme text follows the same compact scale.

</Callout>

</Grid>

为什么这是推荐 hack：需要连 subtitle 一起变时，作用域就该升到 `.slidev-layout`，而不是在每个组件上逐个改。

<style>
.slidev-layout {
  --ustc-fs-subtitle: 0.72rem;
  --ustc-fs-body: 0.9rem;
  --ustc-fs-table-cell: 0.76rem;
  --ustc-fs-block-title: 0.82rem;
  --ustc-fs-block-body: 0.76rem;
  --ustc-fs-callout: 0.76rem;
  --ustc-fs-callout-title: 0.82rem;
  --ustc-lh: 1.25;
}
</style>

---
layout: content
subtitle: "line-height 管行内；段落 gap 另外写"
---

# 段落节奏压缩

看点：右侧三段文字明显贴近；左侧保留默认段落节奏。

<Grid cols="2" gap="lg">

<div>

**默认段落**

第一段说明方法背景，保持默认节奏。

第二段解释实验设置。

第三段给出简短结论。

</div>

<div class="tight-paragraphs">

**紧凑段落**

第一段说明方法背景，局部压缩段落间距。

第二段解释实验设置。

第三段给出简短结论。

</div>

</Grid>

为什么这是推荐 hack：`lineHeight` 只管行内行距；段落之间的 gap 要在局部 wrapper 里改 `p + p`。

<style>
.tight-paragraphs {
  --ustc-lh: 1.22;
}
.tight-paragraphs p {
  margin: 0;
}
.tight-paragraphs p + p {
  margin-top: 0.08rem;
}
</style>

---
layout: content
subtitle: "只放大一个结果框"
---

# 局部放大结果

看点：右侧 ResultBox 像海报数字一样突出；左侧上下文仍是普通正文。

<Grid cols="2" gap="lg" alignY="center">

<Block title="Context">

- dataset: 1.2M samples
- training: 18 hours
- eval split: 50k samples

</Block>

<div class="hero-result">

<ResultBox title="Main result">

$$
\Delta = +12.8\%
$$

84.3% → 97.1%

</ResultBox>

</div>

</Grid>

为什么这是推荐 hack：只把一个结果块放大，保留整页其它信息密度；变量仍然让标题和正文按比例变化。

<style>
.hero-result {
  --ustc-fs-result-title: 1.55rem;
  --ustc-fs-result-body: 1.9rem;
  --ustc-lh: 1.2;
}
</style>

---
layout: section
---

# §3. Color Hacks
局部换肤、整页换肤、作用域优先级。

---
layout: content
subtitle: "只让一块内容换色"
---

# 局部换色

看点：右侧表头和强调色变橙；h1、footer、section bar 仍然是主题蓝。

<Grid cols="2" gap="lg">

<div>

**默认主题色**

| metric | value |
| --- | ---: |
| Accuracy | 97.1% |
| Latency | 18 ms |

</div>

<div class="orange-scope">

**局部橙色作用域**

| metric | value |
| --- | ---: |
| Accuracy | 97.1% |
| Latency | 18 ms |

</div>

</Grid>

为什么这是推荐 hack：颜色变量挂在 wrapper 上，只影响子树；不会污染当前页其它区域或后续页面。

<style>
.orange-scope {
  --ustc-blue-dark: #d97706;
  --ustc-blue: #f59e0b;
  --ustc-blue-border: rgba(217, 119, 6, 0.35);
  --ustc-blue-pale: rgba(245, 158, 11, 0.12);
}
</style>

---
layout: content
subtitle: "整页变量覆盖：chrome 也一起变"
---

# 整页换肤

看点：h1、section bar、footer 全部变红；右侧 wrapper 仍然保持橙色，证明局部作用域优先。

<Grid cols="2" gap="lg">

<Block title="Slide scope">

`.slidev-layout` 上的变量会传给本页所有 theme chrome。

</Block>

<div class="orange-scope">

<Block title="Local wins">

这个 Block 仍然是橙色，因为 wrapper 离它更近。

</Block>

</div>

</Grid>

为什么这是推荐 hack：整页换肤要升到 `.slidev-layout`；局部特殊块继续用 wrapper 覆盖，层级清楚。

<style>
.slidev-layout {
  --ustc-blue-dark: #dc2626;
  --ustc-blue: #ef4444;
  --ustc-blue-border: rgba(220, 38, 38, 0.35);
  --ustc-blue-pale: rgba(239, 68, 68, 0.12);
  --ustc-footer-bg: #dc2626;
}
.orange-scope {
  --ustc-blue-dark: #d97706;
  --ustc-blue: #f59e0b;
  --ustc-blue-border: rgba(217, 119, 6, 0.35);
  --ustc-blue-pale: rgba(245, 158, 11, 0.12);
}
</style>
