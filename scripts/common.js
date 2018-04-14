$(function(){

	const
		appid = '####',
		genreIds = ['2494', '2495', '2496'],
		common = {
			getParam : function(name, url) {
			    if (!url) url = window.location.href;
			    name = name.replace(/[\[\]]/g, "\\$&");
			    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			        results = regex.exec(url);
			    if (!results) return null;
			    if (!results[2]) return '';
			    return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
			showParentsTab : function(parentGenreId) {
				genreIds.forEach(function(id){
					if(parentGenreId === id) {	
						$('[value="'+ id +'"]').prop("checked", true);
						$('[data-genre="'+ id +'"]').addClass('selected');
					}
				});
			},
			getCategoriesUrl : function(categoryId) {
				return 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/categorySearch?appid=' + appid + '&category_id=' + categoryId;		
			},
			getProductsUrl : function() {
				return 'https://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid='+ appid;
			},
			getProductUrl : function(itemId) {
				return 'https://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemLookup?appid=' + appid + '&image_size=600&itemcode=' + itemId;
			}
		};

	window.cn = common;

});
