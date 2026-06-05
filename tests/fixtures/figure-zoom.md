---
theme: ../../
layout: cover
talkTitle: Figure Zoom Fixture
figureZoom: true
sectionBar: false
---

---
layout: content
footer: false
---

<!-- slide 2: deck-wide figureZoom:true → this figure inherits zoom (is-zoomable) -->

<FigureBlock src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" alt="inherited" :numbered="false" />

---
layout: content
footer: false
---

<!-- slide 3: per-figure :zoomable=false overrides the global on → not zoomable -->

<FigureBlock src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" alt="opted-out" :zoomable="false" :numbered="false" />
