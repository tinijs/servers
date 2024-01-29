const {EleventyRenderPlugin} = require('@11ty/eleventy');
const markdownItAnchor = require('markdown-it-anchor');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginBundle = require('@11ty/eleventy-plugin-bundle');

const pluginImage = require('./image.plugin.js');

module.exports = function (eleventyConfig, options) {
  const {
    useCopy,
    useImagePlugin,
    useRenderPlugin,
    useHighlightPlugin,
    useBundlePlugin,
    useMarkdownItAnchor,
    eleventyOptions,
  } = options || {};

  /*
   * Data
   */

  eleventyConfig.addGlobalData('pathGlobalUploads', '/tini-content/uploads');

  /*
   * Copy
   */

  if (useCopy !== false) {
    eleventyConfig.addPassthroughCopy(useCopy || 'content/**/uploads/**/*');
  }

  /*
   * Plugins
   */

  if (useImagePlugin !== false) {
    eleventyConfig.addPlugin(pluginImage);
  }

  if (useRenderPlugin !== false) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
  }

  if (useHighlightPlugin !== false) {
    eleventyConfig.addPlugin(pluginSyntaxHighlight, {
      preAttributes: {tabindex: 0},
      ...(useHighlightPlugin instanceof Object ? useHighlightPlugin : {}),
    });
  }

  if (useBundlePlugin !== false) {
    eleventyConfig.addPlugin(pluginBundle);
  }

  /*
   * Library configs
   */

  if (useMarkdownItAnchor !== false) {
    eleventyConfig.amendLibrary('md', mdLib =>
      mdLib.use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.ariaHidden({
          placement: 'after',
          class: 'header-anchor',
          symbol: '#',
          ariaHidden: false,
        }),
        level: [1, 2, 3, 4],
        slugify: eleventyConfig.getFilter('slugify'),
        ...(useMarkdownItAnchor instanceof Object ? useMarkdownItAnchor : {}),
      })
    );
  }

  /*
   * 11ty configs
   */

  return {
    templateFormats: ['md', 'html', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'content',
      output: '.tini-content',
    },
    pathPrefix: '/tini-content/',
    ...(eleventyOptions || {}),
  };
};
