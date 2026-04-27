---
theme: ../
layout: cover
authors:
  - 演讲者: ["中国科学技术大学"]
conference: "USTC Slidev 主题"
talkTitle: "布局原语完整参考"
subtitle: "Grid · Block · Takeaway · Abs"
date: "2026 年 4 月 27 日"
sectionBar: true
sectionBarMode: full
---

`examples/primitives.md` — 涵盖四个布局原语的全部 Props 演示。

运行方式：`slidev examples/primitives.md`

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

# 一、Grid
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

<Grid cols="3" gap="md" align="top" style="margin-bottom:0.8rem">
  <Block title="align=top（默认）">顶部对齐。内容较短。</Block>
  <Block title="较高的单元格">这个单元格的内容更多一些，撑高了整行，其他单元格顶部对齐。</Block>
  <Block title="短内容">短。</Block>
</Grid>

<Grid cols="3" gap="md" align="center" style="margin-bottom:0.8rem">
  <Block title="align=center">居中对齐。</Block>
  <Block title="较高的单元格">这个单元格的内容更多一些，撑高了整行，其他单元格垂直居中。</Block>
  <Block title="短内容">短。</Block>
</Grid>

<Grid cols="3" gap="md" align="bottom">
  <Block title="align=bottom">底部对齐。</Block>
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

<Grid cols="45 55" gap="lg" align="top">
  <div>

  **方法概述**

  - 将全局问题分解为局部子问题
  - 在树分解上做动态规划
  - 时间复杂度 $O(n \cdot 2^k)$

  其中 $k$ 为树宽（bounded treewidth）。

  </div>
  <FigureBlock
    src="/ATLAS/ATLAS-Detector.png"
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

<Grid cols="2" gap="lg" align="top">
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

<Grid cols="55 45" gap="lg" align="top">
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

# 二、Block
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

**无 title**（退化为通用有边框容器）

<Block>

无标题时，`Block` 变为纯边框容器，适合需要视觉分组但不需要标签的内容。

</Block>

---
layout: content
density: dense
---

# Block — dense 模式

dense 模式下，Block 标题行保持紧凑（`!important` 固定），正文字号随布局缩小。

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

# 三、Takeaway
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

# 四、Abs
`x` · `y` · `w`

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
layout: end
---

# 布局原语参考结束
