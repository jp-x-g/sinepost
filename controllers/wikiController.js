const axios = require('axios');
const cheerio = require('cheerio');

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
          var pagename = `Wikipedia:Wikipedia Signpost` + path;
        }
    } else {
      var pagename = `Wikipedia:Wikipedia Signpost` + path;
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



    csslink = `https://en.wikipedia.org/w/index.php?title=Wikipedia:Wikipedia_Signpost/Templates/external.css&action=raw&ctype=text/css`

    /* Compose URL for font requests. */
    fonts = [
      `Anybody:wght@300`,
      `Yeseva One`,
      `Goblin One`,
      `Stint Ultra Expanded`,
      `Viaoda Libre`
    ]



    /* fonts = [
      `Anybody:wght@300`,
      `Yeseva One`,
      `Goblin One`,
      `Stint Ultra Expanded`,
      `Aboreto`,
      `Abril Fatface`,
      `Almendra Display`,
      `Arbutus`,
      `BhuTuka Expanded One`,
      `Big Shoulders Text:wght@100;400;900`,
      `Bokor`,
      `Calistoga`,
      `Caprasimo`,
      `Castoro Titling`,
      `Chango`,
      `Chicle`,
      `Chonburi`,
      `Climate Crisis`,
      `Dela Gothic One`,
      `Diplomata`,
      `Diplomata SC`,
      `Erica One`,
      `Fascinate Inline`,
      `Federant`,
      `Geostar Fill`,
      `Germania One`,
      `Gideon Roman`,
      `Graduate`,
      `Gravitas One`,
      `Grenze Gotisch:wght@100;400;700;900`,
      `Katibeh`,
      `Kelly Slab`,
      `Kings`,
      `Kumar One`,
      `Kumar One Outline`,
      `Limelight`,
      `New Rocker`,
      `Odibee Sans`,
      `Oi`,
      `Pirata One`,
      `Poller One`,
      `Red Rose:wght@300;400;700`,
      `Smokum`,
      `UnifrakturCook:wght@700`,
      `UnifrakturMaguntia`,
      `Viaoda Libre`
    ] */
    fontsString = fonts.join(`&family=`).replaceAll(` `, `+`);
    fontsString = `https://fonts.googleapis.com/css2?family=${fontsString}&display=swap`

    favicon = `https://upload.wikimedia.org/wikipedia/commons/0/0d/Signpost-favicon.png`

    /* Now the most miserable part: getting metadata to compose a preview card. */
    const $ = cheerio.load(text);

    var pagetitle = $('h2').first().text();
      console.log(pagetitle);

    var descrp = $('div[itemprop="description"]').text();
      console.log(descrp);
      // This will be something like:
      // Barbenheimer confirmed: Some improvement on last week.
      descrp = descrp.replaceAll(pagetitle, "")
      // Remove page title, so that we get the blurb. It will now be something like:
      // : Some improvement on last week.
      descrp = descrp.startsWith(":") ? descrp.substring(1) : descrp;
      descrp = descrp.startsWith(" ") ? descrp.substring(1) : descrp;
      console.log(descrp);
      


    /* Compose header. */

    preface =  `<!DOCTYPE html>\n`
    preface += `\n<html>`
    preface += `\n<head>`
    if( pagetitle != "") {
      preface += `\n  <title>${pagetitle} &ndash; The Signpost</title>`
    } else {
      preface += `\n  <title>The Signpost</title>`
    }
    preface += `\n<link rel="stylesheet" href="${csslink}">`
    preface += `\n<link rel="preconnect" href="https://fonts.googleapis.com">`
    preface += `\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
    preface += `\n<link href="${fontsString}" rel="stylesheet">`
    preface += `\n<link rel="shortcut icon" href="${favicon}" type="image/x-icon" />`
    preface += `\n`
    preface += `\n<meta name="description"            content="${descrp}" />`
    preface += `\n<link rel="canonical"                  href="https://signpost.news${path}">`
    preface += `\n<meta property="og:description"     content="${descrp}" />`
    preface += `\n<meta property="fb:app_id"          content="" />`
    preface += `\n<meta property="og:image"           content="" />`
    preface += `\n<meta property="og:image:alt"       content="" />`
    preface += `\n<meta property="og:image:height"    content="" />`
    preface += `\n<meta property="og:image:width"     content="" />`
    preface += `\n<meta property="og:site_name"       content="The Signpost" />`
    preface += `\n<meta property="og:title"           content="${pagetitle}" />`
    preface += `\n<meta property="og:type"            content="article" />`
    preface += `\n<meta property="og:url"             content="https://signpost.news${path}" />`
    preface += `\n`
    preface += `\n<meta name="twitter:card"           content="summary" />`
    preface += `\n<meta name="twitter:url"            content="https://signpost.news${path}" />`
    preface += `\n<meta name="twitter:title"          content="${pagetitle}" />`
    preface += `\n<meta name="twitter:description"    content="${descrp}" />`
    preface += `\n<meta name="twitter:image"          content="" />`
    preface += `\n<meta name="twitter:site"           content="The Signpost" />`
    preface += `\n<meta name="twitter:image:alt"      content="" />`


    /* Close the header. */

    preface += `</head>\n`
    preface += `<body>\n`

    /* Add this to the text. */

    text = preface + text;

    debugString = `\n<br />`
    debugString += `\n<br />`
    debugString += `\n<br />`
    debugString += `\n<hr />`
    debugString += `\n<div style="display: flex; justify-content: center">`
    debugString += `<!--<img src="https://tools-static.wmflabs.org/toolforge/banners/Powered-by-Toolforge-button.png"> &nbsp; &nbsp;<img src="https://www.debian.org/logos/button-1.gif">-->`
    debugString += `\n<a href="https://en.wikipedia.org/w/api.php?action=parse&format=json&redirects=true&page=Wikipedia:Wikipedia_Signpost${path}">ꙮ</a>`
    debugString += `\n</div>`
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