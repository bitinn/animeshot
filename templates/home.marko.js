function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      escapeXmlAttr = __helpers.xa,
      forEach = __helpers.f;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head>");

    data.meta.render({}, out);

    out.w("<title>AnimeShot / 截图吐槽 for everyone</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/kube.css?" +
      escapeXmlAttr(data.rev) +
      "\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/dropzone.css?" +
      escapeXmlAttr(data.rev) +
      "\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css?" +
      escapeXmlAttr(data.rev) +
      "\"><script src=\"/js/dropzone.js?" +
      escapeXmlAttr(data.rev) +
      "\"></script><script src=\"/js/domtastic.js?" +
      escapeXmlAttr(data.rev) +
      "\"></script><script src=\"/js/fetch.js?" +
      escapeXmlAttr(data.rev) +
      "\"></script><script src=\"/js/form-serialize.js?" +
      escapeXmlAttr(data.rev) +
      "\"></script><script src=\"/js/main.js?" +
      escapeXmlAttr(data.rev) +
      "\"></script>");

    data.analytics.render({}, out);

    out.w("</head><body>");

    data.header.render({}, out);

    out.w("<blocks cols=\"2\" class=\"main\">");

    data.searchBox.render({}, out);

    out.w("<div class=\"main-upload\"><form action=\"/api/files\" method=\"post\" enctype=\"multipart/form-data\" class=\"dropzone forms\" id=\"upload-dropzone\"><div class=\"fallback\"><section><label for=\"upload-field\">上传图片</label><input type=\"file\" name=\"file\" id=\"upload-field\"></section><section><button type=\"submit\">为人民服务！</button></section></div></form><div class=\"upload-shot\" id=\"upload-shot\"></div></div></blocks><blocks cols=\"2\" class=\"main\">");

    forEach(data.shots, function(shot) {
      out.w("<div class=\"main-preview\"><a href=\"shots/" +
        escapeXmlAttr(shot.sid) +
        "\" class=\"preview-image\"><img src=\"/upload/" +
        escapeXmlAttr(shot.sid) +
        ".300.jpg\" alt=\"300px\"></a><blockquote class=\"preview-quote\"><p>" +
        escapeXml(shot.text) +
        "</p><cite><a href=\"shots/" +
        escapeXmlAttr(shot.sid) +
        "\">链接</a></cite></blockquote></div>");
    });

    out.w("<div><p><a href=\"/recent\" class=\"btn\">更多近期上传</a></p></div></blocks></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
