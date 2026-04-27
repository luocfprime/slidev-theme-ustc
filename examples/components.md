---
theme: ../
layout: cover
authors:
  - 演讲者: ["中国科学技术大学"]
conference: "USTC Slidev 主题"
talkTitle: "组件完整参考"
subtitle: "所有组件的全部 Props 演示"
date: "2026 年 4 月 26 日"
sectionBar: true
sectionBarMode: full
figurePrefix: "图"
tablePrefix: "表"
---

`examples/components.md` — 涵盖所有组件的完整 Props 演示。

运行方式：`slidev examples/components.md`

---
layout: toc
highlight: 0
---

# 目录

---
layout: toc
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
`src` · `alt` · `caption` · `width` · `captionAlign` · `captionInsetLeft` · `captionInsetRight` · `prefix` · `number`

---
layout: content
---

# FigureBlock — 基础用法（自动编号）

编号由组件全局自动生成，`caption` 只填描述文字，前缀来自 headmatter `figurePrefix`。

<FigureBlock
  src="/ATLAS/ATLAS-Detector.png"
  alt="ATLAS 探测器"
  caption="ATLAS 探测器横截面图，展示各子探测器从内到外的层级结构。"
  width="60%"
/>

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

接受像素值字符串或数字（单位 px）。

<FigureBlock
  src="/ATLAS/ATLAS-Detector.png"
  alt="ATLAS 探测器"
  caption="内缩 60px：标题范围与图片内容区对齐，适合有边距的图像。"
  width="70%"
  captionInsetLeft="60px"
  captionInsetRight="60px"
/>

---
layout: split
ratio: "1:1"
---

# FigureBlock — 手动编号与前缀覆盖

::left::

`:number="5"` 手动指定编号（跳过自动编号）：

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="手动指定编号为 5。"
  width="55%"
  :number="5"
/>

::right::

`prefix="Fig."` 覆盖全局前缀（headmatter `figurePrefix`）：

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="Logo"
  caption="使用自定义前缀 Fig.。"
  width="55%"
  prefix="Fig."
/>

---
layout: section
---

# 三、TableBlock
`caption` · `captionAlign` · `width` · `prefix` · `number`

---
layout: split
ratio: "1:1"
---

# TableBlock — captionAlign

::left::

`captionAlign="left"`（默认）

<TableBlock caption="探测器性能参数。" captionAlign="left">

| 探测器 | $\eta$ 覆盖 | 分辨率 |
|--------|------------|--------|
| ID | $< 2.5$ | $\sim 0.05\%$ |
| EMCal | $< 3.2$ | $\sim 10\%/\sqrt{E}$ |
| HCal | $< 4.9$ | $\sim 50\%/\sqrt{E}$ |
| MS | $< 2.7$ | $\sim 10\%$ |

</TableBlock>

::right::

`captionAlign="center"`

<TableBlock caption="系统误差汇总。" captionAlign="center">

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

<TableBlock caption="缩减至 70% 宽度，居中显示。" captionAlign="center" width="70%">

| 过程 | 产额 | 误差 |
|------|-----:|-----:|
| $ZH$ | 18.4 | ±1.2 |
| $WH$ | 12.7 | ±0.8 |
| $ggH$ | 4.3 | ±0.5 |

</TableBlock>

宽度缩减后，表格在内容区中居左（`div` 默认左对齐）。若需居中，可用 `<div style="display:flex;justify-content:center">` 包裹。

---
layout: split
ratio: "1:1"
---

# TableBlock — 手动编号与前缀覆盖

::left::

`:number="3"` 手动指定编号：

<TableBlock caption="手动指定编号为 3。" captionAlign="left" :number="3">

| 列 A | 列 B |
|------|------|
| 值 1 | 值 2 |
| 值 3 | 值 4 |

</TableBlock>

::right::

`prefix="Tab."` 覆盖全局前缀（headmatter `tablePrefix`）：

<TableBlock caption="使用自定义前缀 Tab.。" captionAlign="left" prefix="Tab.">

| 列 A | 列 B |
|------|------|
| 值 1 | 值 2 |
| 值 3 | 值 4 |

</TableBlock>

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
layout: end
---

# 组件参考结束
