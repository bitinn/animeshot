
'use strict';

Dropzone.autoDiscover = false

$(document).ready(function() {
	var dz = new Dropzone('#upload-dropzone', {
		maxFilesize: 8
		, acceptedFiles: 'image/png,image/jpeg,image/bmp,image/gif'
		, forceFallback: false
		, dictDefaultMessage: '上传文件'
		, dictInvalidFileType: '不支持这类文件'
		, dictFileTooBig: '文件大小超过上限'
		, dictResponseError: '服务器出错 >_<'
	})

	dz.on('success', function(file, res, err) {
		var id = res
		var name = 'shot-' + id
		var selector = '#' + name
		$('#upload-shot').append('<form method="post" action="/api/shots" id="' + name + '"></form>')
		$(selector).append('<label for="' + name + '-text">请输入截图字幕内容</label>')
		$(selector).append('<input type="hidden" name="hash" value="' + id + '">')
		$(selector).append('<input type="text" name="text" id="' + name + '-text" value="">')
		$(selector).append('<button type="submit">分享</button>')
	})
})
