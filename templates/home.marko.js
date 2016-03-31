function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head><title>AnimeShot / 截图吐槽 for everyone</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/kube.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/dropzone.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css\"><script src=\"/js/dropzone.js\"></script><script src=\"/js/domtastic.js\"></script><script src=\"/js/fetch.js\"></script><script src=\"/js/form-serialize.js\"></script><script src=\"/js/main.js\"></script></head><body><blocks cols=\"2\" class=\"header\"><div class=\"header-title\"><h1><a href=\"/\">AnimeShot</a></h1></div></blocks><blocks cols=\"2\" class=\"main\"><div class=\"main-search\"><form action=\"/search\" class=\"forms\"><section><label for=\"search-field\">搜索图片文字</label><input type=\"search\" name=\"q\" id=\"search-field\" value></section><section><button type=\"submit\">出击吧，搜索君！</button></section></form></div><div class=\"main-upload\"><form action=\"/api/files\" method=\"post\" enctype=\"multipart/form-data\" class=\"dropzone forms\" id=\"upload-dropzone\"><div class=\"fallback\"><section><label for=\"upload-field\">上传图片</label><input type=\"file\" name=\"file\" id=\"upload-field\"></section><section><button type=\"submit\">为人民服务！</button></section></div></form><div class=\"upload-shot\" id=\"upload-shot\"></div></div></blocks><blocks cols=\"2\" class=\"main\">");

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

    out.w("</blocks></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
