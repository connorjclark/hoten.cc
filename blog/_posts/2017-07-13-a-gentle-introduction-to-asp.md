---
title: "A gentle introduction to answer set programming"
excerpt: "ASP is, in short, a programming paradigm that solves combinatoric problems given a set of rules. Users of Prolog will recognize the syntax and logic involved, but for everyone else, oh boy, *you got some learnin' to do*."
---

I was recently introduced to answer set programming (ASP) as a powerful tool for [generating procedural content for games](https://pdfs.semanticscholar.org/1b7b/1908173a360a10e4a4b9fa97a5359be2e4bc.pdf). ASP is, in short, a programming paradigm that solves combinatoric problems given a set of rules. Users of Prolog will recognize the syntax and logic involved, but for everyone else, oh boy, *you got some learnin' to do*.

In terms of terseness, answer set programming lies somewhere between C++ and [APL](https://www.youtube.com/watch?v=a9xAKttWgP4).

To begin dabbling in ASP, you need a solver. I'm using [clingo](https://github.com/potassco/clingo/releases/tag/v5.2.0).

I'll try my hand at introducing some of the concepts to you. At the end of the post, you can find some materials for going further with ASP.

> Sidenote: If you happen to be well-versed in ASP, and you notice I am using some terminonlogy incorrectly, please drop me a message! I'm still picking it up, and have a lot left to learn.

# learn(asp).
___

Facts are atomic, conditionless terms defined by the user.

```prolog
letter(a).
letter(b).
letter(c).
```

This can be shortened to:

```prolog
letter(a; b; c).
```

This ASP program contains only one model in its answer set. Saving as `model.lp` and running `clingo model.lp 0` returns:

```
clingo version 5.2.0
Reading from model.lp
Solving...
Answer: 1
letter(a) letter(b) letter(c)
SATISFIABLE

Models       : 1
Calls        : 1
Time         : 0.006s (Solving: 0.01s 1st Model: 0.00s Unsat: 0.01s)
CPU Time     : 0.016s
```

The one answer is `letter(a) letter(b) letter(c)`, which is simply enumerating every fact which was defined.

> Sidenote: an individual answer is a `model`, and the collection of all models define the `answer set`

# island generator
___

Let's create a program to search a simple design space: grids of 10x10 cells, where each cell is one of two types: water or land.

```prolog
row(1..10). % the same as row(1). row(2). ...
col(1..10).
```

Let's call each item (ex: `row(2)`) in a model a `term`. Terms can be implicitly defined with a `proposition`.

```prolog
cell(X, Y) :- row(X), col(Y).
```

You can read this as "output a term `cell(X, Y)` if `row(X)` and `row(Y)` exists for some `X` and some `Y`"

Similarly, "for every combination of row and col terms, bind their values to `X` and `Y`, and output a term `cell(X, Y)`"

> Sidenote: `cell(1..5, 1..5)` would be more succint

Let's generate terms for whether something is water or land. This is the first taste of the power of ASP. Everything before created just one single model, but no more.

```prolog
{ water(X, Y): cell(X, Y) }.
```

This construct is called a `choice rule`. Like a `proposition`, it will output the term on the LHS (left hand side) when conditions on the RHS are met. The difference is that the emitted terms are grouped as a *set*, and each possible subset of terms will be emitted in a different model.

If you ran `clingo`, oops! There are 100 cells, and each cell can be in one of two states. You've given cling marching orders to generate 2^100 = 1,267,650,600,228,229,401,496,703,205,376 models. You can run `clingo model.lp 1` to instruct clingo that you only want a single model.

The solver is deteriminstic, so it will always be the same model. You can modify this behavior by using additional arguements: `clingo blog.lp 1 --sign-def=rnd --rand-freq=1 --seed=123`. Providing different values for the seed will affect the solution you get.

Define a complementary term for land:

```prolog
land(X, Y) :- cell(X, Y), not water(X, Y).
```

For every X, Y that there exists a term cell(X, Y) and no term water(X, Y), a land(X, Y) will be emitted.

At this point, you should create a script to visualize the output to the program. You can find the python script I used for my visualizations at the bottom of this posting. I used `▓▓` for water and `..` for land.

clingo outputs in json if your provide the option `--outf=2`. For every visualization, I run this command: `clingo model.lp 1 --sign-def=rnd --rand-freq=1 --seed=123 --outf=2 | python visualize.py`

Feeding data into the visualizer, I get:

```
▓▓▓▓..▓▓▓▓..▓▓▓▓▓▓..
..▓▓▓▓▓▓▓▓....▓▓▓▓▓▓
..▓▓....▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓..▓▓......▓▓..▓▓
....▓▓▓▓▓▓▓▓▓▓....▓▓
▓▓..▓▓..............
▓▓▓▓▓▓..▓▓..▓▓▓▓..▓▓
▓▓..▓▓..▓▓▓▓........
▓▓..▓▓..▓▓▓▓..▓▓▓▓..
▓▓........▓▓..▓▓▓▓..
```

Great. We've come up with a program that successfully searches the design space we defined above. Too bad it's not very interesting space.

## constrain!
___

Let's introduce some constraints. Islands are interesting, so let's modify the program to only output models where every edge cell is water.

> Sidenote: I've introduced constants at the top of my model.lp: `#const width=10. #const height=10.`

```prolog
water(1, Y) :- cell(1, Y). % if a term exists matching "cell(1, Y)", then there must exist a term "water(1, Y)"
water(X, 1) :- cell(X, 1).
water(width, Y) :- cell(width, Y).
water(X, height) :- cell(X, height).
```

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓..▓▓▓▓......▓▓▓▓▓▓
▓▓....▓▓▓▓......▓▓▓▓
▓▓....▓▓..▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓....▓▓▓▓..▓▓
▓▓▓▓▓▓..▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓..▓▓▓▓▓▓
▓▓▓▓....▓▓▓▓▓▓....▓▓
▓▓▓▓..............▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## connectedness
___

Now, let's force all land cells to be connected (reachable by moving in a cardinal direction). This can be accomplished by establishing a starting point, creating a term `connected(X, Y)` if `land(X, Y)` is connected to that starting point, and requiring that all land terms are connected.

One way to select the starting land cell is to set to to the top-left most land. However, it is much simpler to define the middle as always land, and use that as the start.

By definition, the start is connected to itself, so a connected term is emitted.

`connected` terms are generated for X, Y if land(X, Y) exists, and there is a neighboring connected cell.


```prolog
% make the middle cell always land

land(width/2, height/2).

% base condition. the start is connected to itself

connected(width/2, height/2).

% land cells are connected to the start if
% neighboring cells are connected to the start

connected(X, Y) :- connected(X - 1, Y), land(X, Y).
connected(X, Y) :- connected(X + 1, Y), land(X, Y).
connected(X, Y) :- connected(X, Y - 1), land(X, Y).
connected(X, Y) :- connected(X, Y + 1), land(X, Y).

% integrity constraint requiring all land to be connected
:- not connected(X, Y), land(X, Y).
```

That last line is a bit different. It's a rule without a head. This is an `integrity constraint`. In their simplest form, they look like this:

`:- not good_condition`

Conversely,

`:- bad_condition`


The non-first term there (`land(X, Y)`) acts as a binding variable- for every X, Y for which the term land(X, Y) exists, the good_condition (`connected(X, Y)`) must succeed.

> Sidenote: I originally forgot that last line, and the first example I looked at for validating actually was all connected! However, it was wrong. It took awhile to realize my mistake, and after trying a second example the error was obvious. It's very, very important to iterate and validate carefully.

Now, the final output.

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓......▓▓▓▓......▓▓
▓▓..▓▓........▓▓▓▓▓▓
▓▓..▓▓....▓▓......▓▓
▓▓▓▓......▓▓▓▓....▓▓
▓▓▓▓........▓▓▓▓..▓▓
▓▓....▓▓▓▓....▓▓▓▓▓▓
▓▓........▓▓....▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## drum roll ...
___

And, for fun, a 50x50 island:

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓....▓▓..▓▓..▓▓▓▓........▓▓....▓▓▓▓..▓▓......▓▓......▓▓▓▓..▓▓▓▓....▓▓......▓▓......▓▓▓▓▓▓..▓▓....▓▓
▓▓..▓▓▓▓............▓▓▓▓..▓▓......▓▓............▓▓..............▓▓............▓▓▓▓..▓▓..........▓▓▓▓
▓▓..▓▓▓▓..▓▓....▓▓....▓▓..........▓▓....▓▓..▓▓..▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓......▓▓▓▓▓▓........▓▓..▓▓▓▓..▓▓▓▓
▓▓..........▓▓..▓▓......▓▓....▓▓▓▓..▓▓........▓▓....▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓....▓▓..▓▓....▓▓..............▓▓
▓▓......▓▓▓▓..▓▓....▓▓....▓▓....▓▓......▓▓▓▓....▓▓..▓▓..▓▓▓▓▓▓▓▓..▓▓........▓▓....▓▓▓▓..▓▓▓▓..▓▓..▓▓
▓▓..▓▓........▓▓▓▓▓▓▓▓▓▓....▓▓▓▓▓▓▓▓..▓▓▓▓▓▓........▓▓....▓▓......▓▓▓▓▓▓..▓▓....▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓▓▓
▓▓▓▓....▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓....▓▓..▓▓........▓▓....▓▓..............▓▓▓▓....▓▓......▓▓▓▓▓▓
▓▓....▓▓▓▓....▓▓▓▓▓▓▓▓....▓▓▓▓▓▓....▓▓▓▓..▓▓....▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓..▓▓▓▓▓▓........▓▓....▓▓▓▓....▓▓▓▓
▓▓▓▓....▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓......▓▓▓▓..▓▓......▓▓▓▓▓▓..▓▓▓▓........▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓....▓▓▓▓▓▓▓▓▓▓..▓▓
▓▓▓▓......▓▓▓▓▓▓▓▓▓▓▓▓....▓▓▓▓▓▓....▓▓▓▓......▓▓▓▓..▓▓▓▓..▓▓............▓▓▓▓..........▓▓▓▓▓▓▓▓▓▓..▓▓
▓▓▓▓....▓▓....▓▓........▓▓▓▓▓▓▓▓▓▓..▓▓..▓▓▓▓....▓▓..▓▓▓▓▓▓........▓▓....▓▓▓▓▓▓......▓▓▓▓▓▓▓▓......▓▓
▓▓....▓▓....▓▓▓▓▓▓........▓▓▓▓▓▓▓▓..▓▓..........▓▓..▓▓▓▓▓▓..▓▓▓▓▓▓........▓▓....▓▓..▓▓....▓▓..▓▓▓▓▓▓
▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓........................▓▓▓▓......▓▓▓▓..........▓▓▓▓..▓▓....▓▓....▓▓..▓▓........▓▓
▓▓▓▓..........▓▓..▓▓▓▓....▓▓▓▓▓▓▓▓▓▓▓▓▓▓..▓▓▓▓..▓▓..........▓▓▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓......▓▓..▓▓▓▓▓▓
▓▓▓▓▓▓▓▓..▓▓..........▓▓........▓▓......▓▓▓▓▓▓▓▓..▓▓▓▓▓▓....▓▓..▓▓......▓▓▓▓▓▓........▓▓........▓▓▓▓
▓▓▓▓▓▓▓▓▓▓....▓▓..▓▓....▓▓..............▓▓▓▓▓▓......▓▓..▓▓..........▓▓..........▓▓....▓▓▓▓▓▓....▓▓▓▓
▓▓▓▓▓▓▓▓▓▓....▓▓..▓▓..........▓▓................▓▓........▓▓▓▓....▓▓....▓▓▓▓..▓▓....▓▓..........▓▓▓▓
▓▓▓▓▓▓▓▓......▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓....▓▓..........▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓▓▓▓▓▓▓▓▓......▓▓▓▓▓▓▓▓..▓▓....▓▓▓▓▓▓
▓▓........▓▓▓▓▓▓▓▓▓▓..▓▓▓▓▓▓..▓▓▓▓▓▓▓▓..▓▓........▓▓▓▓▓▓........▓▓....▓▓▓▓......▓▓....▓▓......▓▓▓▓▓▓
▓▓..▓▓▓▓..▓▓......▓▓........................▓▓..▓▓▓▓▓▓▓▓▓▓....▓▓..▓▓..............▓▓......▓▓..▓▓▓▓▓▓
▓▓..........▓▓..▓▓▓▓▓▓▓▓....▓▓▓▓......▓▓▓▓....▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓........▓▓▓▓..▓▓....▓▓▓▓..........▓▓
▓▓..▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓..▓▓....▓▓..▓▓▓▓▓▓▓▓......▓▓..▓▓....▓▓▓▓..▓▓....▓▓..▓▓▓▓....▓▓▓▓▓▓▓▓▓▓..▓▓
▓▓▓▓▓▓▓▓▓▓..▓▓..........▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓▓▓....▓▓..........▓▓..▓▓........▓▓....▓▓▓▓....▓▓▓▓▓▓....▓▓
▓▓▓▓▓▓▓▓▓▓..▓▓........▓▓▓▓....▓▓▓▓......▓▓▓▓▓▓▓▓........▓▓▓▓....▓▓..▓▓......▓▓▓▓▓▓▓▓▓▓..▓▓........▓▓
▓▓▓▓..▓▓▓▓......▓▓▓▓▓▓▓▓▓▓..▓▓▓▓▓▓▓▓..▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓..▓▓▓▓......▓▓......▓▓▓▓..▓▓..▓▓..▓▓....▓▓▓▓
▓▓....▓▓▓▓......▓▓▓▓▓▓▓▓▓▓....▓▓..........▓▓......▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓....▓▓..▓▓....▓▓..▓▓..▓▓..▓▓▓▓▓▓
▓▓..............▓▓▓▓▓▓....▓▓▓▓....▓▓..▓▓▓▓▓▓..▓▓..▓▓▓▓........▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓..............▓▓▓▓▓▓
▓▓▓▓▓▓....▓▓▓▓▓▓▓▓......▓▓......▓▓▓▓..▓▓▓▓....▓▓......▓▓▓▓....▓▓............▓▓....▓▓▓▓..▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓....▓▓▓▓▓▓▓▓▓▓▓▓▓▓..▓▓..▓▓▓▓..........▓▓..▓▓▓▓..▓▓..........▓▓▓▓▓▓..▓▓..▓▓..▓▓........▓▓▓▓▓▓▓▓▓▓
▓▓....▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓......▓▓▓▓..▓▓▓▓▓▓▓▓....▓▓..▓▓..▓▓▓▓▓▓▓▓..▓▓......▓▓....▓▓....▓▓..▓▓..▓▓▓▓▓▓▓▓
▓▓▓▓....▓▓..▓▓▓▓..▓▓▓▓..▓▓..▓▓▓▓▓▓........................▓▓....▓▓▓▓......▓▓▓▓..▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓
▓▓▓▓..▓▓▓▓............▓▓..▓▓........▓▓▓▓▓▓..▓▓▓▓▓▓▓▓▓▓......▓▓....▓▓▓▓▓▓▓▓..▓▓..▓▓▓▓....▓▓........▓▓
▓▓........▓▓....▓▓..▓▓....▓▓..▓▓▓▓▓▓▓▓▓▓....▓▓..▓▓....▓▓▓▓▓▓▓▓....▓▓............▓▓..........▓▓▓▓..▓▓
▓▓........▓▓..▓▓..▓▓▓▓....▓▓▓▓▓▓▓▓▓▓▓▓▓▓....▓▓......▓▓..........▓▓▓▓..▓▓▓▓..▓▓..▓▓..▓▓▓▓..▓▓▓▓....▓▓
▓▓..▓▓....▓▓..▓▓..▓▓....▓▓......▓▓..▓▓..▓▓..▓▓▓▓........▓▓▓▓..▓▓....▓▓▓▓▓▓..▓▓....▓▓▓▓▓▓....▓▓▓▓▓▓▓▓
▓▓..▓▓........▓▓......▓▓▓▓▓▓....▓▓..........▓▓......▓▓..▓▓▓▓......▓▓........▓▓....▓▓..▓▓..▓▓....▓▓▓▓
▓▓▓▓....▓▓..............................▓▓......▓▓..▓▓..▓▓▓▓▓▓▓▓............▓▓▓▓..▓▓..............▓▓
▓▓▓▓▓▓▓▓▓▓..▓▓▓▓....▓▓..▓▓..▓▓▓▓▓▓..▓▓▓▓......▓▓▓▓..▓▓▓▓..▓▓▓▓..▓▓..▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓▓▓..▓▓▓▓....▓▓
▓▓▓▓▓▓......▓▓▓▓▓▓..▓▓▓▓▓▓▓▓....▓▓▓▓▓▓▓▓..▓▓....▓▓........▓▓▓▓......▓▓▓▓▓▓....▓▓▓▓▓▓......▓▓....▓▓▓▓
▓▓......▓▓▓▓▓▓▓▓........▓▓▓▓..........▓▓....▓▓▓▓▓▓▓▓..▓▓▓▓▓▓▓▓▓▓▓▓........▓▓..▓▓▓▓▓▓▓▓....▓▓....▓▓▓▓
▓▓..▓▓▓▓▓▓....▓▓▓▓....▓▓..▓▓....▓▓..........▓▓▓▓......▓▓......▓▓........▓▓....▓▓......▓▓▓▓▓▓▓▓....▓▓
▓▓....▓▓..........▓▓......▓▓▓▓..▓▓▓▓▓▓▓▓▓▓..▓▓▓▓....▓▓▓▓..▓▓..▓▓........▓▓▓▓▓▓....▓▓▓▓▓▓..▓▓▓▓▓▓..▓▓
▓▓..▓▓....▓▓▓▓▓▓....▓▓▓▓▓▓▓▓▓▓▓▓..▓▓▓▓..▓▓..▓▓▓▓....▓▓▓▓▓▓........▓▓▓▓..▓▓▓▓▓▓▓▓............▓▓▓▓..▓▓
▓▓........▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓........▓▓..▓▓▓▓▓▓▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓..▓▓▓▓..▓▓▓▓▓▓..▓▓..▓▓....▓▓
▓▓....▓▓..........▓▓▓▓▓▓......▓▓▓▓..............................▓▓▓▓..............▓▓▓▓..▓▓..▓▓▓▓..▓▓
▓▓▓▓..▓▓▓▓..▓▓▓▓......▓▓..▓▓......▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓....▓▓....▓▓▓▓..▓▓................▓▓....▓▓..▓▓
▓▓........▓▓..▓▓..▓▓....▓▓▓▓..▓▓..▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓........▓▓▓▓....▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓..▓▓..▓▓
▓▓..▓▓..▓▓▓▓........▓▓........▓▓..▓▓......▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓..▓▓▓▓..▓▓▓▓▓▓..▓▓..▓▓▓▓▓▓▓▓▓▓▓▓▓▓......▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

You know, on second thought, this looks more like a mineshaft ...


# :- not good(R), resource(R).
___

Solving a problem with ASP generally follows this process:

1. Sculpt the general shape of the model
2. Inspect the output, add constraints to remove unwanted models
3. Repeat 2 until you're blue in the face

Basically: design, constrain, iterate.

This development process is outlined in [A Pragmatic Programmer’s Guide to Answer Set Programming](http://ceur-ws.org/Vol-546/49-63.pdf).

___

[Adam Smith](https://adamsmith.as/) (no, not that one) provides some fantastic examples of how ASP can be utilized in creating content for games. See his paper [Answer Set Programming for Procedural Content Generation: A Design Space Approach](https://users.soe.ucsc.edu/~amsmith/papers/tciaig-asp4pcg.pdf) for more, or a more bite sized blog post on [length constraints in map generation](https://eis-blog.soe.ucsc.edu/2011/10/map-generation-speedrun/) for less.

___

The python script used for visualizing the island example:

```python
import sys, json, re

def process(model):
  width, height = find_one(model, "size")[1]
  grid = [[' ' for x in range(width)] for y in range(height)]

  for _, (x, y) in find_all(model, "water"):
    grid[y - 1][x - 1] = '▓'

  for _, (x, y) in find_all(model, "land"):
    grid[y - 1][x - 1] = '.'

  for row in grid:
    for cell in row:
      print(cell * 2, end='')
    print()


def find_one(model, token_type):
  return next(token for token in model if token[0] == token_type)


def find_all(model, token_type):
  return [token for token in model if token[0] == token_type]


# parse into a number, if possible. avoid converting "NaN, Inf"
def convert_value(value):
  if value.isalpha():
    return value
    
  try:
    return int(value)
  except ValueError:
    try:
      return float(value)
    except ValueError:
      return value


def parse_token(token_text):
  match = re.match(r"(.+)\((.*)\)", token_text)
  type = match.group(1)
  values = [convert_value(value) for value in match.group(2).split(",")]
  return (type, values)


input = json.loads(sys.stdin.read())
for call in input["Call"]:
  for witness in call["Witnesses"]:
    model = [parse_token(token_text) for token_text in witness["Value"]]
    process(model)

```

___

The full island search program:

```prolog
#const width=50.
#const height=50.

size(width, height).

cell(1..width, 1..height).

{ water(X, Y): cell(X, Y) }.

land(X, Y) :- cell(X, Y), not water(X, Y).

water(1, Y) :- cell(1, Y).
water(X, 1) :- cell(X, 1).
water(width, Y) :- cell(width, Y).
water(X, height) :- cell(X, height).

% make the middle cell always land

land(width/2, height/2).

% base condition. the start is connected to itself

connected(width/2, height/2).

% land cells are connected to the start if
% neighboring cells are connected to the start

connected(X, Y) :- connected(X - 1, Y), land(X, Y).
connected(X, Y) :- connected(X + 1, Y), land(X, Y).
connected(X, Y) :- connected(X, Y - 1), land(X, Y).
connected(X, Y) :- connected(X, Y + 1), land(X, Y).

:- not connected(X, Y), land(X, Y).
```