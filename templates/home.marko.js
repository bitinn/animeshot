function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html lang=\"zh-cn\"><head><title>测试页面</title><link rel=\"stylesheet\" media=\"all\" href=\"/css/normalize.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/dropzone.css\"><link rel=\"stylesheet\" media=\"all\" href=\"/css/main.css\"><script src=\"/js/dropzone.js\"></script><script src=\"/js/domtastic.js\"></script><script src=\"/js/main.js\"></script></head><body><div class=\"main-upload\"><form action=\"/api/files\" method=\"post\" enctype=\"multipart/form-data\" class=\"dropzone\" id=\"upload-dropzone\"><div class=\"fallback\"><input name=\"file\" type=\"file\"><button type=\"submit\">Upload</button></div></form><div class=\"upload-shot\" id=\"upload-shot\"></div></div><div class=\"main-search\"><form action=\"/api/search\"><div class=\"search-box\"><input name=\"search\" type=\"search\" value></div></form></div></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
