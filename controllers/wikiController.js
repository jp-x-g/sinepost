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

    ////////////////////////////////////////////////////////////////
    // Text processing begins now, take a shot for every lazy hack
    ////////////////////////////////////////////////////////////////

    //
    text = text.replaceAll(`href="/wiki/Wikipedia:Wikipedia_Signpost"`, `href="/"`);
    text = text.replaceAll(`href="/wiki/Wikipedia:Wikipedia_Signpost/`, `href="/`);
    text = text.replaceAll(`href="https://en.wikipedia.org/wiki/Wikipedia:Wikipedia_Signpost"`, `href="/"`);
    text = text.replaceAll(`href="https://en.wikipedia.org/wiki/Wikipedia:Wikipedia_Signpost/`, `href="/`);
    // Replace all Signpost links (or at least most of them) with local domain links
    // remove the "/wiki/Wikipedia:Wikipedia_Signpost" part
    // String processing on HTML = one shot

    text = text.replaceAll(`href="/wiki/`, `href="https://en.wikipedia.org/wiki/`)
    // Replace all formerly-local Wikipedia links with fully specified URLs
    // String processing on HTML = another shot

    // csslink = `<link rel="stylesheet" href="/Templates/external.css">`
    //text.replace("<head>", "<head>\n" + csslink)
    //// Great, extremely well-thought-out way to add something to the head element. Third shot
    //// Also: stylesheet references a route from this same Express app.
    //// Unnecessarily recursive nonsense. Finish your glass!!

    csslink = `https://en.wikipedia.org/w/index.php?title=Wikipedia:Wikipedia_Signpost/Templates/external.css&action=raw&ctype=text/css`


    fonts = [
      "Anybody:wght@300",
      "Yeseva One",
      "Goblin One"
      ]

    preface =  `<!DOCTYPE html>\n`
    preface += `<html>\n`
    preface += `<head>\n`
    preface += `  <title>${path}</title>\n`
    preface += `<link rel="stylesheet" href="${csslink}">\n`
    preface += `<link rel="preconnect" href="https://fonts.googleapis.com">`
    preface += `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
    preface += `<link href="https://fonts.googleapis.com/css2?family=Anybody:wght@300&family=Goblin+One&family=Yeseva+One&display=swap" rel="stylesheet">`
    preface += `</head>\n`
    preface += `<body>\n`

    text = preface + text;

    debugString = `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<br />`
    debugString += `<a href="https://en.wikipedia.org/w/api.php?action=parse&format=json&redirects=true&page=Wikipedia:Wikipedia_Signpost${path}">` + String(pagename) + `</a><br />`
    
    text += debugString;
    text += "\n</body>"
    return text;
  } catch (error) {
    throw error;
  }
}

// async function fetchAndProcessCSS(path) {
//   try {
//     const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
//       params: {
//         action: 'parse',
//         page: `Wikipedia:Wikipedia_Signpost${path}`,
//         format: 'json',
//         prop: 'wikitext',
//         redirects: 'true'
//       }
//     });
//     if (response.data.parse.redirects) {
//       var redirs = response.data.parse.redirects;
//       if (redirs.length != 0) {
//           var pagename = String(redirs[0]["to"]);
//         } else {
//           var pagename = "Wikipedia:Wikipedia Signpost" + path;
//         }
//     } else {
//       var pagename = "Wikipedia:Wikipedia Signpost" + path;
//     }
// 
//     var text = response.data.parse.wikitext['*'];
//     console.log(text)
//     text += "Hubbity hubbity hoo"
// 
//     return text;
//   } catch (error) {
//     throw error;
//   }
// }

module.exports = {
  fetchAndProcessData,
};