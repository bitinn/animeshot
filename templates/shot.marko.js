function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      escapeXmlAttr = __helpers.xa,
      forEach = __helpers.f;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head><title>AnimeShot / " +
      escapeXml(data.text) +
      "</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/kube.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css\"></head><body><blocks cols=\"2\" class=\"header\"><div class=\"header-title\"><h1><a href=\"/\">AnimeShot</a></h1></div></blocks><blocks cols=\"2\" class=\"main\"><div class=\"main-search\"><form action=\"/search\" class=\"forms\"><section><label for=\"search-field\">搜索图片文字</label><input type=\"search\" name=\"q\" id=\"search-field\" value></section><section><button type=\"submit\">出击吧，搜索君！</button></section></form></div></blocks><blocks cols=\"2\" class=\"main\"><div><h2>文字内容</h2><p><a href=\"/shots/" +
      escapeXmlAttr(data.sid) +
      "\">" +
      escapeXml(data.text) +
      "</a></p></div></blocks><blocks cols=\"2\" class=\"main\">");

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
