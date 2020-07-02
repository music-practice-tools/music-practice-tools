function addTags(collection) {
  let tagSet = new Set()
  collection.getAll().forEach(function (item) {
    if ('tags' in item.data) {
      let tags = item.data.tags

      tags = tags.filter(function (item) {
        switch (item) {
          // this list should match the `filter` list in tags.njk
          case 'all':
          case 'nav':
          case 'activity':
          case 'activities':
          case 'tune':
          case 'tunes':
            return false
        }

        return true
      })

      for (const tag of tags) {
        tagSet.add(tag)
      }
    }
  })

  // returning an array in addCollection works in Eleventy 0.5.3
  return [...tagSet]
}

/* global exports */
exports.addCollections = function (eleventyConfig) {
  eleventyConfig.addCollection('tagList', addTags)

  eleventyConfig.addCollection('orderedActivities', function (collectionApi) {
    return collectionApi.getFilteredByTag('activities').sort(function (a, b) {
      return (
        (a.data.order || Number.MAX_SAFE_INTEGER) -
        (b.data.order || Number.MAX_SAFE_INTEGER)
      )
    })
  })
}
