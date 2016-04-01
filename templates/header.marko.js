function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w("<blocks cols=\"2\" class=\"header\"><div class=\"header-title\"><h1><a href=\"/\">AnimeShot</a></h1></div><div class=\"header-description\"><p>本站仅收集高质的吐槽向的「动画截图」，用于广大群众的搜索与吐槽之需。非动画的截图请不要上传，会被管理员删除。</p></div></blocks>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
