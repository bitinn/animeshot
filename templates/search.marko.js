function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head><title>搜索结果</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/kube.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css\"></head><body><div class=\"main-search\"><ul class=\"search-results\">");

    forEach(data.shots, function(shot) {
      out.w("<li class=\"result-preview\"><a href=\"shots/" +
        escapeXmlAttr(shot.sid) +
        "\"><img src=\"/upload/" +
        escapeXmlAttr(shot.sid) +
        ".300.jpg\" alt=\"300px\" class=\"shot-preview-image\"><p class=\"shot-preview-text\">" +
        escapeXml(shot.text) +
        "</p></a></li>");
    });

    out.w("</ul></div></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
