$(function(){

	const appid = '',
	  	  category_id = cn.getParam('category_id'),
	  	  genre = cn.getParam('genre') || 2494,
	  	  query = cn.getParam('query');
	let   url = 'https://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid='+ appid;

	// urlにパラメータの付与
	if (query){
		url = url + '&query=' + query;
	}
	if (category_id){
		url = url + '&category_id=' + category_id;	
	}else if (genre){
		url = url + '&category_id=' + genre;	
	}else{
		url = url + '&category_id=13457';	
	}

	// ランキングと検索結果の表示切り替え
	if (!query && !category_id) {
		var result = $('#ranking ul');
		$('#ranking').show();
	}else {
		var result = $('#result ul');
		$('#result').show();
	}

	// タブの表示切り替え
	if(genre == 2494) {	
		$('[value="2494"]').prop("checked", true);
		$('[data-genre="2494"]').addClass('selected');
	}else if(genre == 2495) {
		$('[value="2495"]').prop("checked", true);
		$('[data-genre="2495"]').addClass('selected');
	}else if(genre == 2496) {
		$('[value="2496"]').prop("checked", true);
		$('[data-genre="2496"]').addClass('selected');
	}

	// Ajaxで親カテゴリの取得
	cn.ajax('http://shopping.yahooapis.jp/ShoppingWebService/V1/json/categorySearch?appid=' + appid + '&category_id=' + genre,
		function(res){
			$('#result_text').append('： ' + $('.parent_category.selected').text());
			$('#side_menu').empty();
			let side_categorys = res.ResultSet[0].Result.Categories.Children;
			var cnt = 0;
			for(var m_c in side_categorys) {
				if (m_c >= 0){
					let category_title = side_categorys[m_c].Title.Short;
					var sub_category_id = side_categorys[m_c].Id;

					if(category_id === sub_category_id){
						$('#result_text').append(' / ' + category_title);
						var category_dom = '<li id="'+ sub_category_id +'" class="parent">' + category_title + '<input type="radio" name="category_id" value="' + sub_category_id +  '" class="input_parent" checked="true" hidden></li>';						
					}else{
						var category_dom = '<li id="'+ sub_category_id +'" class="parent">' + category_title + '<input type="radio" name="category_id" value="' + sub_category_id +  '" class="input_parent" hidden></li>';
					}
					$('#side_menu').append(category_dom);

					// Ajaxで子カテゴリの取得
					cn.ajax('http://shopping.yahooapis.jp/ShoppingWebService/V1/json/categorySearch?appid=' + appid + '&category_id=' + sub_category_id,
						function(response) {
							let side_sub_categorys = response.ResultSet[0].Result.Categories.Children,
								parent_sub_categorys = response.ResultSet[0].Result.Categories.Current;
							
							// 子カテゴリの追加
							if (side_sub_categorys[0]){
								$('#side_menu .parent#'+parent_sub_categorys.Id).append($('<ul class="sub_category" hidden></ul>')[0]);
							}
							for(let ss in side_sub_categorys) {
								if (ss >= 0){
									var sub_id = side_sub_categorys[ss].Id;
									let sub_category_title = side_sub_categorys[ss].Title.Short;
									if(category_id === sub_id){
										$('#result_text').append(' / ' + sub_category_title);
										var sub_dom = $('<li class="on_category">' + sub_category_title + '<input type="radio" name="category_id" value="' + sub_id +  '" class="_tag" checked="true" hidden></li>')
									}else{
										var sub_dom = $('<li class="on_category">' + sub_category_title + '<input type="radio" name="category_id" value="' + sub_id +  '" class="_tag" hidden></li>')
									}
									$('#side_menu .parent#'+parent_sub_categorys.Id).find('.sub_category').append(sub_dom[0]);
								}
							}
							// カテゴリをホバーした際に子カテゴリを表示
							$('#side_menu .parent')[cnt].addEventListener('mouseover', function(){
								$(this).find('.sub_category').show();
							});
							$('#side_menu .parent')[cnt].addEventListener('mouseout', function(){
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
							cnt++;
						},
						function(e) {
							// Todo
						},
						function(data) {
							// Todo
						}
					);
				}
			}
			let parents = document.getElementsByClassName('parent');
			for (p of parents) {
				p.addEventListener('click', function(){	
					$(this).find(".input_parent").click();
					document.myform.submit();
				});
			}
		},
		function(e){
			// Todo
		},	
		function(data){
			// Todo
		}
	);

	// ランキング or　検索結果 の表示
	cn.ajax(url,
		function(res){
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
							image = results[k].Image.Medium,
							review_rate = results[k].Review.Rate,
							review_count = results[k].Review.Count;
						let dom = '<li><a href="./detail.html?id=' + code + '&genre='+ genre +'"><dl><dt id=' + code + '><img src='+ image +'></dt><dd>' + name + '</dd></dt></a></li>';
						result.append(dom);
					}
				};
			}else{
				$('#no_search_result').show();
			}
		},
		function(e){
			$('#error_message').show();
		},
		function(data){
			// 閲覧履歴の表示
			if (localStorage.getItem("test_ec")){
				$('#history').show();
				$('#history ul').empty();

				let sessions = JSON.parse(localStorage.getItem("test_ec"));
				let max_length;
				if(sessions.length>5){
					max_length = 5;
				}else{
					max_length = sessions.length;
				}
				for(let i=0; i<max_length; i++){
					let item_id = sessions[i].item_id,
						item_url = sessions[i].url,
						name = sessions[i].name;
					let history = '<li><a href="./detail.html?id=' + item_id + '&genre='+ genre +'"><dl><dt><img src="https://item-shopping.c.yimg.jp/i/g/' + item_id + '" /></dt><dd>' + name + '</dd></dl></a></li>';
					$('#history ul').append(history);
				}
			}
		}
	);

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
	let parent_categorys = document.getElementsByClassName('parent_category');
	for (parent_category of parent_categorys) {
		parent_category.addEventListener('click', function(){
			$(this).find(".input_tag").click();
			document.myform.submit();
		});
	}

});
