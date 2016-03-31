
'use strict';

Dropzone.autoDiscover = false

$(document).ready(function() {
	var dz = new Dropzone('#upload-dropzone', {
		maxFilesize: 8
		, acceptedFiles: 'image/png,image/jpeg'
		, forceFallback: false
		, maxFiles: 6
		, thumbnailWidth: 80
		, thumbnailHeight: 80
		, dictDefaultMessage: '上传新图片（最多6张）'
		, dictInvalidFileType: '不支持这类图片'
		, dictFileTooBig: '文件大小超过上限'
		, dictResponseError: '服务器出错 >_<'
		, dictMaxFilesExceeded: '超出了单次上传限制'
	})

	dz.on('success', function(file, res, err) {
		var id = res
		var name = 'shot-' + id
		var outer = name + 'outer'
		var inner1 = name + '-inner1'
		var inner2 = name + '-inner2'
		$('#upload-shot').append('<form method="post" action="/api/shots" class="forms" id="' + outer + '"></form>')
		$('#' + outer).append('<input type="hidden" name="hash" value="' + id + '">')
		$('#' + outer).append('<section id="' + inner1 + '"></section>')
		$('#' + inner1).append('<label for="' + name + '-text" id="' + name + '-label">请输入字幕文字，以便搜索</label>')
		$('#' + inner1).append('<input type="text" name="text" id="' + name + '-text" value="">')
		$('#' + outer).append('<section id="' + inner2 + '"></section>')
		$('#' + inner2).append('<button type="submit" id="' + name + '-submit">分享</button>')

		$('#' + outer).on('submit', function(ev) {
			ev.preventDefault()

			fetch(ev.target.action, {
				method: 'post'
				, body: window.formSerialize(ev.target)
				, headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				return res.text()
			}).then(function(text) {
				$('#' + name + '-label').html('成功添加')
				$('#' + name + '-text').addClass('input-success')
				$('#' + name + '-submit').remove()
				$('#' + inner2).append('<a href="/shots/' + id + '" class="btn">访问链接</a>')
			}).catch(function(err) {
				console.log(err)
			})
		})
	})
})
