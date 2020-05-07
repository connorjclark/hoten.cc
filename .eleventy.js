const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const moment = require('moment');

moment.locale('en');

function extractExcerpt(article) {
  if (article.data.excerpt) return article.data.excerpt;

  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }
 
  let excerpt = null;
  const content = article.templateContent;
 
  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];
 
  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);
 
    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });
 
  return excerpt;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({'public': '.'});

  eleventyConfig.addFilter("slug", function(value) {
    value = require('slugify').default(value, {
      replacement: "-",
      lower: true,
    });
    value = value.replace(/[:–]/g, '');
    return value;
  });

  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).format('LL'); // E.g. May 31, 2019
  });

  let markdownIt = require("markdown-it");
  const options = {
    html: true,
  };
  const markdownLib = markdownIt(options).use(require("markdown-it-footnote"));
  
  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
};
