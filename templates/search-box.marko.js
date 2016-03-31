function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      attr = __helpers.a;

  return function render(data, out) {
    out.w("<div class=\"main-search\"><form action=\"/search\" class=\"forms\"><section><label for=\"search-field\">搜索图片文字</label><input type=\"search\" name=\"q\" id=\"search-field\"" +
      attr("value", data.q) +
      "></section><section><button type=\"submit\">出击吧，搜索君！</button></section></form></div>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
