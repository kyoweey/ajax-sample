$(function(){

	const 	detail_area = document.getElementById('detail_area'),
			appid = '',
			item_id = cn.getParam('id'),
			parent_genre = cn.getParam('genre');

	// タブの初期表示切り替え
	if(parent_genre === "2494") {	
		$('[value="2494"]').prop("checked", true);
		$('[data-genre="2494"]').addClass('selected');
	}else if(parent_genre === "2495") {
		$('[value="2495"]').prop("checked", true);
		$('[data-genre="2495"]').addClass('selected');
	}else if(parent_genre === "2496") {
		$('[value="2496"]').prop("checked", true);
		$('[data-genre="2496"]').addClass('selected');
	}

	// 商品情報の描画
	cn.ajax('https://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemLookup?appid=' + appid + '&image_size=600&itemcode=' + item_id,
		function(res) {
			let img = res.ResultSet[0].Result[0].ExImage.Url,
				name = res.ResultSet[0].Result[0].Name,
				price = res.ResultSet[0].Result[0].Price._value,
				dom = '<div class="detail_left"><img src="' + img + '" /></div><div class="detail_right"><div class="name">' + name + '</div><div class="price"> ¥ ' + price + ' </div></div>';
			$('#detail_area').append(dom);
		},
		function(e) {
			$('#error_message').show();
		},
		function(data) {
			let img = data.ResultSet[0].Result[0].ExImage.Url,
				name = data.ResultSet[0].Result[0].Name,
				item_id_list = [];
			// ローカルストレージから閲覧履歴データを取得
			if (localStorage.getItem("test_ec")){
				item_id_list = JSON.parse(localStorage.getItem("test_ec"));
			}
			// フィルタリング
			item_id_list = item_id_list.filter(function (ele, index, array){
				return array[index].item_id !== item_id;
			});
			// 現在表示している商品情報を item_id_list に先頭に追加
			item_id_list.unshift({item_id, name});
			// ローカルストレージに保存
			localStorage.setItem('test_ec',JSON.stringify(item_id_list));
		}
	);
});
