$(function(){

	const common = {
		getParam : function(name, url) {
		    if (!url) url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		},
		ajax : function(url, doneFn, failFn, alwaysFn) {
			$.ajax({
				url: url,
				dataType: 'jsonp',
				type: 'GET',
			})
			.done( res => {
				doneFn(res);
			})
			.fail( e => {
				failFn(e);
			})
			.always( data => {
				alwaysFn(data);
			})
		}
	};

	window.cn = common;

});
