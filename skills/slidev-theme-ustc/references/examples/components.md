---
theme: ../
layout: cover
conference: "USTC Slidev 主题"
talkTitle: "组件与布局原语完整参考"
subtitle: "Callout · FigureBlock · TableBlock · ResultBox · QRCode · PlotlyGraph · Grid · Block · Takeaway · Abs · Badge"
date: "2026 年 4 月 27 日"
sectionBar: true
figurePrefix: "图"
tablePrefix: "表"
---

`examples/components.md` — 涵盖所有组件和布局原语的完整 Props 演示。

运行方式：`slidev examples/components.md`

---
layout: toc
columns: 2
highlight: 0
---

# 目录

---
layout: toc
columns: 2
highlight: 1
---

# 目录

---
layout: section
---

# 一、Callout
`type` · `title`

---
layout: content
---

# Callout — 全部类型（有 title）

<Callout type="note" title="说明（note）">

蓝色。适合**背景知识**、方法介绍、一般补充说明。

</Callout>

<Callout type="tip" title="提示（tip）">

绿色。适合**技巧**、最佳实践、操作建议。

</Callout>

<Callout type="warning" title="注意（warning）">

琥珀色。适合**警告**、潜在陷阱、需要谨慎的地方。

</Callout>

<Callout type="important" title="重要（important）">

红色。适合**关键结论**、重要限制、不可忽略的信息。

</Callout>

<Callout type="example" title="示例（example）">

紫色。适合示例、演示代码、具体案例。

</Callout>

---
layout: content
density: dense
---

# Callout — 无 title 属性

<Callout type="note">

`note` 无标题。

</Callout>

<Callout type="tip">

`tip` 无标题。

</Callout>

<Callout type="warning">

`warning` 无标题。

</Callout>

<Callout type="important">

`important` 无标题。

</Callout>

<Callout type="example">

`example` 无标题。

</Callout>

---
layout: content
density: dense
---

# Callout — dense 模式下

<Callout type="note" title="分析策略">

采用基于 BDT 的多变量分析方法，训练样本为 MC 模拟的 $t\bar{t}H$ 信号与 $t\bar{t}$ 本底。输入变量包括喷注运动学量、$b$-tag 权重及顶夸克重建后的质量。

</Callout>

<Callout type="warning" title="系统误差">

JES 和 JER 不确定性对该分析影响最大（约 **8%**），建议在最终结果中单独列出各误差贡献。

</Callout>

<Callout type="important" title="主要结论">

在 $\sqrt{s} = 13\,\text{TeV}$ 数据集（139 fb$^{-1}$）中，观测到信号超出 $4.2\sigma$（期望 $3.8\sigma$），信号强度 $\mu = 1.15^{+0.32}_{-0.28}$。

</Callout>

---
layout: section
---

# 二、FigureBlock
`src` · `alt` · `caption` · `width` · `imageWidth` · `captionAlign` · `captionInsetLeft` · `captionInsetRight` · `prefix` · `numberSuffix` · `wip`

---
layout: content
---

# FigureBlock — 基础用法（自动编号）

<FigureBlock
  src="/ATLAS/ATLAS-Detector.webp"
  alt="ATLAS 探测器"
  caption="ATLAS 探测器横截面图，展示各子探测器从内到外的层级结构。"
  width="50%"
/>

编号由组件全局自动生成，`caption` 只填描述文字，前缀来自 headmatter `figurePrefix`。


---
layout: split
ratio: "1:1"
---

# FigureBlock — width

::left::

`width="35%"`

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="图宽 35%。"
  width="35%"
/>

::right::

`width="90%"`

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="图宽 90%。"
  width="90%"
/>

---
layout: split
ratio: "1:1"
---

# FigureBlock — captionAlign

::left::

`captionAlign="left"`

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="标题左对齐。"
  width="70%"
  captionAlign="left"
/>

::right::

`captionAlign="center"`（默认）

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="标题居中。"
  width="70%"
  captionAlign="center"
/>

---
layout: content
---

# FigureBlock — captionInsetLeft / captionInsetRight

`captionInsetLeft` 和 `captionInsetRight` 控制标题文字左右内缩，使其与图片内容区对齐（例如图片两侧有留白时）。

`width` 控制整体图块与图注宽度，`imageWidth` 可单独控制图片大小。内缩值接受像素值字符串或数字（单位 px）。

<FigureBlock
  src="/ATLAS/ATLAS-Detector.webp"
  alt="ATLAS 探测器"
  caption="图块宽 70%，图片宽 45%，标题内缩 60px：标题范围与图片内容区对齐。"
  width="70%"
  imageWidth="45%"
  captionInsetLeft="60px"
  captionInsetRight="60px"
/>

---
layout: content
---

# FigureBlock — prefix

`prefix="Fig."` 覆盖全局前缀（headmatter `figurePrefix`）：

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="使用自定义前缀 Fig.。"
  width="45%"
  prefix="Fig."
/>

---
layout: split
ratio: "1:1"
---

# FigureBlock — wip

::left::

无 `src`：用 placehold.co 占位，保留编号和 caption

<FigureBlock
  wip
  src="https://placehold.co/800x450"
  caption="实验结果示意图（待补）。"
  width="90%"
/>

::right::

有 `src`：图片正常渲染，加 WIP badge

<FigureBlock
  wip
  src="/ATLAS/ATLAS-Logo.png"
  caption="草稿图，布局待确认。"
  width="60%"
/>

---
layout: content
density: dense
subtitle: ":number 手动覆盖 / :numbered=false 跳过编号"
---

# FigureBlock — 自动编号的手动覆盖与跳过

<Grid cols="2" gap="lg" alignY="top">

<div>

**默认：自动编号**

<FigureBlock src="/ATLAS/ATLAS-Logo.png" caption="自动分配编号（接续 deck counter）" width="60%" />

</div>

<div>

**`:numbered="false"`：跳过编号**

<FigureBlock :numbered="false" src="/ATLAS/ATLAS-Logo.png" caption="无编号；后续 figure 也不消耗 counter（封面 / 装饰图常用）" width="60%" />

</div>

</Grid>

<Grid cols="2" gap="lg" alignY="top">

<div>

**`:number="42"`：手动钉编号**

<FigureBlock :number="42" src="/ATLAS/ATLAS-Logo.png" caption="显示为 Figure 42；后续 auto counter 会跳到 43" width="60%" />

</div>

<div>

**接下来的默认 figure**

<FigureBlock src="/ATLAS/ATLAS-Logo.png" caption="自动取 max(counter, 43)，不会与上面撞号" width="60%" />

</div>

</Grid>

---
layout: content
---

# FigureBlock — caption slot（脚注 / 链接 / 富 markdown）

`caption` prop 走组件内置的简化 markdown 渲染，**脚注引用、链接、自定义组件都不会生效**。需要这些时改用 `#caption` slot——内容由 Slidev 主管道处理。

**关键：`<template #caption>` 及其内容前后必须各有一个空行**，否则 Slidev 不把内容当 markdown 处理，`[^x]` 会原样显示为字面文字。

<FigureBlock src="/ATLAS/ATLAS-Detector.webp" alt="ATLAS 探测器" width="35%">

<template #caption>

ATLAS 探测器结构示意，详见 ATLAS Collaboration[^atlas-jinst]。

</template>

</FigureBlock>

[^atlas-jinst]: ATLAS Collaboration, *The ATLAS Experiment at the CERN LHC*, *JINST* **3** (2008) S08003.

`caption` prop 仍然保留作为兜底：slot 没填就走 prop（向后兼容，纯文字 caption 一行写完不用开 slot）。

---
layout: section
---

# 三、TableBlock
`caption` · `captionAlign` · `width` · `prefix` · `numberSuffix` · `wip`

---
layout: split
ratio: "1:1"
---

# TableBlock — captionAlign

::left::

`captionAlign="left"`

<TableBlock caption="探测器性能参数。" captionAlign="left">

| 探测器 | $\eta$ 覆盖 | 分辨率 |
|--------|------------|--------|
| ID | $< 2.5$ | $\sim 0.05\%$ |
| EMCal | $< 3.2$ | $\sim 10\%/\sqrt{E}$ |
| HCal | $< 4.9$ | $\sim 50\%/\sqrt{E}$ |
| MS | $< 2.7$ | $\sim 10\%$ |

</TableBlock>

::right::

`captionAlign="center"`（默认）

<TableBlock caption="系统误差汇总。">

| 来源 | 影响 |
|------|-----:|
| JES | $3.2\%$ |
| JER | $1.8\%$ |
| $b$-tag SF | $5.1\%$ |
| 亮度 | $1.7\%$ |
| 总计 | $7.0\%$ |

</TableBlock>

---
layout: content
density: dense
---

# TableBlock — width

`width` 控制整个 TableBlock 容器的宽度（默认 `"100%"`）：

<TableBlock caption="缩减至 70% 宽度，整体居中显示。" captionAlign="center" width="70%">

| 过程 | 产额 | 误差 |
|------|-----:|-----:|
| $ZH$ | 18.4 | ±1.2 |
| $WH$ | 12.7 | ±0.8 |

</TableBlock>

宽度缩减后，TableBlock 默认在内容区中居中；`captionAlign` 只控制标题在容器内的对齐。若需靠左，可用 `<div style="display:flex;justify-content:flex-start">` 包裹；靠右则用 `justify-content:flex-end`。

<div style="display:flex;justify-content:flex-start">
<TableBlock caption="同页靠左放置的 50% 宽表格。" captionAlign="center" width="50%">

| 过程 | 产额 |
|------|-----:|
| $ttH$ | 3.1 |
| $ggH$ | 4.3 |

</TableBlock>
</div>

---
layout: content
---

# TableBlock — prefix

`prefix="Tab."` 覆盖全局前缀（headmatter `tablePrefix`）；`numberSuffix=". "` 可把默认 `": "` 改回句点样式：

<TableBlock caption="使用自定义前缀 Tab.。" prefix="Tab." numberSuffix=". ">

| 列 A | 列 B |
|------|------|
| 值 1 | 值 2 |
| 值 3 | 值 4 |

</TableBlock>

---
layout: content
density: dense
---

# TableBlock — wip

`wip` 在 caption 旁显示 amber badge，表格内容正常渲染：

<TableBlock wip caption="消融实验结果（数值待更新）。" width="70%">

| 方法 | Acc | F1 |
|------|-----|----|
| Full model | 92.3% | ? |
| w/o module A | 89.1% | ? |
| Baseline | 85.7% | ? |

</TableBlock>

无 caption 时 badge 独立显示：

<TableBlock wip width="50%">

| 列 A | 列 B |
|------|------|
| foo | bar |

</TableBlock>

---
layout: content
---

# TableBlock — caption slot（脚注 / 链接 / 富 markdown）

跟 FigureBlock 同样的 `#caption` slot：内容由 Slidev 主管道处理，**`<template>` 与内容之间必须用空行隔开**才会走 markdown：

<TableBlock width="70%">

<template #caption>

模型在 ImageNet-1K 上的对比，基线数值取自 He et al.[^resnet]。

</template>

| 模型 | Top-1 Acc | 参数量 |
|------|----------:|------:|
| ResNet-50 | 76.1% | 25.6M |
| Ours      | 79.3% | 23.8M |

</TableBlock>

[^resnet]: He et al. *Deep Residual Learning for Image Recognition*, CVPR 2016.

默认 `<slot />` 仍然装表格 markdown，命名 slot `#caption` 装 caption——两者并存不冲突。

---
layout: section
---

# 四、ResultBox
`title`

---
layout: content
---

# ResultBox — 有 / 无 title

带 `title` 属性：

<ResultBox title="主要结果">

$$\mu = 1.05^{+0.31}_{-0.29}\,(\text{stat.})^{+0.18}_{-0.15}\,(\text{syst.})$$

观测显著性 $4.2\sigma$（预期 $3.8\sigma$），与标准模型一致。

</ResultBox>

不带 `title` 属性：

<ResultBox>

$$\sigma \times \text{BR}(H \to \gamma\gamma) < 0.12\,\text{pb} \quad (95\%\,\text{CL})$$

</ResultBox>

---
layout: section
---

# 五、QRCode
`url` · `size` · `color` · `background` · `caption`

---
layout: split
ratio: "1:1"
---

# QRCode — 默认与自定义配色

::left::

**默认样式** `color="#000000"`，`background="#ffffff"`

<div style="display:flex;justify-content:center;margin:0.8rem 0;">
  <QRCode url="https://github.com" :size="160" caption="github.com" />
</div>

::right::

**自定义配色** `color="#1E4C90"`，`background="#f0f4ff"`

<div style="display:flex;justify-content:center;margin:0.8rem 0;">
  <QRCode url="https://github.com" :size="160" color="#1E4C90" background="#f0f4ff" caption="自定义配色" />
</div>

---
layout: split
ratio: "1:1"
---

# QRCode — size

::left::

`size: 100`（小）

<div style="display:flex;justify-content:center;margin:0.8rem 0;">
  <QRCode url="https://github.com" :size="100" caption="size: 100" />
</div>

::right::

`size: 220`（大）

<div style="display:flex;justify-content:center;margin:0.8rem 0;">
  <QRCode url="https://github.com" :size="220" caption="size: 220" />
</div>

---
layout: split
ratio: "1:1"
---

# QRCode — caption

::left::

有 `caption` 属性：

<div style="display:flex;justify-content:center;margin:0.8rem 0;">
  <QRCode url="https://github.com" :size="160" caption="github.com" />
</div>

::right::

无 `caption` 属性：

<div style="display:flex;justify-content:center;margin:0.8rem 0;">
  <QRCode url="https://github.com" :size="160" />
</div>

---
layout: section
---

# 六、PlotlyGraph
`filePath` · `graphWidth` · `graphHeight` · 字体大小 Props · `Transform`

---
layout: content
---

# PlotlyGraph — 2D 示例

交互式 Plotly 图表，支持缩放、平移、悬停。

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.3rem;">
  <div style="min-width:0;overflow:hidden;"><PlotlyGraph filePath="/Graph/plotly1.json" :tickFontSize="11" :legendFontSize="10" :graphWidth="600" :graphHeight="360"/></div>
  <div style="min-width:0;overflow:hidden;"><PlotlyGraph filePath="/Graph/plotly1.json" :tickFontSize="11" :legendFontSize="10" :graphWidth="600" :graphHeight="360"/></div>
</div>

---
layout: content
---

# PlotlyGraph — 3D 示例

`PlotlyGraph` 同样支持 3D 图形，可旋转查看。

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.3rem;">
  <div style="min-width:0;overflow:hidden;"><PlotlyGraph filePath="/Graph/plotly2.json" :graphHeight="400"/></div>
  <div style="min-width:0;overflow:hidden;"><PlotlyGraph filePath="/Graph/plotly3.json" :graphHeight="400"/></div>
</div>

---
layout: content
density: dense
---

# PlotlyGraph — 字体大小 Props

所有字体 Props 均接受数字，单位为 px：

| Prop | 作用 | 默认 |
|------|------|------|
| `:tickFontSize` | 坐标轴刻度标签 | Plotly 默认 |
| `:legendFontSize` | 图例文字 | Plotly 默认 |
| `:xTitleFontSize` | X 轴标题 | Plotly 默认 |
| `:yTitleFontSize` | Y 轴标题 | Plotly 默认 |
| `:annotationFontSizeScale` | 标注字号缩放倍数 | `1.0` |

```md
<PlotlyGraph
  filePath="/Graph/plotly1.json"
  :graphHeight="480"
  :tickFontSize="14"
  :legendFontSize="12"
  :xTitleFontSize="16"
  :yTitleFontSize="16"
  :annotationFontSizeScale="1.2"
/>
```

---
layout: content
density: dense
---

# PlotlyGraph — graphWidth / graphHeight 与 Transform

`:graphWidth` 和 `:graphHeight` 直接设定 Plotly 渲染尺寸；不设定时组件使用响应式容器宽度。

搭配 Slidev 内置 `<Transform>` 组件整体缩放：

```md
<Transform :scale="0.75">
  <PlotlyGraph
    filePath="/Graph/plotly1.json"
    :graphWidth="900"
    :graphHeight="500"
    :tickFontSize="18"
  />
</Transform>
```

`Transform` 以 CSS `scale` 缩放整个渲染结果，适合图表尺寸与幻灯片不匹配时的快速调整。

---
layout: section
---

# 七、Grid
`cols` · `gap` · `align`

---
layout: content
---

# Grid — cols：等宽列

`cols` 传纯整数，生成等宽 N 列。

**cols="2"**

<Grid cols="2" gap="md">
  <Block title="左列">等宽两列，左。</Block>
  <Block title="右列">等宽两列，右。</Block>
</Grid>

**cols="3"**

<Grid cols="3" gap="md">
  <Block title="A">三列，A。</Block>
  <Block title="B">三列，B。</Block>
  <Block title="C">三列，C。</Block>
</Grid>

**cols="4"**

<Grid cols="4" gap="sm">
  <Block title="一">四列，一。</Block>
  <Block title="二">四列，二。</Block>
  <Block title="三">四列，三。</Block>
  <Block title="四">四列，四。</Block>
</Grid>

---
layout: content
---

# Grid — cols：比例列

`cols` 传空格分隔的数字，各段加 `fr` 作为 CSS grid 列宽。

**cols="45 55"**（接近等宽，稍偏右）

<Grid cols="45 55" gap="lg" style="margin-bottom:1rem">
  <Block title="45fr">较窄列，放文字说明。</Block>
  <Block title="55fr">较宽列，放图或内容。</Block>
</Grid>

**cols="1 2"**（1:2 比例）

<Grid cols="1 2" gap="lg" style="margin-bottom:1rem">
  <Block title="1fr">窄列。</Block>
  <Block title="2fr">宽列，宽度是左侧两倍。</Block>
</Grid>

**cols="1 2 1"**（中间宽，两侧窄）

<Grid cols="1 2 1" gap="md">
  <Block title="1fr">侧栏。</Block>
  <Block title="2fr">主内容区，宽度最大。</Block>
  <Block title="1fr">侧栏。</Block>
</Grid>

---
layout: content
---

# Grid — cols：多行（自动换行）

`cols` 定义列数，子元素超出列数自动换行，无需指定行数。

**cols="3"，9 个子元素 → 3×3**

<Grid cols="3" gap="sm">
  <Block>1</Block>
  <Block>2</Block>
  <Block>3</Block>
  <Block>4</Block>
  <Block>5</Block>
  <Block>6</Block>
  <Block>7</Block>
  <Block>8</Block>
  <Block>9</Block>
</Grid>

---
layout: content
---

# Grid — gap

`gap` 控制行列间距，三档可选。

<Grid cols="3" gap="sm" style="margin-bottom:0.8rem">
  <Block title="gap=sm">间距 0.6rem</Block>
  <Block>内容</Block>
  <Block>内容</Block>
</Grid>

<Grid cols="3" gap="md" style="margin-bottom:0.8rem">
  <Block title="gap=md（默认）">间距 1.2rem</Block>
  <Block>内容</Block>
  <Block>内容</Block>
</Grid>

<Grid cols="3" gap="lg">
  <Block title="gap=lg">间距 2rem</Block>
  <Block>内容</Block>
  <Block>内容</Block>
</Grid>

---
layout: content
---

# Grid — align

`align` 控制单元格纵向对齐方式（`align-items`）。高度不一致时效果明显。

<Grid cols="3" gap="md" alignY="top" style="margin-bottom:0.8rem">
  <Block title="alignY=top（默认）">顶部对齐。内容较短。</Block>
  <Block title="较高的单元格">这个单元格的内容更多一些，撑高了整行，其他单元格顶部对齐。</Block>
  <Block title="短内容">短。</Block>
</Grid>

<Grid cols="3" gap="md" alignY="center" style="margin-bottom:0.8rem">
  <Block title="alignY=center">居中对齐。</Block>
  <Block title="较高的单元格">这个单元格的内容更多一些，撑高了整行，其他单元格垂直居中。</Block>
  <Block title="短内容">短。</Block>
</Grid>

<Grid cols="3" gap="md" alignY="bottom">
  <Block title="alignY=bottom">底部对齐。</Block>
  <Block title="较高的单元格">这个单元格的内容更多一些，撑高了整行，其他单元格底部对齐。</Block>
  <Block title="短内容">短。</Block>
</Grid>

---
layout: content
density: dense
---

# Grid — 实际用法：contributions 页

`cols="3" gap="md"` + `<Block>` 是最典型的贡献列表用法。

<Grid cols="3" gap="md">
  <Block title="Hardness">

  NP-hard in the general case; reduction from 3-SAT.

  </Block>
  <Block title="Tractability">

  Polynomial-time algorithm under bounded treewidth $k$.

  </Block>
  <Block title="Practical Solver">

  Dynamic programming on tree decomposition, $O(n \cdot 2^k)$.

  </Block>
</Grid>

---
layout: content
density: dense
---

# Grid — 实际用法：文字配图

`cols="45 55" gap="lg"` 替代 `split` 布局在内容区内做分栏。

<Grid cols="45 55" gap="lg" alignY="top">
  <div>

  **方法概述**

  - 将全局问题分解为局部子问题
  - 在树分解上做动态规划
  - 时间复杂度 $O(n \cdot 2^k)$

  其中 $k$ 为树宽（bounded treewidth）。

  </div>
  <FigureBlock
    src="/ATLAS/ATLAS-Detector.webp"
    alt="架构示意"
    caption="架构示意图（此处用探测器图代替）。"
  />
</Grid>

---
layout: content
density: dense
---

# Grid — 实际用法：图表混排

`cols="2" gap="lg"` 并排两张 PlotlyGraph，无需手写 `display:grid`。

<Grid cols="2" gap="lg" alignY="top">
  <div>
    <PlotlyGraph filePath="/Graph/plotly1.json" :tickFontSize="11" :legendFontSize="10" :graphHeight="400" :graphWidth="500" />
    <Takeaway>左图：2D 折线，观察趋势。</Takeaway>
  </div>
  <div>
    <PlotlyGraph filePath="/Graph/plotly2.json" :tickFontSize="11" :graphHeight="400" :graphWidth="500" />
    <Takeaway>右图：3D 曲面，可旋转查看。</Takeaway>
  </div>
</Grid>

---
layout: content
density: dense
---

# Grid — 实际用法：图表 + 说明

`cols="55 45" gap="lg"` 让图占多数宽度，右侧配文字分析。

<Grid cols="55 45" gap="lg" alignY="top">
  <PlotlyGraph filePath="/Graph/plotly1.json" :tickFontSize="12" :legendFontSize="11" :graphHeight="340" />
  <div>

  **观测结果**

  - 信号区间 $m_{jj} \in [1.0, 3.5]\,\text{TeV}$
  - 本底估计采用 ABCD 方法
  - 系统误差 $< 5\%$

  <Takeaway>结果与标准模型预期一致。</Takeaway>

  </div>
</Grid>

---
layout: section
---

# 八、Block
`title`

---
layout: content
---

# Block — 有 / 无 title

**有 title**

<Block title="Definition">

图 $G$ 是**平面图**，当且仅当它可以画在平面上而无边交叉。

</Block>

<Block title="Theorem 1 (Kuratowski, 1930)">

图 $G$ 是平面图，当且仅当它不含 $K_5$ 或 $K_{3,3}$ 的细分作为子图。

</Block>

<Block title="Recovered state" color="#065f46">

`color` 可切换标签与边框色系，用于并排比较或强调不同类别。

</Block>

**无 title**（退化为通用有边框容器）

<Block>

无标题时，`Block` 变为纯边框容器，适合需要视觉分组但不需要标签的内容。

</Block>

---
layout: content
density: dense
---

# Block — dense 模式

dense 模式下，Block 标题行保持紧凑，正文字号随布局缩小。

<Block title="Definition">

图 $G$ 的**色数** $\chi(G)$ 是使 $G$ 的顶点正常着色所需的最少颜色数。

</Block>

<Block title="Lemma 2">

若图 $G$ 满足 $\Delta(G) \leq k$，则 $\chi(G) \leq k + 1$。

</Block>

<Block title="Algorithm 1: Greedy Coloring">

1. 对顶点按度数降序排列
2. 依次为每个顶点分配最小可用颜色
3. 返回使用的颜色数

时间复杂度 $O(V + E)$，最差情况返回 $\Delta + 1$ 色。

</Block>

---
layout: content
lineHeight: 1.5
---

# Block — 内容多样性

Block 的 slot 支持任意 Markdown 内容。

<Block title="Algorithm 2: Dynamic Programming">

**输入：** 树分解 $(T, \{X_t\})$，图 $G$，整数 $k$

**步骤：**
- 叶节点：直接计算 $O(2^k)$ 种赋值
- 引入节点：扩展表
- 遗忘节点：投影（求和）
- 连接节点：合并两子树的表

**输出：** 最优赋值及其代价

</Block>

<Block title="Complexity">

时间 $O(n \cdot 2^k)$，空间 $O(n \cdot 2^k)$，其中 $n = |V(G)|$，$k$ 为树宽。

</Block>

---
layout: content
density: dense
---

# Block — 在 Grid 中使用

Block 是 Grid 最常见的子元素。

<Grid cols="2" gap="md">
  <Block title="Definition: Treewidth">

  图 $G$ 的树宽 $\text{tw}(G)$ 是其所有树分解中最小的宽度。

  </Block>
  <Block title="Definition: Branchwidth">

  图 $G$ 的分支宽度 $\text{bw}(G)$ 满足 $\text{tw}(G) \leq \frac{3}{2}\text{bw}(G) - 1$。

  </Block>
</Grid>

<Grid cols="3" gap="sm" style="margin-top:0.8rem">
  <Block title="P1">第一个命题。</Block>
  <Block title="P2">第二个命题。</Block>
  <Block title="P3">第三个命题。</Block>
</Grid>

---
layout: section
---

# 九、Takeaway
无 Props

---
layout: content
---

# Takeaway — 基础用法

`<Takeaway>` 用于幻灯片末尾的一句话 take-home message。

正文阐述方法……

<Takeaway>

Temporal consistency is the single most important factor driving accuracy across all benchmarks.

</Takeaway>

与 `ResultBox` 的对比：

<ResultBox title="ResultBox（定量结论）">

$$\mu = 1.05^{+0.31}_{-0.29}\,(\text{stat.})^{+0.18}_{-0.15}\,(\text{syst.})$$

观测显著性 $4.2\sigma$（预期 $3.8\sigma$），与标准模型一致。

</ResultBox>

---
layout: content
density: dense
---

# Takeaway — dense 模式

dense 模式下，Takeaway 内的字号随布局缩小，bold 和颜色保持。

- 分析结果 A：信号区间 $m_{jj} \in [1.0, 3.5]\,\text{TeV}$，对应 95% CL 上限
- 分析结果 B：本底估计采用 ABCD 方法，系统误差 $< 5\%$
- 分析结果 C：最终结果与 SM 预期一致，$p\text{-value} = 0.34$

<Takeaway>

The method scales linearly with dataset size and requires no additional supervision.

</Takeaway>

---
layout: content
---

# Takeaway — 多条结论

可以放多个 Takeaway，每条对应一个关键结论。

<Takeaway>

Bounded treewidth is both necessary and sufficient for tractability.

</Takeaway>

<Takeaway>

The DP solver runs in $O(n \cdot 2^k)$ time and matches the theoretical lower bound.

</Takeaway>

<Takeaway>

Empirical results on three benchmarks confirm the theoretical prediction.

</Takeaway>

---
layout: section
---

# 十、Abs
`x` · `y` · `w` · `z`

---
layout: content
---

# Abs — content 页中悬浮 box

常规 `content` 布局正文，右下角用 `<Abs>` 悬浮一个补充说明框，不占文档流。

正文照常排版：

- 方法将全局问题分解为局部子问题
- 在树分解上做动态规划，时间复杂度 $O(n \cdot 2^k)$
- 实验在三个基准上验证，结果与理论吻合

$$
\mathcal{L}_\text{SM} = -\tfrac{1}{4}F_{\mu\nu}F^{\mu\nu} + i\bar{\psi}\not\!\!D\psi + |D_\mu\phi|^2
$$

<Abs x="58%" y="62%" w="36%">
  <Callout type="note" title="符号说明">

  $F_{\mu\nu}$：场强张量；$\psi$：费米子场；$\phi$：Higgs 场。

  </Callout>
</Abs>

---
layout: content
---

# Abs — 悬浮 ResultBox 标注关键结论

正文陈述完推导过程，用 `<Abs>` 在右侧固定位置挂一个 `ResultBox`，视觉上与行文分离。

设信号强度参数 $\mu = \sigma_\text{obs}/\sigma_\text{SM}$，对数似然比检验统计量为：

$$
q_\mu = -2\ln\frac{\mathcal{L}(\mu,\hat{\hat{\theta}}_\mu)}{\mathcal{L}(\hat{\mu},\hat{\theta})}
$$

其中 $\hat{\theta}$ 为无条件极大似然估计，$\hat{\hat{\theta}}_\mu$ 为给定 $\mu$ 下的条件极大似然估计。

<Abs x="55%" y="55%" w="40%">
  <ResultBox title="拟合结果">

  $$\mu = 1.05^{+0.31}_{-0.29}$$

  观测显著性 $4.2\sigma$，与 SM 一致。

  </ResultBox>
</Abs>

---
layout: content
density: dense
---

# Abs — 悬浮 Block 作为边注

dense 布局，正文较满，用 `<Abs>` 在右上角放一个 `Block` 作为术语边注，不挤占行文空间。

图 $G = (V, E)$ 的**树分解**是一棵树 $T$，其节点 $t$ 各关联一个包 $X_t \subseteq V$，满足：

1. $\bigcup_t X_t = V$（覆盖所有顶点）
2. 对每条边 $(u,v) \in E$，存在 $t$ 使 $u,v \in X_t$（覆盖所有边）
3. 对任意顶点 $v$，包含 $v$ 的节点集合在 $T$ 中构成连通子树

**树宽** $\text{tw}(G) = \min_T \max_t |X_t| - 1$，最小化取遍所有树分解。

许多 NP-hard 问题在树宽有界时可以 $O(f(k) \cdot n)$ 时间求解（固定参数可解，FPT）。

<Abs x="62%" y="12%" w="34%">
  <Block title="关键参数">

  $k = \text{tw}(G)$：树宽

  $n = |V(G)|$：顶点数

  典型值：平面图 $k \leq 3$，道路网络 $k \leq 10$

  </Block>
</Abs>

---
layout: content
---

# Abs — `:z` prop：层叠控制

`z` 控制 `<Abs>` 元素在**幻灯片内部**的层叠顺序，默认值 `10`。多个 `<Abs>` 重叠时，`z` 值大的显示在上层。

注意：`:z` 的作用域仅限于幻灯片内容层（`slidev-page` stacking context）。`sectionBar` 等全局组件在独立的渲染层，无法被 `:z` 覆盖。

<Abs x="4%" y="35%" w="38%" :z="20">
  <div style="background:#c0392b;color:white;padding:1rem 1.2rem;border-radius:6px;font-weight:600;">
    :z=20（上层，遮住下方蓝框）
  </div>
</Abs>

<Abs x="16%" y="40%" w="38%" :z="10">
  <div style="background:#16396b;color:white;padding:1rem 1.2rem;border-radius:6px;font-weight:600;">
    :z=10（下层，被红框遮住左上角）
  </div>
</Abs>

---
layout: section
---

# 十一、v-drag 与组件联用
`<v-drag>` 直接包裹 Block · Callout · Takeaway · ResultBox · QRCode

---
layout: content
dragPos:
  vd-block: 782,185,478,_
  vd-callout: 781,322,478,_
---

# v-drag — Block 与 Callout

`<v-drag>` 包裹纯内容组件时无冲突——演示模式下双击即可拖拽，松开后位置自动写回 `dragPos`。

左侧正文照常流式排版；右侧两个组件自由定位，与文档流完全独立。

- 方法将全局问题分解为局部子问题
- 在树分解上做动态规划，时间复杂度 $O(n \cdot 2^k)$
- 实验在三个基准上验证，结果与理论吻合

<v-drag pos="vd-block">
  <Block title="定理（可拖拽）">

  图 $G$ 是平面图，当且仅当不含 $K_5$ 或 $K_{3,3}$ 的细分作为子图。

  </Block>
</v-drag>

<v-drag pos="vd-callout">
  <Callout type="tip" title="提示（可拖拽）">

  演示模式下**双击**即可拖拽；松开后位置自动写回 `dragPos`。

  </Callout>
</v-drag>

---
layout: content
dragPos:
  vd-result: 521,317,490,_
  vd-takeaway: 51,545,978,_
  vd-qr: 1042,165,100,_
---

# v-drag — Takeaway · ResultBox · QRCode

三种组件均为纯内容块，直接放入 `<v-drag>` 无冲突。右侧定量结论与底部二维码可自由拖移。

设信号强度参数 $\mu = \sigma_\text{obs}/\sigma_\text{SM}$，拟合结果见右侧：

- 信号区间 $m_{jj} \in [1.0, 3.5]\,\text{TeV}$
- 本底估计采用 ABCD 方法，系统误差 $< 5\%$
- 最终结果与标准模型预期一致

<v-drag pos="vd-result">
  <ResultBox title="拟合结果（可拖拽）">

  $$\mu = 1.05^{+0.31}_{-0.29}$$

  观测显著性 $4.2\sigma$，与 SM 一致。

  </ResultBox>
</v-drag>

<v-drag pos="vd-takeaway">
  <Takeaway>

  Bounded treewidth is both necessary and sufficient for tractability.

  </Takeaway>
</v-drag>

<v-drag pos="vd-qr">
  <QRCode url="https://sli.dev" :size="90" caption="sli.dev" />
</v-drag>

---
layout: section
---

# 十二、WIP 标注
component 级 `wip` prop · slide 级 `wip` frontmatter

---
layout: content
density: dense
---

# 组件 WIP 标注 — 全家桶（有src）

四个组件都接受 `wip` prop，徽章统一用 `--ustc-wip`（#dc2626），叠在正常渲染的内容之上。组件级 `wip` 只影响组件自身，不会联动整页水印或 section bar：

<Grid cols="2" gap="lg" alignY="top">


<FigureBlock wip src="https://placehold.co/600x400" caption="待补：实验装置示意。" width="45%" />


<VideoBlock wip caption="待补：方法演示视频。" src="/videos/sample_video.mp4" width="45%" />



<TableBlock wip caption="待补：消融实验结果。" width="85%">

| 方法 | Acc | F1 |
|------|-----|----|
| Full model | ? | ? |
| Baseline | ? | ? |

</TableBlock>

<QRCode wip url="https://github.com" :size="140" caption="待补：项目主页 QR。" />


</Grid>

本页 frontmatter 没写 `wip: true`，所以上方 section bar 不会变红，也不会出现整页水印。需要整页标注时，在 slide frontmatter 显式写 `wip: true`。

---
layout: content
density: dense
---

# 组件 WIP 标注 — 全家桶（无src）

`src` / `url` 完全省略：FigureBlock / VideoBlock 渲染空 `<img>` / `<video>`（浏览器自带的 broken-icon）+ WIP badge；TableBlock 不写 markdown 内容就只剩 caption 行；QRCode 走内置斜纹占位方块。

<Grid cols="2" gap="lg" alignY="top">


<FigureBlock wip caption="待补：实验装置示意。" width="45%" />


<VideoBlock wip caption="待补：方法演示视频。" width="45%" />



<TableBlock wip caption="待补：消融实验结果。" width="85%" />

<QRCode wip :size="140" caption="待补：项目主页 QR。" />


</Grid>

适合"我连占位图都还没找"的真·草稿状态——broken-icon 本身就是"这里啥都没有"的最强信号。

---
layout: content
wip: true
---

# Slide 级 WIP 标注

frontmatter 加 `wip: true` 触发两个信号：

1. **大字水印** — "WIP" 横铺在内容上层（opacity 0.10、`pointer-events: none`，不挡阅读和点击）
2. **顶部 section bar 圆圈红化** — 当前页 dot 变红 + 脉冲动画，overview / 演讲提词器一眼能扫到

适合标注"这页还没写完"。slide 级信号只看 frontmatter，不扫描组件内容；组件级 `wip` 只显示组件自己的 badge 或占位状态。

ship 前记得清掉 `wip: true` 和组件级 `wip`。

---
layout: section
---

# 十三、Box
`bg` / `border` / `radius` Props · 不承担语义的原子容器

---
layout: content
---

# Box — 默认形态（学术明示分块）

`<Box>` 是一个不承担语义的原子容器，主要用于对 slide 内容做视觉划分（partition）。
默认 `border + bg=transparent + radius=0`，渲染为 clean sharp rect。

<Grid cols="2" gap="md">

<Box>

适合需要明示边界的学术内容分区，例如把一组前提或定义包起来。

</Box>

<Box>

并列的多个 Box 用 `<Grid cols="N">` 对齐，形成清晰的对比骨架。

</Box>

</Grid>

---
layout: content
---

# Box — 软分块（隐式 partition）

`bg="gray-soft" + :border="false" + radius="6px"` 形成一个柔和、不抢眼的视觉分区。
适合长段正文里想做轻量分组、又不希望让分隔本身吸引读者注意。

<Grid cols="2" gap="md">

<Box bg="gray-soft" :border="false" radius="6px">

软灰底 + 无边框 + soft 圆角。背景色用 `gray-soft` token，对应主题级 `--ustc-box-bg-gray`。

</Box>

<Box bg="gray-soft" :border="false" radius="6px">

并列两块形成节奏一致、不喧宾夺主的隐式分区。

</Box>

</Grid>

---
layout: content
---

# Box — 主题色软底 / 自由色

`bg` 是双模 prop：识别 `blue-pale` / `gray-soft` 两个 token，其它字符串当 CSS 颜色透传。

<Grid cols="2" gap="md">

<Box bg="blue-pale" radius="4px">

`bg="blue-pale"` — 用 token 引用 USTC 主题淡蓝 `var(--ustc-blue-pale)`，保留默认边框。

</Box>

<Box bg="#eef5ff" :border="false" radius="8px">

`bg="#eef5ff"` — 直接传任意 CSS 颜色字符串。适合需要"今天演讲的某个特殊色"的临时场景，作者自负配色协调。

</Box>

</Grid>

---
layout: section
---

# 十四、Badge
`variant` · `color` · `href`

---
layout: content
---

# Badge — 变体 × 配色

行内药丸,标注 venue / year / 状态 / CCF 等级 / 数据集。三种变体,配色任意,内容支持纯文本 / emoji / Iconify 图标。

<div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem">
<Badge variant="soft" color="#e67e22">🔥 HF #288</Badge>
<Badge variant="soft" color="#3b82f6">2026-05</Badge>
<Badge variant="soft" color="#16a34a">rerank 0.998</Badge>
<Badge variant="soft" color="#6b7280">kw+title</Badge>
</div>

<div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem">
<Badge variant="solid" color="#c0392b">CCF A</Badge>
<Badge variant="solid">USTC</Badge>
<Badge variant="solid" color="#16a34a">Oral</Badge>
<Badge variant="outline" color="#3b82f6">Spotlight</Badge>
<Badge variant="outline" color="#6b7280">preliminary</Badge>
</div>

<div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
<Badge variant="soft"><mdi-github /> 1.2k</Badge>
<Badge variant="solid" color="#24292f"><mdi-github /> GitHub</Badge>
<Badge variant="soft" color="#b31b1b"><mdi-school /> arXiv</Badge>
<Badge variant="outline" color="#16a34a"><mdi-check-circle /> reproduced</Badge>
</div>

行内对齐:正文中嵌 <Badge variant="solid" color="#24292f"><mdi-github /> GitHub</Badge> 和 <Badge variant="soft" color="#16a34a"><mdi-check-circle /> verified</Badge>,icon 与文字基线对齐。

---
layout: content
---

# Badge — 文献汇报场景

一眼扫到 <b>year · venue · highlight</b>,year 按新旧用色阶区分;`href` 让 badge 变成链接。

<div style="display:flex;flex-direction:column;gap:.5rem">
<div><Badge variant="soft" color="#16a34a">2026</Badge> <Badge variant="soft" color="#6b7280">CVPR</Badge> <b>方法 A</b> — 文本驱动的三维编辑 <Badge variant="solid" color="#c0392b">Oral</Badge></div>
<div><Badge variant="soft" color="#3b82f6">2025</Badge> <Badge variant="soft" color="#6b7280">NeurIPS</Badge> <b>方法 B</b> — 组合式生成框架 <Badge variant="soft" color="#c0392b">CCF A</Badge></div>
<div><Badge variant="soft" color="#9ca3af">2024</Badge> <Badge variant="soft" color="#6b7280">ICLR</Badge> <b>方法 C</b> — 高效推理 <Badge href="https://arxiv.org/abs/2509.20358" variant="outline" color="#b31b1b"><mdi-school /> arXiv</Badge></div>
<div><Badge variant="outline" color="#9ca3af">2021</Badge> <Badge variant="soft" color="#6b7280">ECCV</Badge> <b>方法 D</b> — 早期基线</div>
</div>

色阶:今年 <Badge variant="soft" color="#16a34a">2026</Badge> → 去年 <Badge variant="soft" color="#3b82f6">2025</Badge> → 前年 <Badge variant="soft" color="#9ca3af">2024</Badge> → 更早 <Badge variant="outline" color="#9ca3af">≤2023</Badge>

---
layout: content
density: dense
---

# Badge — dense 下自动缩放

badge 字号默认由 `--ustc-fs-badge-scale`(`0.68`) 相对当前 `--ustc-fs-body` 计算,dense / compact 下自动跟随缩小,无论它在 `<p>`、`<li>` 还是裸 `<div>` 里都保持一致大小。

- 带 icon 标签 <Badge variant="outline" color="#3b82f6"><mdi-github /> Code</Badge> 在 dense 行内的对齐
- 纯文本标签 <Badge variant="soft" color="#16a34a">SOTA</Badge> 跟随上下文缩放
- 要整体调大/调小所有 badge 且保留 density 缩放,覆盖 `--ustc-fs-badge-scale` 即可

---
layout: end
---

# 参考结束
