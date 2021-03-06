---
layout: post
title: "Game of Life"
date: 2020-04-12
---

I was saddened to hear of John Conway's passing yesterday.

<!-- Excerpt Start -->

Conway's Game of Life is mathematics at play. A grid of cells, each either alive or bare, paired with a simple rule set that determines when new cells become alive and live cells die off, are all the constructs necessary to create a world of patterns and intrigue.

<!-- Excerpt End -->

If a bare cell has 3 live neighbors, it becomes alive. If a live cell has 2 or 3 living neighbors, it remains alive, otherwise it dies off (you could say it died from isolation or from overpopulation). Stick to those rules, and you discover a [world of patterns](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns) emerging from noise. Tweak the rules slightly, and you likely end up with just the noise. That, to me, is the intriguing bit.

I recall ignoring many boring lectures my freshman year of college (we were probably covering UML diagrams...) to program my own version of Conway's Game of Life. I chose Dart because it was so much like ActionScript (I started programming with Flash). And the fact that it was typed made it seem like the future of web development. I even demoed my code to a very confused hiring manager at JP Morgan ... thankfully for us both (and the world?), he passed on the opportunity to hire me and bring Dart to your Chase banking portal.

You can find my version of Conway's Game of Life [here](https://connorjclark.github.io/dart-life/#life). Excuse the styling - I refuse to fix it for posterity reasons, but it really is horrid (give me a break, it was 7 years ago). I suggest playing around with the configurable rule set. Can you find another rule set that produces interesting patterns?

Obviously the Game of Life is just one of many fascinating things made by John Conway. I look forward to learning more about him from his biography. You can also find some nice words from the comments section on [Hacker News](https://news.ycombinator.com/item?id=22843306).
