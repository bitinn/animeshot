function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      escapeXmlAttr = __helpers.xa,
      attr = __helpers.a,
      forEach = __helpers.f;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head>");

    data.meta.render({}, out);

    out.w("<title>AnimeShot / " +
      escapeXml(data.text) +
      "</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/kube.css?" +
      escapeXmlAttr(data.rev) +
      "\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css?" +
      escapeXmlAttr(data.rev) +
      "\"><meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:site\" content=\"@bitinn\"><meta name=\"twitter:title\"" +
      attr("content", data.text) +
      "><meta name=\"twitter:description\" content=\"AnimeShot / 高质的吐槽向的「动画字幕截图」\"><meta name=\"twitter:image\" content=\"" +
      escapeXmlAttr(data.domain) +
      "/upload/" +
      escapeXmlAttr(data.sid) +
      ".1200.jpg\">");

    data.analytics.render({}, out);

    out.w("</head><body>");

    data.header.render({}, out);

    out.w("<blocks cols=\"2\" class=\"main\">");

    data.searchBox.render({}, out);

    out.w("</blocks><blocks cols=\"2\" class=\"main\"><div><h2>文字内容</h2><p>" +
      escapeXml(data.text) +
      " - <a rel=\"nofollow\" href=\"https://whatanime.ga/?url=" +
      escapeXmlAttr(data.domain) +
      "/upload/" +
      escapeXmlAttr(data.sid) +
      ".600.jpg\">查找出处</a></p></div></blocks><blocks cols=\"2\" class=\"main\">");

    forEach(data.size, function(size) {
      out.w("<div class=\"main-preview\"><a href=\"/upload/" +
        escapeXmlAttr(data.sid) +
        "." +
        escapeXmlAttr(size) +
        ".jpg\" class=\"preview-image\"><img src=\"/upload/" +
        escapeXmlAttr(data.sid) +
        "." +
        escapeXmlAttr(size) +
        ".jpg\" alt=\"" +
        escapeXmlAttr(size) +
        "px\"></a></div><div class=\"main-preview\"><p class=\"bold\">" +
        escapeXml(size) +
        "px</p><a href=\"" +
        escapeXmlAttr(data.domain) +
        "/upload/" +
        escapeXmlAttr(data.sid) +
        "." +
        escapeXmlAttr(size) +
        ".jpg\" class=\"smaller\">" +
        escapeXml(data.domain) +
        "/upload/" +
        escapeXml(data.sid) +
        "." +
        escapeXml(size) +
        ".jpg</a></div>");
    });

    out.w("</blocks></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
