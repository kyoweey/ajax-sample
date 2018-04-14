$(function(){

	const	categoryId = cn.getParam('category_id'),
		 	genre = cn.getParam('genre') || '2494',
		  	query = cn.getParam('query'),
		  	// urlにパラメータの付与
		  	updateUrl = function(url, query, categoryId, genre) {
				if (query){
					url = url + '&query=' + query;
				}
				if (categoryId){
					url = url + '&category_id=' + categoryId;	
				}else if (genre){
					url = url + '&category_id=' + genre;	
				}else{
					url = url + '&category_id=13457';	
				}
				return url;
		  	},
		  	// ランキング or　検索結果 の表示
	  	  	showResults = function(res){
				result.empty();
				let results = res.ResultSet[0].Result;

				if(query){
					$('#result_search_text').append(' /「' + query +'」');
				}

				$('#search').val(query);

				if(res.ResultSet.totalResultsAvailable>0){
					for(let k in results) {
						if (k >= 0){
							let name = results[k].Name,
								code = results[k].Code,
								url = results[k].Url,
								image = results[k].Image.Medium;
							let dom = '<li><a href="./detail.html?id=' + code + '&genre='+ genre +'"><dl><dt id=' + code + '><img src='+ image +'></dt><dd>' + name + '</dd></dt></a></li>';
							result.append(dom);
						}
					};
				}else{
					$('#no_search_result').show();
				}
			},
			// エラーメッセージの表示
			showErrorMessage = function(e){
				$('#error_message').show();
			},
			// 閲覧履歴情報の表示
			showBrowsingHistory = function(data){
				// 閲覧履歴の表示
				if (localStorage.getItem("test_ec")){
					$('#history').show();
					$('#history ul').empty();

					let sessions = JSON.parse(localStorage.getItem("test_ec"));
					let maxLength;
					if(sessions.length>5){
						maxLength = 5;
					}else{
						maxLength = sessions.length;
					}
					for(let i=0; i<maxLength; i++){
						let itemId = sessions[i].itemId,
							itemUrl = sessions[i].url,
							itemImg = sessions[i].img,
							itemName = sessions[i].name;
						let history = '<li><a href="./detail.html?id=' + itemId + '&genre='+ genre +'"><dl><dt><img src="' + itemImg + '" /></dt><dd>' + itemName + '</dd></dl></a></li>';
						$('#history ul').append(history);
					}
				}
			},
			// 子カテゴリ情報の表示
			showChildCategories = function(response) {
				let sideSubCategorys = response.ResultSet[0].Result.Categories.Children,
					parentSubCategorys = response.ResultSet[0].Result.Categories.Current;
				
				// 子カテゴリの追加
				if (sideSubCategorys[0]){
					$('#side_menu .parent#'+parentSubCategorys.Id).append($('<ul class="sub_category" hidden></ul>')[0]);
				}
				for(let ss in sideSubCategorys) {
					if (ss >= 0){
						let subId = sideSubCategorys[ss].Id;
						let subCategoryTitle = sideSubCategorys[ss].Title.Short;
						if(categoryId === subId){
							$('#result_text').append(' / ' + subCategoryTitle);
							var subDom = $('<li class="on_category">' + subCategoryTitle + '<input type="radio" name="category_id" value="' + subId +  '" class="_tag" checked="true" hidden></li>')
						}else{
							var subDom = $('<li class="on_category">' + subCategoryTitle + '<input type="radio" name="category_id" value="' + subId +  '" class="_tag" hidden></li>')
						}
						$('#side_menu .parent#'+parentSubCategorys.Id).find('.sub_category').append(subDom[0]);
					}
				}
				// カテゴリをホバーした際に子カテゴリを表示
				$('#side_menu .parent').mouseover(function(){
					$(this).find('.sub_category').show();
				}).mouseout( function(){
					$(this).find('.sub_category').hide();
				});
				let parent = document.getElementsByClassName('on_category');
				for (child of parent) {
					child.addEventListener('click', function(e){
						
						$(this).find("._tag").click();
						document.myform.submit();
						e.stopPropagation();
					});
				}
			},
			// 親カテゴリ情報の表示
			showCategorys = function(res){
				$('#result_text').append('： ' + $('.parent_category.selected').text());
				$('#side_menu').empty();
				let sideCategorys = res.ResultSet[0].Result.Categories.Children,
					cnt = 0;
				for(let mc in sideCategorys) {
					if (mc >= 0){
						let categoryTitle = sideCategorys[mc].Title.Short;
						let subCategoryId = sideCategorys[mc].Id;

						if(categoryId === subCategoryId){
							$('#result_text').append(' / ' + categoryTitle);
							var categoryDom = '<li id="'+ subCategoryId +'" class="parent">' + categoryTitle + '<input type="radio" name="category_id" value="' + subCategoryId +  '" class="input_parent" checked="true" hidden></li>';						
						}else{
							var categoryDom = '<li id="'+ subCategoryId +'" class="parent">' + categoryTitle + '<input type="radio" name="category_id" value="' + subCategoryId +  '" class="input_parent" hidden></li>';
						}
						$('#side_menu').append(categoryDom);

						// Ajaxで子カテゴリの取得
						$.ajax({
							url: cn.getCategoriesUrl(subCategoryId),
							dataType: 'jsonp',
							type: 'GET',
						})
						.done( res => {
							showChildCategories(res);
						})
						.fail( e => {
						})
						.always( data => {
						})
						
					}
				}
				let parents = document.getElementsByClassName('parent');
				for (p of parents) {
					p.addEventListener('click', function(){	
						$(this).find(".input_parent").click();
						document.myform.submit();
					});
				}
			}
	let 	productsUrl = updateUrl(cn.getProductsUrl(), query, categoryId, genre);

	// ランキングと検索結果の表示切り替え
	if (!query && !categoryId) {
		var result = $('#ranking ul');
		$('#ranking').show();
	}else {
		var result = $('#result ul');
		$('#result').show();
	}

	// タブ表示
	cn.showParentsTab(genre);

	// Ajaxで親カテゴリの取得
	$.ajax({
		url: cn.getCategoriesUrl(genre),
		dataType: 'jsonp',
		type: 'GET',
	})
	.done( res => {
		showCategorys(res);
	})
	.fail( e => {
		// todo
	});

	// ランキング or　検索結果 の表示
	$.ajax({
		url: productsUrl,
		dataType: 'jsonp',
		type: 'GET',
	})
	.done( res => {
		showResults(res);
	})
	.fail( e => {
		showErrorMessage(e);
	})
	.always( data => {
		showBrowsingHistory(data);	
	});

	// submit
	let selects = document.getElementsByClassName('select');
	for (select of selects){
		select.addEventListener('change', function() {
			document.myform.submit();
		})
	}
	document.getElementById('search').addEventListener("change", function(){
		document.myform.submit();
	});
	let parentCategorys = document.getElementsByClassName('parent_category');
	for (parentCategory of parentCategorys) {
		parentCategory.addEventListener('click', function(){
			$(this).find(".input_tag").click();
			document.myform.submit();
		});
	}

});
