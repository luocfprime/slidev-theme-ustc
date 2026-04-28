---
theme: ./
layout: cover
authors:
  - 张明远: ["中国科学技术大学", "ATLAS 合作组"]
  - A. Müller: ["CERN"]
  - 李晓彤: ["中国科学技术大学"]
conference: "第 22 届高能物理前沿研讨会"
talkTitle: "基于图神经网络的对撞机事例重建"
subtitle: "从稀疏点云到粒子流的端到端学习"
date: "2026 年 4 月"
sectionBar: true
figurePrefix: "图"
tablePrefix: "表"
---

大型强子对撞机产生的每次碰撞事例包含数千条粒子径迹。
传统基于启发式的重建算法在高亮度 LHC 环境下面临严峻挑战——
本报告提出一种端到端图神经网络框架，显著提升重建效率与精度。

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

# 一、研究背景

高亮度 LHC 下的事例重建挑战

---
layout: content
subtitle: "为什么传统方法在 HL-LHC 不够用？"
---

# 研究动机

大型强子对撞机（LHC）每秒产生约 $10^9$ 次质子-质子碰撞，Run 3 及高亮度 LHC（HL-LHC）阶段的堆积（pileup）事例数将从 $\langle\mu\rangle \approx 50$ 升至 $\langle\mu\rangle \approx 200$。

传统 Kalman Filter 径迹拟合算法的计算复杂度为 $\mathcal{O}(n^2)$，随堆积增加急剧膨胀：

$$t_\text{reco} \propto \langle\mu\rangle^2 \cdot n_\text{hits}$$

<Callout type="important" title="核心挑战">

当 $\langle\mu\rangle = 200$ 时，单次事例重建耗时将超过 10 分钟，远超在线触发预算（$\leq 4\,\text{s}$）。

</Callout>

---
layout: content
density: dense
---

# 相关工作对比

<TableBlock caption="主流端到端事例重建方法性能对比（ATLAS Run 2 条件，$\langle\mu\rangle=50$）。" captionAlign="left">

| 方法 | 主干网络 | 径迹效率 | 假径迹率 | 推理时间 |
|------|---------|--------:|--------:|--------:|
| Kalman Filter [^kf] | — | 98.1% | 0.3% | 820 ms |
| ACTS [^acts] | — | 97.8% | 0.4% | 310 ms |
| GNN-Tracking [^gnn1] | GravNet | 96.2% | 1.1% | 42 ms |
| Exa.TrkX [^exa] | GNN | 97.1% | 0.8% | 28 ms |
| **本工作** | **HeteroGNN** | **97.9%** | **0.5%** | **18 ms** |

</TableBlock>

效率与速度同时优于现有深度学习方案，同时保持与经典算法相当的假径迹率。

[^kf]: Frühwirth, *NIM A* **262** (1987) 444.
[^acts]: Ai et al., *Front. Phys.* **10** (2022) 817828.
[^gnn1]: Ju et al., *EPJ Web Conf.* **245** (2020) 09013.
[^exa]: Choma et al., *arXiv:2012.01563* (2020).

---
layout: split
---

# ATLAS 探测器与输入数据

::left::

输入点云来自 ATLAS 内径迹探测器（Inner Detector），由三个子系统构成：

- **Pixel 探测器**（IBL + 3 层）：精确测量靠近碰撞点的径迹起点，空间分辨率 $\sigma_{r\phi} \approx 10\,\mu\text{m}$
- **SCT**（4 层硅微条）：提供中间层径迹点，$\sigma_{r\phi} \approx 17\,\mu\text{m}$
- **TRT**（稻草管探测器）：外层 $\sim 350{,}000$ 管，兼做粒子识别

每次事例约产生 $3\text{–}8 \times 10^4$ 个击中点（hits），构建图时节点数 $N_v \sim 10^4$，边数 $N_e \sim 10^6$。

::right::

<FigureBlock
  src="/ATLAS/ATLAS-Detector.png"
  alt="ATLAS 探测器横截面"
  caption="ATLAS 探测器横截面，展示内径迹探测器各子系统位置关系。"
/>

---
layout: toc
columns: 2
highlight: 2
---

# 目录

---
layout: section
---

# 二、方法设计

异构图神经网络框架

---
layout: content
density: dense
---

# 图构建与网络结构

<Grid cols="2" gap="lg" alignY="top">
<div>

**图构建**

将探测器击中点映射为图节点 $v_i = (r, \phi, z, \text{layer})$，按几何相邻性构建有向边：

$$
e_{ij} = 1 \;\text{ if }\; \Delta R_{ij} < \epsilon \;\text{ and }\; r_j > r_i
$$

**消息传递**（3 轮迭代）：

$$
h_i^{(l+1)} = \text{MLP}\!\left(h_i^{(l)},\, \bigoplus_{j \in \mathcal{N}(i)} \phi\!\left(h_i^{(l)}, h_j^{(l)}, e_{ij}\right)\right)
$$

</div>
<div>

**边分类头**

$$
\hat{y}_{ij} = \sigma\!\left(W\,[\,h_i \,\|\, h_j\,]\right) \in [0,1]
$$

**损失函数**（带类权重的 BCE）：

$$
\mathcal{L} = -\!\sum_{ij}\!\left[\,w_+\,y_{ij}\log\hat{y}_{ij} + w_-\,(1-y_{ij})\log(1-\hat{y}_{ij})\right]
$$

<Callout type="tip" title="类不平衡处理">

真实边与假边比约为 $1:50$，设 $w_+ = 50,\, w_- = 1$ 平衡正负样本。

</Callout>

</div>
</Grid>

---
layout: content
density: dense
lineHeight: 1.55
---

# 核心理论性质

<Block title="定义 1（异构图）">

给定节点类型集 $\mathcal{A}$ 和边类型集 $\mathcal{R}$，**异构图** $G = (\mathcal{V}, \mathcal{E}, \mathcal{A}, \mathcal{R})$ 中每个节点 $v \in \mathcal{V}$ 和边 $e \in \mathcal{E}$ 分别对应一个类型映射 $\tau(v) \in \mathcal{A}$，$\phi(e) \in \mathcal{R}$。

</Block>

<Block title="定理 1（消息传递表达能力上界）">

$k$ 轮消息传递的表达能力不超过 $k$ 阶 Weisfeiler-Leman 图同构测试。对径迹重建所需的局部结构（$k \leq 3$），3 轮迭代已足够。

</Block>

<Block title="命题 2（推理复杂度）">

单次事例推理时间为 $\mathcal{O}(N_v \cdot d + N_e \cdot d^2)$，其中 $d$ 为隐层维度，与 $\langle\mu\rangle$ 线性相关，优于 Kalman Filter 的 $\mathcal{O}(\langle\mu\rangle^2)$。

</Block>

---
layout: content
margin: tighter
---

# 消息传递公式推导

输入：初始节点特征 $h_i^{(0)} = \text{MLP}_\text{init}(x_i)$，$x_i = (r,\phi,z,\text{layer})$。

<div v-click>

**① 邻域消息聚合**

$$m_i^{(l)} = \bigoplus_{j \in \mathcal{N}(i)} \phi\!\left(h_i^{(l)},\, h_j^{(l)},\, e_{ij}\right)$$

</div>

<div v-click>

**② 节点状态更新**

$$h_i^{(l+1)} = \text{MLP}\!\left(h_i^{(l)},\, m_i^{(l)}\right)$$

</div>

<div v-click>

**③ 边分类输出**（重复 $L=3$ 轮后）

$$\hat{y}_{ij} = \sigma\!\left(W\bigl[h_i^{(L)} \,\|\, h_j^{(L)}\bigr]\right) \in [0,1]$$

</div>

<div v-click>

<Callout type="tip" title="三轮迭代的意义">

每轮消息传递将感受野扩大一跳。<span v-mark="{ type: 'underline', color: '#c0392b' }">$k=3$ 轮已足够覆盖典型径迹段</span>，$k>3$ 反而导致节点表示过平滑（over-smoothing）。

</Callout>

</div>

---
layout: content
density: dense
---

# 模型训练与实现细节

```python {1-5|7-14|all} {lines:true}
import torch
from torch_geometric.nn import HeteroConv, SAGEConv

# 定义异构图卷积层
conv = HeteroConv({('hit', 'to', 'hit'): SAGEConv(-1, 128)}, aggr='mean')

# 三轮消息传递
class HeteroGNN(torch.nn.Module):
    def forward(self, x_dict, edge_index_dict):
        for _ in range(3):
            x_dict = conv(x_dict, edge_index_dict)
            x_dict = {k: F.relu(v) for k, v in x_dict.items()}
        # 边分类头
        return self.edge_classifier(x_dict)

# 训练：AdamW, lr=1e-3, cosine annealing, 50 epochs
```

训练数据：ATLAS MC 模拟（$t\bar{t}$ 事例）$10^5$ 次，验证集 $2 \times 10^4$ 次；GPU：NVIDIA A100 80 GB × 8，批训练耗时约 6 小时。

---
layout: content
density: dense
---

# 端到端处理流程

```mermaid
flowchart LR
  A["原始击中点<br/>Hits<br/>$$N_v \sim 10^4$$"] --> B["几何图构建<br/>$$\Delta R \lt \epsilon$$"]
  B --> C["HeteroGNN<br/>3 轮消息传递"]
  C --> D["边分类头<br/>$$\hat{y}_{ij} \in [0,1]$$"]
  D --> E{"阈值过滤<br/>ŷ > 0.5"}
  E -->|保留| F["径迹候选<br/>Track Seeds"]
  E -->|丢弃| G["背景边"]
  F --> H["最终径迹<br/>$$N_\text{track} \sim 10^3$$"]

  style A fill:#16396b,color:#fff,stroke:#16396b
  style H fill:#003c71,color:#fff,stroke:#003c71
  style G fill:#888,color:#fff,stroke:#888
```

整个流程从原始探测器击中点出发，经图构建、三轮 GNN 消息传递与边分类，最终输出重建径迹，推理延迟仅 **18 ms/event**。

---
layout: toc
columns: 2
highlight: 3
---

# 目录

---
layout: section
---

# 三、实验验证

基准测试与消融分析

---
layout: content
density: dense
---

# 实验设置

<Grid cols="45 55" gap="lg" alignY="top">
<div>

**数据集**

- 信号：$t\bar{t}$ MC（Pythia 8 + Geant4 全模拟）
- 堆积：$\langle\mu\rangle = 50, 100, 140, 200$
- 划分：7:1:2（训练/验证/测试）

**评价指标**

- **径迹效率**：$\varepsilon = N_\text{reco}^\text{match} / N_\text{truth}$
- **假径迹率**：$f = N_\text{fake} / N_\text{reco}$
- **推理时间**：单次事例，Tesla A100

</div>
<div>

<TableBlock caption="各堆积条件下数据集规模（单位：$10^3$）。" captionAlign="left">

| $\langle\mu\rangle$ | 节点数 | 边数 | 真实边 |
|---:|---:|---:|---:|
| 50 | 38 | 820 | 15 |
| 100 | 71 | 3 100 | 29 |
| 140 | 98 | 6 000 | 40 |
| 200 | 139 | 12 200 | 57 |

</TableBlock>

</div>
</Grid>

---
layout: split
ratio: "1:1"
density: dense
---

# 径迹效率与假径迹率

::left::

<FigureBlock
  src="/ATLAS/ATLAS-Detector.png"
  alt="效率 vs 堆积"
  caption="径迹效率随堆积增加的变化。本方法（红）在 $\langle\mu\rangle=200$ 时仍保持 97.1%。"
/>

<Callout type="tip">

在 $p_T > 1\,\text{GeV}$ 的高动量区域，效率可进一步提升至 99.1%。

</Callout>

::right::

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="假径迹率 vs 堆积"
  caption="假径迹率随堆积的变化。蓝线为本方法，灰线为 ACTS 基线。"
  captionAlign="center"
/>

<Callout type="warning" title="低动量区注意">

$p_T < 0.5\,\text{GeV}$ 的径迹在 $\langle\mu\rangle = 200$ 时假径迹率升至 1.8%，尚需专项优化。

</Callout>

---
layout: content
---

# 主要性能结果

<ResultBox title="核心指标（$\langle\mu\rangle = 200$，$p_T > 1\,\text{GeV}$）">

$$
\varepsilon = 97.1\% \quad f = 0.6\% \quad t_\text{reco} = 18\,\text{ms/event}
$$

与最优基线 Exa.TrkX 相比：效率 +0.3%，速度 **1.6×**，假径迹率降低 0.2 个百分点。

</ResultBox>

<Grid cols="3" gap="md" style="margin-top:1rem">
  <Block title="内层（Pixel + SCT）">效率 98.4%，占推理时间 40%</Block>
  <Block title="外层（TRT）">效率 95.8%，占推理时间 35%</Block>
  <Block title="全局合并">融合后综合效率 97.1%，无额外代价</Block>
</Grid>

---
layout: content
density: dense
sectionBarMode: minimal
---

# 消融实验：各模块贡献

<TableBlock caption="消融实验结果（$\langle\mu\rangle=140$）。逐步移除各模块，观察性能下降。" captionAlign="left">

| 配置 | 效率 | 假径迹率 | 推理时间 |
|------|-----:|--------:|--------:|
| 完整模型 | **97.5%** | **0.5%** | **21 ms** |
| −异构边类型 | 96.8% | 0.7% | 19 ms |
| −3 轮迭代（→ 2 轮） | 96.1% | 0.9% | 14 ms |
| −类权重 | 94.3% | 2.1% | 21 ms |
| −几何特征 | 93.7% | 2.4% | 18 ms |

</TableBlock>

类权重（处理正负样本不均衡）和几何特征（节点坐标输入）对最终性能贡献最大。

<Callout type="note">

本页使用 `sectionBarMode: minimal` 演示单页覆盖效果：顶部进度条仅显示圆点，节省纵向空间。

</Callout>

---
layout: content
density: dense
---

# 推理速度随堆积的扩展性

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem">
  <PlotlyGraph filePath="/Graph/plotly1.json" :tickFontSize="11" :legendFontSize="10" :graphHeight="320" :graphWidth="480" />
  <PlotlyGraph filePath="/Graph/plotly2.json" :tickFontSize="11" :graphHeight="320" :graphWidth="480" />
</div>

左图：推理时间与 $\langle\mu\rangle$ 的关系（本方法近线性，基线近二次）。右图：吞吐量（事例/秒）随 GPU 并行度的扩展。

---
layout: toc
columns: 2
highlight: 4
---

# 目录

---
layout: section
---

# 四、结论

主要贡献与未来工作

---
layout: content
---

# 主要贡献

<Grid cols="3" gap="md">
  <Block title="算法贡献">

  提出异构消息传递框架，首次在统一架构中同时处理 Pixel / SCT / TRT 三种探测器几何。

  </Block>
  <Block title="工程贡献">

  推理时间降至 18 ms/event，比最优基线快 1.6×，满足 HL-LHC 在线触发预算。

  </Block>
  <Block title="科学价值">

  在 $\langle\mu\rangle = 200$ 高堆积条件下保持 97.1% 效率，为未来 ATLAS Run 4 分析奠定基础。

  </Block>
</Grid>

<Takeaway>

端到端图神经网络不仅加速了重建，更在高堆积下首次同时满足效率与速度双重约束。

</Takeaway>

---
layout: content
dragPos:
  qr-repo: 1054,163,160,_
---

# 未来工作

正文内容悬停标注演示：`<v-drag>` 用于在不打断行文的情况下添加补充信息或二维码；演示模式下双击可拖拽调整位置。

- **在线部署**：与 ATLAS TDAQ 系统集成，目标实现 FPGA 加速推理（$\leq 2\,\text{ms}$）
- **扩展到量能器**：将同一框架推广至 ECal / HCal 团簇重建，实现全粒子流重建
- **不确定性量化**：引入图上的贝叶斯推断，输出径迹级置信区间

<Callout type="example" title="开放资源">

代码与预训练模型已在 GitHub 开源，数据集可通过 CERN Open Data 门户获取。

</Callout>

<v-drag pos="qr-repo">
  <QRCode url="https://github.com" :size="120" caption="代码仓库" color="#16396b" />
</v-drag>

---
layout: end
---

# 感 谢 聆 听

欢迎提问与讨论

::contact::

张明远 · zmy@ustc.edu.cn · github.com/ustc-hep/heterognn

---
layout: backup
---

# 附 录

---
layout: content
---

# A.1　超参数敏感性分析

<Grid cols="45 55" gap="lg" alignY="top">
<div>

网络深度（消息传递轮数）与隐层维度对性能的影响：

- 轮数 $k \in \{1,2,3,4\}$：$k=3$ 时性能饱和，$k=4$ 无显著提升但推理时间增加 28%
- 隐层维度 $d \in \{64, 128, 256\}$：$d=128$ 为最优平衡点

网络过深会导致**过平滑**问题（over-smoothing），节点表示趋同，边分类头无法区分相邻径迹。

<Callout type="note">

最终选择 $k=3$，$d=128$，对应参数量 1.2 M，适合 GPU 批处理。

</Callout>

</div>
<div>

<FigureBlock
  src="/ATLAS/ATLAS-Logo.png"
  alt="超参数扫描结果"
  caption="图 A.1　效率（上）与推理时间（下）随 $k$ 和 $d$ 的变化热图。"
  captionAlign="left"
/>

</div>
</Grid>

---
layout: content
density: dense
---

# A.2　与标准 Kalman Filter 的误差分析

<TableBlock caption="表 A.1　各动量区间径迹重建精度对比（$\langle\mu\rangle=50$，ATLAS 全模拟）。">

| $p_T$ 区间 | KF 效率 | 本方法效率 | KF 假率 | 本方法假率 |
|-----------|--------:|----------:|--------:|----------:|
| $0.5$–$1\,\text{GeV}$ | 91.2% | 89.4% | 0.8% | 1.2% |
| $1$–$5\,\text{GeV}$ | 97.8% | 97.9% | 0.3% | 0.5% |
| $5$–$20\,\text{GeV}$ | 98.9% | 98.7% | 0.2% | 0.4% |
| $> 20\,\text{GeV}$ | 99.1% | 99.2% | 0.1% | 0.2% |

</TableBlock>

在低动量区（$p_T < 1\,\text{GeV}$），本方法效率略低于 KF，主要因为稀疏点云在低 $p_T$ 时曲率大，图构建时易遗漏远端击中点。高动量区表现持平或略优。

<Takeaway>

GNN 方法在高动量高堆积的实验条件下展现出优势；低动量优化是下一阶段的重点。

</Takeaway>

---
layout: content
density: dense
---

# A.3　预训练方法对比（Typst 排版示例）

<TableBlock caption="Comparison to the state-of-the-art pre-training methods on semantic tasks (ImageNet-1K linear probing, ADE segmentation) and 3D vision tasks (NYUv2, Taskonomy) with ViT-Base/16. Bold = best, underlined = second best." captionAlign="left" />

```typst
#set text(size: 8.2pt)
#set par(leading: 0.55em)

#let best(x) = strong(x)
#let second(x) = underline(x)
#let cite(n) = box(
  stroke: green + 0.45pt,
  inset: (x: 0.4pt, y: -0.2pt),
)[#text(fill: green)[#n]]

#set table(
  stroke: none,
  inset: (x: 2.6pt, y: 0.7pt),
)

#table(
  columns: (
    36mm,
    10mm, 10mm, 11mm,
    10mm, 10mm, 9mm, 10mm, 10mm,
    11mm, 9mm, 12mm, 10mm, 9mm,
  ),
  align: (
    left,
    center, center, center,
    center, center, center, center, center,
    center, center, center, center, center,
  ),

  table.hline(stroke: 0.8pt),

  [*pre-training method (data)*],
  [*IN1K ↑*],
  [*ADE ↑*],
  [*NYUv2 ↑*],
  table.cell(colspan: 10)[*Taskonomy ↓*],

  table.hline(start: 1, end: 2, stroke: 0.45pt),
  table.hline(start: 2, end: 3, stroke: 0.45pt),
  table.hline(start: 3, end: 4, stroke: 0.45pt),
  table.hline(start: 4, end: 14, stroke: 0.45pt),

  [],
  [*lin.*],
  [*segm.*],
  [*depth*],
  [*curv.*],
  [*depth*],
  [*edges*],
  [*kpts2d*],
  [*kpts3d*],
  [*normal*],
  [*occl.*],
  [*reshad.*],
  [*avg.*],
  [*rank.*],

  table.hline(stroke: 0.55pt),

  [DINO #cite("14") (IN1K)],
  [#best[78.2]], [44.7], [66.8],
  [43.04], [38.42], [3.80], [0.16], [45.85],
  [65.71], [0.57], [115.02], [39.07], [5.00],

  [MAE #cite("38") (IN1K)],
  [#second[68.0]], [#second[46.1]], [79.6],
  [41.59], [35.83], [#best[1.19]], [#second[0.08]], [44.18],
  [#second[59.20]], [#best[0.55]], [106.08], [36.09], [#second[2.13]],

  [MutliMAE #cite("4") (IN1K)],
  [60.2], [#best[46.4]], [#second[83.0]],
  [41.42], [35.38], [2.17], [#best[0.07]], [#second[44.03]],
  [60.35], [0.56], [105.25], [36.17], [2.75],

  [MAE (Habitat)],
  [32.5], [40.3], [79.0],
  [42.06], [#second[33.63]], [1.79], [#second[0.08]], [44.81],
  [59.76], [0.56], [#second[102.54]], [#second[35.65]], [2.88],

  [#text(fill: green)[*CroCo*] (Habitat)],
  [37.0], [40.6], [#best[85.6]],
  [#best[40.91]], [#best[31.34]], [#second[1.74]], [#second[0.08]], [#best[41.69]],
  [#best[54.13]], [#best[0.55]], [#best[93.58]], [#best[33.00]], [#best[1.25]],

  table.hline(stroke: 0.8pt),
)
```

---
layout: content
---

# A.4　Typst 绘图示例（CeTZ）

```typst
#import "@preview/cetz:0.3.4": canvas, draw, vector, matrix

#set text(size: 9pt)

#html.frame(canvas({
  import draw: *

  ortho(y: -30deg, x: 30deg, {
    on-xz({
      grid((0,-2), (8,2), stroke: gray + .5pt)
    })

    let wave(amplitude: 1, fill: none, phases: 2, scale: 8, samples: 100) = {
      line(..(for x in range(0, samples + 1) {
        let x = x / samples
        let p = (2 * phases * calc.pi) * x
        ((x * scale, calc.sin(p) * amplitude),)
      }), fill: fill)

      let subdivs = 8
      for phase in range(0, phases) {
        let x = phase / phases
        for div in range(1, subdivs + 1) {
          let p = 2 * calc.pi * (div / subdivs)
          let y = calc.sin(p) * amplitude
          let x = x * scale + div / subdivs * scale / phases
          line((x, 0), (x, y), stroke: rgb(0, 0, 0, 150) + .5pt)
        }
      }
    }

    on-xy({
      wave(amplitude: 1.6, fill: rgb(0, 0, 255, 50))
    })
    on-xz({
      wave(amplitude: 1, fill: rgb(255, 0, 0, 50))
    })
  })
}))
```
