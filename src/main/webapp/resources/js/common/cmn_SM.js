/**
 * 1. smCom 은 업무별로 정의하시면 되겠습니다.
 * 2. 이하 구현하신 함수를 cmn.js의 함수명과 동일한경우 overriding합니다.
 */


var smCom = {};//smCom 은 업무별로 정의하시면 되겠습니다.  

smCom.initFunction = function(){
	console.log("over riding ");
};

/**
 * 공동명의 팝업창을 호출한다.
 *
 * @date 2019.03.06
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @example
    smCom.openJntTnnc();
 */
smCom.openJntTnnc = function(popupInfo) {
	
	var popOps = {
			       popup_name : "공동명의"
                 , url        : "/WEB-INF/ux/sm/sm0505/SM05050006P.xml"
                 , data       : {
		                          saleStusGbCd  : (WebSquare.util.isNull(popupInfo.saleStusGbCd) ? "" : popupInfo.saleStusGbCd)
		                        , siteCd        : (WebSquare.util.isNull(popupInfo.siteCd) 		 ? "" : popupInfo.siteCd)
		                        , siteNm        : (WebSquare.util.isNull(popupInfo.siteNm) 		 ? "" : popupInfo.siteNm)
		                        , bloCd         : (WebSquare.util.isNull(popupInfo.bloCd) 		 ? "" : popupInfo.bloCd)
		                        , dong          : (WebSquare.util.isNull(popupInfo.dong) 		 ? "" : popupInfo.dong)
		                        , ho            : (WebSquare.util.isNull(popupInfo.ho) 			 ? "" : popupInfo.ho)
		                        , custCd        : (WebSquare.util.isNull(popupInfo.custCd) 		 ? "" : popupInfo.custCd)
		                        , custNm        : (WebSquare.util.isNull(popupInfo.custNm) 		 ? "" : popupInfo.custNm)
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "L"
                 , height     : "680"
	             };
	
 	com.popup_open(popOps);
};

/**
 * 공동명의 팝업창을 호출한다.(이력용)
 *
 * @date 2019.03.06
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @example
    smCom.openJntTnnc();
 */
smCom.openJntTnncChgHist = function(popupInfo) {
	
	var popOps = {
			       popup_name : "공동명의"
                 , url        : "/WEB-INF/ux/sm/sm0510/SM05100010P.xml"
                 , data       : {
		                          saleStusGbCd  : (WebSquare.util.isNull(popupInfo.saleStusGbCd) ? "" : popupInfo.saleStusGbCd)
		                        , siteCd        : (WebSquare.util.isNull(popupInfo.siteCd) 		 ? "" : popupInfo.siteCd)
		                        , siteNm        : (WebSquare.util.isNull(popupInfo.siteNm) 		 ? "" : popupInfo.siteNm)
		                        , bloCd         : (WebSquare.util.isNull(popupInfo.bloCd) 		 ? "" : popupInfo.bloCd)
		                        , dong          : (WebSquare.util.isNull(popupInfo.dong) 		 ? "" : popupInfo.dong)
		                        , ho            : (WebSquare.util.isNull(popupInfo.ho) 			 ? "" : popupInfo.ho)
		                        , chgDgr        : (WebSquare.util.isNull(popupInfo.chgDgr) 	     ? "" : popupInfo.chgDgr)
		                        , custCd        : (WebSquare.util.isNull(popupInfo.custCd) 		 ? "" : popupInfo.custCd)
		                        , custNm        : (WebSquare.util.isNull(popupInfo.custNm) 		 ? "" : popupInfo.custNm)
		                        }
        		 , callbackFn : (WebSquare.util.isNull(popupInfo.callbackStr) ? "" : popupInfo.callbackStr)
                 , widType    : "L"
                 , height     : "680"
	             };
	
 	com.popup_open(popOps);
};
/**
 * 메모장 팝업창을 호출한다.
 *
 * @date 2019.05.29
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @example
    smCom.openMemo();
 */
smCom.openMemo = function(popupInfo) {
	
	var popOps = {
			       popup_name : "메모장"
                 , url        : "/WEB-INF/ux/sm/sm0505/SM05050005P.xml"
                 , data       : {
		                          siteCd        : (WebSquare.util.isNull(popupInfo.siteCd) 		 ? "" : popupInfo.siteCd)
		                        , siteNm        : (WebSquare.util.isNull(popupInfo.siteNm) 		 ? "" : popupInfo.siteNm)
		                        , bloCd         : (WebSquare.util.isNull(popupInfo.bloCd) 		 ? "" : popupInfo.bloCd)
		                        , dong          : (WebSquare.util.isNull(popupInfo.dong) 		 ? "" : popupInfo.dong)
		                        , ho            : (WebSquare.util.isNull(popupInfo.ho) 			 ? "" : popupInfo.ho)
		                        , custCd        : (WebSquare.util.isNull(popupInfo.custCd) 		 ? "" : popupInfo.custCd)
		                        , custNm        : (WebSquare.util.isNull(popupInfo.custNm) 		 ? "" : popupInfo.custNm)
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "L"
                 , height     : "583"
	             };
	
 	com.popup_open(popOps);
};
/**
 * 숫자입력값의 길이를 제한한다.
 *
 * @date 2019.03.14
 * @author 송병기 (tpsbk)
 * @memberOf smCom
 * @memberOf smCom
 * @param {String}
 *            value 컨트롤의 입력값
 * @param {String}
 *            ctrlId 컨트롤의 id
 *
 * inputType=number의 validator로 지정할 수 있는 이벤트 핸들러.
 * 컨트롤의 userData1 속성에 "정수부최대입력길이.소수부최대입력길이"의 형식으로 입력길이를 지정하면 입력길이가 초과되는 것을 방지해준다.
 * 입력길이 지정형식의 예: 5(정수부만 5자리, 소수부 입력불가), 3.2(정수부 3자리, 소수부 2자리), 0.2(정수부 입력불가, 소수부 2자리)
 */
smCom.validateNumberLength = function (value, ctrlId) {
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
 * 동호수 정보 팝업창을 호출한다..
 *
 * @date 2019.03.06
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @example
    openCntprDongHo(popupInfo);
 */
smCom.openDongHo = function(popupInfo) {
	var popOps = {
			       popup_name : "동호수정보"
                 , url        : "/WEB-INF/ux/sm/sm0510/SM05100002P.xml"
                 , data       : {
		                          siteCd        : (WebSquare.util.isNull(popupInfo.siteCd) 		 ? "" : popupInfo.siteCd)
		                        , siteNm        : (WebSquare.util.isNull(popupInfo.siteNm) 		 ? "" : popupInfo.siteNm)
		                        , bloCd         : (WebSquare.util.isNull(popupInfo.bloCd) 		 ? "" : popupInfo.bloCd)
		                        , schType       : (WebSquare.util.isNull(popupInfo.schType)      ? "" : popupInfo.schType)
		                        , custNm        : (WebSquare.util.isNull(popupInfo.custNm)       ? "" : popupInfo.custNm)
		                        , dong          : (WebSquare.util.isNull(popupInfo.dong)         ? "" : popupInfo.dong)
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "M"
                 , height     : "680"
	             };
	
	
 	com.popup_open(popOps);
};

/**
 * 전표조회 팝업창을 호출한다.
 *
 * @date 2019.05.23
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @example
    smCom.openSlipInfo(popupInfo);
 */
smCom.openSlipInfo = function(popupInfo) {
	
	var popOps = {
			       popup_name : "전표조회"
                 , url        : "/WEB-INF/ux/sm/sm2500/SM25000013P.xml"
                 , data       : {
		                          slipGbCd      : (WebSquare.util.isNull(popupInfo.slipGbCd) 	 ? "R" : popupInfo.slipGbCd)
                	            , siteCd        : (WebSquare.util.isNull(popupInfo.siteCd) 		 ? ""  : popupInfo.siteCd)
		                        , siteNm        : (WebSquare.util.isNull(popupInfo.siteNm) 		 ? ""  : popupInfo.siteNm)
		                        , bloCd         : (WebSquare.util.isNull(popupInfo.bloCd) 		 ? ""  : popupInfo.bloCd)
		                        , dong          : (WebSquare.util.isNull(popupInfo.dong) 		 ? ""  : popupInfo.dong)
		                        , ho            : (WebSquare.util.isNull(popupInfo.ho) 			 ? ""  : popupInfo.ho)
		                        , amtGbCd       : (WebSquare.util.isNull(popupInfo.amtGbCd) 	 ? ""  : popupInfo.amtGbCd)
		                        , tradeCd       : (WebSquare.util.isNull(popupInfo.tradeCd) 	 ? ""  : popupInfo.tradeCd)
		                        , custCd        : (WebSquare.util.isNull(popupInfo.custCd) 		 ? ""  : popupInfo.custCd)
		                        , custNm        : (WebSquare.util.isNull(popupInfo.custNm) 		 ? ""  : popupInfo.custNm)
		                        , aprvStusNm    : (WebSquare.util.isNull(popupInfo.aprvStusNm)   ? ""  : popupInfo.aprvStusNm)
		                        , rcmyGbNm      : (WebSquare.util.isNull(popupInfo.rcmyGbNm) 	 ? ""  : popupInfo.rcmyGbNm)
		                        , slipDt        : (WebSquare.util.isNull(popupInfo.slipDt) 		 ? ""  : popupInfo.slipDt)
		                        , rcmyDt        : (WebSquare.util.isNull(popupInfo.rcmyDt) 		 ? ""  : popupInfo.rcmyDt)
		                        , rcmySeq       : (WebSquare.util.isNull(popupInfo.rcmySeq) 	 ? ""  : popupInfo.rcmySeq)
	                            , rcmyHistSeq   : (WebSquare.util.isNull(popupInfo.rcmyHistSeq)  ? ""  : popupInfo.rcmyHistSeq)
		                        , taxnSlipNo    : (WebSquare.util.isNull(popupInfo.taxnSlipNo) 	 ? ""  : popupInfo.taxnSlipNo)
		                        , txfreSlipNo   : (WebSquare.util.isNull(popupInfo.txfreSlipNo)  ? ""  : popupInfo.txfreSlipNo)
		                        , apSlipNo      : (WebSquare.util.isNull(popupInfo.apSlipNo)     ? ""  : popupInfo.apSlipNo)
		                        , slipNo        : (WebSquare.util.isNull(popupInfo.slipNo)       ? ""  : popupInfo.slipNo)
		                        , cnclSlipNo    : (WebSquare.util.isNull(popupInfo.cnclSlipNo)   ? ""  : popupInfo.cnclSlipNo)
		                        , pblcTgpr      : (WebSquare.util.isNull(popupInfo.pblcTgpr)     ? ""  : popupInfo.pblcTgpr)
		                        , cntrtChgDgr   : (WebSquare.util.isNull(popupInfo.cntrtChgDgr)  ? ""  : popupInfo.cntrtChgDgr)
		                        
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "XL"
                 , height     : "850"
	             };
	
 	com.popup_open(popOps);
};

/**
 * report 호출
 *
 * @date 2019.04.22
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @param jrf파일명, 파라미터
 * @example
   smCom.openReport(rptInfo);
 */
smCom.openReport = function(jrfId, param) {
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
    var _resid = $('<input type="hidden" value="UBIHTML_SM" name="resid">');
    var _sonourl = $('<input type="hidden" value="'+sonourl+'" name="sonourl">');

    $form.append(_jrf).append(_arg).append(_resid).append(_sonourl);
    var features ='height=900, width=980, status=no, scrollbars=yes, resizable=yes';
    window.open("", 'watchwin', features);
    
    $form.submit();
};

/**
 * 정산완료에 따른 버튼 컨트롤
 * @date 2019.06.04
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @param btnInfo
 * @example
 * var btnInfo = [btnSave.id,btnExcelDwn.id]
 * smCom.fnBtnAuth(btnInfo);
 **/
smCom.fnBtnAuth = function (btnInfo){
	var sPrgsAdjYn = "Y";	// 진행중
	if (sessionStorage.getItem("selPrgsAdjYn")){
        sPrgsAdjYn = sessionStorage.getItem("selPrgsAdjYn");
    }
		
	if (btnInfo.length > 0){
		for (var i = 0; i < btnInfo.length; i++){
			if (sPrgsAdjYn == "N"){		// 정산완료
				$p.getComponentById(btnInfo[i]).hide();	
			} else {
				$p.getComponentById(btnInfo[i]).show("");
			}
		}			
	}
	
};

/* gridView 동적 적용 start */
/**
 * 동적 그리드 생성/스타일 변경
 * 기본적인 정보를 통해 그리드를 동적으로 생성하거나 스타일을 변경합니다.
 *
 * @date 2019. 02. 15.
 * @param {Array} gridOptionsArr JSONArray  형태로 데이터 동적 그리드생성및 스타일변경할 데이터 구조체
 * @param {String=} gridOptionsArr.id 그리드ID
 * @param {String=} gridOptionsArr.ref 참조할 데이터셋
 * @param {String=} gridOptionsArr.colNmType 그리드의 헤더를 생성할때 id로 할것인지 name으로 할것인지 정의
 * @param {String=} gridOptionsArr.colTpJsn 그리드의 바디 컬럼의 inputType="text"를 제외한 정보를 지정합니다.
 * @param {String=} gridOptionsArr.type 플래그 "C":새로생성,"R":기존 그리드의 스타일변경
 * @param {String=} gridOptionsArr.parentObj type="C"인경우 생성될 그리드의 부모,"R"인경우 없어도무관
 * @param {String=} gridOptionsArr.style 그리드에 적용할 스타일
 *
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var gridViewInfo = [{ //gridview동적생성
 *       id:"grd_Create"
 *       ,ref:"dlt_Create"
 *       ,colNmType:"id" 또는 "name"// header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
 *       ,colTpJsn: {colid:inputType,colid2:inputType2,...}//default column의 inputType은 'text' 입니다. 기타 inputType에 대해 기술합니다.
 *                   // ex) {bttonId:'select',bttonchk:'check',...}
 *       ,colExp:["progrmId",...] // 그리드 생성시 제외할 컬럼
 *       ,style:"width: 500px;height: 150px;" //
 *       ,type:"R"
 *  },...]
 * com.createGridView(gridViewInfo);
 *
 */
smCom.createGridView = function(gridOptionsArr,grd_Obj){
        if(com.isEmpty(gridOptionsArr) || gridOptionsArr.length == 0){
            //m_                console.log(com.getPrintTime()+"[common.js][com.createGridView] 생성할 그리드 정보가 없습니다.");
                return;
        }
        for(var key in gridOptionsArr){
                if(!gridOptionsArr.hasOwnProperty(key)) continue;
                var gridObj = gridOptionsArr[key];
                var dl_info = {
                        id :gridObj.ref
                        ,type : gridObj.colNmType || "name"  // header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
                };
                var _colTpJsn = gridObj.colTpJsn;
                var _colExp = gridObj.colExp;

                var grdStrObj  = this.grdHeaderBodyStr(dl_info,_colTpJsn,_colExp);
                var subgridObj = {
                        id : gridObj.id
                        ,ref:gridObj.ref
                        ,style:gridObj.style
                        ,headerStr :grdStrObj.strH
                        ,bodyStr:grdStrObj.strB
                        ,apt:gridObj.apt || false
                }
                var gridStr = smCom.getGridViewSrc(subgridObj);
                gridObj.type = gridObj.type || "R";
                if(gridObj.type == "R"){
                    grd_Obj.setGridStyle(WebSquare.xml.parse( gridStr , true ));
                }else{
                    //m_                        console.log(com.getPrintTime()+"[common.js][com.createGridView] 타입이 지정되어있지않습니다.");
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
  * @date 2018. 08. 30.
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var dl_info = {
 *                 id :"dlt_datalistid"
 *                 ,type : "name||id"  // header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
 *                }
 * var colTpJsn = {colid1:'select',colid2:'radio',...}//input type 결정
 * var colExp = ['colid1','colid2',...]               // 제외할 컬럼 결정
 * com.grdHeaderBodyStr(dl_id,colTpJsn);
 */
smCom.grdHeaderBodyStr = function(dl_info,colTpJsn,colExp){
    var rtnObj = {strH:"",strB:""};
    if(com.isEmpty(dl_info.id)){
        //m_        console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스트 아이디가 없습니다.");
        return;
    }
    var dlObj = $w.data[dl_info.id] || {};
    if(com.isEmpty(dlObj)){
        //m_        console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스가 없습니다.");
        return;
    }
    var _type = dl_info.type || "name";
    var _colTpJsn = colTpJsn || {};
    var _colExp = colExp || [];
    var _colExpJsn = {};
    if(_colExp.length>0){
        for(var key in _colExp){
            if(!_colExp.hasOwnProperty(key)) continue;
            _colExpJsn[_colExp[key]] = "Y";
        }
    }

    var colIdArr = dlObj.cellIdList;

    var gridHeader = '';
    var gridBody = '';
    ////데이터리스트 기준으로 컬럼을 만든다.
    for (var k in colIdArr){
            if(!colIdArr.hasOwnProperty(k)) continue;
            var colid = colIdArr[k];
            if(_colExpJsn[colid] == "Y") continue;
            var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
            var _hinputType = "text";
            switch(colid){
            case "chk": _hinputType = "checkbox"
            	break;
            case "radio": _hinputType = "radio"
            	break;            	
            }
            gridHeader +='<w2:column blockSelect="false" id="'+'h'+colid+'" style="height:20px" inputType="'+_hinputType+'" width="70" value="'+colNm+'"></w2:column>';
            var inputType = _colTpJsn[colid] || "text";            
            gridBody += '<w2:column blockSelect="false" id="'+colid+'" style="height:20px" inputType="'+inputType+'" width="70"></w2:column>';
    }
    rtnObj.strH = gridHeader;
    rtnObj.strB = gridBody;
    return rtnObj;
};

/**
 * 생성할 그리드의 기본 문자열
 * @private
 * @date 2018. 08. 30.
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var obj = [{ //gridview동적생성
 *       id:"grd_Create"  //  생성할 그리드의 id
 *       ,ref:"dlt_Create" // 참조할 데이터리스트의 id
 *       ,style:"width: 500px;height: 150px;" //
 *       ,headerStr :"헤더에 적용할 스트링" || "";
         ,bodyStr :"바디에 적용할 스트링"|| "";
 *  },...]
 * smCom.getGridViewSrc(obj);
 */
smCom.getGridViewSrc = function(obj){
        var _id = obj.id ;
        var _datalist = obj.ref ;
        
        var gridHeader = obj.headerStr || "";
        var gridBody = obj.bodyStr || "";
        
        //var _aptType = obj.apt == true ? '" visibleRowNum="29" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptType = obj.apt == true ? '" visibleRowNum="all" autoFit="none" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptStyle = obj.apt == true ? " width:"+$w.data[_datalist].cellIdList.length*80+"px; height: 640px;":"";
        var _style = obj.apt == true ? _aptStyle : obj.style || "width: 100%;height: 100%;";
        
        
        
             var gridStr = '<w2:gridView xmlns:w2="http://www.inswave.com/websquare" xmlns:ev="http://www.w3.org/2001/xml-events" dataList="data:'
                + _datalist
                + '" scrollByColumn="false" id="'
                + _id
                + '" style="'
                + _style
                //+ '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">'
                + _aptType
                + '<w2:header id="header1" style="">'
                + '<w2:row id="row1" style="">'
                + gridHeader
                + '</w2:row>'
                +'</w2:header>'
                +'<w2:gBody id="gBody1" style="">'
                +'<w2:row id="row2" style="">'
                + gridBody
                +'</w2:row>'
                +'</w2:gBody>'
                +'</w2:gridView>' ;
        return gridStr ;
};
/* gridView 동적 생성 finish */
/**
 * 그리드의 배경색을 바꾼다.
 * 
 * ex)
 * var _colorInfo = {
 * 	color:[row1,row2,...] //idxArr
 * };
 * smCom.setGrdRowColor(grdObj,_colorInfo);
 */

smCom.setGrdRowColor = function( _grdObj, _colInfo){
	
	$.each(_colInfo,function(_color,_idxArr){
		$.each(_idxArr,function(_color,_idx){
			_grdObj.setRowStyle(_idx,"background-Color",_color);
		});
	});
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
 *  },...]
 * com.createGridView(gridViewInfo);
 *
 */
smCom.createGridViewHeader = function(gridOptionsArr, grd_Obj){
    if(com.isEmpty(gridOptionsArr) || gridOptionsArr.length == 0){
        //console.log(com.getPrintTime()+"[common.js][com.createGridView] 생성할 그리드 정보가 없습니다.");
        return;
    }
    
    for(var key in gridOptionsArr){
        if(!gridOptionsArr.hasOwnProperty(key)) continue;
        var gridObj = gridOptionsArr[key];
        console.log("헤더와 본문 그리드 컬럼 생성");
        var grdStrObj  = this.grdHeaderBodyStrHeader(gridObj.dynamicData, gridObj.headerElement, gridObj.staticColElement);
        console.log("컬럼 생성 완료");
        var subgridObj = {
                id : gridObj.id
                ,ref:gridObj.ref
                ,style:gridObj.style
                ,headerStr :grdStrObj.strH
                ,bodyStr:grdStrObj.strB
                ,apt:gridObj.apt || false
        }
        
        var gridStr = smCom.getGridViewSrcHeader(subgridObj);
        
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
 * com.grdHeaderBodyStrHeader(dl_id,colTpJsn);
 */
smCom.grdHeaderBodyStrHeader = function(refId, headerElement, staticColElement) {
    var rtnObj = {strH:"", strB:""};
    
    if(com.isEmpty(refId)){
        //console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스트 아이디가 없습니다.");
        return;
    }
    
    var dlObj = $p.data.get("JSON", [refId], {"singleMode":true});
            
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
    var _realid = '';
    var _concatOpt = '';  
    var staticgridH = '';
    var staticgridB = '';
    for (var k = 0; k < staticColElement.length; k++) {
    	var staticEle = staticColElement[k];
    	staticgridH += '<w2:column blockSelect="false" style="height:' + WebSquare.util.parseInt(staticEle.rowSpan, 1) * 20 + 'px" ';
    	staticgridB += '<w2:column blockSelect="false" style="height:20px"';
        $.each(staticEle, function(key, value) {
        	
        	staticgridH += ' ' + key + '="' + value + '"';

            if(key != "value" && key != "rowSpan") {
            	console.log("key==", key);
            	console.log("value==", value);
            	if(key == "dataType" && value == "number") {
                	staticgridB += (staticColElement[k].textAlign != undefined ? '' : ' textAlign="right" ') + key + '="' + value + '"';
            	} else {
            		staticgridB += ' ' + key + '="' + value + '"';
            	}
            }
        }); 

        staticgridH += '></w2:column>';         	
        staticgridB += '></w2:column>';         	
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
	        }
        
	        for (var j = 0; j < dlObj.length; j++) {
	        	//컬럼명 패턴 지정
	            _realid = _element.id + ((_concatOpt == "I") ? j : dlObj[j][_element.id]);
	            
	            //헤더, 본문 string 세팅, body string은 실제 바인딩할 컬럼에 한해서만 세팅
	            gridHeader += '<w2:column blockSelect="false" style="height:20px"';
	            gridBody += (_element.usePtnYn == "Y") ? '<w2:column blockSelect="false" style="height:20px"' : '';
	            
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
			                    } else {
			                    	gridBody += (key == "id") ? ' id="' + _realid + '"' : ' ' + key + '="' + value + '"';
			                    }
		                    }
		                }
		            }
		        }); 
		        gridHeader += '></w2:column>';    
		        gridBody += (_element.usePtnYn == "Y") ? '></w2:column>' : '';    
	        }
	        
	        gridHeader += '</w2:row>';
	        gridBody  += (_element.usePtnYn == "Y") ? '</w2:row>' : '' ;
        }
    } else {
    	gridHeader += '<w2:row id="row1" style="">' + staticgridH + '</w2:row>';
    	gridBody += staticgridB + '</w2:row>';
    }
    
    gridHeader += '</w2:header>';
    gridBody +=' </w2:gBody>';

    rtnObj.strH = gridHeader;
    rtnObj.strB = gridBody;
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
 *       id:"grd_Create"  //  생성할 그리드의 id
 *       ,ref:"dlt_Create" // 참조할 데이터리스트의 id
 *       ,style:"width: 500px;height: 150px;" //
 *       ,headerStr :"헤더에 적용할 스트링" || "";
         ,bodyStr :"바디에 적용할 스트링"|| "";
 *  },...]
 * smCom.getGridViewSrcHeader(obj);
 */
smCom.getGridViewSrcHeader = function(obj){
	var _id = obj.id ;
	var _datalist = obj.ref ;
	
	var gridHeader = obj.headerStr || "";
	var gridBody = obj.bodyStr || "";
	
	//var _aptType = obj.apt == true ? '" visibleRowNum="29" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
	var _aptType = obj.apt == true ? '" visibleRowNum="all" autoFit="none" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false">';
	var _aptStyle = obj.apt == true ? " width:"+$w.data[_datalist].cellIdList.length*80+"px; height: 640px;":"";
	var _style = obj.apt == true ? _aptStyle : obj.style || "width: 100%;height: 100%;";
	var gridStr = '<w2:gridView xmlns:w2="http://www.inswave.com/websquare" xmlns:ev="http://www.w3.org/2001/xml-events" dataList="data:'
	    + _datalist
	    + '" scrollByColumn="false" id="'
	    + _id
	    + '" style="'
	    + _style
	    //+ '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">'
	    + _aptType
	    + gridHeader
	    + gridBody
	    +'</w2:gridView>' ;
        return gridStr ;
};

/**GridView 관련 Function Finish*/
