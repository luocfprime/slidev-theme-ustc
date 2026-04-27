---
theme: ./
layout: cover
authors:
  - 演讲者: ["中国科学技术大学"]
  - 合作者 A: ["中国科学技术大学"]
  - 合作者 B: ["清华大学"]
conference: "An Example Conference"
talkTitle: "USTC Slidev 主题"
subtitle: "面向 USTC 学术报告的 Slidev 主题"
date: "2026 年 4 月 26 日"
sectionBar: true
sectionBarMode: full
figurePrefix: "图"
tablePrefix: "表"
---

一套面向 USTC 学术报告、组会汇报和学术讲座的 Slidev 主题。
封面内容区可放简短摘要、公告或感谢语。

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

# 一、布局系统
`cover` · `toc` · `section` · `content` · `split` · `blank` · `end` · `backup`

---
layout: content
---

# content 布局

`density: normal`（默认），字号 `1.4rem`，行高 `1.47`。

- 列表条目：默认间距
- 第二条：可见间隔
  - 嵌套列表
  - 也支持多级

内联代码：`const x = 42`，**粗体**，*斜体*，~~删除线~~

---
layout: content
density: dense
---

# content 布局（dense 模式）

`density: dense` 将正文字号压缩至 `1.05rem`，适合数据密集型幻灯片。

- 条目 A：观测值 $p_T > 30\,\text{GeV}$，满足选择标准
- 条目 B：信号区间 $m_{jj} \in [1.0, 3.5]\,\text{TeV}$，对应 95% CL 上限
- 条目 C：本底估计采用 ABCD 方法，系统误差 $< 5\%$
- 条目 D：最终结果与 SM 预期一致，$p\text{-value} = 0.34$

| 样本 | 事例数 | 权重 |
|------|-------:|-----:|
| 信号 (MC) | 12 450 | 1.00 |
| $t\bar{t}$ | 8 320 | 0.94 |
| W+jets | 4 110 | 1.12 |
| QCD | 2 890 | 0.87 |
| 数据 | 28 180 | — |

---
layout: section
---

# 二、分栏布局
`split` 布局：`ratio` · `gap` · `density`

---
layout: split
ratio: "2:1"
---

# split 2:1（默认）

::left::

左侧占 **2/3** 宽度，适合文字配图。

标准粒子物理 Lagrangian 密度：

$$
\mathcal{L}_\text{SM} = -\frac{1}{4}F_{\mu\nu}F^{\mu\nu} + i\bar{\psi}\not\!\!D\psi + |D_\mu\phi|^2 - V(\phi) + y_{ij}\bar{\psi}_i\psi_j\phi
$$

其中每一项对应：规范场动能、费米子动能、Higgs 动能、Higgs 势、Yukawa 耦合。

::right::

<FigureBlock
  src="/ATLAS/ATLAS-Detector.png"
  alt="ATLAS 探测器"
  caption="ATLAS 探测器横截面示意图。"
/>

---
layout: split
ratio: "1:1"
---

# split 1:1（等宽）

::left::

<TableBlock caption="信号区域事例统计。">

| 过程 | 产额 |
|------|-----:|
| $ZH \to \ell\ell bb$ | $18.4 \pm 1.2$ |
| $WH \to \ell\nu bb$ | $12.7 \pm 0.8$ |
| $ggH \to bb$ | $4.3 \pm 0.5$ |
| 总信号 | $35.4 \pm 1.5$ |
| $t\bar{t}$ 本底 | $22.1 \pm 3.2$ |
| 数据 | 58 |

</TableBlock>

::right::

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="ATLAS Logo"
  caption="ATLAS 合作组标志。"
  captionAlign="center"
/>

---
layout: section
---

# 三、组件库
`Callout` · `FigureBlock` · `TableBlock` · `ResultBox` · `QRCode` · `PlotlyGraph`

---
layout: content
---

# Callout 组件

五种语义类型，每种独立配色。可选 `title` 属性。

<Callout type="note" title="说明">这是 `type="note"`（蓝色），适合**背景知识**或一般说明。</Callout>

<Callout type="tip" title="提示">这是 `type="tip"`（绿色），适合技巧或最佳实践。</Callout>

<Callout type="warning" title="注意">这是 `type="warning"`（琥珀色），适合提醒或潜在陷阱。</Callout>

<Callout type="important" title="重要">这是 `type="important"`（红色），适合**关键结论**或关注点。</Callout>

<Callout type="example">这是 `type="example"`（紫色），适合示例或代码演示。无 `title` 属性。</Callout>

---
layout: split
ratio: "1:1"
---

# FigureBlock & TableBlock 组件

::left::

编号全局自动生成，`caption` 只填描述文字：

<FigureBlock
  src="/ATLAS/ATLAS-Detector.png"
  alt="ATLAS 探测器"
  caption="ATLAS 探测器横截面图。"
  width="80%"
/>

::right::

<TableBlock caption="探测器性能参数。" captionAlign="left">

| 探测器 | $\eta$ 覆盖 |
|--------|------------|
| ID | $\lvert\eta\rvert < 2.5$ |
| EMCal | $\lvert\eta\rvert < 3.2$ |
| HCal | $\lvert\eta\rvert < 4.9$ |
| MS | $\lvert\eta\rvert < 2.7$ |

</TableBlock>

---
layout: split
ratio: "2:1"
---

# ResultBox & QRCode 组件

::left::

<ResultBox title="主要结果">

$$\mu = 1.05^{+0.31}_{-0.29}\,(\text{stat.})^{+0.18}_{-0.15}\,(\text{syst.})$$

观测显著性 $4.2\sigma$（预期 $3.8\sigma$），与标准模型一致。

</ResultBox>

`ResultBox` 用于突出展示核心定量结论，带双线边框。

::right::

<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;">
  <QRCode url="https://github.com" :size="140" caption="github.com" />
</div>

`QRCode` 将 URL 渲染为内联 SVG 二维码，无需联网。

---
layout: section
---

# 四、数学与代码
LaTeX 方程、代码块语法高亮

---
layout: content
---

# LaTeX 数学公式

行内公式：质子质量 $m_p \approx 938.3\,\text{MeV}/c^2$，精细结构常数 $\alpha \approx 1/137$。

块级公式——标准模型 Lagrangian：

$$
\mathcal{L}_\text{SM} =
  \underbrace{-\tfrac{1}{4}F_{\mu\nu}^a F^{a\mu\nu}}_{\text{规范场动能}}
  + \underbrace{i\bar{\psi}\not\!\!D\psi}_{\text{费米子动能}}
  + \underbrace{|D_\mu H|^2 - V(H)}_{\text{Higgs 场}}
  + \underbrace{y_{ij}\bar{\psi}_i H \psi_j + \text{h.c.}}_{\text{Yukawa 耦合}}
$$

Breit-Wigner 共振截面：

$$
\sigma(E) = \frac{2J+1}{(2s_1+1)(2s_2+1)} \cdot \frac{\pi}{k^2}
            \cdot \frac{\Gamma_i \Gamma_f}{(E-E_0)^2 + (\Gamma/2)^2}
$$

---
layout: content
density: dense
---

# 代码块与语法高亮

带行号和高亮行：

```python {1-3|5-8|all} {lines:true}
import numpy as np
import uproot
import awkward as ak

# 读取 ROOT 文件中的事例数据
with uproot.open("signal.root") as f:
    tree = f["CollectionTree"]
    pt = tree["jet_pt"].array()
    eta = tree["jet_eta"].array()

# 筛选喷注：pT > 25 GeV，|η| < 2.5
mask = (pt > 25_000) & (np.abs(eta) < 2.5)
selected = pt[mask]
print(f"Selected jets: {ak.sum(ak.num(selected))}")
```

---
layout: section
---

# 五、布局原语
`Grid` · `Block` · `Takeaway` · `Abs`

---
layout: content
---

# Grid — 等宽列 / 比例列 / 多行

<Grid cols="3" gap="md">
  <Block title="Hardness">NP-hard in the general case.</Block>
  <Block title="Tractability">Polynomial-time under bounded parameters.</Block>
  <Block title="Algorithm">Practical dynamic programming solver.</Block>
</Grid>

<Grid cols="45 55" gap="lg" align="top" style="margin-top:1rem">
<div>

`cols="3"` → 等宽三列，`cols="45 55"` → 比例两列，9 个子元素自动换行成九宫格。

</div>
<FigureBlock src="/ATLAS/ATLAS-Logo.png" alt="ATLAS" caption="右侧比例列图示。" />
</Grid>

---
layout: content
---

# Block — 定义 / 定理 / 算法框

<Block title="Definition">

图 $G$ 是**平面图**，当且仅当它可以画在平面上而无边交叉。

</Block>

<Block title="Theorem 1 (Kuratowski)">

图 $G$ 是平面图，当且仅当它不含 $K_5$ 或 $K_{3,3}$ 的细分作为子图。

</Block>

<Block>

无 `title` 时退化为通用有边框容器，适合需要视觉分组但无需标签的场景。

</Block>

---
layout: content
---

# Takeaway — 一句话结论

正文叙述内容……结论落在 Takeaway 中。

<Takeaway>

Temporal consistency is the key factor driving accuracy gains across all benchmarks.

</Takeaway>

与 `ResultBox` 的区别：`Takeaway` 是定性一句话，`ResultBox` 是定量结果含数学公式。

<ResultBox title="对比：ResultBox">

$$\mu = 1.05^{+0.31}_{-0.29}\,(\text{stat.})^{+0.18}_{-0.15}\,(\text{syst.})$$

</ResultBox>

---
layout: section
---

# 六、速查参考
所有布局与组件选项一览

---
layout: content
density: dense
---

# 布局 frontmatter 速查

| 布局 | 独有选项 | 共有选项 |
|------|---------|---------|
| `cover` | `talkTitle`, `subtitle`, `authors`, `conference`, `date`, `showLogo`, `logoSrc`, `logoAlt`, `background` | — |
| `content` / `default` | `density`, `footnote`, `lineHeight`, `align` | `footer`, `footerMode`, `sectionBar`, `sectionBarMode` |
| `split` | 同 content + `ratio`, `gap` | 同上 |
| `section` | `sectionLabel` | `footer`, `footerMode` |
| `toc` | `highlight` | `footer`, `footerMode` |
| `end` | `showLogo`, `logoSrc`, `logoAlt` | `footer`, `footerMode` |
| `blank` | — | — |
| `backup` | — | `footer`, `footerMode` |

`density`: `normal`（默认）/ `dense` · `footerMode`: `full`（默认）/ `minimal` · `footnote`: `overlay`（默认）/ `flow`

`ratio`: `2:1`（默认）/ `1:1` / `3:2` / `1:2` / `2:3` · `gap`: `sm` / `md`（默认）/ `lg`

---
layout: content
density: dense
---

# 全局 headmatter 与组件速查

**全局 headmatter（写在第一页 frontmatter 中）：**

| 选项 | 说明 |
|------|------|
| `figurePrefix` | 图编号前缀，默认 `"Figure"` |
| `tablePrefix` | 表编号前缀，默认 `"Table"` |
| `sectionBar: true` | 开启顶部分节进度条 |
| `sectionBarMode` | `full`（默认，点+标题）/ `minimal`（仅点） |

**组件：**

| 组件 | 关键 Props |
|------|-----------|
| `Callout` | `type` (note/tip/warning/important/example), `title?` |
| `FigureBlock` | `src`, `alt?`, `caption?`, `width?`, `captionAlign?`, `captionInsetLeft/Right?`, `prefix?`, `:number?` |
| `TableBlock` | `caption?`, `captionAlign?`, `width?`, `prefix?`, `:number?` |
| `ResultBox` | `title?` |
| `QRCode` | `url`, `:size?`, `color?`, `background?`, `caption?` |
| `PlotlyGraph` | `filePath`, `:graphWidth?`, `:graphHeight?`, `:tickFontSize?`, `:legendFontSize?`, `:xTitleFontSize?`, `:yTitleFontSize?`, `:annotationFontSizeScale?` |
| `Grid` | `cols` (数字或空格分隔比例), `gap?` (sm/md/lg), `align?` (top/center/bottom) |
| `Block` | `title?` |
| `Takeaway` | — |
| `Abs` | `x`, `y`, `w?` |

---
layout: content
---

# 导航与键盘快捷键

将鼠标悬停在左下角可调出导航控制面板。

## 快捷键

|  | 操作 |
|--|------|
| <kbd>Space</kbd> / <kbd>→</kbd> | 下一步动画 / 下一页 |
| <kbd>←</kbd> / <kbd>Shift</kbd>+<kbd>Space</kbd> | 上一步动画 / 上一页 |
| <kbd>↑</kbd> / <kbd>↓</kbd> | 上一页 / 下一页（跳过动画） |
| <kbd>F</kbd> | 全屏 |
| <kbd>G</kbd> | 开启摄像头录制 |
| <kbd>D</kbd> | 开启画笔模式 |
| <kbd>O</kbd> | 幻灯片概览 |

---
layout: end
---

# 谢 谢

本次报告到此为止

欢迎提问与讨论

---
layout: backup
---

# 附录

---
layout: content
---

# Backup Slide A.1

备用幻灯片示例。页脚显示 `A.1`，主正文页码不变。
