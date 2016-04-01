function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    out.w("<div class=\"group main\">");

    if (data.prev > 1) {
      out.w("<a href=\"/recent/page/" +
        escapeXmlAttr(data.prev) +
        "\" class=\"btn left\">上一页</a>");
    }

    if (data.prev === 1) {
      out.w("<a href=\"/recent\" class=\"btn left\">上一页</a>");
    }

    out.w("<a href=\"/recent/page/" +
      escapeXmlAttr(data.next) +
      "\" class=\"btn right\">下一页</a></div>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
