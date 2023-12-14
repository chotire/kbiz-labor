;
/**PopUp 관련 Function Finish*/

/**
* 팝업창을 닫는다.
* callbackStr을 이용하여 부모창의 callback함수를 호출한다.
* 
* @date 2016.10.09
* @memberOf com
* @param {String} popId popup창 id로 값이 없을 경우 현재창의 아이디(this.popupID) close.
* @param {String} [callbackStr] callbackFunction명으로 부모 객체는 opener || parent으로 참조한다. opener || parent가 없을 경우 window 참조.
* @param {String} [returnValue] callbackFunction에 넘겨줄 파라메터로 String타입을 권장한다.
* @author Inswave Systems
* @example
* com.closePopup();
* com.closePopup("scwin.zipPopupCallback" , '{message:"정상처리되었습니다"}');
* com.closePopup("scwin.zipPopupCallback" , '정상처리되었습니다.');
*/
com.closePopup = function(callbackFnStr, retObj, callbackYn, selectedIdx) {
	com._closePopup($p.getPopupId(), callbackFnStr, com.strSerialize(retObj), window); // IFrame일 경우, 메모리릭을 없애기 위한 코딩. (부모/자식 간 페이지로 객체 파라미터 전달 방식은 비권장. 문자열 전달 권장.)
};



/**
*
* 팝업창을 연다.
*
* @date 2016.10.09
* @param {String} url url 화면경로
* @param {Array} options Popup창 옵션
* @param {String} [options.id] Popup창 아이디
* @param {String} [options.type] 화면 오픈 타입 ("iframePopup", "wframePopup", "browserPopup")
* @param {String} [options.width] Popup창 넓이
* @param {String} [options.height] Popup창 높이
* @param {String} [options.popupName] useIframe : true시 popup 객체의 이름으로 popup 프레임의 표시줄에 나타납니다.
* @param {String} [options.useIFrame] [default : false] true : IFrame 을 사용하는 WebSquare popup / false: window.open 을 사용하는 popup
* @param {String} [options.style] Popup의 스타일을 지정합니다. 값이 있으면 left top width height는 적용되지 않습니다.
* @param {String} [options.resizable] [default : false]
* @param {String} [options.modal] [default : false]
* @param {String} [options.scrollbars] [default : false]
* @param {String} [options.title] [default : false]
* @memberOf com
* @author Inswave Systems
* @example
* var dataObj = { id : "I0001", deptCd : "DS001" };
* var options = {};
* com.openPopup("/template/common/xml/zzAlertPop.xml", options, dataObj);
* 
* var dataObj = { type : "json", 
*				 data : { data : dma_authority.getJSON(), callbackFn : "scwin.insertMember" }, 
*				 name : "authObj" };
* var options = { id : "AuthorityMemberPop", 
*				 popupName : "직원 조회", 
*				 modal : true, 
*				 width : 560, height: 400 };
* com.openPopup("/ui/BM/BM002P01.xml", options, dataObj);
*/
com.openPopup = function(url, opt, dataObj) {
	com._openPopup(url, opt, dataObj);
};

com._openPopup = function(url, opt, dataObj) {
	var _dataObj = dataObj || {};
	
	var width = opt.width || 500;
	var height = opt.height || 500;
	
	var top = ((document.body.offsetHeight/2) - (parseInt(height)/2) + $(document).scrollTop()) + "px" ;
	var left = ((document.body.offsetWidth/2) - (parseInt(width)/2) + $(document).scrollLeft()) + "px" ;
	
	if (typeof _dataObj.data.callbackFn === "undefined") {
		_dataObj.data.callbackFn = "";
	} else if (_dataObj.data.callbackFn.indexOf("gcm") !== 0) {
		_dataObj.data.callbackFn = $p.id + _dataObj.data.callbackFn;
	}

	var options = {
		id : opt.id,
		popupName : opt.popupName || "",
		type : opt.type || "wframePopup",
		width : width + "px",
		height : height + "px",
		top : opt.top || top  || "140px",
		left :  opt.left || left || "500px",
		popupName : opt.popupName || '',
		modal : (opt.modal == false) ? false : true,
		dataObject : _dataObj,
		alwaysOnTop : opt.alwaysOnTop || false,
		useModalStack : (opt.useModalStack == false) ? false : true,
		resizable : (opt.resizable == false) ? false : true,
		useMaximize : opt.useMaximize || false
	};
	
	$p.openPopup(url, options);
};


com.openPopup_R = function(url, opt, dataObj) {
    this._openPopup_R(url, opt, dataObj);
};

com.popup_popId = "";
com.popup_popCallBack = "";
com.popup_pframeId = "";
com.popup_pType = "";
/**
 * 팝업창을 오픈합니다.
 *
 * @date 2018.08.10
 * @memberOf com
 * @param {String} url[필수] popup으로 열 화면의 화면 경로 포함한 파일 명이되겠습니다.
 * @param {String} callbackFn[옵션] 팝업창으로 부터 받을 콜백을 등록합니다. [default:""]
 * @param {String} data[옵션] 팝업창에 던질 데이터를 등록합니다.[default:""]
 * @param {String} width[옵션] 팝업창의 가로 크기.[default:"500"]
 * @param {String} height[옵션] 팝업창의 세로 크기.[default:"500"]
 * @param {String} type[옵션] 팝업창의 종류 window일경우만 기재.[default:"wframePopup"]
 * @param {String} popup_name[옵션] 팝업창의 종류가 window일경우 필수. 타이틀로 사용할 내용 기재.[default:""]
 *
 * @author Inswave Systems
 * @example
 *
 * // case 1) 팝업 화면만 띄우는경우[URL만 입력]
 * var popOps = {
 *                  url:"/ui/smm/smp/xml/test2.xml"
 *              };
 * com.popup_open(popOps);
 *
 * // case 2) 콜백을 포함하는 경우 [url,callbackFn ]
 *            - 팝업으로 부터 데이터를 받을경우
 *            - 팝업이 수행되고 나서 다른 프로세스를 수행하는경우
 * var popOps = {
 *                  url:"/ui/smm/smp/xml/test2.xml"
 *                  ,callbackFn : "scsObj.popCallback"
 *              };
 * com.popup_open(popOps);
 *
 * // case 3) 데이터를 전달 하는 경우 [url,data ]
 *
 * var popOps = {
 *                  url:"/ui/smm/smp/xml/test2.xml"
 *                  ,data : "팝업에 넘길 string 데이터" || {"팝업에 넘길 Json 데이터"}
 *              };
 * com.popup_open(popOps);
 *
 *
 * // case 4) 사이즈를 지정하고자 하는 경우 [url,width,height ]
 *
 * var popOps = {
 *                  url:"/ui/smm/smp/xml/test2.xml"
 *                  width:"450"
 *                  height:"300"
 *              };
 * com.popup_open(popOps);
 *
 * // case 5) window 팝업으로 호출하고자 하는 경우 [url,type,popup_name ]
 *
 * var popOps = {
 *                  url:"/ui/smm/smp/xml/test2.xml"
 *                  type:"window"
 *                  popup_name:"팝업 타이틀"
 *              };
 * com.popup_open(popOps);
 *
 * // case 6) browser 용 팝업으로 호출하는경우
 *
 * var popOps = {
 *                  url:"/ui/smm/smp/xml/test2.xml"
 *                  type:"browser"
 *                  modal : true || false
 *                  popup_name:"팝업 타이틀"
 *              };
 * com.popup_open(popOps);
 *
 *
 *
 */
com.popup_open = function(popOps) {
    if (!this.isEmpty(popOps)) {
        var _url = popOps.url;
        if (this.isEmpty(_url)) {
            alert("[cmn.js][com.popup_open] 팝업 파일경로가 없습니다.");
            return false;
        }
        var popId = popOps.pid || _url.substring(_url.lastIndexOf("/") + 1, _url
                .lastIndexOf("."))
                + "_" + new Date().getTime();

        var pop_modal = true;
        var popName = popOps.popup_name || popId;
        if(popOps.type == "window"){
            popOps.useHeader = true;
            pop_modal = popOps.modal ;
        }
        var pop_type = "wframePopup";
        //popOps.type = "browser";
        if(popOps.type == "browser"){
            pop_type = "window";
            pop_modal = popOps.modal ;
            if(!pop_modal){// modal less인경우 하나만 띄우도록
                popId = _url.substring(_url.lastIndexOf("/") + 1, _url.lastIndexOf("."));
            }
        }
        //팝업 너비
        if (!this.isEmpty(popOps.widType)) {        	
        	popOps.width  = gcm.POP_WIDTH_TYPE[popOps.widType] || 500;
        	gcm.POP_CUSTOM_WIDTH_TYPE = "";
        }
        
        var opt = {
            id : popId,
            popupName : popName,
            modal : pop_modal,
            width : popOps.width || 500,
            height : popOps.height || 500,
            type : pop_type,
            useHeader : popOps.useHeader || false,
            closeAction : popOps.closeAction || ""
        };
        
        if( pop_type == "window" && popOps.resizable != undefined ){
            $.extend(opt, {resizable:popOps.resizable});        	
        }
        
        if( pop_type == "window" && popOps.scrollbars != undefined ){
        	$.extend(opt, {scrollbars:popOps.scrollbars});        	
        }
        
        if( pop_type == "window" && popOps.location != undefined ){
        	$.extend(opt, {location:popOps.location});        	
        }
        
        var dataObj = {
            type : "json",
            data : {
                data : popOps.data || "",
                callbackFn : popOps.callbackFn || ""
            },
            name : "paramObj"
        };

        this.popup_pframeId = this.getFrameId() || gcm.initWframeId;
        dataObj.data.pframeId = this.popup_pframeId;//
        this.popup_pType = opt.type;

        console.log('_url :: ' + _url);
        console.log(opt);
        console.log(dataObj);
        this.openPopup_R(_url, opt, dataObj);
    } else {
        alert("[cmn.js][com.popup_open] 팝업을 열기위한 정보가 없습니다.");
    }
};


com._openPopup_R = function(url, opt, dataObj) {
    var _dataObj = dataObj || {};
    _dataObj.data = _dataObj.data || {};

    var width = opt.width || 500;
    var height = opt.height || 500;

    var top = ((document.body.offsetHeight / 2) - (parseInt(height) / 2) + $(
            document).scrollTop());
    if( top < 0 ) top = 0;
    top = top + "px";

    var left = ((document.body.offsetWidth / 2) - (parseInt(width) / 2) + $(
            document).scrollLeft())
            + "px";

    if (typeof _dataObj.data.callbackFn === "undefined") {
        _dataObj.data.callbackFn = "";
    } else if (_dataObj.data.callbackFn.indexOf("gcm") !== 0) {
        _dataObj.data.callbackFn = $p.id + _dataObj.data.callbackFn;
    }
    var popId = $p.id + opt.id;
    opt.frameMode = "wframe";
    if(opt.type == "window"){
        opt.useIFrame = false;
        opt.frameMode = "";
        sessionStorage.setItem("winpopParam", JSON.stringify({popId:popId,opt:opt,dataObj:dataObj}));
    }

    var popurl = "";
    var alertClassName = "";
    if (url.indexOf("showMessage") > -1 || url.indexOf("errorAlertP") > -1) {
    	popurl = "popupMsg.html";
    	alertClassName = "alert";
    } else {
    	popurl = "popup.html";
    	alertClassName = "";
    }
    
    var options = {
        id : popId,
        // id : opt.id,
        type : opt.type || "wframePopup",
        width : width + "px",
        height : height + "px",
        top : opt.top || top || "140px",
        left : opt.left || left || "500px",
        popupName : opt.popupName || '',
        title : opt.title || "",
        modal : (opt.modal == false) ? false : true,
        useIFrame : opt.useIFrame || false,
        dataObject : _dataObj, // litewindow 에서 사용 가능 기능
        scrollbars :  (opt.type == "window" && opt.scrollbars != undefined && opt.scrollbars == true) ? true : false, // browser일 경우에만 scrollbars
        alwaysOnTop : opt.alwaysOnTop || false,
        useModalStack : (opt.useModalStack == false) ? false : true,
        resizable : (opt.type == "window" && opt.resizable != undefined && opt.resizable == true) ? true : false, // browser일 경우에만 resize허용
        location : (opt.type == "window" && opt.location != undefined && opt.location == true) ? true : false, // browser일 경우에만 resize허용
        useMaximize : opt.useMaximize || false,
        className : alertClassName,
        frameMode : opt.frameMode,
        method : "post",
        //popupUrl : "popup.html"
        popupUrl : popurl
    };
    
    com.popOptions = options;

    $p.openPopup(url, options);
    gcm.initWframePopId =  options.id;
    //팝업의 autoheight설정 관련 start
    
    var search = $("#"+options.id+" .autoHeight");
    $(search).each(function(idx){
    	var _win = parseInt(com.popOptions.height.replace("px",""),10);
    	var _pd = Number($('#'+com.popOptions.id+' .content_body.popup').css('padding-bottom').replace(/[^-\d\.]/g, ''));
    	_pd += Number($('#'+com.popOptions.id+' .content_body.popup').css('padding-top').replace(/[^-\d\.]/g, ''));
    	
    	var _wrapUnderH = 0;    	
    	var _tblSearch = '#'+com.popOptions.id+' .tbl_search';
    	
    	if (typeof _tblSearch !== 'undefined' || _tblSearch != '') {
			_wrapUnderH +=  $(_tblSearch).outerHeight();
    	}
    	
    	var _search = '#'+com.popOptions.id+' .defaultbox';
    	if (typeof _search !== 'undefined' || _search != '') {
    		_wrapUnderH +=  $(_search).outerHeight();
    	}
    
		var _h = 0;
		var _pos = 0;
		var _totalH = 0;
		var _m = 0;
		var _underH = 0;
		
		//_pos = this.offsetTop;		
		//_m += Number($(this).css('margin-top').replace(/[^-\d\.]/g, ''))
		//_m += Number($(this).css('margin-bottom').replace(/[^-\d\.]/g, ''))
		//_h = $(this).outerHeight();
		/**
		$(this).nextAll().each(function(idx){
			debugger;
			_m += Number($(this).css('margin-top').replace(/[^-\d\.]/g, ''));
			_m +=  Number($(this).css('margin-bottom').replace(/[^-\d\.]/g, ''));
			_underH +=  $(this).outerHeight();
		})
		*/
		var popHeader = 50 ;// 팝업헤더의 높이	
		
		//팝업의 udc인경우 bottom의 값을 $(this).nextAll()으로 찾을수 없으므로 추가함
		//if( this.id.indexOf('udc_grd') > -1){
		var bObj = $('#'+com.popOptions.id+' .bottombox');
		if (typeof bObj !== 'undefined' || bObj != '') {
			_m += Number(bObj.css('margin-top').replace(/[^-\d\.]/g, ''));
			_m += Number(bObj.css('margin-bottom').replace(/[^-\d\.]/g, ''));
			_underH +=  bObj.outerHeight();
		}
		//}

		_totalH = _win - _pos - _m -_underH - _pd - _wrapUnderH - popHeader - 24;
		 $(this).height(_totalH);		
	});
    //팝업의 autoheight설정 관련 finish
	
    // 이후에 설정되어야함..
    if(options.type != "window" && !opt.useHeader){
        $("#"+options.id).addClass("no_header");
    }
    if(options.type == "window"){
        $("#"+options.id).addClass("winpop");
    }

    if(options.type == "litewindow" && opt.useHeader){
        $("#"+options.id).addClass("black_title");
        if($("#"+options.id).position().top < 0){
            $("#"+options.id).css("top",100);
        }
    }

    if(popId.indexOf("gridsearch") > -1){
        var _popObj = $("#"+options.id);
        var iw = _popObj.width();
        var ih = _popObj.height();
        var grdOffset = $("#"+_dataObj.data.data.grd).offset();
        var grdWidth = $("#"+_dataObj.data.data.grd).width();
        _popObj.offset({top:grdOffset.top -(ih+10),left:(grdWidth/2-iw/2)+grdOffset.left });
    }

    var p_id = this.popup_pframeId;

    if(opt.closeAction){
        var _tPopArr = $(".w2window_close");
        for(var c = 0;c < _tPopArr.length;c++){
            var _pObj = _tPopArr[c];
            if(_pObj.id.indexOf(popId) > -1){
                _pObj.onclick = function(){
                  var frame = $w.comp[p_id];
                    var tmpArr = opt.closeAction.split(".");
                    var _sObj = frame.getObj(tmpArr[0]);
                    _sObj[tmpArr[1]]();
                     if (opt.closeAction) {
                            com.closePopup(popId, opt.closeAction, "");
                        }
                        com.closePopup(popId);
                };
            }
        }
    }
};

/**
 * 팝업창을 닫는다. callbackStr을 이용하여 부모창의 callback함수를 호출한다.
 *
 * @date 2016.10.09
 * @memberOf com
 * @param {String}
 *            popId popup창 id로 값이 없을 경우 현재창의 아이디(this.popupID) close.
 * @param {String}
 *            [callbackStr] callbackFunction명으로 부모 객체는 opener || parent으로 참조한다.
 *            opener || parent가 없을 경우 window 참조.
 * @param {String}
 *            [returnValue] callbackFunction에 넘겨줄 파라메터로 String타입을 권장한다.
 * @author Inswave Systems
 * @example com.closePopup(); com.closePopup("zipPopup");
 *          com.closePopup("zipPopup", "scsObj.zipPopupCallback" ,
 *          '{message:"정상처리되었습니다"}'); com.closePopup("zipPopup",
 *          "scsObj.zipPopupCallback" , '정상처리되었습니다.');
 */
com.closePopup = function(popId, callbackFnStr, retObj, callbackYn, selectedIdx) {
	
    var winobj = opener || parent;
    
    // 윈도우 팝업안에서의 레이어 팝업인경우 2019.04.15
    if($p.isWFramePopup() && $p.isPopup()){
    	winobj = parent
    }
    
    this._closePopup(popId, callbackFnStr, this.strSerialize(retObj), winobj); // IFrame일
                                                                                // 경우,
                                                                                // 메모리릭을
                                                                                // 없애기
                                                                                // 위한
                                                                                // 코딩.
                                                                                // (부모/자식
                                                                                // 간
                                                                                // 페이지로
                                                                                // 객체
                                                                                // 파라미터
                                                                                // 전달
                                                                                // 방식은
                                                                                // 비권장.
                                                                                // 문자열
                                                                                // 전달
                                                                                // 권장.)
};


com._closePopup = function(popId, callbackFnStr, retStr, winObj) {
    var nowObj = opener || this;
    
 // 윈도우 팝업안에서의 레이어 팝업인경우 2019.04.15
    if($p.isWFramePopup() && $p.isPopup()){
    	nowObj = this
    }
    
    if ((typeof callbackFnStr !== "undefined") && (callbackFnStr !== "")) {
        var func = winObj.WebSquare.util.getGlobalFunction(callbackFnStr);
        //debugger;
        if (func) {
        		//udc에서 호출하는 경우 팝업처리로직 추가        		
        		if(callbackFnStr.indexOf("com.udcCallback") > -1){
        			func(com.popup_popId,com.getJSON(retStr));
        		}else{
	        		//일반 화면에서 팝업콜백 처리하는경우
	                func(com.getJSON(retStr));
        		}
        		if(com.isEmpty(opener)){
        			$w.closePopup(popId);
        			/*
        			try {
    	    			if( $("html").hasClass("w2modalopenedbody") ) $("html").removeClass("w2modalopenedbody");
    	    			if( $(".w2modal_popup").css("display") == "block" ) $(".w2modal_popup").css("display","none");
        			} catch(e) {}
        			*/
        		}else{
        			//nowObj.$p.closePopup(popId);
        			nowObj.$w.closePopup(popId);  //2019.04.15
        		}
        		
        } else {
                if (winObj.$p.getParameter("w2xPath") !== winObj.parent.$p
                        .getParameter("w2xPath")) {
                    nowObj._closePopup(popId, callbackFnStr, retStr, winObj.parent);
                    return;
                }
                if(com.isEmpty(opener)){
        			$w.closePopup(popId);
        		}else{
        			//nowObj.$p.closePopup(popId);
        			nowObj.$w.closePopup(popId); //2019.04.15
        		}
        }

    } else {
    	if(com.isEmpty(opener)){
			$w.closePopup(popId);
		}else{
			//nowObj.$p.closePopup(popId);
			nowObj.$w.closePopup(popId); //2019.04.15
		}
    }
};

com.popup_close = function(val) {
	
	var popupID = $w.getParameter("popupID");
	var _popId = this.popup_popId || popupID;
	var _callback = this.popup_popCallBack || JSON.parse($w.getPopupParam()).callbackFn;
    if (_callback) {
        this.closePopup(_popId, _callback, val);
    }
    this.closePopup(_popId);
};
/**PopUp 관련 Function Finish*/
;