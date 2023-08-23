const axios = require('axios');

async function fetchAndProcessData(path) {
  try {
    const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'parse',
        page: `Wikipedia:Wikipedia_Signpost${path}`,
        format: 'json',
        redirects: 'true'
      }
    });
    if (response.data.parse.redirects) {
      var redirs = response.data.parse.redirects;
      if (redirs.length != 0) {
          var pagename = String(redirs[0]["to"]);
        } else {
          var pagename = "Wikipedia:Wikipedia Signpost" + path;
        }
    } else {
      var pagename = "Wikipedia:Wikipedia Signpost" + path;
    }

    var text = response.data.parse.text['*'];
    // Additional text processing
    text = text.replaceAll(`href="/wiki/Wikipedia:Wikipedia_Signpost"`, `href="/"`);
    text = text.replaceAll(`href="/wiki/Wikipedia:Wikipedia_Signpost/`, `href="/`);
    text = text.replaceAll(`href="https://en.wikipedia.org/wiki/Wikipedia:Wikipedia_Signpost"`, `href="/"`);
    text = text.replaceAll(`href="https://en.wikipedia.org/wiki/Wikipedia:Wikipedia_Signpost/`, `href="/`);
    // Replace all Signpost links (or at least most of them) with local domain links
    // remove the "/wiki/Wikipedia:Wikipedia_Signpost" part

    text = text.replaceAll(`href="/wiki/`, `href="https://en.wikipedia.org/wiki/`)
    // Replace all formerly-local Wikipedia links with fully specified URLs


    debugString = `<br />`
    debugString += `<a href="https://en.wikipedia.org/w/api.php?action=parse&format=json&redirects=true&page=Wikipedia:Wikipedia_Signpost${path}">` + String(pagename) + `</a><br />`
    
    text += debugString;
    return text;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchAndProcessData
};