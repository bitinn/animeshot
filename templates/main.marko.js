function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head><title>测试页面</title></head><body><p>你好，" +
      escapeXml(data.name) +
      "</p></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
