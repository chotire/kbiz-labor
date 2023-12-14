/**
 * 1. csCom 은 업무별로 정의하시면 되겠습니다.
 * 2. 이하 구현하신 함수를 cmn.js의 함수명과 동일한경우 overriding합니다.

 * 하자 Scope에서 공유되는 전역 변수, 상수, 공통 함수를 정의한다.
 * 
 * @version 1.0
 * @author 이미연  
 * @type saCom
 * @class saCom
 * @namespace gcmsaCom
 */
var saCom = {};//saCom 은 업무별로 정의하시면 되겠습니다.

var callBackInfo = {};	//콜백정보

var callBackStr = "";	//콜백 텍스트

saCom.initFunction = function(){
	console.log("over riding ");
};

/**
 * 영업 거래처 검색 팝업을 오픈한다.
 *
 * @date 2019.03.11
 * @author 이미연  
 * @example
 * 	var popupInfo = {
 * 		vendrNm  : ""
 *    ,	callback : "schSlTrade_callback"
 *  };
    saCom.openSlTrade(popupInfo);
 */
saCom.openSlTrade = function (popupInfo) {
	var popOps = {
			popup_name:"업체검색"
          , url:"/ux/sa/sacomm/schSlTradePop.xml"
          , widType:"L"
          , height:"540"
          , data : { 
        	   vendrNm : (WebSquare.util.isNull(popupInfo.vendrNm) ? "" : popupInfo.vendrNm) 
          	}
          , callbackFn : popupInfo.callback
        };
	
	com.popup_open(popOps);		
};

/**
 * 숫자입력값의 길이를 제한한다.
 *
 * @date 2019.03.14
 * @author 송병기 (tpsbk)
 * @memberOf saCom
 * @memberOf saCom
 * @param {String}
 *            value 컨트롤의 입력값
 * @param {String}
 *            ctrlId 컨트롤의 id
 *
 * inputType=number의 validator로 지정할 수 있는 이벤트 핸들러.
 * 컨트롤의 userData1 속성에 "정수부최대입력길이.소수부최대입력길이"의 형식으로 입력길이를 지정하면 입력길이가 초과되는 것을 방지해준다.
 * 입력길이 지정형식의 예: 5(정수부만 5자리, 소수부 입력불가), 3.2(정수부 3자리, 소수부 2자리), 0.2(정수부 입력불가, 소수부 2자리)
 */
saCom.validateNumberLength = function (value, ctrlId) {
	var resultValue = value;	//반환값
	var ctrl = $p.getComponentById(ctrlId);
	
	if (ctrl && ctrl.getUserData) {	//input 컨트롤일 경우
		var maxLengthInfo = ctrl.getUserData("userData1");
		if (maxLengthInfo) {	//input 컨트롤의 userData1이 존재할 경우
			var maxLength = maxLengthInfo.split(".");
			var integerMaxLength = Number(maxLength[0]),	//정수부 자릿수
				decimalMaxLength = maxLength.length > 1 ? Number(maxLength[1]) : 0;	//소수부 자릿수
				
			var testValue = value.split("."),
				minus = false;
			if (testValue.length) {
				if (testValue[0].length && testValue[0].charAt(0) == '-') {
					minus = true;
					testValue[0] = testValue[0].substring(1);
				}
				if (testValue[0].length > integerMaxLength) {	//정수부 길이 검사
					testValue[0] = integerMaxLength == 0 ? "0" : testValue[0].substring(0, integerMaxLength);
				}
				
				if (testValue.length > 1) {	//소수부 길이 검사
					if (decimalMaxLength == 0) {
						testValue[1] = "";
					} else {
						if (testValue[1].length > decimalMaxLength) {
							testValue[1] = testValue[1].substring(0, decimalMaxLength);
						}
						testValue[1] = "." + testValue[1]; 
					}
				}
				
				resultValue = testValue[0];
				if (testValue.length > 1) {
					resultValue += testValue[1]; 
				}
				
				if (minus) {
					resultValue = "-" + resultValue;
				}
			}
		}
	}

	return resultValue;
};

/**
 * 영업 공통코드 중 사업구분 리스트를 조회한다.
 *
 * @date 2019.03.18
 * @author 이미연  
 * @example
 *  saCom.selectBzpjGbCd();
 */
saCom.selectBzpjGbCd = function () {
    ajaxLib.ajax("/sa/sacomm/selectBzpjGbCdList", {
	    mode        : "synchronous"
	  , requestData : {}
	  , errCallback : "saCom.fnErrCallBack"                    
	  , callback    : function (result, e) {
		  callBackInfo = result.data.bzpjGbCdList;
	  }      
    });
    
    return callBackInfo;
};

/**
 * 팀장정보를 조회한다.
 *
 * @date 2019.09.19
 * @author 이미연  
 * @example
 *  saCom.getDpldrInfoHead();
 */
saCom.getDpldrInfoHead = function () {
	var rslt
	
	ajaxLib.ajax("/sa/sacomm/selectDpldrInfoHead", {
		mode        : "synchronous", 
		requestData : {}, 
		errCallback : "saCom.fnErrCallBack", 
		callback    : function (result, e) {
			rslt = result.data.dsDpldrInfo;
			
			if (rslt == null) {
				rslt = {"dpldrEmpno" : sessionStorage.userEmpno, "userNm" : sessionStorage.userNm}
			}
		}      
	});
	
	return rslt;
};

/**
 * 현장소장정보를 조회한다.
 *
 * @date 2019.09.19
 * @author 이미연  
 * @example
 *  saCom.getDpldrInfoSite('111111');
 */
saCom.getDpldrInfoSite = function (pjtId) {
	var rslt;
	
	ajaxLib.ajax("/sa/sacomm/selectDpldrInfoSite", {
		mode        : "synchronous", 
		requestData : {"pjtId" : pjtId}, 
		errCallback : "saCom.fnErrCallBack", 
		callback    : function (result, e) {
			rslt = result.data.dsDpldrInfo;
			
			if (rslt == null) {
				rslt = {"stafEmpno" : sessionStorage.userEmpno, "userNm" : sessionStorage.userNm}
			}
		}      
	});

	return rslt;
};

/**
 * 영업 프로젝트 담당자 여부를 가져온다
 *
 * @date 2019.06.28
 * @author 이미연  
 * @example
 *  saCom.getPjtMngYn("111111");
 */
saCom.getPjtMngYn = function (pjtId) {
	var authYn = "N";
	ajaxLib.ajax("/sa/sacomm/selectAuthAtPjt", {
		  mode        : "synchronous"
		, requestData : { "pjtid" : pjtId }
	    , errCallback : "saCom.fnErrCallBack"                    
		, callback    : function (result, e) {
			authYn = result.data.dsAuthInfo != null ? result.data.dsAuthInfo.authYn : "N";
		}      
	});
	
	return authYn;
};

saCom.fnErrCallBack = function(result, e) {
	console.log("error has occured!!");
};

/* gridView 동적 적용 start */
/**
 * 동적 그리드 생성/스타일 변경
 * 기본적인 정보를 통해 그리드를 동적으로 생성하거나 스타일을 변경합니다.
 *
 * @date 2019. 03. 29.
 * @param {Array} gridOptionsArr JSONArray  형태로 데이터 동적 그리드생성및 스타일변경할 데이터 구조체
 * @param {String=} gridOptionsArr.id 그리드ID
 * @param {String=} gridOptionsArr.ref 참조할 데이터리스트
 * @param {String=} gridOptionsArr.dynamicData 동적그리드에 세팅할 정보가 들어있는 데이터리스트
 * @param {String=} gridOptionsArr.headerElement ref에서 헤더로 지정할 컬럼정보 JSON
 * @param {String=} gridOptionsArr.staticColElement 고정된 컬럼정보 JSON
 * @param {String=} gridOptionsArr.type 플래그 "C":새로생성,"R":기존 그리드의 스타일변경
 * @param {String=} gridOptionsArr.parentObj type="C"인경우 생성될 그리드의 부모,"R"인경우 없어도무관
 * @param {String=} gridOptionsArr.useFooterYn footer 적용여부
 * @param {String=} gridOptionsArr.useSubTotalYn subtotal 적용여부
 * @param {String=} gridOptionsArr.style 그리드에 적용할 스타일
 *
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var gridViewInfo = [{ //gridview동적생성
 *       id:"grd_Create"
 *       , ref:"dlt_Create"
 *       , dynamicData : "dynamicdataList"
 *       , headerElement : [{"id" : "", value : "", }]
 *       , staticColElement : [{"id" : "", value : "", }]
 *       , style:"width: 500px;height: 150px;" //
 *       , type:"R"
 *       , parentObj :""
 *       , useFooterYn:"Y"
 *       , useSubTotalYn : "Y"
 *  },...]
 * com.createGridView(gridViewInfo);
 *
 */
saCom.createGridView = function(gridOptionsArr, grd_Obj){
    if(com.isEmpty(gridOptionsArr) || gridOptionsArr.length == 0){
        //console.log(com.getPrintTime()+"[common.js][com.createGridView] 생성할 그리드 정보가 없습니다.");
        return;
    }
    
    for(var key in gridOptionsArr){
        if(!gridOptionsArr.hasOwnProperty(key)) continue;
        var gridObj = gridOptionsArr[key];
        var subTotalYn = gridObj.useSubTotalYn || "N";
        var footerYn   = gridObj.useFooterYn || "N";        
        var grdStrObj  = this.grdHeaderBodyStr(gridObj.dynamicData, gridObj.headerElement, gridObj.staticColElement, subTotalYn, footerYn);
        var subgridObj = {
                  id : gridObj.id
                , ref:gridObj.ref
                , style:gridObj.style
                , headerStr :grdStrObj.strH
                , bodyStr:grdStrObj.strB
                , subTotalStr:grdStrObj.strS
                , footerStr:grdStrObj.strF
                , event : gridObj.event || null
                , apt:gridObj.apt || false
        }
        var gridStr = saCom.getGridViewSrc(subgridObj);
        
        gridObj.type = gridObj.type || "R";
        if(gridObj.type == "R"){
            grd_Obj.setGridStyle(WebSquare.xml.parse( gridStr , true ));
        }else{
            //console.log(com.getPrintTime()+"[common.js][com.createGridView] 타입이 지정되어있지않습니다.");
        }
    }
};

/**
 * 데이터리스트로부터 그리드에 적용할 header/body string정보 얻어오기
 *
 * @private
 * @param {JSON} dl_info 데이터 정보
 * @param {String=} dl_info.id 데이터리스트 아이디
 * @param {String=} dl_info.type 그리드의 헤더셀의 값을 결정한다. default:"name" "id"
 * @date 2019. 03. 29.
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * dl_info : dataList
 * headerElement : [{"id" : "", "value" : "", align : "", width : ""}…]
 * staticColElement : [{"id" : "", "value" : "", align : "", width : ""}…]
 * 
 *                
 * com.grdHeaderBodyStr(dl_id,colTpJsn);
 */
saCom.grdHeaderBodyStr = function(refId, headerElement, staticColElement, useSubTotalYn, useFooterYn) {
    var rtnObj = {strH:"", strB:"", strS:"", strF:""};
    var dlObj = com.isEmpty(refId) ? [] : $p.data.get("JSON", [refId], {"singleMode":true});
            
    //데이터리스트 기준으로 컬럼을 만든다.
    /* JSON 생성
		1. 헤더가 될 데이터 리스트 명
		2. 헤더 ID, VALUE구성으로 JSON으로 받기
		[{"id" : "", "value" : "", align : "", width : "", usePtnYn : "Y", "concatOpt" : ""}...] => 이 파라미터를 바탕으로 헤더 로우 구성
		- id(헤더ID에 사용할 컬럼)
		- value(헤더 텍스트로 보여줄 컬럼)
		- usePtnYn(실 컬럼으로 사용할건지의 여부, 컬럼 생성시 실 컬럼으로 사용)
		- width 열 너비
		- align 정렬방식
        - dataType : 데이터 타입
		- concatOpt : 실 컬럼id 조합 옵션("I" : rowIndex를 붙임 기본값으로 지정, "N" : 헤더 데이터 리스트에 있는 값을 붙임)
		
		3. 고정적으로 표시할 헤더 JSON(옵션)
		  ex) [{"colId" : "", type : "", width : "", align : "", readonly : ""}, ...]
     * */
    var gridHeader = '<w2:header id="header1" style="">';
    var gridBody = '<w2:gBody id="gBody1" style="">'
                    +'<w2:row id="row' + (headerElement.length+1) +'" style="">';
    var gridFooter = (useFooterYn == "Y") ? '<w2:footer style="" id="footer1">' +'<w2:row id="row' + (headerElement.length+3) +'" style="">' : '';
    
    var _realid = '';
    var _concatOpt = '';  
    var staticgridH = '';
    var staticgridB = '';
    var staticgridF = '';
    
    for (var k = 0; k < staticColElement.length; k++) {
    	var staticEle = staticColElement[k];
    	staticgridH += '<w2:column blockSelect="false" style="height:' + WebSquare.util.parseInt(staticEle.rowSpan, 1) * 20 + 'px"';
    	staticgridB += '<w2:column blockSelect="false" style="height:20px"';
    	staticgridF += (useFooterYn == "Y") ? '<w2:column blockSelect="false" style="height:33px"' : '';
    	
        $.each(staticEle, function(key, value) {
        	staticgridH +=  ' ' + ((key == "textAlign") ? 'textAlign="center"' 
        			                                    : ((key != "footerValue") ? key + '="' + value + '"' : ''));

            if(key != "value" && key != "rowSpan") {
                if (key == "dataType" && value == "number") {
                	staticgridB += (staticEle.textAlign != undefined ? '' : ' textAlign="right" ') + key + '="' + value + '"';
                	staticgridF += (useFooterYn == "Y") ? ((staticEle.textAlign != undefined ? '' : ' textAlign="right" ') + key + '="' + value + '"') : '';
                } else if (key == "footerValue") {
            		staticgridF += (useFooterYn == "Y") ? ' value="' + value + '"' : '';
                } else if (key == "expression") {
                	staticgridF += (useFooterYn == "Y") ?  ' inputType="expression" expression="' + value.toLowerCase() + '(\'' +staticEle.id + '\')"': '';
                } else {
	            	staticgridB += ' ' + key + '="' + value + '"';
	        		staticgridF += (useFooterYn == "Y") ? ' ' + key + '="' + value + '"' : '';
                }
            } 
        }); 
        
        staticgridH += '></w2:column>';         	
        staticgridB += '></w2:column>';
		staticgridF += (useFooterYn == "Y") ? '></w2:column>' : '' ;
    }
    
    //동적컬럼 데이터가 있을 경우 적용
    if(!com.isEmpty(dlObj)){
	    for (var i = 0; i < headerElement.length; i++) {
	        var _element = headerElement[i];
	        _concatOpt = (_element.usePtnYn == "Y" ) ? _element.concatOpt || "I" : "I";
	        gridHeader += '<w2:row id="row' + (i+1) + '" style="">';
	        if(i == 0) {
	        	gridHeader += staticgridH;
	        	gridBody += staticgridB;
	        	gridFooter += (useFooterYn == "Y") ? staticgridF : '';
	        }
        
	        for (var j = 0; j < dlObj.length; j++) {
	        	//컬럼명 패턴 지정
	            _realid = _element.id + ((_concatOpt == "I") ? j : dlObj[j][_element.id]);
	            
	            //헤더, 본문 string 세팅, body string은 실제 바인딩할 컬럼에 한해서만 세팅
	            gridHeader += '<w2:column blockSelect="false" style="height:20px"';
	            gridBody += (_element.usePtnYn == "Y") ? '<w2:column blockSelect="false" style="height:20px"' : '';
	            gridFooter += (useFooterYn == "Y") ? ((_element.usePtnYn == "Y") ? '<w2:column blockSelect="false" style="height:33px"' : '') : '';
	            
		        $.each(_element, function(key, value) {
		        	//json의 key에서 usePtnYn, concatOpt을 제외하고 세팅
		            if (key != "usePtnYn" && key != "concatOpt" && key != "displayFormat" && key != "textAlign") {
			            //value는 헤더에 표시할 값으로만 세팅
			            if (key == "value") {
			            	gridHeader += ' value="' + dlObj[j][_element.value] + '"';
			            } else {	            	
		                    gridHeader += (key == "id") 
		                                  ? ' id="' + 'h' + (_element.usePtnYn == "Y" ? _realid : "column" + j)  + '"' 
		                                  : ' ' + key + '="' + value + '"';
			            }
	                }
		            
		            //실제 바인딩할 컬럼인 경우에만 body string에 세팅
		            if (_element.usePtnYn == "Y"){
		                if (key != "usePtnYn" && value != "Y") {
		                    if(key != "value" && key != "rowSpan") {
			                    if (key == "dataType" && value == "number") {
			                    	gridBody += (_element.textAlign != undefined ? '' : ' textAlign="right" ') + key + '="' + value + '"';
			                    	gridFooter += (useFooterYn == "Y") ? ((_element.textAlign != undefined ? '' : ' textAlign="right" ') + key + '="' + value + '"') : '';
			                    } else if (key == "footerValue") {
			                    	gridFooter += (useFooterYn == "Y") ? ' value="' + value + '"' : '';
			                    } else if (key == "expression") {
			                    	gridFooter += (useFooterYn == "Y") ? ' inputType="expression" ' + key + '="' + value + '(\'' + _realid + '\')"' : '';
			                    } else {	
			                    	gridBody += (key == "id") ? ' id="' + _realid + '"' : ' ' + key + '="' + value + '"';
			                    	gridFooter += (useFooterYn == "Y") ? ((key == "id") ? ' id="' + _realid + '"' : ' ' + key + '="' + value + '"') : '';
			                    }
		                    }
		                }
		            }
		        }); 
		        
		        gridHeader += '></w2:column>';    
		        gridBody   += (_element.usePtnYn == "Y") ? '></w2:column>' : '';    
		        gridFooter += (useFooterYn == "Y") ? ((_element.usePtnYn == "Y") ? '></w2:column>' : '') : '';    
	        }
	        
	        gridHeader += '</w2:row>';
	        gridBody   += (_element.usePtnYn == "Y") ? '</w2:row>' : '' ;
	        gridFooter += (useFooterYn == "Y") ? ((_element.usePtnYn == "Y") ? '</w2:row>' : '' ) : '';
        }
    } else {
    	gridHeader += '<w2:row id="row1" style="">' + staticgridH + '</w2:row>';
    	gridBody   += staticgridB + '</w2:row>';
    	gridFooter += (useFooterYn == "Y") ? staticgridF + '</w2:row>' : '';
    }
    
    gridHeader += '</w2:header>';
    gridBody   +=' </w2:gBody>';
    gridFooter += (useFooterYn == "Y") ? ' </w2:footer>' : '' ;

    rtnObj.strH = gridHeader;
    rtnObj.strB = gridBody;
    rtnObj.strF = gridFooter;
    
    return rtnObj;
};

/**
 * 생성할 그리드의 기본 문자열
 * @private
 * @date 2019. 03. 29.
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var obj = [{ //gridview동적생성
 *         id:"grd_Create"  //  생성할 그리드의 id
 *       , ref:"dlt_Create" // 참조할 데이터리스트의 id
 *       , style:"width: 500px;height: 150px;" //
 *       , headerStr :"헤더에 적용할 스트링" || "";
         , bodyStr :"바디에 적용할 스트링"|| "";
         , subTotalStr :"subTotal에 적용할 스트링"|| "";
         , footerStr :"footer에 적용할 스트링"|| "";
 *  },...]
 * saCom.getGridViewSrc(obj);
 */
saCom.getGridViewSrc = function(obj){
	var _id = obj.id ;
	var _datalist = obj.ref ;
	var gridHeader   = obj.headerStr || "";
	var gridBody     = obj.bodyStr   || "";
	var gridSubTotal = obj.subTotalStr || "";
	var gridFooter   = obj.footerStr || "";
	var gridEvent    = obj.event || null;
	
	//var _aptType = obj.apt == true ? '" visibleRowNum="29" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
	var _aptType = obj.apt == true ? '" visibleRowNum="all" autoFit="none" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false">';
	var _aptStyle = obj.apt == true ? " width:" + $w.data[_datalist].cellIdList.length*80+"px; height: 640px;":"";
	var _style = obj.apt == true ? _aptStyle : obj.style || "width: 100%;height: 100%;";
	var _event = '';
	
	if(gridEvent != null) {
        $.each(gridEvent, function(key, value) {
        	_event += key + '="' + value + '" ';
        });
	}
	
	var gridStr = '<w2:gridView xmlns:w2="http://www.inswave.com/websquare" xmlns:ev="http://www.w3.org/2001/xml-events" dataList="data:'
	    + _datalist + '" '
	    + _event 	
	    + ' scrollByColumn="false" id="'
	    + _id
	    + '" style="'
	    + _style
	    //+ '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">'
	    + _aptType
	    + gridHeader
	    + gridBody
	    + gridSubTotal
	    + gridFooter
	    +'</w2:gridView>' ;
	
	return gridStr ;
};

/**
 * report 호출
 *
 * @date 2019.04.22
 * @author 곽은진 (tpkej)
 * @memberOf saCom
 * @param jrf파일명, 파라미터
 * @example
   saCom.openReport(rptInfo);
 */
saCom.openReport = function(jrfId, param) {
	// 출력이력 저장
	var data = "";
	
	for(var key in param){
        
        data += key + "#" + param[key] + "#"; 
	}
	// 접속자명
	data += "USER_NM" + "#" + sessionStorage.userNm + "#"
	
	
	var url = UBI_HTML_URL; // UBI리포트 HTML페이지 변수
	//var url = "http://kofficel.sdcit.co.kr/ubi4/ubihtml";
	var sonourl = KOFFICE_MAIN_URL+"/ubi4/ubiCallbackTest"; // 콜백 URL 테스트

	
    var $form = $('<form></form>');
    $form.attr('action', url);
    $form.attr('method', 'post');
    $form.attr('target', 'watchwin');
    $form.appendTo('body');
    var _jrf = $('<input type="hidden" value="'+jrfId+'" name="jrf">');
    var _arg = $('<input type="hidden" value="'+data+'" name="arg">');
    var _resid = $('<input type="hidden" value="UBIHTML_SA" name="resid">');
    var _sonourl = $('<input type="hidden" value="'+sonourl+'" name="sonourl">');

    $form.append(_jrf).append(_arg).append(_resid).append(_sonourl);
    var features ='height=900, width=980, status=no, scrollbars=yes, resizable=yes';
    window.open("", 'watchwin', features);
    
    $form.submit();
};
