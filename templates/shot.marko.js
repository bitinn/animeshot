function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head><title>" +
      escapeXml(data.text) +
      "</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/kube.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css\"></head><body><div class=\"main-shot\">");

    forEach(data.size, function(size) {
      out.w("<div class=\"shot-preview\"><img src=\"/upload/" +
        escapeXmlAttr(data.sid) +
        "." +
        escapeXmlAttr(size) +
        ".jpg\" alt=\"" +
        escapeXmlAttr(size) +
        "px\" class=\"shot-preview-image\"><p class=\"shot-preview-text\">" +
        escapeXml(size) +
        "px</p><input type=\"text\" value=\"" +
        escapeXmlAttr(data.domain) +
        "/upload/" +
        escapeXmlAttr(data.sid) +
        "." +
        escapeXmlAttr(size) +
        ".jpg\" class=\"shot-preview-url\"></div>");
    });

    out.w("</div></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
