---
title: "Gridia"
layout: default
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
---

<style>
  main img {
    margin: 5px;
    border: 1px solid #ccc;
    float: left;
    width: 350px;
  }

  main img:hover {
    border: 1px solid #777;
  }

  main .images {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: space-evenly;
  }

  main iframe {
    width: 100%;
    height: calc(60vw * var(--aspect-ratio));
  }
</style>

# Gridia

## [Play](/gridia/play/)

Note: the below media is from a previous iteration of the game. I've since begun remaking it as a web game (linked to above).

<iframe width="560" height="400" src="https://www.youtube.com/embed/zpi_QMDMhW0" frameborder="0" allowfullscreen style="--aspect-ratio: 400 / 560;"></iframe>

Gridia is a massively customizable multiplayer online game with a persistent world. Gridia is a product that a creative mind will be able to use to create their own world – complete with customizable graphics, items, quests and the like. Worldmasters can build and maintain a world as they see fit, supporting anywhere from dozens to thousands of players. Gridia supports a vast crafting system - everything seen in the game can be created. Players can harvest the landscape for its resources and claim parcels of lands to build on.

Each player will have a place to call their own, to tend their own little garden, store loot, and decorate as they wish. Players can tend their fields, run into town to trade with other players, socialize, or participate in server events such as town sieges, musical chairs, capture the flag, or whatever event a Worldmaster has in store for the day. By the time they return to their home, their fields may be ready for harvest.</p>

<br>Note: currently under construction

<div class="images">
{% for image in images %}
  ![](/images/gridia/{{ image }}.png)
{% endfor %}
</div>