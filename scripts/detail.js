$(function(){

	const	itemId = cn.getParam('id'),
			parentGenre = cn.getParam('genre'),
			// 商品詳細の表示
			showProductDetail = function(res) {
				let img = res.ResultSet[0].Result[0].ExImage.Url,
					name = res.ResultSet[0].Result[0].Name,
					price = res.ResultSet[0].Result[0].Price._value,
					dom = '<div class="detail_left"><img src="' + img + '" /></div><div class="detail_right"><div class="name">' + name + '</div><div class="price"> ¥ ' + price + ' </div></div>';
				$('#detail_area').append(dom);
			},
			// エラーメッセージの表示
			showErrorMessage = function(e) {
				$('#error_message').show();
			},
			// 閲覧履歴情報の更新
			updateBrowsingHistory = function(data) {
				let img = data.ResultSet[0].Result[0].ExImage.Url,
					name = data.ResultSet[0].Result[0].Name,
					itemIdList = [];
				// ローカルストレージから閲覧履歴データを取得
				if (localStorage.getItem("test_ec")){
					itemIdList = JSON.parse(localStorage.getItem("test_ec"));
				}
				// フィルタリング
				itemIdList = itemIdList.filter(function (ele, index, array){
					return array[index].itemId !== itemId;
				});
				// 現在表示している商品情報を itemIdList に先頭に追加
				itemIdList.unshift({itemId, name, img});
				// ローカルストレージに保存
				localStorage.setItem('test_ec',JSON.stringify(itemIdList));
			};

	// タブの表示
	cn.showParentsTab(parentGenre);
	// 商品情報の描画
	$.ajax({
		url: cn.getProductUrl(itemId),
		dataType: 'jsonp',
		type: 'GET',
	})
	.done( res => {
		showProductDetail(res);
	})
	.fail( e => {
		showErrorMessage(e);
	})
	.always( data => {
		updateBrowsingHistory(data);
	})
});
