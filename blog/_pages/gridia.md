---
title: "Gridia"
layout: single
excerpt: "Gridia is a massively customizable multiplayer online game"
permalink: /gridia/
images:
  - JU7oVcM
  - dKCFAkn
  - 20Zt3SM
  - 65X1Nbl
  - tRfFemn
  - BscKO65
  - 0CwLFy8
  - PAc5vlC
  - UHQHttq
  - fXTAyrC
  - C3IsmtA
  - 6SMVxIO
  - SxAuR1A
  - jnJnvc1
  - 0HPcka7
style: |
  div.img {
      margin: 5px;
      border: 1px solid #ccc;
      float: left;
      width: 350px;
  }

  div.img:hover {
      border: 1px solid #777;
  }

  div.img img {
      width: 100%;
      height: auto;
  }

  #outer {
    width: 100%;
    text-align: center;
  }

  #inner {
    display: inline-block;
  }
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/zpi_QMDMhW0" frameborder="0" allowfullscreen></iframe>

<br>
<div id="outer" style="width:100%">  
  <div id="inner">
    <p>Gridia is a massively customizable multiplayer online game with a persistent world. Gridia is a product that a creative mind will be able to use to create their own world – complete with customizable graphics, items, quests and the like. Worldmasters can build and maintain a world as they see fit, supporting anywhere from dozens to thousands of players. Gridia supports a vast crafting system - everything seen in the game can be created. Players can harvest the landscape for its resources and claim parcels of lands to build on.</p>

    <p> Each player will have a place to call their own, to tend their own little garden, store loot, and decorate as they wish. Players can tend their fields, run into town to trade with other players, socialize, or participate in server events such as town sieges, musical chairs, capture the flag, or whatever event a Worldmaster has in store for the day. By the time they return to their home, their fields may be ready for harvest.</p>
    
    <h1>Play Demo</h1>
    <strike> <a href="/gridia-alpha-1.7/wp">Web Player</a> | <a href="/gridia-alpha-1.7/instructions.odt">How To Play</a> </strike>
    <br>Note: currently under construction
  </div>
</div>
<br>

{% for image in page.images %}
  <div class="img">
    <a target="_blank" href="https://i.imgur.com/{{ image }}.png">
      <img src="https://i.imgur.com/{{ image }}.png">
    </a>
  </div>
{% endfor %}
