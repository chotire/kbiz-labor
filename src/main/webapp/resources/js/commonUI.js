var openSearchBoo;
com.commonUI = function(){
	//검색조건3줄이상 열고닫기
	com.searchSwich();	
	//그리드 채우기
	com.autoHeight();
	//접고 펼치기
	com.foldingLayout();
};

//그리드 채우기
com.autoHeight = function(){
	var pId = $p.getFrame().id;	
	var _search = pId == "mf" ? '.autoHeight' : '#'+pId+' .autoHeight';
	
	if($(_search).length){
		com.autoHeightCount();
		$(window).resize(function() { 
			com.autoHeightCount();
		});
	}
};

com.autoHeightCount = function(){

    // content_body 가 있을 수도 있고 없을 수도 있다.
    if( $('.content_body').css('padding-top') == undefined ) {
        return;
    }

	var _win = $(window).height();
	var _pb = Number($('.content_body').css('padding-top').replace(/[^-\d\.]/g, ''));
	
	var pId = $p.getFrame().id;	
	var _wrapUnderH = Number($('.content_body').css('padding-bottom').replace(/[^-\d\.]/g, ''));
	
	
	var _navi = '#' + pId + ' .navigator_wrap';
	
	if (typeof _navi !== 'undefined' || _navi != '') {
		_wrapUnderH = _wrapUnderH + $(_navi).outerHeight();
	}

	var tbl_search = '#' + pId + ' .tbl_search';
	
	if (typeof tbl_search !== 'undefined' || tbl_search != '') {
		if ($(tbl_search).outerHeight() < 51) {
			_wrapUnderH = _wrapUnderH + 51;
		} else {
			_wrapUnderH = _wrapUnderH + $(tbl_search).outerHeight();
		}
	}
	
	var _search = pId == "mf"? '.lybox_wrap' : '#'+pId+' .lybox_wrap';
	
	$(_search).nextAll().each(function(idx){
		_wrapUnderH = _wrapUnderH +  Number($(this).css('margin-top').replace(/[^-\d\.]/g, ''));
		_wrapUnderH = _wrapUnderH +  Number($(this).css('margin-bottom').replace(/[^-\d\.]/g, ''));
		_wrapUnderH = _wrapUnderH +  $(this).outerHeight();
	});	
	
	_wrapUnderH = _wrapUnderH + 143;
	
	var _search = pId == "mf"? '.autoHeight' : '#'+pId+' .autoHeight';
	
	$(_search).each(function(idx){
		var _h;
		var _pos;
		var _totalH;
		var _m = 0;
		var _underH = 0;
		_pos = $(this).offset().top;
		
		if (_pos != 0) {
			_wrapUnderH = 0;
		}
		
		_m += Number($(this).css('margin-top').replace(/[^-\d\.]/g, ''));
		_m += Number($(this).css('margin-bottom').replace(/[^-\d\.]/g, ''));
		_h = $(this).outerHeight() - 10;
		$(this).nextAll().each(function(idx){
			_m += Number($(this).css('margin-top').replace(/[^-\d\.]/g, ''));
			_m +=  Number($(this).css('margin-bottom').replace(/[^-\d\.]/g, ''));
			_underH +=  $(this).outerHeight();
		})
		/* 아파트 그리드 */
		if($(this).hasClass('aptGrid')){			
			_totalH = _win - _pos - _m -_underH - _pb - _wrapUnderH -42;
		}
		else _totalH = _win - _pos - _m -_underH - _pb - _wrapUnderH -7;
		if($p.isWFramePopup()){
			$(this).height(_h);	
		}else{
			$(this).height(_totalH);
		}
	});
};

//검색조건3줄이상 열고닫기
com.searchSwich = function(){
	var pId = $p.getFrame().id;
	var _search = pId == "mf"? '.tbl_search' : '#'+pId+' .tbl_search';
	
	$(_search).each(function(idx){
		var _this = $(this)
		var _tr = _this.find('.tb_list > tbody > tr')
		//console.log(_tr.length)
		if(_tr.length >=3){
		//	_tr.eq(1).nextAll().css('display','none')
			//alert("aaa")
			_this.append('<a class="w2anchor2 btn_swich on" href="javascript:vold(null)" />')
			if(!openSearchBoo) _this.toggleClass('on')
			else{
				_tr.eq(1).nextAll().css('display','none')
			}
			_this.find('.btn_swich').click(function(){
				_this.toggleClass('on')
				if(_this.hasClass('on')) _tr.eq(1).nextAll().css('display','table-row')
				else _tr.eq(1).nextAll().css('display','none')
				com.autoHeightCount()
			});
		}
	
	});
};

//접고 펼치기
com.foldingLayout = function(){
	var pId = $p.getFrame().id;
	var _search = pId == "mf"? '.foldingbox' : '#'+pId+' .foldingbox';
	var _search2 = pId == "mf"? '.foldingbox .btn_folding' : '#'+pId+' .foldingbox .btn_folding';
	
	if($(_search).length){
		$(_search2).click(function(){
			$(this).parent().toggleClass('on');
		});
	}
	_search = pId == "mf"? '.foldingbox1' : '#'+pId+' .foldingbox1';
	_search2 = pId == "mf"? '.foldingbox1 .btn_folding' : '#'+pId+' .foldingbox1 .btn_folding';
	if($(_search).length){
		$(_search2).click(function(){
			$(this).parent().parent().parent().parent().toggleClass('on');
		});
	}
	com.autoHeightCount();
};
