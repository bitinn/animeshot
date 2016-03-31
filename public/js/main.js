
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
})
