---
title: "Deceitful Java: How I Won A Free Thingy"
excerpt: There are many stories about amazingly obsufcated code. This is not one of them.
---

There are many stories about obsufcated code. Brilliant programmers have created programs that, at first glance (and second...and third...) seem absolutely harmless.[^1] But through some trick or another, be it compiler settings or little known language features, these programs deceive even the most meticulous code audits.

This is not one of those stories.

This code challenge came up during Mo' Code Movember,[^2] a small hackathon that took place in Nov. 2014. A Microsoft representative (shout out to Paul DeCarlo)[^3] had some goodies to give away. He came up with this challenge:

>Every participant will be assigned a unique number (from 1 to n, the number of participants). Each person must submit a program, in the language of their choice, that generates a random number from 1 to n. Whomever's number comes up the most wins. The catch - everyone can review your code. If your code is identified as anything other than a fair number generator, you get disqualified. Code reviewers cannot run the program. Incorrect accusers are also disqualified.

So, with the problem at hand, and assigned the number 5, I decided to use Java. I fired up Netbeans and created a new project. This was my main file, and what I showed to my code reviewers:

```java
package random;

public class Random {

    public static void main(String[] args) {
        int numPeople = 7; // n = 7
        int answer = (int) (Math.random() * numPeople) + 1;
        System.out.println(answer);
    }
}
```

No one challenged my code. When it came time to run my program, I was certain it would return 5.

If you're familiar with how Java's packaging system works, you probably already know how I made the deception. Within the same package as my main file (random), I had a class called Math. Math is already a builtin collection of static methods, and is imported by default. However, the Math in my random package gets higher priority than Java's built in Math class. As icing on top of the cake, Java automatically imports all files within the same package. All I had to do was write a faulty random() method, and be sure to collapse the "random" package in Netbean's project explorer.

```java
public class Math {

    public static double random() {
        return 4.0 / 7;
    }
}
```

The contest results ended up something like this:

| Number  |Frequency|
| ------- | ------- |
|    1    |    0    |
|    2    |    1    |
|    3    |    2    |
|    4    |    0    |
|    5    |    3    |
|    6    |    0    |
|    7    |    1    |

With the contest rigged ever so slightly in my favor, I won the free thingy. The prize was a purple pair of Beats headphones, branded with Visual Studio's logo. They're not my favorite headphones, but I enjoy the conveneince. They're a good fit for my laptop go-bag since they fold up nicely.

![My Free Thingy](/images/beats-vs.jpg)

[^1]: <http://www.ioccc.org/>
[^2]: <https://github.com/CougarCS/mo-code-movember-2014>
[^3]: <https://github.com/toolboc>
