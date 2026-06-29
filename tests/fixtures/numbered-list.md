---
theme: ../../
layout: cover
talkTitle: NumberedList Fixture
sectionBar: false
---

---
layout: content
footer: false
sectionBar: false
---

<!-- slide 2: NumberedList default visual structure -->

# NumberedList

<NumberedList
  :items="[
    { title: 'Collect data', body: 'gather sources and normalize fields' },
    { title: 'Run analysis', body: 'apply the shared scoring protocol' },
    { title: 'Write summary', body: 'report findings and remaining caveats' },
  ]"
/>

---
layout: content
footer: false
sectionBar: false
---

<!-- slide 3: NumberedList start/color/divider controls -->

# NumberedList Controls

<NumberedList
  :start="4"
  color="#065f46"
  :divider="false"
  :items="[
    { title: '**Observation** model $p(x_t)$', body: '**images** -> latent state $z_t$' },
    { title: 'Policy head', body: 'state -> action' },
  ]"
/>
