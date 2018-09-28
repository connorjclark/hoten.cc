---
title: "Announcing Theia"
---

We at [Course Hero](https://www.coursehero.com/) are announcing the open release of [Theia](https://github.com/coursehero/theia), a framework for building, rendering, and caching React applications.

---

As all in web know, SEO drives growth. And naturally, a page with seemingly no content (from the perspective of an indexing spider) or one with a deferred render is not great for SEO.

In recent years, React has become one of the [most popular frontend frameworks](https://w3techs.com/technologies/comparison/js-angularjs,js-react,js-vuejs) for high traffic sites. At Course Hero, all new projects since 2016 have been in React, leaving our Angular 1.3.x projects around until a large enough feature compels us to refactor.

However, Course Hero doesn't have a Node.JS backend (the company predates the runtime by a few years). This means that logged out, critical landing pages - which must be tuned for SEO - can't have the initial view with React on the server. A painful workaround for this is to render the intial view in an alternative way, using the backend's templating language. The initial view generated in both implementations must be congruent, or else there's risk of page flickering. Even then, it's suboptimal, as React would not be able to [hydrate](https://stackoverflow.com/questions/46516395/whats-the-difference-between-hydrate-and-render-in-react-16) from the inital, non-React rendered view, resulting in a longer than necessary bootup time. These reasons have steered the majority of projects at Course Hero touching landing pages away from using React.

We could could call out to an external process from our PHP backend to do this initial rendering, but we had a few reasons to not do that. We wanted to avoid installing Node on all of our web servers. We wanted to be able to scale Node rendering independently from our web servers. We wanted deployments for our React applications separated from main deployments to the entire site backend. And we wanted control over caching. To achieve these goals, I began implementing a microservice, Theia, in November 2017, and today we are announcing its open release.

![Theia integrates with Slack](/blog/images/theia-slack.png)
*Theia integrates with Slack*
{:.image-caption}

When paired with a Node.JS backend, rendering the initial view before the browser loads any JavaScript is trivial. However, new adopters to React very often don't utilize a Node.JS backend. There's a fundamental friction point here. That initial rendering from the server is important, so companies that do adopt React either relegate it to logged-in experiences, or they build a rendering service that integrates with their backend. I know of one large company that has done the latter, as Ben Ilegbodu of Eventbrite told me last July at Node Summit. Hopefully, Theia will save some effort for others solving this initial rendering issue, and others will find its additional features and configurability beneficial to development.

As of this writing, Theia powers Course Hero's new [course study guides](https://www.coursehero.com/sg/), and we are considering adopting it in other parts of the site.
