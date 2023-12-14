;
/**공통코드 관련 Function Start*/

/**
 * 세션 스토리지에 있는 공통코드 데이터를 상위코드 값이 같은것을 구한다.
 *
 * @memberOf com
 * @param {String}
 *            upperCd 상위코드 필터 값
 * CF00250000U.xml 샘플이 있으면 참조해서 사용하세요            
 */
com.sessionTcfCodeSearch = function(_cd) {//CF035에 해당하는 데이터리스트를 찾아온다.
	/*
	if(com.isEmpty(sessionStorage.getItem("accessToken"))){
		alert("accessToken이 없습니다.\n로그아웃 처리 합니다.");
		com.logOut();
		return false;
	}
	*/
	var dataListOption = _getCodeDataListOptions(gcm.COMMON_CODE_INFO.FILED_ARR);
	
	var dltId = gcm.DATA_PREFIX + _cd;
	if (typeof $w.data[dltId] === "undefined") {//없으면
		dataListOption.id = dltId;
		$w.data.create(dataListOption);  // 동일한 id의 DataCollection이 존재할 경우, 삭제 후 재생성함
		return com.setCompWithDlt( _cd, $w.data[dltId], "", "cdOdr");
	}else{//있으면
		var _dataComp = $w.data[dltId];
		if(_dataComp.getTotalRow() == 0){//있더라도
			//데이터가 없으면 조회를 한번 더 해본다. 이때에는 데이터리스트가 존재하므로 데이터만 넣자.
			return com.setCompWithDlt( _cd, $w.data[dltId], "", "cdOdr");
		}else{
			return _dataComp.getAllJSON();//json 데이터를 리턴한다.
		}
	}
	
	// dataList를 동적으로 생성하기 위한 옵션 정보를 반환한다.	
	function _getCodeDataListOptions(infoArr) {
		var option = {
			"type" : "dataList",
			"option":{ "baseNode": "list", "repeatNode": "map"},
			"columnInfo":[]
		};
		
		for (var idx in infoArr) {
			option.columnInfo.push({ "id" : infoArr[idx] });
		}
		return option;
	};
};

/**
 * 세션 스토리지에 있는 공통코드 데이터를 상위코드 값이 같은것을 구한다.
 *
 * @memberOf com
 * @param {String}
 *            data 세션스토리지 메시지 데이터 리스트
 * @param {String}
 *            upperCd 상위코드 필터 값
 * CF00250000U.xml 샘플이 있으면 참조해서 사용하세요            
 */
com.sessionTcfCodeSearchPooL = function(data, upperCd) {
	var filterRtn = new Array();
	$.each(data,function(key,_data){
		if (_data.upperCd == upperCd) {
			var filterInfo = {};
			filterInfo = _data;
			filterRtn.push(filterInfo);
		}
	});
	return filterRtn;
};

/**
 * 세션 스토리지에 있는 메시지 데이터를 검색 필터에 따라서 원하는것을 구한다.
 *
 * @memberOf com
 * @param {String}
 *            data 세션스토리지 메시지 데이터 리스트 
 * @param {String} 
 *            msgCd 메시지 코드 필터 값 
 * @param {String}
 *            jobGbCd 업무구분코드 필터 값
 * @param {String}
 *            msgTypeCd 메시지 유형코드 필터 값
 */
com.sessionTcfMsgSearch = function(data, msgCd, jobGbCd, msgTypeCd) {
	
	var filterRtn;
	$.each(data,function(key,_data){
		if (_data.msgCd == msgCd) {
			filterRtn = _data.msgCn;
		}			
	});
	return filterRtn;	
};

/**
 * 세션 스토리지에 있는 메시지 데이터를 검색 필터에 따라서 원하는것을 구한다.
 *
 * @memberOf com
 * @param {String}
 *            data 세션스토리지 메시지 데이터 리스트 
 * @param {String} 
 *            msgCd 메시지 코드 필터 값 
 * @param {String}
 *            jobGbCd 업무구분코드 필터 값
 * @param {String}
 *            msgTypeCd 메시지 유형코드 필터 값
 */
com.sessionTcfMsgTypeCdSearch = function(data, msgCd, jobGbCd, msgTypeCd) {
	
	var filterRtn;
	$.each(data,function(key,_data){
		if (_data.msgCd == msgCd) {
			filterRtn = _data.msgTypeCd;
		}			
	});
	return filterRtn;	
};
/**
 * 메모리에 올려져있는 공통코드 목록을 조회후 대상 datalist 에 settting 합니다. 
 * tcfCodeList
 */
com.setComCodeDs = function( _code, _dsObj, _callback, _key){

	gcm[_key] = gcm[_key] ||  JSON.parse(sessionStorage.getItem(_key));
	//gcm.tcfCodeList
	if(com.isEmpty(gcm[_key])){//없으면 담아온다..
		/*
		if(com.isEmpty(sessionStorage.getItem("accessToken"))){
			alert("accessToken이 없습니다.\n로그아웃 처리 합니다.");
			return false;
		}else{
			alert("accessToken이 있습니다.\n데이터를 조회 해옵니다 -개발중-");
		}
		*/
	}
	
	var filterRtn = new Array();
	$.each(gcm[_key],function(key,_data){
		if (_data.upperCd == _code) {
			var filterInfo = {};
			filterInfo = _data;
			//filterInfo.cd = _data.cd.replaceAll(_code, "");
			filterRtn.push(filterInfo);
		}
	});	
	
	//_dsObj check
	if(com.isEmpty(_dsObj)){
		alert("적용할 데이터객체가 없습니다.");
		return false;
	}else{
		_dsObj.setJSON(filterRtn);
	}
	
	if (typeof _callback === "function") {
		_callback();
	}	
};

/**
* 공통코드Ds
*/
com.setCodeDs = function( type, _code, _dsObj, _callback){	
	com.setComCodeDs( _code, _dsObj, _callback, gcm.CD_KEY[type]);
};

/**
* [Pool] 공통코드 CodeDetailPool
*/
com.setCDPool = function( _code, _dsObj, _callback){	
	com.setCodeDs( "Pool", _code, _dsObj, _callback);
			
};
/**
* [일반]공통코드 CodeList
*/
com.setCDList = function( _code, _dsObj, _callback){
	
	com.setCodeDs( "Code", _code, _dsObj, _callback);
};
/**
* [부서] 공통코드 DeptList
*/
com.setDeptList = function( _code, _dsObj, _callback){
	com.setCodeDs( "Dept", _code, _dsObj, _callback);
};
/**
* [메시지] 공통코드 MsgInfo
*/
com.setMsgList = function( _code, _dsObj, _callback){
	com.setCodeDs( "Msg", _code, _dsObj, _callback);
};

/**
* [일반]공통코드 selCdList
*  1. sfCallback : callback함수명
*  2. upperCd : 상위코드
*  3. cdLv : 코드레벨
*  4. useYn : 사용여부
*  5. epntYn : 말단여부
*/
com.getCdLvData = function(sfCallback, upperCd, cdLv, useYn, epntYn) {
	var json = {
			 "upperCd":upperCd
			,"cdLv":cdLv
			,"useYn":useYn
			,"epntYn":epntYn
			};
	json = com.getJSON(json);

	ajaxLib.ajax("/cf/CF00000002U/selectCdLevelList", {
	     mode        : "synchronous"
	    ,requestData : json
	    ,callback    : sfCallback     
	    ,errCallback : "com.cdLvListErrCallBack"
   });
};
com.cdLvListErrCallBack = function(){
	
};

/**
[일반]공통코드 CodeList 가변
 1. obj : setting Object Id
 2. codeOptions : SQL where Option or Object cd, cdNm Setting 
     codeOptions = [
         cd: sql where 조건의 cd in 조건 --> ex) 'CM00401302', 'CM00401303' ,
         upperCd: sql where 조건의 upperCd, 
         useYn: sql where 조건의 useYn,
         epntYn: sql where 조건의 epntYn,
         charValN1: sql where 조건의 charValN1,
         charValN2: sql where 조건의 charValN2,
         charValN3: sql where 조건의 charValN3,
         charValN4: sql where 조건의 charValN4,
         charValN5: sql where 조건의 charValN5,
         nmbrValN1: sql where 조건의 nmbrValN1,
         nmbrValN2: sql where 조건의 nmbrValN2,
         nmbrValN3: sql where 조건의 nmbrValN3,
         nmbrValN4: sql where 조건의 nmbrValN4,
         nmbrValN5: sql where 조건의 nmbrValN5,
         setCd: object 셋팅할 Cd (default : cd),
         setNm: object 셋팅할 Name (default : cdNm)
         blankLineAddYn: cd, nm 이 없는 빈 row 추가 여부
         allLineAddYn: 전체 row 추가 여부 (cd 값은 없고 '전체' 명칭 부여) 
     ];  
 3. callback : 셋팅 후 처리로직 추가
               string 이나 function 지원    
               ex)  "scwin.fnButtonControl"  --> string 경우
                   function(){               --> function 경우
                       //로직..
                   }    
                        
  
 Call ex)    
          com.selCdListVrbl( "sbxItexpGb", {
              upperCd: "CM004100",
              setCd: "cd",       -->   default 는 없으면 cd 다른 값이 필요하면 다른 컬럼.
              cd: "'CM00401302','CM00401303','CM00401304','CM00401305'" --> cd 에 in 조건으로 필요한 경우.
          });              
*/
com.selCdListVrbl = function(obj, codeOptions, callback){

    var defaults = {useYn: "Y", setCd: "cd", setNm: "cdNm"};
    codeOptions = $.extend({}, defaults, codeOptions || {});
        
    ajaxLib.ajax("/cf/CF00000002U/selectCdList", {
        requestData: codeOptions,
        callback: function(res){
            var strRslt = res.data.dsCdList;    
            var dltId = "dst_Temp" + parseInt(Math.random()*10000,10);
            com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성                        
            var _dataObj = $w.getComponentById(dltId);            
            
            //전체 row  추가 
            if (codeOptions.allLineAddYn == "Y"){	
            	_dataObj.setJSON([{cd: "", cdNm: "전체"}] , true);
            }           
            
            if (codeOptions.blankLineAddYn == "Y"){	//cd,nm 이 없는 row 추가.
            	_dataObj.insertRow();  
            }                        
            _dataObj.setJSON(strRslt, "true");
                        
            var _idArr = obj.split(":");
            if(_idArr.length === 1){
                com.tempId = $p.getFrame().getObj(_idArr[0]).id;
            }else{
                com.tempId = $p.getFrame().getObj(_idArr[0]).id+":" + _idArr[1];
            }            
            
            var tmpIdArr = com.tempId.split(":");
            // 기본 컴포넌트에 대한 Node Setting 설정
            if (tmpIdArr.length === 1) {
                var comp = $p.getComponentById(tmpIdArr[0]);
                
                comp.setNodeSet("data:" + dltId, codeOptions.setNm, codeOptions.setCd);
            // gridView 컴포넌트에 대한 Node Setting 설정
            } else {
                var gridObj = $p.getComponentById(tmpIdArr[0]);                
                gridObj.setColumnNodeSet(tmpIdArr[1], "data:" + dltId, codeOptions.setNm, codeOptions.setCd);
            } 
            
            //callback 
            if (typeof callback === "function") {
                callback();
            } else if (typeof callback === "string") {
                var arg = com.$w; 
                var _key = callback.split(".")[0] == "com"? "com" : "scwin";
                var _cb = callback.replace(_key,"").replaceAll(".","");                       
                var _tmp = arg.getFrame().getObj(_key);
                var callbacktmp = _tmp[_cb];  
                
                if (callbacktmp && typeof callbacktmp == "function") {
                    callbacktmp();
                }                   
            }
            
        },      
        errCallback: ""
    });
};

/**
 * [일반]공통코드 CodeList 가변을 DataCollection에 받는다
 *
 * @memberOf com
 * @param {String}
 1. codeOptions : SQL where Option or Object cd, cdNm Setting 
     codeOptions = [
         cd: sql where 조건의 cd in 조건 --> ex) 'CM00401302', 'CM00401303' ,
         upperCd: sql where 조건의 upperCd, 
         useYn: sql where 조건의 useYn,
         epntYn: sql where 조건의 epntYn,
         charValN1: sql where 조건의 charValN1,
         charValN2: sql where 조건의 charValN2,
         charValN3: sql where 조건의 charValN3,
         charValN4: sql where 조건의 charValN4,
         charValN5: sql where 조건의 charValN5,
         nmbrValN1: sql where 조건의 nmbrValN1,
         nmbrValN2: sql where 조건의 nmbrValN2,
         nmbrValN3: sql where 조건의 nmbrValN3,
         nmbrValN4: sql where 조건의 nmbrValN4,
         nmbrValN5: sql where 조건의 nmbrValN5,
         setCd: object 셋팅할 Cd (default : cd),
         setNm: object 셋팅할 Name (default : cdNm)
         
         ajaxMode : 데이터 요청시 동기 비동기값
     ]; 
 2. callback : 셋팅 후 처리로직 추가
               string 이나 function 지원    
               ex)  "scwin.fnButtonControl"  --> string 경우
 */
com.selTcfCodeSearchOption = function(codeOptions, afCallback) {
	
    var defaults = {useYn: "Y", setCd: "cd", setNm: "cdNm"};
    codeOptions = $.extend({}, defaults, codeOptions || {});

    var ajaxJson = {
       "requestData" : codeOptions,
       "callback" : afCallback,      
       "errCallback" : ""	
    };
    
    /** 데이터 요청시 동기(synchronous)/비동기(asynchronous) 여부 추가 default 비동기 **/
    if (codeOptions["ajaxMode"] != null) {
    	ajaxJson["mode"] = codeOptions["ajaxMode"];
    }
    
    ajaxLib.ajax("/cf/CF00000002U/selectCdList", ajaxJson);
};

/**
* [일반]공통코드 selDtlCdList
*  1. uppperCd : 상위코드 
*/
com.selDtlCdList = function( obj ,upperCd, useYn, epntYn, 
		                   charValN1, charValN2, charValN3, charValN4, charValN5,
		                   nmbrValN1, nmbrValN2, nmbrValN3, nmbrValN4, nmbrValN5 ) {
	var json = {
			 "upperCd":upperCd
			,"useYn":useYn
			,"epntYn":epntYn
			,"charValN1":charValN1,"charValN2":charValN2,"charValN3":charValN3,"charValN4":charValN4,"charValN5":charValN5
			,"nmbrValN1":nmbrValN1,"nmbrValN2":nmbrValN2,"nmbrValN3":nmbrValN3,"nmbrValN4":nmbrValN4,"nmbrValN5":nmbrValN5   
			};
	json = com.getJSON(json);
	
	var _idArr = obj.split(":");
	if(_idArr.length === 1){
		com.tempId = $p.getFrame().getObj(_idArr[0]).id;
	}else{
		com.tempId = $p.getFrame().getObj(_idArr[0]).id+":" + _idArr[1];
	}
	ajaxLib.ajax("/cf/CF00000002U/selectDtlCdList", {
	     mode        : "synchronous"
	    ,requestData : json
	    ,callback    : "com.dtlCdListCallback"      
	    ,errCallback : "com.dtlCdListErrCallBack"
   });
}; 
com.dtlCdListCallback = function(res){
	var strRslt = res.data.dsDtlCdList;	
	var dltId = "dst_Temp" + parseInt(Math.random()*10000,10);
	com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성
	var _dataObj = $w.getComponentById(dltId);
	
	_dataObj.setJSON(strRslt);	
	var tmpIdArr = com.tempId.split(":");
	// 기본 컴포넌트에 대한 Node Setting 설정
	if (tmpIdArr.length === 1) {
		var comp = $p.getComponentById(tmpIdArr[0]);
		
		comp.setNodeSet("data:" + dltId, "cdNm", "cd");
	// gridView 컴포넌트에 대한 Node Setting 설정
	} else {
		var gridObj = $p.getComponentById(tmpIdArr[0]);
		
		gridObj.setColumnNodeSet(tmpIdArr[1], "data:" + dltId, "cdNm", "cd");
	}		
};
com.dtlCdListErrCallBack = function(){
	
};


/**
* [일반]공통코드 selCdList
*  1. uppperCd : 상위코드 
*/
com.selCdList = function( obj ,upperCd, useYn, epntYn, 
		                   charValN1, charValN2, charValN3, charValN4, charValN5,
		                   nmbrValN1, nmbrValN2, nmbrValN3, nmbrValN4, nmbrValN5 ) {
	var json = {
			 "upperCd":upperCd
			,"useYn":useYn
			,"epntYn":epntYn
			,"charValN1":charValN1,"charValN2":charValN2,"charValN3":charValN3,"charValN4":charValN4,"charValN5":charValN5
			,"nmbrValN1":nmbrValN1,"nmbrValN2":nmbrValN2,"nmbrValN3":nmbrValN3,"nmbrValN4":nmbrValN4,"nmbrValN5":nmbrValN5   
			};
	json = com.getJSON(json);
	
	var _idArr = obj.split(":");
	if(_idArr.length === 1){
		com.tempId = $p.getFrame().getObj(_idArr[0]).id;
	}else{
		com.tempId = $p.getFrame().getObj(_idArr[0]).id+":" + _idArr[1];
	}
	ajaxLib.ajax("/cf/CF00000002U/selectCdList", {
	     mode        : "synchronous"
	    ,requestData : json
	    ,callback    : "com.cdListCallback"      
	    ,errCallback : "com.cdListErrCallBack"
   });
}; 
com.cdListCallback = function(res){
	var strRslt = res.data.dsCdList;	
	var dltId = "dst_Temp" + parseInt(Math.random()*10000,10);
	com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성
	var _dataObj = $w.getComponentById(dltId);
	
	_dataObj.setJSON(strRslt);	
	var tmpIdArr = com.tempId.split(":");
	// 기본 컴포넌트에 대한 Node Setting 설정
	if (tmpIdArr.length === 1) {
		var comp = $p.getComponentById(tmpIdArr[0]);
		
		comp.setNodeSet("data:" + dltId, "cdNm", "cd");
	// gridView 컴포넌트에 대한 Node Setting 설정
	} else {
		var gridObj = $p.getComponentById(tmpIdArr[0]);
		
		gridObj.setColumnNodeSet(tmpIdArr[1], "data:" + dltId, "cdNm",  "cd");
	}		
};
com.cdListErrCallBack = function(){
	
};

/**
* [일반]공통코드 CodeList selectBox,gridview:Selectbox set..
*  1. _code : 전달받은 _code값으로 전역 데이터리스트를 생성한다. 
*  2. _compArr : _code를 셋팅할 _compArr id 정보
*  var obj = [
*  				{ codekey:["comp1","comp2","comp3"..]},
*  				{ codekey2:["comp4","comp5","comp6"..]},
*  				{ codekey3:["comp7","grdcomp1:column1","grdcomp2:column2"..]},...
*             ]; 
*/
com.setCdComp = function(codeOptions, callbackFunc, chkCdOdr) {	
	var codeOptionsLen = 0;
	if (codeOptions) {
		codeOptionsLen = codeOptions.length;
	} else {
		alert("적용할 데이터가 없습니다.");
		return;
	}	
	var i, j, dltId, paramCode = "", compArr, compArrLen, tmpIdArr;
	var dataListOption = _getCodeDataListOptions(gcm.COMMON_CODE_INFO.FILED_ARR);	
	$.each(codeOptions,function(key1,_codeObj){
		$.each(_codeObj,function(_cd,_compArr){
			dltId = gcm.DATA_PREFIX + _cd;
			if (typeof $w.data[dltId] === "undefined") {
				if (i > 0) {
					paramCode += ",";
				}
				paramCode += _cd;
				dataListOption.id = dltId;
				$w.data.create(dataListOption);  // 동일한 id의 DataCollection이 존재할 경우, 삭제 후 재생성함
				if( chkCdOdr ) {
					com.setCompWithDlt( _cd, $w.data[dltId], "", "cdOdr");
				} else {
					com.setCompWithDlt( _cd, $w.data[dltId]);
				}
			} else {
				//있는경우...gcm[dltId]
				//실제 데이터가 있는지 recheck
				var _dataComp = $w.data[dltId];
				if(_dataComp.getTotalRow() == 0){
					//데이터가 없으면 조회를 한번 더 해본다. 이때에는 데이터리스트가 존재하므로 데이터만 넣자.
					if( chkCdOdr ) {
						com.setCompWithDlt( _cd, $w.data[dltId], "", "cdOdr");
					} else {
						com.setCompWithDlt( _cd, $w.data[dltId]);
					}
				}
			}
			
			if (_compArr) {
				compArr = _compArr;
				compArrLen = compArr.length;
				$.each(_compArr,function(_k,_v){
					tmpIdArr = _v.split(":");
					// 기본 컴포넌트에 대한 Node Setting 설정
					if (tmpIdArr.length === 1) {
						var comp = $p.getComponentById(tmpIdArr[0]);
						comp.setNodeSet("data:" + dltId, gcm.COMMON_CODE_INFO.LABEL, gcm.COMMON_CODE_INFO.VALUE);
					// gridView 컴포넌트에 대한 Node Setting 설정
					} else {
						var gridObj = $p.getComponentById(tmpIdArr[0]);
						gridObj.setColumnNodeSet(tmpIdArr[1], "data:" + dltId, gcm.COMMON_CODE_INFO.LABEL, gcm.COMMON_CODE_INFO.VALUE);
					}					
				});
			}
			
			
			
		});//end each
	});//end each
	
	if (typeof callbackFunc === "function") {
		callbackFunc();
	}
	// dataList를 동적으로 생성하기 위한 옵션 정보를 반환한다.
	function _getCodeDataListOptions(infoArr) {
		var option = {
			"type" : "dataList",
			"option":{ "baseNode": "list", "repeatNode": "map"},
			"columnInfo":[]
		};
		
		for (var idx in infoArr) {
			option.columnInfo.push({ "id" : infoArr[idx] });
		}
		return option;
	};
};

/*
 * 데이터리스트가 없는경우에 들어옴
 * */
com.setCompWithDlt = function( _code, _dsObj, _key, _chkCdOdr){
/*
if(com.isEmpty(sessionStorage.getItem("accessToken"))){
	alert("accessToken이 없습니다.\n로그아웃 처리 합니다.");
	com.logOut();
	return false;
}else{
*/
	com.createDataObj("dataMap", "dsConCd", [ "upperCd" , "cdOdr" , "etc"]);
	var _dmObj = $w.getComponentById("dsConCd");
	_dmObj.set("upperCd",_code);
    _dmObj.set("cdOdr",_chkCdOdr);
	_dmObj.set("etc",_dsObj.id +":"+_key);

	var rtn = ajaxLib.ajax("/cf/CFCommon/selectTcfCodeList", {
			mode : "synchronous"
		, requestData : _dmObj.getJSON()
        , callback : "com.setCdGlobalCb"
        , errCallback : "com.setCdGlobalErr"
	});	
	_dsObj.setJSON(rtn.data.tcfCodeList);
	return rtn.data.tcfCodeList;
//}		
};
com.setCdGlobalCb = function(res,e){
	
	var _compInfo = JSON.parse(e.requestBody);
	var _infoArr = _compInfo.etc.split(":");
	var _compId = _infoArr[0];
	var _key = _infoArr[1];
	var _dataComp = $w.getComponentById(_compId);
	_dataComp.setJSON(res.data.tcfCodeList);
	
};
com.setCdGlobalErr = function(){
	
};

/**공통코드 관련 Function Finish*/
;