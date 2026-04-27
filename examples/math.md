---
theme: ../
layout: cover
authors:
  - 演讲者: ["中国科学技术大学"]
conference: '$\LaTeX$ 数学公式示例'
talkTitle: '数学公式完整参考 $\int e^{-x^2}dx$'
subtitle: '行内公式 $\alpha_s(Q)$ · 块级公式 $\int e^{-x^2}dx$ · 组件内数学'
date: "2026 年 4 月 27 日"
sectionBar: true
figurePrefix: "图"
tablePrefix: "表"
---

`examples/math.md` — 系统展示数学公式在各种位置与组件中的渲染效果。

运行方式：`slidev examples/math.md`

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

# 一、行内公式（Inline Math）
段落 $p_T=p\sin\theta$ · 列表 $\sigma_E/E$ · 粗体 / 斜体混排

---
layout: content
---

# 行内公式 — 段落中

行内公式使用单美元符号 `$...$` 包裹，与正文无缝融合。

大型强子对撞机每次质子-质子碰撞产生约 $10^9$ 个事例，运行能量 $\sqrt{s} = 13\,\text{TeV}$，积分亮度 $\mathcal{L} = 139\,\text{fb}^{-1}$。探测器接受度以赝快度 $\eta = -\ln\tan(\theta/2)$ 和方位角 $\phi \in [0, 2\pi)$ 表示；横动量 $p_T = p\sin\theta$ 是关键物理量。

信号强度参数 $\mu = \sigma_\text{obs}/\sigma_\text{SM}$ 衡量观测截面与标准模型预测之比，$\mu = 1$ 对应标准模型预期。统计显著性定义为 $Z = \Phi^{-1}(1-p)$，其中 $\Phi$ 为正态分布累积函数，$p$ 为 $p$-value。

希格斯玻色子质量 $m_H = 125.09 \pm 0.24\,\text{GeV}$，衰变宽度 $\Gamma_H \approx 4.07\,\text{MeV}$，对应寿命 $\tau_H = \hbar/\Gamma_H \approx 1.6 \times 10^{-22}\,\text{s}$。

---
layout: content
---

# 行内公式 — 列表中

- **径迹参数：** 冲击参数 $d_0$、$z_0$，曲率 $\kappa = qB/(p_T)$，方向角 $\phi_0$、$\theta_0$
- **能量分辨率：** $\sigma_E/E = a/\sqrt{E} \oplus b/E \oplus c$，其中 $a$（采样项）、$b$（噪声项）、$c$（常数项）
- **亮度测量：** $\mathcal{L} = \frac{f_\text{rev} \cdot n_b^2}{4\pi \sigma_x \sigma_y}$，$f_\text{rev} = 11.2\,\text{kHz}$，$n_b$ 为每束团质子数
- **截面上限：** $\sigma \times \text{BR}(H \to \gamma\gamma) < 0.12\,\text{pb}$ 在 95% 置信水平（CL）
- **$b$-标记效率：** WP70 工作点对应效率 $\varepsilon_b \approx 70\%$、误标率 $\varepsilon_l \approx 1\%$
- 不确定性来源：喷注能量刻度（JES $\pm 1.5\%$）、喷注能量分辨率（JER $\pm 0.8\%$）、$b$-tag SF（$\pm 2\%$）

---
layout: content
---

# 行内公式 — 粗体 / 斜体 / 代码混排

在 Markdown 强调语法中嵌入数学：

- 使用 **$k$ 轮消息传递**，表达能力上界为 $k$ 阶 WL 图同构测试
- *自旋* $s = 1/2$ 的费米子满足 Dirac 方程 $( i \gamma^\mu \partial_\mu - m )\psi = 0$
- 传播子 $\Delta_F(x-y) = \langle 0 | T\phi(x)\phi(y) | 0 \rangle$ 在动量空间为 $\tilde{\Delta}_F(k) = i/(k^2 - m^2 + i\epsilon)$
- 矩阵元 $\mathcal{M}$ 通过 `FeynArts` 自动生成，截面 $\sigma = \frac{1}{2s}\int |\mathcal{M}|^2 d\Phi_n$
- `eta` 变量对应 $\eta$，`pT` 对应 $p_T$，`dR` 对应 $\Delta R = \sqrt{(\Delta\eta)^2 + (\Delta\phi)^2}$

脚注中的行内公式[^fn1]同样正常渲染。

[^fn1]: 脚注标题也可带数学：**共振截面 $\sigma(E)$**。Breit-Wigner 公式 $\sigma(E) = \frac{4\pi}{k^2} \frac{\Gamma^2/4}{(E-E_0)^2 + \Gamma^2/4}$，其中 $\Gamma$ 为共振宽度，半高全宽满足 $\Delta E=\Gamma$。

---
layout: section
---

# 二、块级公式（Display Math $\displaystyle \int_a^b f(x)\,dx$）
单行 $\mathcal{L}_\text{SM}$ · 多行对齐 · 矩阵与分段函数

---
layout: content
---

# 块级公式 — 单行

单个 `$$...$$` 块，居中显示，上下留白。

标准模型拉格朗日量密度：

$$
\mathcal{L}_\text{SM} = -\frac{1}{4}F_{\mu\nu}^a F^{a\mu\nu} + i\bar{\psi}_i \not\!\!D_{ij}\psi_j + |D_\mu \phi|^2 - V(\phi) + y_{ij}\bar{\psi}_{Li}\phi\psi_{Rj} + \text{h.c.}
$$

Higgs 势：

$$
V(\phi) = -\mu^2|\phi|^2 + \lambda|\phi|^4, \quad \langle\phi\rangle = \frac{v}{\sqrt{2}}, \quad v \approx 246\,\text{GeV}
$$

费米子质量由 Yukawa 耦合产生，$m_f = y_f v/\sqrt{2}$，顶夸克 $m_t \approx 173\,\text{GeV}$ 对应 $y_t \approx 1$。

---
layout: content
---

# 块级公式 — 多行对齐

`aligned` 环境对多步推导对齐等号：

$$
\begin{aligned}
\frac{\partial \mathcal{L}}{\partial(\partial_\mu\phi)} - \frac{\partial \mathcal{L}}{\partial\phi} &= 0 \\[4pt]
\Rightarrow\quad (\partial^\mu\partial_\mu + m^2)\phi &= 0 \\[4pt]
\Rightarrow\quad (-k^2 + m^2)\tilde{\phi}(k) &= 0
\end{aligned}
$$

路径积分表达式：

$$
\begin{aligned}
Z[J] &= \int \mathcal{D}\phi\; e^{i\int d^4x\,[\mathcal{L}(\phi) + J\phi]} \\
     &= Z_0[J]\;\exp\!\left[i\int d^4x\;\mathcal{L}_\text{int}\!\left(\frac{1}{i}\frac{\delta}{\delta J}\right)\right] \\
     &= \exp\!\left[-\frac{i}{2}\int d^4x\,d^4y\;J(x)\Delta_F(x-y)J(y) + \cdots\right]
\end{aligned}
$$

---
layout: content
density: dense
---

# 块级公式 — 矩阵

`pmatrix`、`bmatrix`、`vmatrix` 环境：

**旋转矩阵（$SO(3)$）：**

$$
R_z(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{pmatrix}, \quad
R_y(\theta) = \begin{pmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{pmatrix}
$$

**CKM 矩阵（Wolfenstein 参数化）：**

$$
V_\text{CKM} = \begin{pmatrix} 1-\lambda^2/2 & \lambda & A\lambda^3(\rho-i\eta) \\ -\lambda & 1-\lambda^2/2 & A\lambda^2 \\ A\lambda^3(1-\rho-i\eta) & -A\lambda^2 & 1 \end{pmatrix} + \mathcal{O}(\lambda^4)
$$

行列式 $|\det V_\text{CKM}| = 1$（幺正性），CP 破坏由 Jarlskog 不变量 $J = \text{Im}(V_{us}V_{cb}V_{ub}^*V_{cs}^*) \approx 3 \times 10^{-5}$ 表征。

---
layout: content
density: dense
---

# 块级公式 — cases 与 piecewise

`cases` 环境描述分段函数：

$$
\Theta(x) = \begin{cases} 1 & x > 0 \\ \tfrac{1}{2} & x = 0 \\ 0 & x < 0 \end{cases}, \qquad
\delta_\epsilon(x) = \begin{cases} \dfrac{1}{2\epsilon} & |x| \leq \epsilon \\ 0 & |x| > \epsilon \end{cases}
$$

PDF 参数化（MMHT2014 形式）：

$$
xf_i(x, Q^2) = \begin{cases}
A_i\, x^{\delta_i}(1-x)^{\eta_i}(1 + \varepsilon_i\sqrt{x} + \gamma_i x) & \text{（价夸克）} \\
A_i\, x^{-\delta_i}(1-x)^{\eta_i}(1 + \varepsilon_i x^{0.5} + \gamma_i x) & \text{（海夸克 / 胶子）}
\end{cases}
$$

DGLAP 演化方程将 $f_i(x,Q_0^2)$ 演化至任意 $Q^2 > Q_0^2$：

$$
\frac{\partial f_i(x,Q^2)}{\partial \ln Q^2} = \frac{\alpha_s(Q^2)}{2\pi} \sum_j \int_x^1 \frac{dy}{y}\; P_{ij}\!\left(\frac{x}{y}\right) f_j(y, Q^2)
$$

---
layout: content
density: dense
---

# 块级公式 — 求和、积分、极限

$$
\sigma_{gg\to H} = \frac{\pi^2}{8m_H} \,\Gamma(H\to gg)\, \int_0^1 dx\; g(x,\mu_F^2)\, g\!\left(\frac{m_H^2}{sx},\mu_F^2\right) \frac{1}{x}
$$

配分函数与自由能：

$$
Z = \text{Tr}\,e^{-\beta H} = \sum_n e^{-\beta E_n}, \qquad F = -k_BT\ln Z, \qquad \langle O\rangle = \frac{\text{Tr}(Oe^{-\beta H})}{Z}
$$

格林函数（Matsubara 频率求和）：

$$
G(\tau) = -\frac{1}{\beta}\sum_{n=-\infty}^{\infty} e^{-i\omega_n\tau}\, G(i\omega_n), \quad \omega_n = \frac{(2n+1)\pi}{\beta}\;\text{（费米子）}
$$

洛伦兹不变相空间：

$$
d\Phi_n = (2\pi)^4\delta^4\!\left(p_\text{in} - \sum_{i=1}^n k_i\right) \prod_{i=1}^n \frac{d^3k_i}{(2\pi)^3 2E_i}
$$

---
layout: content
density: dense
---

# 块级公式 — 行点击高亮

`$$` 后紧跟 `{行号|行号|all}` 即可开启逐行点击高亮，语法与代码块一致：

$$ {1|2|3|4|all}
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac{1}{c}\,\frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\[8pt]
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \\[8pt]
\nabla \times \vec{\mathbf{E}}\, +\, \frac{1}{c}\,\frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\[8pt]
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{aligned}
$$

点击顺序：**第 1 行**（Ampère 定律）→ **第 3 行**（Faraday 定律）→ **all**（完整 Maxwell 方程组）。

<Callout type="tip" title="语法">

````md
$$ {1|3|all}
\begin{aligned}
第一行 \\
第二行 \\
第三行
\end{aligned}
$$
````

</Callout>

---
layout: section
---

# 三、公式在 Callout 中
五种类型 $\Delta R$ · 行内 $q/p$ · 块级 $|\mathcal{M}|^2$

---
layout: content
---

# Callout — 行内公式

<Callout type="note" title="运动学定义：$p_T=p\sin\theta$">

径迹参数五元组 $(d_0, z_0, \phi_0, \theta_0, q/p)$：横向冲击参数 $d_0$、纵向冲击参数 $z_0$、横动量方向 $\phi_0$、极角 $\theta_0$、以及电荷与动量之比 $q/p$，其中 $p_T = |q/p|^{-1}\sin\theta_0$。

</Callout>

<Callout type="tip" title="计算技巧：$\ln n!$">

对 $n \gg 1$，Stirling 近似给出 $\ln n! \approx n\ln n - n + \tfrac{1}{2}\ln(2\pi n)$，相对误差约 $1/(12n)$。利用此式可将熵 $S = -k_B\sum_i p_i\ln p_i$ 在大系统极限下化为连续积分形式。

</Callout>

<Callout type="warning" title="符号约定：$\hbar=c=1$">

本文使用自然单位 $\hbar = c = 1$，度规约定 $(+,-,-,-)$。注意 $\gamma^\mu\gamma_\mu = 4$，$\text{tr}(\gamma^\mu\gamma^\nu) = 4g^{\mu\nu}$，$\text{tr}(\gamma^\mu\gamma^\nu\gamma^\rho\gamma^\sigma) = 4(g^{\mu\nu}g^{\rho\sigma} - g^{\mu\rho}g^{\nu\sigma} + g^{\mu\sigma}g^{\nu\rho})$。

</Callout>

---
layout: content
density: dense
---

# Callout — 块级公式（dense 模式）

<Callout type="important" title="核心结论：$t\propto\langle\mu\rangle^{1.08}$">

在 $\langle\mu\rangle = 200$ 高堆积条件下，GNN 推理时间与堆积近线性相关：

$$
t_\text{GNN} \propto \langle\mu\rangle^{1.08 \pm 0.03}
$$

而 Kalman Filter 为 $t_\text{KF} \propto \langle\mu\rangle^{2.1 \pm 0.1}$，差距在 $\langle\mu\rangle = 200$ 时达到 **11.4×**。

</Callout>

<Callout type="example" title="具体计算示例：$|\mathcal{M}|^2$">

对 $t\bar{t}H$ 信号，矩阵元平方在领头阶（LO）为：

$$
|\mathcal{M}|^2 = \frac{g_s^4 y_t^2}{4}\, C_F\, \text{tr}\!\left[\not\!p_1 \gamma^\mu \not\!p_2 \gamma^\nu\right] \epsilon_\mu^*(k_1)\epsilon_\nu^*(k_2) \cdot \bar{u}(p_3)\cdots
$$

NLO QCD 修正引入 $K$-因子 $K \approx 1.3$（CTEQ6L1 PDF，$\mu_R = \mu_F = m_t + m_H/2$）。

</Callout>

---
layout: section
---

# 四、公式在 Block 中 $W_p(\mu,\nu)$
定义 $W_p(\mu,\nu)$ · 定理 $\sup_{\|f\|_L\le1}$ · 证明

---
layout: content
---

# Block — 定义、定理、命题

<Block title="定义 1（Wasserstein 距离）">

对概率测度 $\mu, \nu$ 在度量空间 $(X, d)$ 上，$p$-Wasserstein 距离定义为

$$
W_p(\mu,\nu) = \left(\inf_{\gamma \in \Pi(\mu,\nu)} \int_{X\times X} d(x,y)^p\, d\gamma(x,y)\right)^{1/p}
$$

其中 $\Pi(\mu,\nu)$ 为所有边缘分布为 $\mu$ 和 $\nu$ 的联合分布族。

</Block>

<Block title="定理 1（Kantorovich 对偶）">

$$
W_1(\mu,\nu) = \sup_{\|f\|_L \leq 1} \left[\int f\, d\mu - \int f\, d\nu\right]
$$

其中上确界取遍所有 1-Lipschitz 函数 $f: X \to \mathbb{R}$。

</Block>

---
layout: content
density: dense
---

# Block — dense 模式中的数学

<Block title="引理 2（Cauchy-Schwarz 不等式）">

对内积空间 $(\mathcal{H}, \langle\cdot,\cdot\rangle)$ 中任意 $u, v \in \mathcal{H}$：

$$|\langle u, v\rangle|^2 \leq \langle u,u\rangle \cdot \langle v,v\rangle$$

等号成立当且仅当 $u, v$ 线性相关（即 $u = \lambda v$ 对某 $\lambda \in \mathbb{C}$）。

</Block>

<Block title="命题 3（Fisher 信息矩阵）">

对参数化分布族 $\{p(x;\theta)\}_{\theta \in \Theta}$，Fisher 信息矩阵元为

$$
\mathcal{I}_{ij}(\theta) = \mathbb{E}\!\left[\frac{\partial \ln p}{\partial\theta_i}\frac{\partial \ln p}{\partial\theta_j}\right] = -\mathbb{E}\!\left[\frac{\partial^2 \ln p}{\partial\theta_i\partial\theta_j}\right]
$$

Cramér-Rao 下界：$\text{Cov}(\hat\theta) \geq \mathcal{I}^{-1}(\theta)$，即任意无偏估计量的方差不小于 Fisher 信息逆矩阵。

</Block>

---
layout: content
density: dense
---

# Block — Grid 中的多列数学

<Grid cols="2" gap="md">
  <Block title="Maxwell 方程组（微分形式）">

  $$\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$$

  $$\nabla \times \mathbf{B} = \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial\mathbf{E}}{\partial t}$$

  $$\nabla \cdot \mathbf{B} = 0, \quad \nabla\times\mathbf{E} = -\frac{\partial\mathbf{B}}{\partial t}$$

  </Block>
  <Block title="Maxwell 方程组（协变形式）">

  $$\partial_\mu F^{\mu\nu} = \mu_0 J^\nu$$

  $$\partial_{[\mu}F_{\nu\rho]} = 0$$

  场强张量：$F^{\mu\nu} = \partial^\mu A^\nu - \partial^\nu A^\mu$

  规范不变性：$A^\mu \to A^\mu + \partial^\mu\chi$

  </Block>
</Grid>

<Block title="连续性方程与守恒荷">

由 $\partial_\mu J^\mu = 0$ 得守恒荷 $Q = \int d^3x\, J^0(\mathbf{x},t) = \text{const}$。对应 Noether 定理：每个连续对称性对应一个守恒荷。

</Block>

---
layout: section
---

# 五、公式在 TableBlock 中
表头 $Q/e,T_3$ · 表格单元 $m_f$ · 数学列 $\int f(x)\,dx$

---
layout: content
density: dense
---

# TableBlock — 数学在单元格中

<TableBlock caption="标准模型基本费米子质量（$\overline{\text{MS}}$ 方案，$\mu = 2\,\text{GeV}$）。" captionAlign="left">

| 粒子 | 符号 | 质量 | 电荷 $Q/e$ | 弱同位旋 $T_3$ |
|------|------|-----:|----------:|-------------:|
| 上夸克 | $u$ | $2.16^{+0.49}_{-0.26}\,\text{MeV}$ | $+2/3$ | $+1/2$ |
| 下夸克 | $d$ | $4.67^{+0.48}_{-0.17}\,\text{MeV}$ | $-1/3$ | $-1/2$ |
| 奇夸克 | $s$ | $93.4^{+8.6}_{-3.4}\,\text{MeV}$ | $-1/3$ | $-1/2$ |
| 魅夸克 | $c$ | $1.273 \pm 0.046\,\text{GeV}$ | $+2/3$ | $+1/2$ |
| 底夸克 | $b$ | $4.183^{+0.017}_{-0.020}\,\text{GeV}$ | $-1/3$ | $-1/2$ |
| 顶夸克 | $t$ | $172.69 \pm 0.30\,\text{GeV}$ | $+2/3$ | $+1/2$ |
| 电子 | $e^-$ | $0.51100\,\text{MeV}$ | $-1$ | $-1/2$ |
| μ 子 | $\mu^-$ | $105.66\,\text{MeV}$ | $-1$ | $-1/2$ |
| τ 轻子 | $\tau^-$ | $1776.86 \pm 0.12\,\text{MeV}$ | $-1$ | $-1/2$ |

</TableBlock>

---
layout: content
density: dense
---

# TableBlock — 数学公式作为列内容

<TableBlock caption="常用积分公式速查（$n \neq -1$，$a > 0$）。" captionAlign="left">

| 被积函数 $f(x)$ | 不定积分 $\int f(x)\,dx$ | 备注 |
|:---:|:---:|:---|
| $x^n$ | $\dfrac{x^{n+1}}{n+1} + C$ | $n \neq -1$ |
| $e^{ax}$ | $\dfrac{1}{a}e^{ax} + C$ | $a \neq 0$ |
| $\sin(ax)$ | $-\dfrac{1}{a}\cos(ax) + C$ | — |
| $\dfrac{1}{\sqrt{a^2-x^2}}$ | $\arcsin\dfrac{x}{a} + C$ | $|x| < a$ |
| $\dfrac{1}{x^2+a^2}$ | $\dfrac{1}{a}\arctan\dfrac{x}{a} + C$ | — |
| $\dfrac{1}{\sqrt{x^2 \pm a^2}}$ | $\ln\!\left|x + \sqrt{x^2\pm a^2}\right| + C$ | — |

</TableBlock>

---
layout: section
---

# 六、公式在 ResultBox 中
测量值 $\hat{\theta}\pm\sigma$ · 非对称误差 $x^{+a}_{-b}$ · 显著性 $Z$

---
layout: content
---

# ResultBox — 测量结果

<ResultBox title="Higgs 信号强度 $\mu_{ggH}$ 测量">

$$
\mu_{ggH} = 1.05^{+0.16}_{-0.14}\,(\text{stat.})^{+0.13}_{-0.11}\,(\text{syst.})
$$

组合显著性 $Z_\text{obs} = 5.4\sigma$（预期 $4.9\sigma$），质量 $m_H = 124.86 \pm 0.27\,\text{GeV}$。

</ResultBox>

<ResultBox title="$t\bar{t}$ 产生截面（$\sqrt{s} = 13\,\text{TeV}$）">

$$
\sigma_{t\bar{t}} = 831^{+19}_{-29}\,(\text{scale})^{+35}_{-35}\,(\text{PDF})\,\text{pb}
$$

与 NNLO+NNLL QCD 预测 $\sigma_{t\bar{t}}^\text{th} = 831.76^{+19.77}_{-29.20}\,\text{pb}$ 完全一致（$\mu_R=\mu_F=m_t=173.3\,\text{GeV}$）。

</ResultBox>

---
layout: content
density: dense
---

# ResultBox — dense 模式 + 复杂公式

<ResultBox title="$W$ 玻色子质量 $m_W$ 精密测量">

$$
m_W = 80\,433.5 \pm 6.4_\text{stat} \pm 9.4_\text{syst} = 80\,433.5 \pm 11.4\,\text{MeV}
$$

与标准模型预测 $m_W^\text{SM} = 80\,357 \pm 6\,\text{MeV}$ 偏差 $7\sigma$；与 LHCb 测量 $m_W^\text{LHCb} = 80\,354 \pm 32\,\text{MeV}$ 差异待进一步确认。

</ResultBox>

<ResultBox title="引力波事件 GW150914：$h\sim10^{-21}$">

$$
m_1 = 36^{+5}_{-4}\,M_\odot,\quad m_2 = 29^{+4}_{-4}\,M_\odot,\quad M_f = 62^{+4}_{-4}\,M_\odot,\quad E_\text{rad} = 3.0^{+0.5}_{-0.5}\,M_\odot c^2
$$

峰值应变 $h \sim 10^{-21}$，对应距离 $d_L = 410^{+160}_{-180}\,\text{Mpc}$；信噪比 SNR $= 24$，虚假警报率 $< 1/(203000\,\text{yr})$。

</ResultBox>

---
layout: section
---

# 七、公式在 Split 布局中
左右推导 $\psi(x,t)$ · 侧栏参数 $G=(V,E)$ · 公式参考

---
layout: split
ratio: "1:1"
---

# Split — 两栏数学推导

::left::

**薛定谔方程（位置表象）**

$$
i\hbar\frac{\partial\psi}{\partial t} = \hat{H}\psi = \left[-\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r})\right]\psi
$$

定态解 $\psi(\mathbf{r},t) = \phi(\mathbf{r})e^{-iEt/\hbar}$，其中

$$
\hat{H}\phi = E\phi
$$

氢原子 $V = -e^2/(4\pi\varepsilon_0 r)$，能级

$$
E_n = -\frac{m_e e^4}{2\hbar^2}\frac{1}{n^2} = \frac{-13.6\,\text{eV}}{n^2}
$$

::right::

**路径积分（Feynman 表述）**

$$
K(x_f,t_f;x_i,t_i) = \int_{x_i}^{x_f} \mathcal{D}x(t)\; e^{iS[x]/\hbar}
$$

经典作用量 $S[x] = \int_{t_i}^{t_f} L(x,\dot{x})\,dt$，传播子满足

$$
\psi(x_f,t_f) = \int dx_i\; K(x_f,t_f;x_i,t_i)\,\psi(x_i,t_i)
$$

半经典近似 $\hbar \to 0$ 恢复最小作用量原理：

$$
\delta S = 0 \;\Leftrightarrow\; \frac{d}{dt}\frac{\partial L}{\partial\dot{x}} = \frac{\partial L}{\partial x}
$$

---
layout: split
ratio: "2:1"
density: dense
---

# Split — 主内容 + 侧边公式参考

::left::

**图神经网络消息传递框架**

将探测器击中点映射为图 $G = (V, E)$，节点特征 $h_i^{(0)} = (r_i, \phi_i, z_i, \text{layer}_i)$。

第 $l$ 轮更新：

$$
m_{ij}^{(l)} = \phi_m\!\left(h_i^{(l)}, h_j^{(l)}, e_{ij}\right)
$$

$$
h_i^{(l+1)} = \phi_h\!\left(h_i^{(l)},\bigoplus_{j\in\mathcal{N}(i)} m_{ij}^{(l)}\right)
$$

边分类头：$\hat{y}_{ij} = \sigma(W[h_i \| h_j]) \in [0,1]$

训练损失（类权重 BCE）：

$$
\mathcal{L} = -\sum_{ij}\left[w_+ y_{ij}\log\hat{y}_{ij} + w_-(1-y_{ij})\log(1-\hat{y}_{ij})\right]
$$

::right::

**参数汇总**

| 符号 | 含义 |
|------|------|
| $N_v \sim 10^4$ | 节点数 |
| $N_e \sim 10^6$ | 边数 |
| $d = 128$ | 隐层维度 |
| $k = 3$ | 消息传递轮数 |
| $w_+ = 50$ | 正边权重 |

<Callout type="note">

推理时间 $O(N_v d + N_e d^2)$，与 $\langle\mu\rangle$ 近线性。

</Callout>

---
layout: section
---

# 八、公式在 Takeaway 中
行内数学 $\varepsilon=97.1\%$ · dense 模式 · Cramér-Rao 下界

---
layout: content
---

# Takeaway — 含行内公式

Takeaway 里的行内数学应与加粗文字保持相同视觉重量。

正文论证过程：我们证明了在 $\langle\mu\rangle = 200$ 条件下，异构 GNN 推理时间约为 18 ms，而 Kalman Filter 超过 10 分钟。

<Takeaway>

异构 GNN 在 $\langle\mu\rangle = 200$ 时推理时间 $t = 18\,\text{ms}$，比 Kalman Filter 快 **33×**，同时保持效率 $\varepsilon = 97.1\%$、假径迹率 $f = 0.6\%$。

</Takeaway>

<Takeaway>

Cramér-Rao 下界 $\text{Var}(\hat\theta) \geq \mathcal{I}^{-1}(\theta)$ 表明 Fisher 信息量是无偏估计的效率上限；当且仅当 $\hat\theta$ 为指数族的充分统计量时等号成立。

</Takeaway>

---
layout: content
density: dense
---

# Takeaway — dense 模式下含公式

各分析结果摘要：

- **能量分辨率：** $\sigma_E/E = 10\%/\sqrt{E[\text{GeV}]} \oplus 0.7\%$（电磁量能器）
- **径迹动量分辨率：** $\sigma_{p_T}/p_T^2 = 0.05\%\,\text{GeV}^{-1} \oplus 0.1\%/p_T\,[\text{GeV}^{-1}]$（内径迹系统）
- **$b$-标记效率：** $\varepsilon_b = 70\%$ @ WP70，对应误标率 $\varepsilon_l \approx 0.8\%$

<Takeaway>

精确测量要求 $\sigma_E/E < 1\%$；目前 HL-LHC 升级后的 ATLAS 量能器设计目标为 $\sigma_E/E = 9\%/\sqrt{E} \oplus 0.5\%$，较 Run 2 提升 $\sim 30\%$。

</Takeaway>

---
layout: section
---

# 九、引用中的公式
Markdown blockquote $F=ma$ · 引用来源 · 引文脚注 $\delta S=0$

---
layout: content
---

# 引用 — 行内公式与引文来源

> “The most incomprehensible thing about the universe is that it is comprehensible.”
>
> 用数学语言表达：若自然规律可压缩为模型族 $\mathcal{M}$，则观测数据 $D$ 的描述长度可写作 $L(D,\mathcal{M}) = L(\mathcal{M}) + L(D\mid\mathcal{M})$。科学理论追求的是在预测误差 $\epsilon$ 可控时最小化该长度。
>
> — Einstein 引文语境下的最小描述长度解释，$\arg\min_{\mathcal{M}} L(D,\mathcal{M})$

正文继续承接引用：上面的 quote 同时测试普通引文文本、行内公式、长符号与破折来源行。

> **Noether 定理：** 每个连续对称性 $\delta q_i = \epsilon\,\Delta q_i$ 对应一个守恒量
>
> $$
> Q = \sum_i \frac{\partial L}{\partial \dot q_i}\Delta q_i - F
> $$
>
> 若 $\frac{dQ}{dt}=0$，则相空间流保持辛形式 $\omega = \sum_i dp_i\wedge dq_i$。

---
layout: content
density: dense
---

# 引用 — 公式、脚注与嵌套语义

> Feynman 路径积分把量子振幅写成所有路径的相干叠加[^quote-path]：
>
> $$
> \langle x_f,t_f\mid x_i,t_i\rangle
> = \int_{x_i}^{x_f}\mathcal{D}x(t)\,\exp\!\left(\frac{i}{\hbar}S[x]\right)
> $$
>
> 当 $\hbar\to 0$ 时，驻相条件 $\delta S=0$ 给出经典轨道。

<Callout type="note" title="引用块旁的公式标题：$\delta S=0$">

这一页同时检查 blockquote、脚注、Callout 标题和块级公式的组合渲染。脚注中的公式要在悬停预览与底部脚注列表中都保持可读。

</Callout>

[^quote-path]: 引用脚注中的公式：作用量 $S[x]=\int_{t_i}^{t_f}L(x,\dot{x},t)\,dt$，传播核满足半群性质 $K(t_3,t_1)=\int dx_2\,K(t_3,t_2)K(t_2,t_1)$。

---
layout: section
---

# 十、脚注中的公式 $\chi^2=\mathbf{r}^\top V^{-1}\mathbf{r}$
overlay $P_{k|k-1}$ · flow $\overline{\text{MS}}$ · 悬停预览

---
layout: content
---

# 脚注 — overlay 模式

正文中引用带有数学内容的参考文献[^kf][^acts][^gnn]。脚注区默认以 overlay 方式固定在页面底部，字号较小，公式应等比缩小。

Kalman Filter 的最优性由 Bellman 方程保证[^kf]：在线性高斯假设下，滤波估计量 $\hat{x}_{k|k}$ 是最小均方误差（MMSE）估计。

非线性扩展（EKF）在一阶 Taylor 展开处线性化：系统方程 $f(\mathbf{x}_k, \mathbf{u}_k)$ 由雅可比矩阵 $F_k = \partial f/\partial \mathbf{x}|_{\hat{x}_{k-1}}$ 近似[^acts]。

GNN 边分类精度 $\text{AUC} = 0.987$，在 $\langle\mu\rangle = 140$ 时假边率 $f_e < 0.3\%$[^gnn]。

[^kf]: **Kalman 预测 $\hat{x}_{k|k-1}$**：Frühwirth, R. "Application of Kalman filtering to track and vertex fitting." *NIM A* **262** (1987) 444–450. 状态向量 $\mathbf{x}_k = (x, y, z, p_x, p_y, p_z)^\top$，预测协方差 $P_{k|k-1} = F_k P_{k-1} F_k^\top + Q_k$。
[^acts]: **拟合质量 $\chi^2$**：Ai, X. et al. "A Common Tracking Software Project." *Front. Phys.* **10** (2022) 817828. ACTS 使用 $\chi^2 = \mathbf{r}^\top V^{-1} \mathbf{r}$ 检验拟合质量，$\mathbf{r}$ 为残差向量。
[^gnn]: **消息传递 $h_i^{(l+1)}$**：Ju, X. et al. "Graph Neural Networks for Particle Reconstruction in HEP." *EPJ Web Conf.* **245** (2020) 09013. 消息传递 $k=3$ 轮，$d=128$ 维隐层，更新式 $h_i^{(l+1)}=\phi_h(h_i^{(l)},\oplus_j m_{ij}^{(l)})$。

---
layout: content
density: dense
footnote: flow
---

# 脚注 — flow 模式

`footnote: flow` 时，脚注随正文流动，不固定在底部——适合脚注较多或公式复杂的情形[^deriv][^renorm]。

量子场论中，圈图积分通常发散，需通过正规化与重整化处理：

$$
\Sigma(p^2) = \frac{g^2}{16\pi^2}\left[\frac{2}{\epsilon} - \gamma_E + \ln(4\pi) - \ln\frac{p^2}{\mu^2} + \text{有限项}\right]
$$

[^deriv]: 维度正规化：将时空维度从 $d=4$ 解析延拓至 $d=4-\epsilon$，消除紫外发散。自能积分 $\int d^dk\, k^{-2n}$ 在 $d=4-\epsilon$ 下收敛，极点 $1/\epsilon$ 对应对数发散。
[^renorm]: $\overline{\text{MS}}$ 方案：减去 $2/\epsilon - \gamma_E + \ln(4\pi)$。重整化群方程 $\mu\,d g/d\mu = \beta(g)$，对 QCD $\beta_0 = 11 - 2n_f/3$，$\alpha_s(\mu) = \alpha_s(M_Z)/[1 + \alpha_s(M_Z)\beta_0\ln(\mu/M_Z)/(2\pi)]$。

---
layout: section
---

# 十一、综合演示
长公式 $\mathcal{A}_n$ · 公式密集页 · 跑动耦合 $\alpha_s(Q^2)$

---
layout: content
density: dense
lineHeight: 1.45
---

# 综合 — 公式密集页（dense + lineHeight）

**散射振幅分解（BCFW 递推）：**

$$
\mathcal{A}_n(1^{h_1}\cdots n^{h_n}) = \sum_{\alpha,h} \mathcal{A}_L(\hat{1},\ldots,\alpha^h,-\hat{P}_{\alpha\beta})\frac{1}{P_{\alpha\beta}^2}\mathcal{A}_R(\hat{P}_{\alpha\beta},\beta,\ldots,\hat{n})
$$

**Optical theorem：** $2\,\text{Im}\,\mathcal{M}(a\to a) = \sum_X (2\pi)^4\delta^4(p_a - p_X)|\mathcal{M}(a\to X)|^2 = 2E_a|\mathbf{p}_a|\sigma_\text{tot}$

**Dispersion relation：**

$$
\text{Re}\,\mathcal{M}(s) = \frac{1}{\pi}\,\text{P.V.}\int_{s_\text{th}}^\infty \frac{\text{Im}\,\mathcal{M}(s')}{s'-s}\,ds'
$$

**Renormalization group (β-function at 2-loop)：**

$$
\mu\frac{d\alpha_s}{d\mu} = -\frac{\alpha_s^2}{2\pi}\left[\beta_0 + \frac{\beta_1}{4\pi}\alpha_s + \cdots\right], \quad \beta_0 = 11 - \frac{2n_f}{3},\quad \beta_1 = 102 - \frac{38n_f}{3}
$$

**Running coupling solution：**

$$
\alpha_s(\mu_2) = \frac{\alpha_s(\mu_1)}{1 + \frac{\alpha_s(\mu_1)\beta_0}{2\pi}\ln(\mu_2/\mu_1)}
$$

---
layout: content
density: dense
---

# 综合 — 公式 + Callout + Takeaway

量子色动力学跑动耦合在单圈近似下：

$$
\alpha_s(Q^2) = \frac{2\pi}{\beta_0 \ln(Q/\Lambda_\text{QCD})}, \quad \Lambda_\text{QCD} \approx 213\,\text{MeV}
$$

<Callout type="note" title="渐近自由">

$Q \to \infty$ 时 $\alpha_s \to 0$：夸克在高能（短距离）下表现为自由粒子。Gross、Politzer、Wilczek 因此获得 2004 年诺贝尔物理学奖。判据：$\beta_0 > 0$，即 $n_f < 33/2$（对 QCD，$n_f = 6 \ll 16.5$）。

</Callout>

<Callout type="warning" title="红外困境">

$Q \to \Lambda_\text{QCD}$ 时 $\alpha_s \to \infty$，微扰论失效。夸克禁闭区域 $r \gtrsim 1\,\text{fm}$（$Q \lesssim 200\,\text{MeV}$）需格点 QCD 或有效场论处理。

</Callout>

<Takeaway>

$\alpha_s(m_Z) = 0.1179 \pm 0.0010$ 是目前精度最高的 QCD 参数之一，世界平均值由 DIS、$e^+e^-$、格点 QCD 联合确定。

</Takeaway>

---
layout: end
---

# 数学公式参考结束
