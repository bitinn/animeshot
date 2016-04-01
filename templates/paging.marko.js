function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    out.w("<div class=\"group main\">");

    if (data.q) {
      if (data.prev > 1) {
        out.w("<a href=\"/" +
          escapeXmlAttr(data.page) +
          "/page/" +
          escapeXmlAttr(data.prev) +
          "?q=" +
          escapeXmlAttr(data.q) +
          "\" class=\"btn left\">上一页</a>");
      }

      if (data.prev === 1) {
        out.w("<a href=\"/" +
          escapeXmlAttr(data.page) +
          "?q=" +
          escapeXmlAttr(data.q) +
          "\" class=\"btn left\">上一页</a>");
      }

      out.w("<a href=\"/" +
        escapeXmlAttr(data.page) +
        "/page/" +
        escapeXmlAttr(data.next) +
        "?q=" +
        escapeXmlAttr(data.q) +
        "\" class=\"btn right\">下一页</a>");
    } else {
      if (data.prev > 1) {
        out.w("<a href=\"/" +
          escapeXmlAttr(data.page) +
          "/page/" +
          escapeXmlAttr(data.prev) +
          "\" class=\"btn left\">上一页</a>");
      }

      if (data.prev === 1) {
        out.w("<a href=\"/" +
          escapeXmlAttr(data.page) +
          "\" class=\"btn left\">上一页</a>");
      }

      out.w("<a href=\"/" +
        escapeXmlAttr(data.page) +
        "/page/" +
        escapeXmlAttr(data.next) +
        "\" class=\"btn right\">下一页</a>");
    }

    out.w("</div>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
