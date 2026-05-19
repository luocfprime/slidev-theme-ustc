---
theme: ../../
layout: cover
talkTitle: Footnote Fixture
sectionBar: false
---

# Footnote Fixture

---
layout: content
footer: false
---

# Repeated Reference

First use[^alpha] and second use[^alpha] of the same label.

[^alpha]: Alpha footnote definition.

---
layout: content
footer: false
---

# Single Reference

Single[^beta] reference only.

[^beta]: Beta footnote definition.

---
layout: content
footer: false
---

# Figure Caption References

<FigureBlock src="/ATLAS/ATLAS-Logo.png" width="42%">

<template #caption>

First caption footnote[^caption].

</template>

</FigureBlock>

<FigureBlock src="/ATLAS/ATLAS-Logo.png" width="42%">

<template #caption>

Second caption footnote[^caption].

</template>

</FigureBlock>

[^caption]: Caption footnote definition.
