---
layout: post
title: "KB vs KB"
date: 2020-07-08
---

TL;DR: As of v6.0, Lighthouse now uses KiB (=1024 bytes) because it is unambigous. Chrome DevTools moved to kB (=1000 bytes), faster than intended, but maybe [for the best](https://randomascii.wordpress.com/2016/02/13/base-ten-for-almost-everything/)?

A KiB (kibibyte, 1024 bytes) is the same as kilobyte (KB, 1024 bytes), unless you mean kilobyte (kB, 1000 bytes). Confused? Read more on [wikipedia](https://en.wikipedia.org/wiki/Kibibyte).

On Mac a KB is 1000 bytes. On Windows a KB is 1024 bytes.

Where did the `kibi` in kibibyte come from? It's a portmanteau–`kilo` and `binary`. Cute. It was also chosen due to its proximity to the SI unit “kilo”, guaranteeing confusion.

If you sell things you want to seem bigger, you use kB. If you prefer your maths in base 2, you use KB, and you're probably a computer. If you bought a TB hard drive and find yourself with 68 fewer GBs of storage than expected, you got played.

In an alternate universe, a kibibyte is called a KKB (large kilobyte). Valiant effort, [Knuth](https://en.wikipedia.org/wiki/Kibibyte#cite_ref-10:~:text=Donald%20Knuth).

This is what happens when you define unit prefixes based on the "convenience" of being close to an existing standard. kilo means 1000, unless it actually means 1024, which surely is close enough. The difference starts at 24, grows with every increasing unit, and results in endless confusion.

Given three wishes, I'd first wish to hit reset on all this mess and declare KB = kilobyte = 1000 bytes, and kB = kibibyte = 1024 bytes. My next wish wouldn't matter, because the first was actually two wishes and the genie was speaking in kilowishes, where kilo is derived from "two". It's close enough.

In most developer tooling, a KB is 1024 bytes. If you've used more than one type of computer or software in your lifetime, you'll probably find yourself doublethinking as to what a KB means based on the context you are currently in.

Thanks for reading. If there's one takeaway, let it be this: KiB = 1024 bytes. Please remember that when you see it in Lighthouse (as of 6.0). The unit value isn't really changing–it's just getting an unambiguous label. See the [Lighthouse PR](https://github.com/GoogleChrome/lighthouse/pull/10870).

In a similar vein, Chrome DevTools now uses kB for the base 10 unit. It was a bit of an accident; you can learn more from the [design doc](https://docs.google.com/document/d/1TWn4kpXlN-W_LmuZGQ9Iv7pmK4R7zgmhKkZ9gF2CsrE/edit?usp=sharing).
