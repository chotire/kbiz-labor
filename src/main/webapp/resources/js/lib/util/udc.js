;
/**udc 관련 Function Start*/

/**
 * UDC의 내부component의 값을 set합니다.
 * */
com.setUdcValue = function(udc_id,comp_id,val){
        var nowFrame = $p.getFrame();
        var udcObj = nowFrame.getObj(udc_id);
        var udc_incomp = comp_id;
        var udc_incomp_id = udcObj.id +"_"+ udc_incomp;
        var comp = $w.comp[udc_incomp_id];
        comp.setValue(val);
};

/**
 * UDC의 내부component의 값을 읽습니다.
 * */
com.getUdcValue = function(udc_id,comp_id){	
        var nowFrame = $p.getFrame();
        var udcObj = nowFrame.getObj(udc_id);
        var udc_incomp = comp_id;
        var udc_incomp_id = udcObj.id +"_"+ udc_incomp;
        var comp = $w.comp[udc_incomp_id];
        return comp.getValue();
};

/**
 * UDC의 내부component에 focusing 합니다.
*  */
com.setUdcFocus = function(udc_id,comp_id){	
       var nowFrame = $p.getFrame();
       var udcObj = nowFrame.getObj(udc_id);
       var udc_incomp = comp_id;
       var udc_incomp_id = udcObj.id +"_"+ udc_incomp;
       var comp = $w.comp[udc_incomp_id];
       comp.focus();
};

/**
 * UDC의 내부component를 return 합니다.
 * */
com.getUdcComp = function(udc_id,comp_id){	
       var nowFrame = $p.getFrame();
       var udcObj = nowFrame.getObj(udc_id);
       var udc_incomp = comp_id;
       var udc_incomp_id = udcObj.id +"_"+ udc_incomp;
       var comp = $w.comp[udc_incomp_id];
       return comp; 
};

/**
 * udc를 이용한 gridView의 fixColumn과 hiddenColumn을 처리하기위해 본 함수를 사용합니다.
 * 
 * @memberOf com
 * @param {String:Y} gridView의 id
 * @param {String:Y} 담당 udc의 id
 * @return {} 없음
 * @example
 * 
 * com.setGridFix("gridViewId","udcId");
 * 
 * */
com.setGridFix = function(grdId, udcId){
    var nowFrame = $p.getFrame();
    var grdObj = nowFrame.getObj(grdId);//gridObj 
    var udcObj = nowFrame.getObj(udcId);//udcObj
    udcObj.setUserData("userData1",grdObj.id)     
};

//udcDeptPopup
/*var popOps = {
        url:'/ux/cf/CF00051000P.xml'
        //type:"browser"
        ,modal : true //true || false
        ,popup_name:"팝업 타이틀"
        ,callbackFn : "scwin.popCallback"
    };
			
			com.popup_open(popOps);
			
			com.udcDeptPopup();
			*/
/**
 * INPUT 값에 따른 조회처리 분기.
 * */
com.udcSelNm = function(type, _comps, val1, val2, val3){

    var json = "";
    var _ids = "";
	switch(type){
		case "DeptTreeSelNm":
	        json = '{"deptCd":"val1","deptNm":"val2"}'; //,"cond":"val3"}';
	        json = json.replaceAll("val1", val1);
	        json = json.replaceAll("val2", val2);
	        //json = json.replaceAll("val3", val3);
		    json = com.getJSON(json);
		    
		    _ids = "";
			$.each(_comps.comp,function(key,value){
				if(key!=0){
					_ids += ",";
				}
				_ids += value.id  ;				
		    });
			com.udc_Comp_set(type,_ids);
			
			ajaxLib.ajax("/cf/CF00051000P/selectTcfUseDeptListRecursive", {
			     mode        : "synchronous"
			    ,requestData : json
			    ,callback    : "com.deptTreePopupCallback"      
			    ,errCallback : "com.deptTreePopupErrCallBack"
            });

			break;
		case "DeptSelNm":
	        json = '{"deptCd":"val1","deptNm":"val2"}'; //,"cond":"val3"}';
	        json = json.replaceAll("val1", val1);
	        json = json.replaceAll("val2", val2);
	        //json = json.replaceAll("val3", val3);
		    json = com.getJSON(json);
		    
		    _ids = "";
			$.each(_comps.comp,function(key,value){
				if(key!=0){
					_ids += ",";
				}
				_ids += value.id  ;				
		    });
			com.udc_Comp_set(type,_ids);
			
			ajaxLib.ajax("/cf/CF00051000P/selectTcfDeptList", {
			     mode        : "synchronous"
			    ,requestData : json
			    ,callback    : "com.deptPopupCallback"      
			    ,errCallback : "com.deptPopupErrCallBack"
            });
			
			break;
		case "SiteSelNm":
	        json = '{"siteCd":"val1","siteNm":"val2"}'; //,"cond":"val3"}';
	        json = json.replaceAll("val1", val1);
	        json = json.replaceAll("val2", val2);
	        //json = json.replaceAll("val3", val3);
		    json = com.getJSON(json);
		    
		    _ids = "";
			$.each(_comps.comp,function(key,value){
				if(key!=0){
					_ids += ",";
				}
				_ids += value.id  ;				
		    });
			com.udc_Comp_set(type,_ids);
			
			ajaxLib.ajax("/cf/CF00051002P/selectTcmSiteList", {
			     mode        : "synchronous"
			    ,requestData : json
			    ,callback    : "com.sitePopupCallback"      
			    ,errCallback : "com.sitePopupErrCallBack"
            });
			
			break;	
		case "TradeSelNm":
	        json = '{"tradeCd":"val1","tradeNm":"val2"}';
	        json = json.replaceAll("val1", val1);
	        json = json.replaceAll("val2", val2);
		    json = com.getJSON(json);
		    
		    _ids = "";
			$.each(_comps.comp,function(key,value){
				if(key!=0){
					_ids += ",";
				}
				_ids += value.id  ;				
		    });
			com.udc_Comp_set(type,_ids);
			
			ajaxLib.ajax("/cf/CF00300000U/selectTcfTradeInfoList", {
			     mode        : "synchronous"
			    ,requestData : json
			    ,callback    : "com.tradePopupCallback"      
			    ,errCallback : "com.tradePopupErrCallBack"
            });
			
			break;

		case "UserSelNm":
	        json = '{"userId":"val1","userNm":"val2"}'; //,"cond":"val3"}';
	        json = json.replaceAll("val1", val1);
	        json = json.replaceAll("val2", val2);
	        //json = json.replaceAll("val3", val3);
		    json = com.getJSON(json);
		    
		    _ids = "";
			$.each(_comps.comp,function(key,value){
				if(key!=0){
					_ids += ",";
				}
				_ids += value.id  ;				
		    });
			com.udc_Comp_set(type,_ids);
			
			ajaxLib.ajax("/cf/CF00050501U/selectTcfUserInfoList", {
			     mode        : "synchronous"
			    ,requestData : json
			    ,callback    : "com.userPopupCallback"      
			    ,errCallback : "com.userPopupErrCallBack"
            });
			
			break;			
	}		
	
};

/**
 * 부서명 찾기시 Callback처리.
 * */
com.deptPopupCallback = function(result, e) {

	// 1건이면 RETURN
	if (result.data.dsTcfDeptList.length == 1 ){
		var compArr = gcm.UDCINFO["DeptSelNm"].split(",")
		var _jsn = result.data.dsTcfDeptList[0];
		
		$w.getComponentById(compArr[0].substring(0,compArr[0].lastIndexOf("_"))).setUserData("pageData",_jsn);
		
		$w.comp[compArr[0]].setValue(_jsn.deptNm);
		$w.comp[compArr[1]].setValue(_jsn.deptCd);

	// 다건인 경우 POPUP호출
	}else{
		var _jsn = JSON.parse(e.requestBody);
		com.udcPopup("DeptPopup",gcm.UDCINFO["DeptSelNm"], _jsn.deptCd, _jsn.deptNm, _jsn.cond);
	}

};
com.deptPopupErrCallBack = function(){

};

/**
 * 현장명 찾기시 Callback처리.
 * */
com.sitePopupCallback = function(result, e) {

	// 1건이면 RETURN
	if (result.data.dsTcmSiteList.length == 1 ){
		var compArr = gcm.UDCINFO["SiteSelNm"].split(",")
		var _jsn = result.data.dsTcmSiteList[0];
		
		$w.getComponentById(compArr[0].substring(0,compArr[0].lastIndexOf("_"))).setUserData("pageData",_jsn);
		
		$w.comp[compArr[0]].setValue(_jsn.siteNm);
		$w.comp[compArr[1]].setValue(_jsn.siteCd);

	// 다건인 경우 POPUP호출
	}else{
		var _jsn = JSON.parse(e.requestBody);
		com.udcPopup("SitePopup",gcm.UDCINFO["SiteSelNm"], _jsn.siteCd, _jsn.siteNm, _jsn.cond);
	}

};
com.sitePopupErrCallBack = function(){

};

/**
 * 거래처명 찾기시 Callback처리.
 * */
com.tradePopupCallback = function(result, e) {

	// 1건이면 RETURN
	if (result.data.dsTcfTradeInfoList.length == 1 ){
		var compArr = gcm.UDCINFO["TradeSelNm"].split(",")
		var _jsn = result.data.dsTcfTradeInfoList[0];
		
		$w.getComponentById(compArr[0].substring(0,compArr[0].lastIndexOf("_"))).setUserData("pageData",_jsn);
		
		$w.comp[compArr[0]].setValue(_jsn.tradeNm);
		$w.comp[compArr[1]].setValue(_jsn.tradeCd);
		$w.comp[compArr[2]].setValue(_jsn.sapTradeCd);

	// 다건인 경우 POPUP호출
	}else{
		var _jsn = JSON.parse(e.requestBody);
		com.udcPopup("TradePopup",gcm.UDCINFO["TradeSelNm"], _jsn.tradeCd, _jsn.tradeNm, _jsn.cond);
	}

};
com.tradePopupErrCallBack = function(){

};

/**
 * 사용자명 찾기시 Callback처리.
 * */
com.userPopupCallback = function(result, e) {
	
	// 1건이면 RETURN
	if (result.data.dsTcfUserInfoList.length == 1 ){
		var compArr = gcm.UDCINFO["UserSelNm"].split(",")
		var _jsn = result.data.dsTcfUserInfoList[0];
		
		$w.getComponentById(compArr[0].substring(0,compArr[0].lastIndexOf("_"))).setUserData("pageData",_jsn);
		
		$w.comp[compArr[0]].setValue(_jsn.userNm);
		$w.comp[compArr[1]].setValue(_jsn.userId);
		$w.comp[compArr[2]].setValue(_jsn.userEmpno);

	// 다건인 경우 POPUP호출
	}else{
		var _jsn = JSON.parse(e.requestBody);
		com.udcPopup("UserPopup",gcm.UDCINFO["UserSelNm"], _jsn.userId, _jsn.userNm, _jsn.cond);
	}

};
com.userPopupErrCallBack = function(){

};

/**
 * 각 UDC팝업 호출처리.
 * */
com.udcPopup = function(type,_comps, val1, val2, val3, val4, val5, val6, val7, val8){
	//
	var popOps = "";
	var _ids   = "";

	switch(type){
		case "AddrPopupApi": //주소검색 팝업Api
			popOps = {
				pid: "AddrPopupApi"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00353001P.xml'
		        ,modal : true		        
				,popup_name:"주소검색"
			    ,widType : "M"
			    ,height : 870
		        ,callbackFn : "com.udcCallbackAddrPopupApi"
		    };
			
			_ids = "";
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);			
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;	

		case "DeptTreePopup":
			popOps = {
				pid: "DeptTreePopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00051000P.xml'
		        //type:"browser"
		        ,modal : true //true || false
		        ,popup_name:"부서(트리) 검색"
		        ,callbackFn : "com.udcCallbackDeptTreePopup"
		        //,width : 600
		        ,widType : "M"
		        ,height : 540
		        ,data : {
		                 deptCd : val1
		                ,deptNm : val2
		                ,cond   : val3
		                }
		    };
			_ids = "";			
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);			
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;	
		case "DeptPopup":
			popOps = {
				pid: "DeptPopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00051001P.xml'
		        //type:"browser"
		        ,modal : true //true || false
		        ,popup_name:"부서 조회"
		        ,callbackFn : "com.udcCallbackDeptPopup"
		        //,width : 600
		        ,widType : "M"
		        ,height : 540
		        ,data : {
		                 deptCd : val1
		                ,deptNm : val2
		                ,cond   : val3
		                }
		    };
			_ids = "";			
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);			
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;	
		case "SitePopup":
			popOps = {
				pid: "SitePopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00051002P.xml'
		        //type:"browser"
		        ,modal : true //true || false
		        ,popup_name:"현장 조회"
		        ,callbackFn : "com.udcCallbackSitePopup"
		        //,width : 600
		        ,widType : "M"
		        ,height : 540
		        ,data : {
		                 siteCd : val1
		                ,siteNm : val2
		                ,cond   : val3
		                }
		    };
			_ids = "";			
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);			
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;	
		case "TradePopup":
			popOps = {
				pid: "TradePopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00300003P.xml'
		        //type:"browser"
		        ,modal : true //true || false
		        ,popup_name:"거래처 검색"
		        ,callbackFn : "com.udcCallbackTradePopup"
		        //,width : 1200
		        ,widType : "XL"
		        ,height : 540
		        ,data : {
	                     tradeCd : val1
	                    ,tradeNm : val2
	                    ,cond    : val3
	                    }
		    };
			_ids = "";
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;
	
		case "UserPopup":
			popOps = {
				pid: "UserPopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00050502P.xml'
		        //type:"browser"
		        ,modal : true //true || false
		        ,popup_name:"사용자 검색"
		        ,callbackFn : "com.udcCallbackUserPopup"
		        ,width : 1400
			    //,widType : "XL"
		        ,height : 540
		        ,data : {
		                 userId : val1
		                ,userNm : val2
		                ,cond   : val3
		                }
		    };
			_ids = "";			
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);			
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;	

		case "AflPopup":
			popOps = {
				pid: "AflPopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00350000P.xml'
		        //type:"browser"
		        ,modal : true //true || false
		        ,popup_name:"첨부파일 관리"
		        ,callbackFn : "com.udcCallbackAflPopup"
		        //,width : 600
		        ,widType : (gcm.POP_CUSTOM_WIDTH_TYPE != "" ? gcm.POP_CUSTOM_WIDTH_TYPE : "M")
		        ,height : 540
		        ,data : {
		                 jobGbCd : val1,
		                 menuId : val2,
		                 aflId : val3,
		                 fileExt : val4,
		                 usage   : val5,
		                 fileLimit : (val6 == undefined ? 0 : val6),
		                 fileCert : val7,
		                 filePathCustom : val8
		                }
		    };
			_ids = "";			
			if(typeof _comps == "string"){
				_ids	= _comps;
			}else{
				$.each(_comps.comp,function(key,value){
					if(key!=0){
						_ids += ",";
					}
					_ids += value.id  ;				
			    });
			}
			com.popup_open(popOps);			
			com.udc_Comp_set(gcm.initWframePopId,_ids);
			break;		

        case "AflImgListPopup":
            popOps = {
                 pid: "AflPopup"+"_" +new Date().getTime()
                ,url:'/ux/cf/CF00350000P.xml'
                ,modal : true
                ,popup_name:"이미지 첨부파일 관리"
                ,callbackFn : "com.udcCallbackAflPopup"
                ,widType : (gcm.POP_CUSTOM_WIDTH_TYPE != "" ? gcm.POP_CUSTOM_WIDTH_TYPE : "M")
                ,height : 540
                ,data : {
                     jobGbCd  : val1,
                     menuId   : val2,
                     aflId    : val3,
                     fileExt  : val4,
                     usage    : val5,
                     fileSize : val6
                }
            };
            _ids = "";          
            if(typeof _comps == "string"){
                _ids    = _comps;
            }else{
                $.each(_comps.comp,function(key,value){
                    if(key!=0){
                        _ids += ",";
                    }
                    _ids += value.id  ;             
                });
            }
            com.popup_open(popOps);         
            com.udc_Comp_set(gcm.initWframePopId,_ids);
            break;			
			
		case "AflImgPopup":
			popOps = {
				 pid: "AflImgPopup"+"_" +new Date().getTime()
		        ,url:'/ux/cf/CF00350003P.xml'
		        ,modal : true
		        ,popup_name:"이미지파일 보기"
		        ,widType : "M"
		        ,height : 600
		        ,data : { imgSrc : val1 }
		    };
			com.popup_open(popOps);			
			break;
	}	
};

/**
 * 각 UDC팝업 호출처리.
 * */
com.udc_Comp_set = function(_udc,_ids){
	gcm.UDCINFO[_udc] = _ids;	
};

/**
 * 주소검색 팝업API callback처리.
 * */
com.udcCallbackAddrPopupApi = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";
	
	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);

	t = $w.comp[_compids[0]];//
	//t.setUserData("pageData",_val);
	t.setValue(_val.addrBasic);
	t = $w.comp[_compids[1]];//
	t.setValue(_val.zipNo);
	t = $w.comp[_compids[2]];//
	t.setValue(_val.addrDetail);	

	gcm.initWframePopId = "";
};

/**
 * 주소검색 팝업 callback처리.
 * */
com.udcCallbackAddrPopup = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";
	
	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);

	t = $w.comp[_compids[0]];//
	//t.setUserData("pageData",_val);
	t.setValue(_val.addrBasic);
	t = $w.comp[_compids[1]];//
	t.setValue(_val.zipNo);
	t = $w.comp[_compids[2]];//
	t.setValue(_val.addrDetail);	

	gcm.initWframePopId = "";
};

/**
 * 부서트리검색 팝업 callback처리.
 * */
com.udcCallbackDeptTreePopup = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";	

	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);
	
	t = $w.comp[_compids[0]];//nm
	//t.setUserData("pageData",_val);
	t.setValue(_val.deptNm);
	t = $w.comp[_compids[1]];//cd
	t.setValue(_val.deptCd);		

	gcm.initWframePopId = "";
};

/**
 * 부서검색 팝업 callback처리.
 * */
com.udcCallbackDeptPopup = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";	
	
	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);

	t = $w.comp[_compids[0]];//nm
	//t.setUserData("pageData",_val);
	t.setValue(_val.deptNm);
	t = $w.comp[_compids[1]];//cd
	t.setValue(_val.deptCd);	

	gcm.initWframePopId = "";
};

/**
 * 현장검색 팝업 callback처리.
 * */
com.udcCallbackSitePopup = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";
	
	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);

	t = $w.comp[_compids[0]];//nm
	//t.setUserData("pageData",_val);
	t.setValue(_val.siteNm);
	t = $w.comp[_compids[1]];//cd
	t.setValue(_val.siteCd);	

	gcm.initWframePopId = "";
};

/**
 * 거래처검색 팝업 callback처리.
 * */
com.udcCallbackTradePopup = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";	
	
	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);

	t = $w.comp[_compids[0]];//tradeNm
	//t.setUserData("pageData",_val);
	t.setValue(_val.tradeNm);
	t = $w.comp[_compids[1]];//tradeCd
	t.setValue(_val.tradeCd);
	t = $w.comp[_compids[2]];//sapTradeCd
	t.setValue(_val.sapTradeCd);

	gcm.initWframePopId = "";
};

/**
 * 사용자검색 팝업 callback처리.
 * */
com.udcCallbackUserPopup = function(_popupId, _val){
	
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";	
	
	$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);
	
	t = $w.comp[_compids[0]];//nm
	t.setValue(_val.userNm);
	t = $w.comp[_compids[1]];//cd
	t.setValue(_val.userId);
    t = $w.comp[_compids[2]];
    t.setValue(_val.userEmpno);
	
	gcm.initWframePopId = "";
};

/**
 * UDC callBack getUserData
 * */
com.getUdcCBAllData = function(udcId){
	
	return $p.getComponentById(udcId).getUserData("pageData"); 
};

/**
 * 첨부파일 팝업 callback처리.
 * */
com.udcCallbackAflPopup = function(_popupId, _val){
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";	
	
	try {$w.getComponentById(_compids[0].substring(0,_compids[0].lastIndexOf("_"))).setUserData("pageData",_val);} catch (e){}

	t = $w.comp[_compids[0]];//nm
	//t.setUserData("pageData",_val);
	// udc의 onchange event를 발생시키기위해 2회 세팅.
	t.setValue("");
	t.setValue(_val.aflId);

	gcm.initWframePopId = "";
	
    try { scwin.udcCallbackAflEx(); } catch (e) { }
	
};

/**
 * 첨부파일(팝업)_드레그방식 호출처리.
 * */
com.udcAflList = function(val1){
    var json = "";
    json = '{"aflId":"val1"}';
    json = json.replaceAll("val1", val1);
    json = com.getJSON(json);

    var rtnVal = ajaxLib.ajax("/cf/CF00350000P/selectTcfAflList", {
	     mode        : "synchronous"
	    ,requestData : json
	    ,callback    : "com.aflListCallback"      
	    ,errCallback : "com.aflListErrCallBack"
   });
    
   return rtnVal.data.dsTcfAflList;
};

/**
 * 첨부파일 단건 호출처리.
 * */
com.udcAflSingle = function(val1){
    var json = "";
    json = '{"aflId":"val1","aflSeq":"1"}';
    json = json.replaceAll("val1", val1);
    json = com.getJSON(json);
    var rtnVal = ajaxLib.ajax("/cf/CF00350000P/selectTcfAfl", {
         mode        : "synchronous"
        ,requestData : json
        ,callback    : "com.aflListCallback"      
        ,errCallback : "com.aflListErrCallBack"
   });
   return rtnVal.data.dsTcfAflMap;
};

/**
 * 첨부파일 단건 호출처리( min(afl_seq)로 조회).
 * */
com.udcAflMinSeqSingle = function(val1){
    var json = "";
    json = '{"aflId":"val1","aflSeq":"1"}';
    json = json.replaceAll("val1", val1);
    json = com.getJSON(json);
    var rtnVal = ajaxLib.ajax("/cf/CF00350000P/selectTcfAflMinSeq", {
         mode        : "synchronous"
        ,requestData : json
        ,callback    : "com.aflListCallback"      
        ,errCallback : "com.aflListErrCallBack"
   });
   return rtnVal.data.dsTcfAflMap;
};

/**
 * 첨부파일(팝업)_드레그방식 호출처리.
 * */
com.aflListCallback = function(result, e) {
//debugger;
	// RETURN :result.data.dsTcfAflList
};

/**
 * 첨부파일(팝업)_드레그방식 Callback처리.
 * */
com.aflListErrCallBack = function(){

};

//첨부파일 리스트 저장.
com.updateAflList = function(JSONParam, JSONList) {
	var rtnVal =  ajaxLib.ajax("/cf/CF00350000P/updateTcfAfl", {
 	    mode : "synchronous"
      , requestData : {param : JSONParam, tcfAflList : JSONList}
      , callback : "updateAflListCallback"
      , errCallback : "updateAflListErrCallBack"
    });
	return rtnVal.data.dsTcfAflMap.aflId;
};

/**
* 첨부파일 리스트 저장_드레그방식 Callback처리.
* */
com.updateAflListCallback = function(result, e) {

};

/**
* 첨부파일 리스트 저장_드레그방식 errorCallback처리.
* */
com.updateAflListErrCallBack = function(){

};

//첨부파일 리스트 삭제.
com.deleteAflList = function(JSONParam, JSONList) {
	var rtnVal =  ajaxLib.ajax("/cf/CF00350000P/deleteTcfAfl", {
 	    mode : "synchronous"
      , requestData : {param : JSONParam, tcfAflList : JSONList}
      , callback : "deleteAflListCallback"
      , errCallback : "deleteAflListErrCallBack"
    });
	return rtnVal.data.SuccesYn;
};

/**
* 첨부파일 리스트 삭제_드레그방식 Callback처리.
* */
com.deleteAflListCallback = function(result, e) {

};

/**
* 첨부파일 리스트 삭제_드레그방식 errorCallback처리.
* */
com.deleteAflListErrCallBack = function(){

};

/**
 * 각 UDC팝업 호출처리후 콜백처리.
 * */
com.udcCallback = function(_popupId, _val){
	
	var _compids = gcm.UDCINFO[_popupId].split(",");
	var t = "";	
	/*
	if(gcm.initWframePopId.indexOf("DeptTreePopup") > -1){		
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.deptNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.deptCd);
	}else if(gcm.initWframePopId.indexOf("TradePopup") > -1){
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.tradeNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.tradeCd);
	}else if(gcm.initWframePopId.indexOf("UserPopup") > -1){
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.userNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.userId);
	}else if(gcm.initWframePopId.indexOf("DeptPopup") > -1){		
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.deptNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.deptCd);
	}else if(gcm.initWframePopId.indexOf("SitePopup") > -1){		
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.siteNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.siteCd);		
	}else{
		console.log("해당사항이 없다.");
	}	
	*/
	var udcType = _compids[1].split($p.id)[1].split("_")[0].toLowerCase();
	
	if(udcType.indexOf("addressinfo") > -1){		
		t = $w.comp[_compids[0]];//
		t.setUserData("pageData",_val);
		t.setValue(_val.addrBasic);
		t = $w.comp[_compids[1]];//
		t.setValue(_val.zipNo);
		t = $w.comp[_compids[2]];//
		t.setValue(_val.addrDetail);	
	}else if(udcType.indexOf("deptinfo") > -1){		
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.deptNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.deptCd);	
	}else if(udcType.indexOf("depttreeinfo") > -1){		
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.deptNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.deptCd);		
	}else if(udcType.indexOf("tradeinfo") > -1){
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.tradeNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.tradeCd);
	}else if(udcType.indexOf("userinfo") > -1){
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.userNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.userId);
	}else if(udcType.indexOf("siteinfo") > -1){		
		t = $w.comp[_compids[0]];//nm
		t.setUserData("pageData",_val);
		t.setValue(_val.siteNm);
		t = $w.comp[_compids[1]];//cd
		t.setValue(_val.siteCd);	
	}else{
		console.log("해당사항이 없다.");
	}
	gcm.initWframePopId = "";
};

/**udc 관련 Function Finish*/
;