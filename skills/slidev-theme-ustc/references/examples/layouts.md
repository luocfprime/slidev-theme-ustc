---
theme: ../
layout: cover
authors:
  - 演讲者: ["中国科学技术大学"]
conference: "USTC Slidev 主题"
talkTitle: "布局系统完整参考"
subtitle: "所有布局的全部 frontmatter 选项"
date: "2026 年 4 月 26 日"
sectionBar: true
sectionBarMode: full
---

`examples/layouts.md` — 涵盖所有布局的完整选项演示。

运行方式：`slidev examples/layouts.md`

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

# 一、cover 布局
`talkTitle` · `subtitle` · `authors` · `presenter` · `authorMarks` · `conference` · `date` · `showLogo` · `logoSrc` · `logoAlt` · `background`

---
layout: cover
talkTitle: "showLogo: true（默认）"
subtitle: "副标题（可选）"
presenter: "演讲者"
authors:
  - name: "演讲者"
    affiliations: ["中国科学技术大学"]
  - name: "合作者"
    affiliations: ["清华大学"]
conference: "Example Conference"
date: "2026 年 4 月"
showLogo: true
---

`showLogo: true`（默认）在右上角显示 USTC logo。

`logoSrc` 可替换图片路径（默认 `'/ustc/logo.svg'`），`logoAlt` 修改无障碍文字。

`presenter` 指定汇报者姓名（下划线标注），不填默认取第一作者。

---
layout: cover
talkTitle: "showLogo: false"
authors:
  - name: "演讲者"
    affiliations: ["中国科学技术大学"]
conference: "Example Conference"
date: "2026 年 4 月"
showLogo: false
---

`showLogo: false` 隐藏 logo，适合无需品牌标识的场合。

---
layout: cover
talkTitle: "background 背景色"
authors:
  - name: "演讲者"
    affiliations: ["中国科学技术大学"]
date: "2026 年 4 月"
background: "/ATLAS/ATLAS-Detector.webp"
showLogo: false
---

`background` 接受 CSS 颜色值或图片 URL，用于自定义封面背景。

---
layout: cover
talkTitle: "authorMarks — marks + multi-affiliation wrapping"
presenter: "Bob Chen"
authors:
  - name: "Alice Wang"
    affiliations: ["University of Science and Technology of China", "Shanghai AI Laboratory"]
    marks: ["†", "*"]
  - name: "Bob Chen"
    affiliations: ["University of Science and Technology of China", "Tsinghua University"]
    marks: ["†"]
  - name: "Carol Liu"
    affiliations: ["Peking University", "Institute of Computing Technology, Chinese Academy of Sciences"]
  - name: "David Zhang"
    affiliations: ["Shanghai Jiao Tong University"]
    marks: ["*"]
authorMarks:
  "†": "Equal contribution"
  "*": "Corresponding author"
date: "April 2026"
---

`marks` 作为上标显示在机构编号之后，各 mark 之间有逗号。`authorMarks` 图例显示在机构行下方。机构行使用 `flex-wrap: wrap`，超出宽度自动折行，不影响上方作者行的标注。

`presenter: "Bob Chen"` 下划线只覆盖名字本身，不延伸到上标。

---
layout: cover
talkTitle: "Multi-Institution Wrapping"
authors:
  - name: "Alice Wang"
    affiliations: ["University of Science and Technology of China", "Shanghai AI Laboratory"]
  - name: "Bob Chen"
    affiliations: ["Tsinghua University", "Peking University"]
  - name: "Carol Liu"
    affiliations: ["Fudan University"]
  - name: "David Zhang"
    affiliations: ["Zhejiang University", "Shanghai Jiao Tong University"]
  - name: "Eve Li"
    affiliations: ["Institute of Computing Technology, Chinese Academy of Sciences"]
date: "April 2026"
---

机构列表使用 `flex-wrap: wrap`，单个机构项不断行，超出宽度自动折到下一行。

---
layout: cover
talkTitle: "超长标题：基于异构图神经网络的高亮度 LHC 事例重建与实时触发优化研究"
authors:
  - name: "张明远"
    affiliations: ["中国科学技术大学"]
date: "2026 年 4 月"
showLogo: false
---

超长 `talkTitle` 测试。默认 `--ustc-max-w-cover-h1: 48rem`，可单独覆盖此 token 控制封面标题折行宽度而不影响其他幻灯片的 h1。

---
layout: cover
talkTitle: "超长副标题测试"
subtitle: "这是一段比较长的副标题，用于测试默认的 --ustc-max-w-cover-sub 在什么位置开始折行，以便决定是否需要调整默认值。副标题通常用于报告的子标题或引言性文字。"
authors:
  - name: "张明远"
    affiliations: ["中国科学技术大学"]
date: "2026 年 4 月"
showLogo: false
---

超长 `subtitle` 测试。默认 `--ustc-max-w-cover-sub: 58rem`，可单独覆盖此 token 控制封面副标题折行宽度。

---
layout: section
---

# 二、content 布局
`density` · `margin` · `footer` · `footerMode` · `footnote` · `lineHeight` · `align` · `subtitle` · `background` · `sectionBar` · `sectionBarMode`

---
layout: content
footerMode: full
---

# footerMode: full（默认）

页脚完整模式：**左**：演讲者 · **中**：报告标题 · **右**：会议 · 日期 · 页码。

---
layout: content
footerMode: minimal
---

# footerMode: minimal

页脚简化模式：**左**：演讲者 · **右**：页码。

适合内容密集、需要节省底部空间的幻灯片。

---
layout: content
footer: false
---

# footer: false

完全隐藏页脚栏，此幻灯片底部没有蓝色栏。

适合图形密集型幻灯片或全屏展示页。

---
layout: content
footnote: overlay
---

# footnote: overlay（默认）

正文引用文献[^a1]，可在行内堆叠多个标记[^a2][^a3]。

**Overlay 模式**：脚注浮层覆盖于内容下方，不占用正文布局空间，悬停上标可预览全文。

正文可以继续排布更多内容，不会被脚注挤压。

[^a1]: ATLAS Collaboration, *JHEP* **04** (2024) 123.
[^a2]: CMS Collaboration, *PLB* **832** (2022) 137232.
[^a3]: LHCb Collaboration, *PRL* **128** (2022) 041801.

---
layout: content
footnote: flow
---

# footnote: flow

`footnote: flow` 将脚注以正常文档流渲染在内容之后，不使用绝对定位。[^b1][^b2]

适合脚注较少、正文不满页时使用，避免脚注与内容重叠。

[^b1]: Flow 模式下脚注直接紧跟内容排布。
[^b2]: 适合参考文献较少的幻灯片。

---
layout: content
lineHeight: 2.5
---

# lineHeight: 2.5

`lineHeight` 覆盖默认正文行高（`1.8`）。

它只调整段落内部的行距；段落之间的块间距仍由段落 margin 或外层 CSS 控制。

设为 `2.5` 时正文行间距明显增大，适合：

- 需要手写批注的讲义
- 较长的逐行数学推导
- 视觉上更宽松的叙述内容

---
layout: content
margin: normal
sectionBar: false
---

# margin: normal

`margin: normal` 是默认边距，作为和其它档位对照的基准。

---
layout: content
margin: tight
sectionBar: false
---

# margin: tight

`margin: tight` 同时收窄顶部和左侧边距，适合正文较多、但仍希望保留清晰页边的页面。

---
layout: content
margin: tighter
sectionBar: false
---

# margin: tighter

`margin: tighter` 进一步压缩顶部和左侧边距，适合表格、长公式或更接近讲义风格的页面。

---
layout: content
margin: none
sectionBar: false
---

# margin: none

`margin: none` 取消顶部和左侧边距，适合需要最大正文宽度的页面。

---
layout: content
subtitle: "这里是副标题，渲染在标题正下方、正文之前。"
---

# content subtitle prop

`subtitle` 在 frontmatter 中声明，自动渲染在 `h1` 正下方：

```yaml
---
layout: content
subtitle: "副标题或引言文字"
---

# 幻灯片标题

正文内容…
```


---
layout: section
---

# 三、split 布局
`ratio` · `gap` · `density` · `margin` · `lineHeight` · `align` · `footnote` · `subtitle` · `background` · `footer` · `footerMode` · `sectionBar` · `sectionBarMode`

---
layout: split
ratio: "2:1"
---

# ratio: "2:1"（默认）

::left::

左侧 2/3，右侧 1/3。最常用比例，适合文字说明配图。

$$\mu_\text{sig} = 1.05^{+0.31}_{-0.29}$$

::right::

<FigureBlock src="/ATLAS/ATLAS-Detector.webp" alt="ATLAS" caption="探测器示意图。" />

---
layout: split
ratio: "1:1"
---

# ratio: "1:1"

::left::

左右等宽，适合两组并列数据或双图对比。

<TableBlock caption="左侧数据。" captionAlign="left">

| 变量 | 值 |
|------|---:|
| $p_T$ | 45.2 GeV |
| $\eta$ | 1.23 |
| $\phi$ | −0.87 |

</TableBlock>

::right::

<FigureBlock src="/ATLAS/ATLAS-Logo.png" alt="Logo" caption="右侧图示。" captionAlign="center" />

---
layout: split
ratio: "3:2"
---

# ratio: "3:2"

::left::

左侧 3/5，右侧 2/5，文字稍多时使用。

- $\sigma \times \mathrm{BR} = 2.3\,\text{pb}$
- 本底压低因子 $\sim 10^3$
- 系统误差 $< 8\%$

::right::

<FigureBlock src="/ATLAS/ATLAS-Detector.webp" alt="ATLAS" caption="结果分布图。" />

---
layout: split
ratio: "1:2"
---

# ratio: "1:2"

::left::

左侧 1/3，文字较少，右侧大图为主体。

- 观测到 $5\sigma$ 超出
- $\mu = 1.05$

::right::

<FigureBlock src="/ATLAS/ATLAS-Detector.webp" alt="ATLAS" caption="探测器几何结构。" />

---
layout: split
ratio: "2:3"
---

# ratio: "2:3"

::left::

左侧 2/5，右侧图形更宽，以视觉为主的结果展示页。

::right::

<FigureBlock src="/ATLAS/ATLAS-Detector.webp" alt="ATLAS" caption="宽幅图示。" />

---
layout: split
ratio: "1:1"
gap: sm
---

# gap: sm（0.8rem）

::left::

`gap: sm` 使两栏间距最小（0.8rem），适合内容需要紧凑排布的幻灯片。

`gap` 可选值：`sm`（0.8rem）/ `md`（1.4rem，默认）/ `lg`（2rem）

::right::

内容更贴近中间分隔线，整体更紧凑。

---
layout: split
ratio: "1:1"
gap: lg
---

# gap: lg（2rem）

::left::

`gap: lg` 使两栏间距最大（2rem），视觉分离感更强。

适合需要明确区分左右的「对比」类幻灯片。

::right::

内容与左栏之间有更大的留白。

---
layout: split
ratio: "2:1"
density: dense
---

# split + density: dense

::left::

`split` 同样支持 `density: dense`，正文字号压缩至 `1.05rem`。

- **信号选择**：$p_T > 25\,\text{GeV}$，$|\eta| < 2.5$
- **信号区间**：$m_{bb} \in [100, 140]\,\text{GeV}$
- **系统误差**：JES $3\%$，JER $2\%$，$b$-tag $5\%$

$$\mu = 1.05^{+0.31}_{-0.29}$$

::right::

<FigureBlock src="/ATLAS/ATLAS-Detector.webp" alt="ATLAS" caption="分析结果分布。" />

---
layout: split
ratio: "1:1"
---

# split 不带 ::left::／::right::（单栏模式）

当不使用 `::left::` 和 `::right::` 时，默认插槽填满整个内容区，渲染为单栏布局。

此时 `ratio` 和 `gap` 无效，行为等同于 `content` 布局，但使用 `split` 的 CSS 类。

---
layout: section
---

# 四、section 布局
`sectionLabel` · `footer` · `footerMode`

---
layout: section
---

# 四A、section 标准用法

无 `sectionLabel` 时，TOC 进度条使用一级标题文字（即「四A、section 标准用法」）。

---
layout: section
sectionLabel: "4B 自定义标签"
---

# 四B、section sectionLabel

`sectionLabel: "4B 自定义标签"` 覆盖 TOC 和进度条中显示的文字。

此节在顶部进度条和目录页中显示 **"4B 自定义标签"** 而非标题文字。

适合标题较长或需要简写的场景。

---
layout: section
---

# 五、toc 布局
`highlight` · `columns` · `footer` · `footerMode`

---
layout: toc
highlight: 0
---

# 目录（highlight: 0）

`highlight: 0`（默认）不高亮任何条目，全部均匀显示。

---
layout: toc
highlight: 3
---

# 目录（highlight: 3）

`highlight: 3` 高亮第三个分节，其余条目以较低不透明度显示。

用于汇报进度时指示当前所在章节。

---
layout: toc
columns: 2
highlight: 0
---

# 目录（columns: 2）

`columns: 2` 将条目排为两列，并按列优先填充：左列从上到下排列前半部分，右列排列后半部分。

---
layout: section
---

# 六、sectionBar 选项
全局开关与单页覆盖

---
layout: content
density: dense
---

# sectionBar 全局与单页选项

**全局（写在第一页 headmatter）：**

```yaml
sectionBar: true          # 开启进度条（必须）
sectionBarMode: full      # full（默认）或 minimal
```

| | `full` | `minimal` |
|---|---|---|
| 进度条高度 | 2rem | 1.5rem |
| 内容 | 圆点 + 章节标题 | 仅圆点 |

**单页覆盖（写在单张幻灯片 frontmatter）：**

```yaml
sectionBarMode: minimal   # 仅此页使用 minimal 模式
sectionBar: false         # 仅此页隐藏进度条
```

注意：进度条只在 `content` / `default` / `split` 页面渲染；`section` / `cover` / `toc` / `end` / `blank` / `backup` 页面均不显示。

---
layout: content
density: dense
sectionBarMode: minimal
---

# sectionBarMode: minimal（本页实时效果）

本页 frontmatter 设置了 `sectionBarMode: minimal`，顶部进度条仅显示圆点，无章节标题。

对比上一页可观察 `full` 与 `minimal` 的高度与内容差异。

---
layout: content
density: dense
sectionBar: false
---

# sectionBar: false（本页实时效果）

本页 frontmatter 设置了 `sectionBar: false`，顶部进度条完全隐藏。

适合全图页、过渡页等不需要导航信息的场景。

这是一行比较长的文本：这是一行比较长的文本：为了测试当前页面在 dense 模式下的排版效果，这里放置一段较长的连续说明文字，用于观察文本在 Slidev 页面中的换行、行距、字号、边距以及整体视觉密度。当 sectionBar 被关闭后，页面顶部不再显示进度条或章节提示，因此正文区域会显得更加干净，适合用于展示大图、关键结论、过渡页或需要弱化导航信息的内容场景。通过这段较长文本，可以更直观地判断当前主题在面对长句、说明性段落和高信息密度内容时，是否仍然保持良好的可读性和版面稳定性。

---
layout: section
---

# 七、blank 布局
完全空白，最大自由度

---
layout: blank
---

<div style="height:100%;background:var(--ustc-blue-dark);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;">
  <span style="color:white;font-size:3rem;font-weight:700;letter-spacing:-0.02em;">layout: blank</span>
  <span style="color:rgba(255,255,255,0.6);font-size:1.2rem;">无任何布局结构，页脚与进度条均不渲染</span>
</div>

---
layout: section
---

# 八、end 布局
`showLogo` · `logoSrc` · `logoAlt` · `footer` · `footerMode` · contact 插槽

---
layout: end
showLogo: false
---

# 谢 谢

`showLogo: false`（默认）不显示 logo。

---
layout: end
showLogo: true
---

# 谢 谢

`showLogo: true` 在结尾页显示 logo（路径默认 `'/ustc/logo.svg'`）。

---
layout: end
showLogo: false
---

# 谢 谢

`contact` 具名插槽：在主内容下方渲染联系信息区域。

::contact::

Author · example@mail.ustc.edu.cn · github.com/example

---
layout: section
---

# 九、backup 布局
附录幻灯片，独立页码编号

---
layout: backup
---

# 附录

---
layout: content
---

# Backup Slide A.1

`backup` 布局标志附录起始点。此后所有幻灯片的页脚页码显示为 `A.1`、`A.2` 等，不计入主正文页数。

---
layout: content
---

# Backup Slide A.2

第二张附录幻灯片，页脚显示 `A.2`。
