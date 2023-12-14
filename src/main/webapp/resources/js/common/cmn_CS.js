/**
 * 1. csCom 은 업무별로 정의하시면 되겠습니다.
 * 2. 이하 구현하신 함수를 cmn.js의 함수명과 동일한경우 overriding합니다.

 * 하자 Scope에서 공유되는 전역 변수, 상수, 공통 함수를 정의한다.
 * 
 * @version 3.0
 * @author 신설연 (tpshinsy1)
 * @type csCom
 * @class csCom
 * @namespace gcmcsCom
 */
var csCom = {};  //csCom 은 업무별로 정의하시면 되겠습니다.  

/**
 * AS권한정보를 리턴한다.
 * 
 * @date 2019.09.05
 * @author 송병기 (tpsdk)
 * @returns asUserAuth 
 */
csCom.getAsUserAuth = function() {
	//세션에서 AS권한정보를 읽어 페이지 변수에 할당한다.
	var asUserAuth = JSON.parse(sessionStorage.getItem("asUserAuth"));
	
	if (!asUserAuth) {//권한정보가 없는 경우 서버에서 읽는다.
		ajaxLib.ajax("/cs/cscomm/cscommon/selectAsUserAuth", {
            mode        : "synchronous",
            requestData : {},
            callback    : function(result, e) {
            	asUserAuth = result.data.dsAsUserAuth;
            	sessionStorage.setItem("asUserAuth", JSON.stringify(asUserAuth));
            }
        });
	}
	
	return asUserAuth;
};

/**
 * 하자공통 색상값을 설정한다.
 *
 * @date 2019.03.04
 * @author 신설연 (tpshinsy1)
 * @example
    csCom.color.wrng
 */
csCom.color = {
	wrng     : "#FF0000",  //경보색
	accentA  : "#e6d4a5",  //강조색(진한노랑)
	accentB  : "#f1aca7",  //강조색(빨강)
	accentC  : "#adc5eb",  //강조색(파랑)
	accentD  : "#9ddceb",  //강조색(초록)
	subTotal : "#F0E9F4",  //소계색(그리드 소계행 배경색)
	grey     : "#F2F4F6",  //회색
	total    : "#F6F3F0"   //합계색(그리드 합계행 배경색)
};

/**
 * 임직원 검색 팝업을 오픈한다.
 *
 * @date 2022.08.26
 * @author 이미연
 * @memberOf csCom
 * @example
    var callbackStr = "scwin.btnDeptStaff_callback";
    
    csCom.openStaffPopup(callbackStr);
 */
csCom.openStaffPopup = function(callbackStr) {
	com.popup_open({
		popup_name : "임직원 선택",
		url        : "/WEB-INF/ux/cs/cscomm/schDeptStaff.xml",
		data       : "",
		callbackFn : callbackStr,
		widType    : "XL",
		height     : "800"
	});
};

/**
 * 부서별 임직원 팝업을 오픈한다.
 *
 * @date 2019.03.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
    var popupInfo = {
                      deptNm      : "ibxDeptNm"
                    , deptCd      : "ibxDeptCd"
                    , userNm      : "ibxUserNm"
                    , userEmpno   : "ibxUserEmpno"
                    , buttonClick : true
                    , callbackStr : "scwin.btnDeptStaff_callback"
                    }
    
    csCom.openDeptStaff(popupInfo);
 */
csCom.openDeptStaff = function(popupInfo) {
	var bButtonClick = csCom.nvl(popupInfo.buttonClick, false);
	var vDeptCd      = csCom.nvl(popupInfo.deptCd, ""); 
	var vDeptNm      = csCom.nvl(popupInfo.deptNm, "");
	var vUserEmpno   = csCom.nvl(popupInfo.userEmpno, "");
	var vUserNm      = csCom.nvl(popupInfo.userNm, "");

	if (!bButtonClick) {
		ajaxLib.ajax("/cs/cscomm/cscommon/selectDeftStaffList", {
	        mode		: "synchronous",
	        requestData	: {
	        	keyDeptNm : vDeptNm ? $p.getComponentById(vDeptNm).getValue() : "",
	        	keyUserNm : vUserNm ? $p.getComponentById(vUserNm).getValue() : "",
	        },
			callback	: function(result, e) {
				//부서별 임직원 조회 후처리
				var dsDeftStaffList = result.data.dsDeftStaffList;

				//1건이면 바인딩
				if (dsDeftStaffList.length === 1) {

					//부서코드
					vDeptCd && $p.getComponentById(vDeptCd).setValue(dsDeftStaffList[0].deptCd);
					//부서명
					vDeptNm && $p.getComponentById(vDeptNm).setValue(dsDeftStaffList[0].deptNm);
					//사용자사번
					vUserEmpno && $p.getComponentById(vUserEmpno).setValue(dsDeftStaffList[0].userEmpno);
					//사용자명
					vUserNm && $p.getComponentById(vUserNm).setValue(dsDeftStaffList[0].userNm);

					return false;
				}
				
				//부서별 임직원 팝업오픈
				csCom.openDeptStaffPopup(popupInfo);
			}
	    });
		
	} else {
		//부서별 임직원 팝업오픈
		csCom.openDeptStaffPopup(popupInfo);
	}
};

//부서별 임직원 팝업오픈
csCom.openDeptStaffPopup = function(popupInfo) {
	var bButtonClick = csCom.nvl(popupInfo.buttonClick, false);
	var vDeptNm      = $p.getComponentById(popupInfo.deptNm) ? $p.getComponentById(popupInfo.deptNm).getValue() : "";
	var vUserNm      = $p.getComponentById(popupInfo.userNm) ? $p.getComponentById(popupInfo.userNm).getValue() : "";

	com.popup_open({
		popup_name : "부서별 임직원",
		url        : "/WEB-INF/ux/cs/cs0015/CS00150025P.xml",
		data       : {
			keyDeptNm : bButtonClick ? "" : vDeptNm,
			keyUserNm : bButtonClick ? "" : vUserNm,
		},
		callbackFn : popupInfo.callbackStr,
		widType    : "M",
		height     : "588"
	});
};

/**
 * 협력회사Pool 팝업을 오픈한다.
 *
 * @date 2019.03.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @memberOf csCom
 * @param {String}
 *            div 조회구분
 *            . A : 협력회사 Pool정보를 조회한다(AS계약에서는 AS/외주/자재 업체만 조회).
 *            . B : 협력회사정보 관리에서 POOL에 정상적으로 등록된 업체와 타현장에 등록된 업체를 조회한다(해당현장에 등록된 업체제외, MULTI 선택 가능).
 *            . C : 처리업체를 조회한다.
 *            . D : 모든 현장의 업체를 조회한다.
 * @param {String}
 *            multiYn 멀티여부(Y/N)
 * @param {String}
 *            tradeNm 거래처명
 * @param {String}
 *            siteCd 현장코드
 * @param {String}
 *            bloCd 블록코드
 * @param {boolean}
 *            buttonClick 버튼클릭여부
 * @param {String}
 *            callbackStr 콜백함수명
 * @author 신설연 (tpshinsy1)
 * @example
    var popupInfo = {
                      div         : ibxTradePoolDiv.getValue()
                    , multiYn     : ibxTradePoolMultiYn.getValue()
                    , tradeNm     : ibxTradePoolTradeNm.getValue()
                    , siteCd      : wfmSiteCd.getWindow().ibxSiteCd.getValue()
                    , bloCd       : wfmSiteCd.getWindow().ibxBloCd.getValue()
                    , buttonClick : false
                    , callbackStr : "scwin.btnTradePool_callback"
                    }
    	
    csCom.openTradePoolPop(popupInfo);
 */
csCom.openTradePoolPop = function(popupInfo) {
	var bButtonClick = csCom.nvl(popupInfo.buttonClick, false);

	//팝업호출
	com.popup_open({
		popup_name : "협력회사Pool",
		url        : "/WEB-INF/ux/cs/cs0020/CS00200005P.xml",
		data       : {
			div        : csCom.nvl(popupInfo.div, ""),
			multiYn    : csCom.nvl(popupInfo.multiYn, ""),
			siteCd     : csCom.nvl(popupInfo.siteCd, ""),
			bloCd      : csCom.nvl(popupInfo.bloCd, 0),
			keyTradeNm : bButtonClick ? "" : csCom.nvl(popupInfo.tradeNm, "")
		},
		callbackFn : csCom.nvl(popupInfo.callbackStr, ""),
		widType    : "M",
		height     : "575"
	});
};

/**
 * 협력회사검색 팝업을 오픈한다.
 *
 * @date 2019.03.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @memberOf csCom
 * @param {String}
 *            div 조회구분
 *            . A : 업체Pool에 없는 거래선을 조회한다.
 *            . B : 현장별업체에 없는 거래선을 조회한다.
 *            . C : TCF_TRADE_INFO의 전체 업체를 조회한다.
 * @param {String} multiYn 멀티여부(Y/N)
 * @param {String} tradeNm 거래처명
 * @param {String} siteCd 현장코드
 * @param {String} bloCd 블록코드
 * @param {boolean} buttonClick 버튼클릭여부
 * @param {String} callbackStr 콜백함수명
 * @example 
    var popupInfo = {
                      div         : ibxTradeSearchDiv.getValue()
                    , multiYn     : ibxTradeSearchMultiYn.getValue()
                    , tradeNm     : ibxTradeSearchTradeNm.getValue()
                    , siteCd      : wfmSiteCd.getWindow().ibxSiteCd.getValue()
                    , bloCd       : wfmSiteCd.getWindow().ibxBloCd.getValue()
                    , buttonClick : false
                    , callbackStr : "scwin.btnTradeSearch_callback"
                    }
    
    csCom.openTradeSearchPop(popupInfo);
 */
csCom.openTradeSearchPop = function(popupInfo) {
	var bButtonClick = csCom.nvl(popupInfo.buttonClick, false);

	//팝업호출
	com.popup_open({
		popup_name : "협력회사검색",
		url        : "/WEB-INF/ux/cs/cs0020/CS00200010P.xml",
		data       : {
			div        : csCom.nvl(popupInfo.div, ""),
			multiYn    : csCom.nvl(popupInfo.multiYn, ""),
			siteCd     : csCom.nvl(popupInfo.siteCd, ""),
			bloCd      : csCom.nvl(popupInfo.bloCd, 0),
			keyTradeNm : bButtonClick ? "" : csCom.nvl(popupInfo.tradeNm, "")
		},
		callbackFn : csCom.nvl(popupInfo.callbackStr, ""),
		widType    : "M",
		height     : "575"
	});
};

/**
 * 하자 협력회사정보 wFrame을 설정한다.
 *
 * @date 2019.03.05
 * @memberOf csCom
 * @author 이정우
 * @example
    var tradeInfo = {
                     id                  : wfmKeyTradeCd.id          	//화면내 wFrame Id
                   , tradeCdWidth        : "80px"                   	//거래처코드 넓이(기본값 80px)
                   , tradeNmWidth        : "200px"                  	//거래처명   넓이(기본값 200px)
                   , tradeCdVisible      : true                     	//거래처코드 표시(기본값 true)
                   , tradeNmVisible      : true                     	//거래처명   표시(기본값 true)
                   , btnClearVisible     : false						//리셋버튼   표시(기본값 false)
                   , div            	 : "A"   						//조회구분 (tradePool(A,B,C,D), tradeSearch(A,B,C))
                   , multiYn             : "Y"   						//멀티선택여부 (Y,N)
                   , urlDiv            	 : "tradePool"   				//팝업선택(협력회사Pool(tradePool), 협력회사검색(tradeSearch))
                   , keyTradeNm          : dsTradeInfo.get("tradeNm")   //거래처명
                   , keySiteCd           : ""   						//현장코드
                   , keyBloCd            : ""   						//블록코드
                   , tradeCd          	 : dsTradeInfo.get("tradeCd")   //거래처코드
                   , callback            : "ibxTradeNm_onkeydown"   	//후처리 스크립트
                   , clearCallback       : "ibxTradeNm_onkeydown"   	//후처리 스크립트(리셋버튼)
                   };
    
    //협력회사 wframe 설정
    csCom.setWfmTradeInfo(tradeInfo);
 */
csCom.setWfmTradeInfo = function(tradeInfo) {
	var tradeInfoObj = $p.getComponentById(tradeInfo.id).getWindow();
	var objIbxTradeCd = tradeInfoObj.ibxTradeCd
	var objIbxTradeNm = tradeInfoObj.ibxTradeNm
	var objBtnClear   = tradeInfoObj.btnClear
			
	objIbxTradeCd.setStyle("width", csCom.nvl(tradeInfo.tradeCdWidth, "80px"));  //거래처코드 넓이(기본값 80px)
	objIbxTradeNm.setStyle("width", csCom.nvl(tradeInfo.tradeNmWidth, "200px"));  //거래처명   넓이(기본값 200px)

	//거래처코드 표시(기본값 true)
	tradeInfo.tradeCdVisible = csCom.nvl(tradeInfo.tradeCdVisible, true);	
	if (tradeInfo.tradeCdVisible) {
		objIbxTradeCd.show("");
	} else {
		objIbxTradeCd.hide();
	}

	//거래처명 표시(기본값 true)
	tradeInfo.tradeNmVisible = csCom.nvl(tradeInfo.tradeNmVisible, true);	
	if (tradeInfo.tradeNmVisible) {
		objIbxTradeNm.show("");
	} else {
		objIbxTradeNm.hide();
	}
	
	//리셋버튼 표시(기본값 false)
	tradeInfo.btnClearVisible = csCom.nvl(tradeInfo.btnClearVisible, false);	
	if (tradeInfo.btnClearVisible) {
		objBtnClear.show("");
	} else {
		objBtnClear.hide();
	}
	
	//협력회사wFrame의 dsSearchParam DataCollection에 값 설정
	var dsSearchParam = tradeInfoObj.dsSearchParam;
	dsSearchParam.set("div",   	 		csCom.nvl(tradeInfo.div          , "A"));         	//조회구분
	dsSearchParam.set("multiYn",    	csCom.nvl(tradeInfo.multiYn      , "N"));     		//멀티선택여부
	dsSearchParam.set("urlDiv",   	 	csCom.nvl(tradeInfo.urlDiv       , "tradePool"));    //팝업선택
	dsSearchParam.set("keyTradeNm", 	csCom.nvl(tradeInfo.keyTradeNm   , ""));  			//거래처명
	dsSearchParam.set("keySiteCd",  	csCom.nvl(tradeInfo.keySiteCd    , ""));   			//현장코드
	dsSearchParam.set("keyBloCd",   	csCom.nvl(tradeInfo.keyBloCd     , 0));    			//블록코드
	dsSearchParam.set("tradeCd",    	csCom.nvl(tradeInfo.tradeCd      , ""));     		//거래처코드
	dsSearchParam.set("callback",   	csCom.nvl(tradeInfo.callback     , ""));    			//선택 후처리 스크립트
	dsSearchParam.set("clearCallback", 	csCom.nvl(tradeInfo.clearCallback, "")); 			//선택 후처리 스크립트(리셋버튼)
}

/**
 * 선택한 현장을 세션에 설정한다.
 *
 * @date 2019.03.04
 * @memberOf csCom
 * @param {String}
 *            siteCd 현장코드
 * @param {String}
 *            bloCd 블록코드
 * @author 신설연 (tpshinsy1)
 * @example
 */
csCom.setSelSite = function(siteCd, bloCd) {
	ajaxLib.ajax("/cs/cs0500/CS05000070P/selectTcsSiteList", {
		mode		: "synchronous",
		requestData	: {
			keySiteCd : siteCd,
			keyBloCd  : bloCd
		},
		callback	: function(result, e) {
			//세션설정
			sessionStorage.setItem("selCsSiteCd", result.data.dsTcsSiteList[0].siteCd);
			sessionStorage.setItem("selCsSiteNm", result.data.dsTcsSiteList[0].siteNm);
			sessionStorage.setItem("selCsBloCd",  result.data.dsTcsSiteList[0].bloCd);
		}
    });
};

/**
 * 하자 현장정보 wFrame을 설정한다.
 *
 * @date 2019.03.05
 * @memberOf csCom
 * @author 신설연 (tpshinsy1)
 * @example
    var siteInfo = {
                     id                  : wfmKeySiteCd.id          //화면내 wFrame Id
                   , siteCdWidth         : "100px"                  //현장코드 넓이(기본값 100px)
                   , siteNmWidth         : "295px"                  //현장명   넓이(기본값 295px)
                   , bloCdWidth          : "100px"                  //블록코드 넓이(기본값 100px)
                   , siteCdAlign         : "center"                 //현장코드 정렬(기본값 left)
                   , siteNmAlign         : "center"                 //현장명   정렬(기본값 left)
                   , bloCdAlign          : "center"                 //블록코드 정렬(기본값 left)
                   , siteCdVisible       : false                    //현장코드 표시(기본값 true)
                   , siteNmVisible       : false                    //현장명   표시(기본값 true)
                   , bloCdVisible        : true                     //블록코드 표시(기본값 false)
                   , siteInfoDisable     : true                     //현장정보 wFrame Disable(기본값 false)
                   , changeSelectSession : false                    //현장 선택시 세션 반영여부(기본값 true)
                   , selectAfterScript   : "wfmKeySiteCd_onchange"  //선택 후처리 스크립트
                   };
    
    //현장검색 wframe 설정
    csCom.setWfmSiteInfo(siteInfo);
 */
csCom.setWfmSiteInfo = function(siteInfo) {
	var objSiteInfo     = $p.getComponentById(siteInfo.id).getWindow();
	var objIbxSiteCd    = objSiteInfo.ibxSiteCd;
	var objIbxSiteNm    = objSiteInfo.ibxSiteNm;
	var objIbxBloCd     = objSiteInfo.ibxBloCd;
	var objDsCmnCsParam = objSiteInfo.dsCmnCsParam;

	objIbxSiteCd.setStyle("width", csCom.nvl(siteInfo.siteCdWidth, "70px"));  //현장코드 넓이(기본값 100px)
	objIbxSiteNm.setStyle("width", csCom.nvl(siteInfo.siteNmWidth, "180px"));  //현장명   넓이(기본값 295px)
	objIbxBloCd.setStyle("width",  csCom.nvl(siteInfo.bloCdWidth, "20px"));   //블록코드 넓이(기본값 100px)

	objIbxSiteCd.setStyle("text-align", csCom.nvl(siteInfo.siteCdAlign, "center"));  //현장코드 정렬(기본값 left)
	objIbxSiteNm.setStyle("text-align", csCom.nvl(siteInfo.siteNmAlign, "left"));  //현장명   정렬(기본값 left)
	objIbxBloCd.setStyle("text-align",  csCom.nvl(siteInfo.bloCdAlign, "center"));   //블록코드 정렬(기본값 left)

	//현장코드 표시(기본값 true)
	siteInfo.siteCdVisible = csCom.nvl(siteInfo.siteCdVisible, true);	
	siteInfo.siteCdVisible ? objIbxSiteCd.show("") : objIbxSiteCd.hide();

	//현장명 표시(기본값 true)
	siteInfo.siteNmVisible = csCom.nvl(siteInfo.siteNmVisible, true);
	siteInfo.siteNmVisible ? objIbxSiteNm.show("") : objIbxSiteNm.hide();

	//블록코드 표시(기본값 false)
	siteInfo.bloCdVisible  = csCom.nvl(siteInfo.bloCdVisible, false);
	siteInfo.bloCdVisible ? objIbxBloCd.show("") : objIbxBloCd.hide();
	
	var bSiteInfoDisable = csCom.nvl(siteInfo.siteInfoDisable, false);
	objIbxSiteCd.setDisabled(bSiteInfoDisable);
	objIbxSiteNm.setDisabled(bSiteInfoDisable);
	objIbxBloCd.setDisabled(bSiteInfoDisable);
	objSiteInfo.btnSiteCd.setDisabled(bSiteInfoDisable);

	//현장검색wFrame의 dsCmnCsParam DataCollection에 값 설정
	objDsCmnCsParam.set("selectAfterScript",   siteInfo.selectAfterScript);                                                                //선택 후처리 스크립트
	objDsCmnCsParam.set("changeSelectSession", csCom.nvl(siteInfo.changeSelectSession, true));  //현장 선택시 선택현장세션 반영여부
}

/**
 * 협력회사정보 팝업을 오픈한다.
 *
 * @date 2019.03.04
 * @author 이정우
 * @memberOf csCom
 * @param {String}
 *            siteCd 현장코드
 * @param {String}
 *            bloCd 블록코드
 * @param {String}
 *            tradeCd 거래처코드
 * @author 이정우
    var popupInfo = {
                      siteCd      : wfmSiteCd.getWindow().ibxSiteCd.getValue()
                    , bloCd       : wfmSiteCd.getWindow().ibxBloCd.getValue()
                    , tradeCd     : ibxTradeCd.getValue()
                    }
    
    csCom.openTradeSiteInfoPop(popupInfo);
 */
csCom.openTradeSiteInfoPop = function(popupInfo) {
	//팝업호출
	com.popup_open({
		popup_name : "협력회사정보",
		url        : "/WEB-INF/ux/cs/cs0505/CS05050005P.xml",
		data       : {
			keySiteCd	: csCom.nvl(popupInfo.siteCd, ""),
			keyBloCd	: csCom.nvl(popupInfo.bloCd, 0),
			keyTradeCd	: csCom.nvl(popupInfo.tradeCd, "")
		},
		widType    : "XL",
		height     : "710px"
	});
};

/**
 * 현장별계약정보 팝업을 오픈한다.
 *
 * @date 2019.03.04
 * @author 이정우
 * @memberOf csCom
 * @param {String}
 *            tradeCd 거래처코드
 * @author 이정우
    var popupInfo = {
                      tradeCd : ibxTradeCd.getValue()
                    }
    
    csCom.openTradeSiteContPop(popupInfo);
 */
csCom.openTradeSiteContPop = function(popupInfo) {
	//팝업호출
	com.popup_open({
		popup_name : "현장별계약정보",
		url        : "/WEB-INF/ux/cs/cs0505/CS05050010P.xml",
		data       : {
			keyTradeCd : csCom.nvl(popupInfo.tradeCd, "")
		},
		widType    : "XL",
		height     : "526"
	});
};

/**
 * 공통코드 팝업을 오픈한다.
 *
 * @date 2019.03.07
 * @author 이정우
 * @memberOf csCom
 * @param {String}
 *            upperCd 상위코드(그룹코드)
 * @param {String}
 *            cdNm 검색명
 * @author 이정우
    var popupInfo = {
                      upperCd  : "CF008"
                    , cdNm     : ibxCdNm.getValue()
                    , callback : ""
                    }
    
    csCom.openCommonCodePop(popupInfo);
 */
csCom.openCommonCodePop = function(popupInfo) {
	//팝업호출
	com.popup_open({
		popup_name : csCom.nvl(popupInfo.upperNm, "공통코드"),
		url        : "/WEB-INF/ux/cs/cscomm/CommonCode.xml",
		data       : {
			upperCd  : csCom.nvl(popupInfo.upperCd, ""),
			cdNm     : csCom.nvl(popupInfo.cdNm, ""),
			upperNm  : csCom.nvl(popupInfo.upperNm, "")
		},
		callbackFn : popupInfo.callbackStr,
		widType    : "S",
		height     : "600"
	});
};

/**
 * 숫자입력값의 길이를 제한한다.
 *
 * @date 2019.03.14
 * @author 송병기 (tpsbk)
 * @memberOf csCom
 * @param {String}
 *            value 컨트롤의 입력값
 * @param {String}
 *            ctrlId 컨트롤의 id
 *
 * inputType=number의 validator로 지정할 수 있는 이벤트 핸들러.
 * 컨트롤의 userData1 속성에 "정수부최대입력길이.소수부최대입력길이"의 형식으로 입력길이를 지정하면 입력길이가 초과되는 것을 방지해준다.
 * 입력길이 지정형식의 예: 5(정수부만 5자리, 소수부 입력불가), 3.2(정수부 3자리, 소수부 2자리), 0.2(정수부 입력불가, 소수부 2자리)
 */
csCom.validateNumberLength = function (value, ctrlId) {
	var resultValue = value.replaceAll(",", "");	//반환값
	value = value.replaceAll(",", "");
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
 * 문자열이 호수의 형태인지 확인한다.
 *
 * @date 2019.03.18
 * @author 이정우
 * @memberOf csCom
 * @param {String}
 *            String 문자열
 */
csCom.isHouseNum = function(value) {
	if (value.charAt(0).toUpperCase() == "B") {	//지하층
		if (WebSquare.util.isNumber(WebSquare.util.parseInt(value.substring(1, 4), ""))) {
			return value.length == 4;
		}
	} else if (WebSquare.util.isNumber(WebSquare.util.parseInt(value, 0))) {
		return value.length == 3 || value.length == 4;
	}
	
	return false;
};

/**
 * 입력객체에 호수의 길이 유효성검사를 하고 앞에 '0'을 삽입하여 자리수를 맞춘다.(onblur에 사용)
 *
 * @date 2019.03.18
 * @author 이정우
 * @memberOf csCom
 * @param {String}
 *            ctrlId 컨트롤의 id
 */
csCom.setValidHouseNum = function(ctrlId) {
	var ctrl    = $p.getComponentById(ctrlId);
	var value   = ctrl.getValue ? ctrl.getValue().toString() : ctrl.value.toString();
	var bResult = true;

	if (value.length > 0) {
		if (csCom.isHouseNum(value)) {
			if (value.length === 3) {
				if (ctrl.setValue) {
					ctrl.setValue(com.lpad(value, 4, "0"));
				} else {
					ctrl.value = com.lpad(value, 4, "0");
				}
			}
		} else {
 			bResult = false;
		}
	}

	return bResult;
};

/**
 * 호수의 존재여부를 체크한다
 *
 * @date 2019.03.28
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {String} id 컨트롤의 id
 * @param {String} siteCd 현장코드
 * @param {String} bloCd 블록코드
 * @param {String} dong 동
 * @param {String} ho 호
 * @returns {boolean} 호수존재여부 true / false
 * @example
    var popupInfo = {
                      id     : ibxKeyHo.id
                    , siteCd : wfmSiteCd.getWindow().ibxSiteCd.getValue()
                    , bloCd  : wfmSiteCd.getWindow().ibxBloCd.getValue()
                    , dong   : sbxDong.getValue()
                    , ho     : ibxHo.getValue()
                    }
    
    csCom.validHo(popupInfo);
 */
csCom.validHo = function(popupInfo) {
	var bResult = true;

	if (popupInfo.ho.length > 0) {
		ajaxLib.ajax("/cs/cs0510/CS05100025P/selectIsExistDongHo", {
			mode		: "synchronous",
			requestData	: {
				keySiteCd : popupInfo.siteCd,
				keyBloCd  : WebSquare.util.parseInt(popupInfo.bloCd),
				keyDong   : popupInfo.dong,
				keyHo     : popupInfo.ho
			},
			callback	: function(result, e) {
				if (!result.data.isExistDongHo) {
					bResult = false;
				}
			}
	    });
	}

	return bResult;
};

/**
 * 입력객체에 호수 형태로 입력양식을 설정한다.(onkeyup에 사용)
 *
 * @date 2019.03.18
 * @author 이정우
 * @memberOf csCom
 * @memberOf csCom
 * @param {String}
 *            ctrlId 컨트롤의 id
 */
csCom.setInputHouseNum = function(ctrlId) {
	var ctrl = $p.getComponentById(ctrlId),
		value = ctrl.getValue ? ctrl.getValue().toString().trim() : ctrl.value.toString().trim(),
		valChar = "",
		regN    = /[^0-9]/gi,
		result	= "";
	
	for (var i = 0; i < value.length; i++) {
		valChar = value.charAt(i).toUpperCase();
		
		if (i == 0) {	//첫번째는 지하를 위해 "B" 허용
			if (valChar != "B")
				valChar = valChar.replace(regN, "");	//숫자만 남긴다.
		} else {	//일반
			valChar = valChar.replace(regN, "");	//숫자만 남긴다.
		}
		
		result += valChar;
	}
	
	if (ctrl.setValue) {
		ctrl.setValue(result);
	} else {
		ctrl.value = result;
	}
};

/* gridView 동적 적용 start */
/**
 * 동적 그리드 생성/스타일 변경
 * 기본적인 정보를 통해 그리드를 동적으로 생성하거나 스타일을 변경합니다.
 *
 * @date 2019. 02. 15.
 * @param {Array} gridOptionsArr JSONArray  형태로 데이터 동적 그리드생성및 스타일변경할 데이터 구조체
 * @param {String} gridOptionsArr.id 그리드ID
 * @param {String} gridOptionsArr.ref 참조할 데이터셋
 * @param {String} gridOptionsArr.colNmType 그리드의 헤더를 생성할때 id로 할것인지 name으로 할것인지 정의
 * @param {String} gridOptionsArr.colTpJsn 그리드의 바디 컬럼의 inputType="text"를 제외한 정보를 지정합니다.
 * @param {String} gridOptionsArr.type 플래그 "C":새로생성,"R":기존 그리드의 스타일변경
 * @param {String} gridOptionsArr.parentObj type="C"인경우 생성될 그리드의 부모,"R"인경우 없어도무관
 * @param {String} gridOptionsArr.style 그리드에 적용할 스타일
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
 * csCom.createGridView(gridViewInfo);
 *
 */
csCom.createGridView = function(gridOptionsArr, grd_Obj){
	if(com.isEmpty(gridOptionsArr) || gridOptionsArr.length == 0){
		//m_                        console.log(com.getPrintTime()+"[common.js][com.createGridView] 생성할 그리드 정보가 없습니다.");
		return;
	}

	for(var key in gridOptionsArr){
		if(!gridOptionsArr.hasOwnProperty(key)) continue;

		var gridObj = gridOptionsArr[key],
			dl_info = {
				id :gridObj.ref,
				ype : csCom.nvl(gridObj.colNmType, "name")  // header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
			},
        	_colTpJsn = gridObj.colTpJsn,
        	_colExp = gridObj.colExp,

        	grdStrObj  = this.grdHeaderBodyStr(dl_info,_colTpJsn,_colExp),
        	subgridObj = {
				id			: gridObj.id,
				ref			: gridObj.ref,
				style		: gridObj.style,
				headerStr	: grdStrObj.strH,
				bodyStr		: grdStrObj.strB,
				apt			: csCom.nvl(gridObj.apt, false)
        	},
        	gridStr = csCom.getGridViewSrc(subgridObj);
		
        gridObj.type = csCom.nvl(gridObj.type, "R");
        if (gridObj.type == "R") {
            grd_Obj.setGridStyle(WebSquare.xml.parse(gridStr, true));
        } else{
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
 * csCom.grdHeaderBodyStr(dl_id,colTpJsn);
 */
csCom.grdHeaderBodyStr = function(dl_info,colTpJsn,colExp){
    var rtnObj = {
    		strH: "",
    		strB: ""
    };
    
    if(com.isEmpty(dl_info.id)){
        //m_        console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스트 아이디가 없습니다.");
        return;
    }
    
    var dlObj = csCom.nvl($w.data[dl_info.id], {});
    
    if(com.isEmpty(dlObj)){
        //m_        console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스가 없습니다.");
        return;
    }
    
    var _type = csCom.nvl(dl_info.type, "name");
    var _colTpJsn = csCom.nvl(colTpJsn, {});
    var _colExp = csCom.nvl(colExp, []);
    var _colExpJsn = {};
    if(_colExp.length>0){
        for(var key in _colExp){
            if(!_colExp.hasOwnProperty(key)) continue;
            _colExpJsn[_colExp[key]] = "Y";
        }
    }

    var colIdArr = dlObj.cellIdList,
    	gridHeader = '',
    	gridBody = '';
    
    ////데이터리스트 기준으로 컬럼을 만든다.
    for (var k in colIdArr){
            if(!colIdArr.hasOwnProperty(k)) continue;
            var colid = colIdArr[k];
            if(_colExpJsn[colid] == "Y") continue;
            var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
            var _hinputType = "text"; 
            var colId2 = colid.substring(0, 5);
            
            switch (colId2) {
            case "check": _hinputType = "checkbox"
            	break;
            case "radio": _hinputType = "radio"
            	break;            	
            }
            
            gridHeader +='<w2:column blockSelect="false" id="'+'h'+colid+'" style="height:20px" inputType="'+_hinputType+'" width="70" value="'+colNm+'" readonly="true"></w2:column>';
            var inputType = csCom.nvl(_colTpJsn[colid], "text");            
            gridBody += '<w2:column blockSelect="false" id="'+colid+'" style="height:20px" inputType="'+inputType+'" width="70" readonly="true"></w2:column>';
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
 * csCom.getGridViewSrc(obj);
 */
csCom.getGridViewSrc = function(obj){
        var _id = obj.id ;
        var _datalist = obj.ref ;
        
        var gridHeader = csCom.nvl(obj.headerStr, "");
        var gridBody = csCom.nvl(obj.bodyStr, "");
        
        //var _aptType = obj.apt == true ? '" visibleRowNum="29" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptType  = obj.apt == true ? '" visibleRowNum="all" autoFit="none" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false">';
        var _aptStyle = obj.apt == true ? " width:"+$w.data[_datalist].cellIdList.length*80+"px; height: 550px;":"";
        var _style    = obj.apt == true ? _aptStyle : csCom.nvl(obj.style, "width: 100%;height: 100%;");
        
		var gridStr = '<w2:gridView xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:ev=\"http://www.w3.org/2001/xml-events\" xmlns:w2=\"http://www.inswave.com/websquare\" xmlns:xf=\"http://www.w3.org/2002/xforms\" dataList="data:'
		            + _datalist
		            + '" scrollByColumn="false" id="'
		            + _id
		            + '" style="'
		            + _style
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

/**
 * 예산편성대상현장 팝업을 오픈한다.
 *
 * @date 2019.03.26
 * @author 이정우
 * @memberOf csCom
 * @param {String} bgtStdYm 예산편성기준연월
 * @param {String} brchCd 지부코드
 * @param {String} siteNm 현장명
 * @author 이정우
    var popupInfo = {
                      bgtStdYm    : sbxBgtStdYm.getValue()
                    , brchCd      : wfmBrchCd.getWindow().sbxBrch.getValue()
                    , siteNm      : ibxSiteNm.getValue()
                    , callbackStr : "scwin.btnBgtCmpilSite_callback"
                    }
    
    csCom.openBgtCmpilSitePop(popupInfo);
 */
csCom.openBgtCmpilSitePop = function(popupInfo) {
	//팝업호출
	com.popup_open({
		popup_name : "예산편성대상현장",
		url        : "/WEB-INF/ux/cs/cs3000/CS30000505P.xml",
		data       : {
			bgtStdYm   : csCom.nvl(popupInfo.bgtStdYm, ""),
			brchCd     : csCom.nvl(popupInfo.brchCd, ""),
			siteNm     : csCom.nvl(popupInfo.siteNm, "")
		},
		callbackFn : csCom.nvl(popupInfo.callbackStr, ""),
		widType    : "L",
		height     : "578"
	});
};

/**
 * 옵션정보 팝업을 오픈한다.
 *
 * @date 2019.03.29
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {String} siteCd 현장코드
 * @param {String} bloCd 블록코드
 * @param {String} dong 동
 * @param {String} ho 호
 * @author 신설연 (tpshinsy1)
 * @example
    var popupInfo = {
                      siteCd      : wfmSiteCd.getWindow().ibxSiteCd.getValue()
                    , bloCd       : wfmSiteCd.getWindow().ibxBloCd.getValue()
                    , dong        : sbxDong.getValue()
                    , ho          : ibxHo.getValue()
                    }
    	
    csCom.openOptionInfoPopup(popupInfo);
 */
csCom.openOptionInfoPopup = function(popupInfo) {
	//팝업호출
	com.popup_open({
		popup_name : "옵션정보",
		url        : "/WEB-INF/ux/cs/cs0510/CS05100025P.xml",
		data       : {
			siteCd : csCom.nvl(popupInfo.siteCd, ""),
			bloCd  : csCom.nvl(popupInfo.bloCd, 0),
			dong   : csCom.nvl(popupInfo.dong, ""),
			ho     : csCom.nvl(popupInfo.ho, "")
		},
		widType    : "XL",
		height     : "680"
	});
};

/**
 * 휴대전화번호의 유효성을 검사한다.
 *
 * @date 2019.04.02
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {String} value 컨트롤의 입력값
 *
 * 휴대전화번호의 유효성 검사 결과가 성공이면 true 실패면 false를 리턴한다.
 */
csCom.validateCrryTelNo = function (value) {
	var regPhone = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
	value = value.split("-").join("");
	return regPhone.test(value);
};

/**
 * 입주자정보 팝업을 오픈한다.
 *
 * @date 2019.04.03
 * @author 최진희 (tpchoijh1)
 * @memberOf csCom
 * @param {String} siteCd 현장코드
 * @param {String} bloCd 블록코드
 * @param {String} dong 동
 * @param {String} ho 호
 * @param {String} callbackStr 콜백함수명
 * @author 최진희 (tpchoijh1)
    var popupInfo = {
                    , siteCd      : wfmSiteCd.getWindow().ibxSiteCd.getValue()
                    , bloCd       : wfmSiteCd.getWindow().ibxBloCd.getValue()
                    , dong        : sbxKeyDong.getValue()
                    , ho          : ibxKeyHo.getValue()
                    , callbackStr : "scwin.btnOptionInfo_callback"
                    }
    
    csCom.openOcphInfoPop(popupInfo);
 */
csCom.openOcphInfoPop = function(popupInfo) {
	//팝업호출
	com.popup_open({
		popup_name : "입주자정보",
		url        : "/WEB-INF/ux/cs/cs2000/CS20000005P.xml",
		data       : {
			siteCd     : csCom.nvl(popupInfo.siteCd, ""),
			bloCd      : csCom.nvl(popupInfo.bloCd, "0"),
			dong       : csCom.nvl(popupInfo.dong, ""),
			ho         : csCom.nvl(popupInfo.ho, "")
		},
		callbackFn : csCom.nvl(popupInfo.callbackStr, ""),
		widType    : "XL",
		height     : "705"
	});
};

/**
 * 실접수처리 팝업을 오픈한다.
 * 
 * @date 2019.04.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {Array} arrChkList JSONArray 형태로 실접수 처리하기 위해 선택한 데이터 배열
 * @param {String} callbackStr 콜백함수명
 */
csCom.openRealDeftRcptPop = function(arrChkList, callbackStr) {
	var cnt = 0;
	for (var i = 0; i < arrChkList.length; i++) {
		if (arrChkList[i].deftPrcgStusCd === "CS09001A") {
			cnt++;
		}
	}

	if (cnt > 0) {
		com.popup_open({
			popup_name : "실접수처리",
			url        : "/WEB-INF/ux/cs/cs2500/CS25000025P.xml",
			data       : arrChkList,
			widType    : "XS",
			height     : "236",
			callbackFn : callbackStr
		});
	 	
	 	return true;
	 	
	} else {
		return false;
	}
};

/**
 * 원인변경 팝업을 오픈한다.
 * 
 * @date 2019.04.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {Array} arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {String} callbackStr 콜백함수명
 */
csCom.openDeftCausChgPop = function(arrChkList, callbackStr) {
	var cnt = 0;
	for (var i = 0; i < arrChkList.length; i++) {
		if (arrChkList[i].deftPrcgStusCd === "CS09001A" ||  //가접수
		    arrChkList[i].deftPrcgStusCd === "CS09001B" ||  //실접수
		    arrChkList[i].deftPrcgStusCd === "CS09001C") {  //재하자
			cnt++;
		}
	}

	if (cnt > 0) {
		com.popup_open({
			popup_name : "원인변경",
			url        : "/WEB-INF/ux/cs/cs2500/CS25000030P.xml",
			data       : arrChkList,
			widType    : "S",
			height     : "280",
			callbackFn : callbackStr
		});
	 	
	 	return true;
	 	
	} else {
		return false;
	}
};

/**
 * 작업지시서 팝업을 오픈한다.
 * 
 * @date 2019.04.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {Array}  arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {Array}  arrSearchParamMap JSONArray 형태로 검색조건파라미터
 * @param {String} callbackStr 콜백함수명
 */
csCom.openWorkWkiPop = function(arrChkList, arrSearchParamMap, callbackStr) {
	com.popup_open({
		popup_name : "작업지시서",
		url        : "/WEB-INF/ux/cs/cs2500/CS25000060P.xml",
		data       : {
			arrChkList        : arrChkList,
			arrSearchParamMap : arrSearchParamMap
		},
		widType    : "S",
		height     : "280",
		callbackFn : callbackStr
	});
};

/**
 * 작업완료확인서 팝업을 오픈한다.
 * 
 * @date 2019.05.30
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {Array}  arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {Array}  arrSearchParamMap JSONArray 형태로 검색조건파라미터
 * @param {String} callbackStr 콜백함수명
 */
csCom.openWorkCpltCondcPop = function(arrChkList, arrSearchParamMap, callbackStr) {
	com.popup_open({
		popup_name : "작업완료확인서",
		url        : "/WEB-INF/ux/cs/cs2500/CS25000095P.xml",
		data       : {
			arrChkList        : arrChkList,
			arrSearchParamMap : arrSearchParamMap
		},
		widType    : "S",
		height     : "280",
		callbackFn : callbackStr
	});
};

/**
 * 완료처리 팝업을 오픈한다.
 * 
 * @date 2019.04.04
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {Array} arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {String} callbackStr 콜백함수명
 */
csCom.openDeftCpltPrcgPop = function(arrChkList, callbackStr) {
	var cnt = 0;
	for (var i = 0; i < arrChkList.length; i++) {
		if (arrChkList[i].deftPrcgStusCd === "CS09001B" ||  //실접수
		    arrChkList[i].deftPrcgStusCd === "CS09001C" ||  //재하자
		    arrChkList[i].deftPrcgStusCd === "CS09001E") {  //가완료
			cnt++;
		}
	}

	if (cnt > 0) {
		com.popup_open({
			popup_name : "작업완료처리",
			url        : "/WEB-INF/ux/cs/cs2500/CS25000035P.xml",
			data       : arrChkList,
			widType    : "S",
			height     : "236",
			callbackFn : callbackStr
		});
		
		return true;
		
	} else {
		return false;
	}
};

/**
 * 재하자 팝업을 오픈한다.
 * 
 * @date 2019.04.05
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {Array} arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {String} callbackStr 콜백함수명
 */
csCom.openRrcptPop = function(arrChkList, callbackStr) {
	var cnt = 0;
	for (var i = 0; i < arrChkList.length; i++) {
		if (arrChkList[i].deftPrcgStusCd === "CS09001E" ||  //가완료
		    arrChkList[i].deftPrcgStusCd === "CS09001X") {  //최종완료
			cnt++;
		}
	}

	if (cnt > 0) {
		com.popup_open({
			popup_name : "재하자",
			url        : "/WEB-INF/ux/cs/cs2500/CS25000015P.xml",
			data       : arrChkList,
			widType    : "M",
			height     : "340",
			callbackFn : callbackStr
		});

	 	return true;
	 	
	} else {
		return false;
	}
};

/**
 * 처리경과 팝업을 오픈한다.
 * 
 * @date 2019.04.05
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {String} deftNo 하자번호
 */
csCom.openPrcgElpsPop = function(deftNo) {
 	com.popup_open({
        popup_name : "처리경과",
        url        : "/WEB-INF/ux/cs/cs2500/CS25000040P.xml",
        data       : {
        	deftNo: deftNo
        },
        widType    : "M",
        height     : "393"
 	});
};

/**
 * 엑셀컬럼정의 팝업을 오픈한다.
 * 
 * @date 2019.04.08
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {String} xlsTypeCd 엑셀유형코드
 */
csCom.openXlsColDefinePop = function(xlsTypeCd) {
	com.popup_open({
		popup_name : "엑셀컬럼정의",
		url        : "/WEB-INF/ux/cs/cs2500/CS25000075P.xml",
		data       : {xlsTypeCd: xlsTypeCd},
		widType    : "M",
		height     : "390"
	});
};

/**
 * 중복접수 팝업을 오픈한다.
 * 
 * @date 2019.04.10
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   keyDeftNo           : dsTcsDeftMap.get("deftNo")            //하자번호
 *                 , keySiteCd           : dsTcsDeftMap.get("siteCd")            //현장코드
 *                 , keyBloCd            : dsTcsDeftMap.get("bloCd")             //블록코드
 *                 , keyRcptDt           : dsTcsDeftMap.get("trcptDt")           //접수일자(가접수일자)
 *                 , keyRcvprNm          : dsTcsDeftMap.get("rcvprNm")           //접수자명
 *                 , keyRcptStepCdNm     : dsTcsDeftMap.get("rcptStepCdNm")      //접수단계코드명
 *                 , keyDeftPrcgStusCdNm : dsTcsDeftMap.get("deftPrcgStusCdNm")  //하자처리상태코드명
 *                 , keyLocClsCdNm       : sbxLocClsCd.getText()                 //위치분류코드명
 *                 , keyDongNm           : dsTcsDeftMap.get("dongNm")            //동명
 *                 , keyDong             : dsTcsDeftMap.get("dong")              //동
 *                 , keyHo               : dsTcsDeftMap.get("ho")                //호
 *                 , keyLocNm            : sbxLocNo.getText()                    //위치명
 *                 , keyLocNo            : dsTcsDeftMap.get("locNo")             //위치번호
 *                 , keyDeftMjobtypNm    : sbxDeftMjobtypNo.getText()            //하자중공종명
 *                 , keyDeftJobtypNm     : sbxDeftJobtypNo.getText()             //하자공종명
 *                 , keyDeftJobtypNo     : dsTcsDeftMap.get("deftJobtypNo")      //하자공종번호
 *                 , keyDeftTypeNm       : sbxDeftTypeNo.getText()               //하자유형명
 *                 , keyDeftTypeNo       : dsTcsDeftMap.get("deftTypeNo")        //하자유형번호
 *                 , keyDeftCausNm       : dsTcsDeftMap.get("deftCausNm")        //하자원인명
 *                 , keyConsMnbdCdNm     : dsTcsDeftMap.get("consMnbdCdNm")      //시공주체코드명
 *                 , keyConsTradeNm      : sbxConsTradeCd.getText()              //시공거래처명
 *                 , keyGbCd             : "E"                                   //구분
 *                 , modiAuth            : false                                 //수정권한(기본값 true)
 *                 , callbackStr         : "scwin.btnDupDeftRcpt_callback"       //후처리함수
 *                 }
 * 
 * csCom.openDupDeftRcptPop(popupInfo);
 */
csCom.openDupDeftRcptPop = function(popupInfo) {
	com.popup_open({
		popup_name : "중복접수",
		url        : "/WEB-INF/ux/cs/cs1505/CS15050505P.xml",
		data       : popupInfo,
		widType    : "XL",
		height     : "626",
		callbackFn : popupInfo.callbackStr
	});
};

/**
 * 하자접수및처리 팝업을 오픈한다.
 * 
 * @date 2019.04.15
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   parentMenuId : "CS25000000U"
 *                 , siteCd       : dsTcsDeftMap.get("siteCd")       //현장코드
 *                 , bloCd        : dsTcsDeftMap.get("bloCd")        //블록코드
 *                 , siteNm       : dsTcsDeftMap.get("siteNm")       //현장명
 *                 , deftNo       : dsTcsDeftMap.get("deftNo")       //하자번호
 *                 , aplntNm      : ""                               //신청자명
 *                 , telNo        : ""                               //전화번호
 *                 , crryTelNo    : ""                               //휴대전화번호
 *                 , dong         : dsTcsDeftMap.get("dong")         //동
 *                 , ho           : dsTcsDeftMap.get("ho")           //호
 *                 , callbackStr  : "scwin.btnDeftRcptDtl_callback"  //후처리함수
 *                 }
 * 
 * openDeftRcptDtlPop(popupInfo);
 */
csCom.openDeftRcptDtlPop = function(popupInfo) {
	
	// 선택한 현장을 세션에 설정한다.
	this.setSelSite(popupInfo.siteCd, popupInfo.bloCd);

	com.popup_open({
		popup_name : "하자접수 및 처리 - " + csCom.nvl(popupInfo.siteNm, ""),
		url        : "/WEB-INF/ux/cs/cs2500/CS25000005P.xml",
		data       : popupInfo,
		widType    : "XL",
		height     : "850",
		callbackFn : csCom.nvl(popupInfo.callbackStr, "")
	});
};

/**
 * 그리드 높이를 자동으로 설정한다.
 * 
 * @date 2019.04.16
 * @author 이정우
 * @memberOf csCom
 * @param {Object} grid 	 그리드객체
 * @param {number} [minHeight] 최소 높이 사이즈
 * @param {number} [maxHeight] 최대 높이 사이즈
 *            
 * csCom.setGridAutoFitHeight(grdTcsVocList, 100, 200);
 */
csCom.setGridAutoFitHeight = function(grid, minHeight, maxHeight) {
    var firstHeaderId = grid.getHeaderID(0),
        gridHeight 	  = grid.getHeaderSize(firstHeaderId, "height");	//헤더높이
    
    //행높이
    for (var i = 0; i < grid.getRowCount(); i++) {
        gridHeight += grid.getCellSize(0, 0, "height") + 1;
    }
    //합계행존재시 합계행 높이 더하기
    if (grid.getFooterData(0) != undefined) {
    	gridHeight += Number(grid.getFooterStyle(0, "height").replaceAll("px", "")) + 1;
    }
    
    if (minHeight && gridHeight < minHeight) {
    	gridHeight = minHeight;
    }
    
    if (maxHeight && gridHeight > maxHeight) {
    	gridHeight = maxHeight;
    }
    
    grid.setGridHeight(gridHeight);
};

 
/**
 * 조직도 팝업을 오픈한다.
 * 
 * @date 2019.04.18
 * @author 손기범 (beganwhso@naver.com) 
 * @memberOf csCom
 * @param {String} siteCd 현장 코드 
 */
csCom.orgcPop = function(siteCd) {
	com.popup_open({
		popup_name : "조직도",
		url : "/WEB-INF/ux/cs/cs0500/CS05000075P.xml",
		data : {siteCd : siteCd},
		widType : "M",
		height : "505",
		callbackFn: ""
	});
};


/**
 * 도면정보 팝업을 오픈한다.
 * 
 * @date 2019.04.18
 * @author 손기범 (beganwhso@naver.com) 
 * @memberOf csCom
 * @param {String} siteCd 현장 코드
 * @param {String} bloCd 블록 코드
 * @param {String} pytpCd 평면 코드 
 */
csCom.drawInfoPop = function(siteCd, bloCd, pytpCd) {
	com.popup_open({
		popup_name :"도면정보",
		url	: "/WEB-INF/ux/cs/cs0500/CS05000060P.xml",
		data : {
			siteCd: siteCd,
			bloCd: bloCd,
			pytpCd: pytpCd
		},
		widType		: "S",
		height		: "500"
	});
};


/**
 * 도면정보(빨간박스 표시) 팝업을 오픈한다.
 * 
 * @date 2019.04.18
 * @author 손기범 (beganwhso@naver.com) 
 * @memberOf csCom
 * @param {String} siteCd 현장 코드
 * @param {String} bloCd 블록 코드
 * @param {String} pytpCd 평면 코드 
 * @param {String} [callbackStr] 후처리함수
 */
csCom.drawShowInfo = function(siteCd, bloCd, pytpCd, callbackStr) {
	com.popup_open({
		popup_name  : "도면정보",
		url         : "/WEB-INF/ux/cs/cs0500/CS05000065P.xml",
		data        : {
			siteCd : siteCd,
			bloCd  : bloCd,
			pytpCd : pytpCd
		},
		widType     : "S",
		height      : "500",
		callbackFn  : callbackStr
	});
};

/**
 * 이미지 첨부파일 팝업을 오픈한다.
 * 
 * @date 2019.04.18
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   popupTitle  : "사진보기"                                  //팝업타이틀(기본값 : 이미지 보기)
 *                 , menuId      : "CS15000500U"                               //화면메뉴ID
 *                 , aflId       : ""                                          //첨부파일ID
 *                 , jobGbCd     : "CS"                                        //업무구분코드(기본값 : "CS")
 *                 , fileExt     : "*.*"                                       //파일확장자(기본값 : *.*)
 *                 , usage       : ""                                          //파일첨부팝업 수정여부(기본값 : INS)
 *                 , height      : "150px"                                     //팝업높이(기본값 : 850px)
 *                 , callbackStr : $p.id + "scwin.openImgAflListPop_callback"  //후처리함수
 *                 }
 * 
 * csCom.openImgAflListPop(popupInfo);
 */
csCom.openImgAflListPop = function(popupInfo) {
	com.popup_open({
		popup_name : csCom.nvl(popupInfo.popupTitle, "이미지 보기"),
		url        : "/WEB-INF/ux/cs/cscomm/imgAflPopup.xml",
		data       : {
			menuId  : csCom.nvl(popupInfo.menuId, ""),
			aflId   : csCom.nvl(popupInfo.aflId, ""),
			jobGbCd : csCom.nvl(popupInfo.jobGbCd, "CS"),
			fileExt : csCom.nvl(popupInfo.fileExt, "*.*"),  //*.* : 제한없음, "..." : 기술한 확장자 첨부불가
			usage   : WebSquare.util.isNull(popupInfo.usage)   ? "INS" : popupInfo.usage,    //INS : CUD 버튼 허용, "" : CUD 버튼 불가
		},
		widType    : "M",
		height     : csCom.nvl(popupInfo.height, "580px"),
		callbackFn : csCom.nvl(popupInfo.callbackStr, "")
	});
};

/**
 * 작업일변경 팝업을 오픈한다.
 * 
 * @date 2019.04.25
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   deftNo      : dsTcsDeftMap.get("deftNo")                 //하자번호
 *                 , modiAuth    : false                                      //수정권한(기본값 true)
 *                 , callbackStr : $p.id + "scwin.openWorkDtChgPop_callback"  //후처리함수
 *                 }
 * 
 * csCom.openWorkDtChgPop(popupInfo);
 */
csCom.openWorkDtChgPop = function(popupInfo) {
	com.popup_open({
		popup_name : "작업일변경",
		url        : "/WEB-INF/ux/cs/cs2500/CS25000050P.xml",
		data       : {
			keyDeftNo : popupInfo.deftNo,
			modiAuth  : csCom.nvl(popupInfo.modiAuth, true)
		},
		widType    : "M",
		height     : "536px",
		callbackFn : popupInfo.callbackStr
	});
};

/**
 * SMS전송 팝업을 오픈한다.
 * 
 * @date 2019.04.26
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   deftNo       : dsTcsDeftMap.get("deftNo")               //하자번호
 *                 , crryTelNo    : dsTcsDeftMap.get("crryTelNo")            //신청자 휴대폰번호
 *                 , siteNm       : dsTcsDeftMap.get("siteAbbNm")            //현장약어명
 *                 , dong         : sbxDong.getText()                        //동
 *                 , ho           : dsTcsDeftMap.get("ho")                   //호
 *                 , deftJobtypNm : sbxDeftJobtypNo.getText()                //세부공종
 *                 , aplntNm      : dsTcsDeftMap.get("aplntNm")              //신청자명
 *                 , callbackStr  : $p.id + "scwin.openSmsTrsmPop_callback"  //후처리함수
 *                 }
 * 
 * csCom.openSmsTrsmPop(popupInfo);
 */
csCom.openSmsTrsmPop = function(popupInfo) {
	com.popup_open({
        popup_name : "SMS전송",
        url        : "/WEB-INF/ux/cs/cs2500/CS25000080P.xml",
        data       : popupInfo,
        widType    : "M",
        height     : "530px",
        callbackFn : popupInfo.callbackStr
	});
};

/**
 * 세대 하자정보 팝업을 오픈한다.
 * 
 * @date 2019.05.03
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   keySiteCd  : //현장코드
 *                 , keySiteNm  : //현장명
 *                 , keyBloCd   : //블록코드
 *                 , keyDong    : //동
 *                 , keyHo      : //호
 *                 , keyocphSeq : //입주자순번
 *                 }
 * 
 * csCom.openHhdDfRcptInfoPop(popupInfo);
 */
csCom.openHhdDfRcptInfoPop = function(popupInfo) {
	com.popup_open({
		popup_name : "하자정보",
		url        : "/WEB-INF/ux/cs/cs2500/CS25000010P.xml",
		data       : popupInfo,
		widType    : "XL",
		height     : "614px"
	});
};

/**
 * 위치바꾸기 팝업을 오픈한다.
 * 
 * @date 2019.05.13
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   keySiteCd   : dsSearchParam.get("keySiteCd")          //현장코드
 *                 , keyBloCd    : dsSearchParam.get("keyBloCd")           //블록코드
 *                 , keyGb       : "BS"                                    //구분(BS, AS)
 *                 , callbackStr : $p.id + "scwin.openLocChgPop_callback"  //후처리함수
 *                 }
 * 
 * csCom.openLocChgPop(popupInfo);
 */
csCom.openLocChgPop = function(popupInfo) {
	com.popup_open({
		popup_name : "위치바꾸기",
		url        : "/WEB-INF/ux/cs/cs1510/CS15100005P.xml",
		data       : popupInfo,
		callbackFn : popupInfo.callbackStr,
		widType    : "S",
		height     : "285px"
	});
};

/**
 * 공종바꾸기 팝업을 오픈한다.
 * 
 * @date 2019.05.14
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   keySiteCd   : dsSearchParam.get("keySiteCd")             //현장코드
 *                 , keyBloCd    : dsSearchParam.get("keyBloCd")              //블록코드
 *                 , keyGb       : "BS"                                       //구분(BS, AS)
 *                 , callbackStr : $p.id + "scwin.openJobtypChgPop_callback"  //후처리함수
 *                 }
 * 
 * csCom.openJobtypChgPop(popupInfo);
 */
csCom.openJobtypChgPop = function(popupInfo) {
	com.popup_open({
		popup_name : "공종바꾸기",
		url        : "/WEB-INF/ux/cs/cs1510/CS15100010P.xml",
		data       : popupInfo,
		callbackFn : popupInfo.callbackStr,
		widType    : "S",
		height     : "285px"
	});
};

/**
 * 유형/원인 바꾸기 팝업을 오픈한다.
 * 
 * @date 2019.05.14
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   keySiteCd   : dsSearchParam.get("keySiteCd")               //현장코드
 *                 , keyBloCd    : dsSearchParam.get("keyBloCd")                //블록코드
 *                 , keyGb       : "BS"                                         //구분(BS, AS)
 *                 , callbackStr : $p.id + "scwin.openTypeCausChgPop_callback"  //후처리함수
 *                 }
 * 
 * csCom.openTypeCausChgPop(popupInfo);
 */
csCom.openTypeCausChgPop = function(popupInfo) {
	com.popup_open({
		popup_name : "유형/원인 바꾸기",
		url        : "/WEB-INF/ux/cs/cs1510/CS15100015P.xml",
		data       : popupInfo,
		callbackFn : popupInfo.callbackStr,
		widType    : "S",
		height     : "300px"
	});
};

/**
 * 하자유형 팝업을 오픈한다.
 * 
 * @date 2019.05.14
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @example
 * var popupInfo = {
 *                   keyDeftJobtypNo : dsTcsXlsDeftList.getCellData(row, "deftJobtypNo")  //하자공종번호
 *                 , keyDeftJobtypNm : dsTcsXlsDeftList.getCellData(row, "deftJobtypNm")  //하자공종명
 *                 , callbackStr     : $p.id + "scwin.btnDeftTypeSrch_callback"           //후처리함수
 *                 }
 * 
 * csCom.openDeftTypePop(popupInfo);
 */
csCom.openDeftTypePop = function(popupInfo) {
	com.popup_open({
		popup_name : "하자유형",
		url        : "/WEB-INF/ux/cs/cs1510/CS15100020P.xml",
		data       : popupInfo,
		callbackFn : popupInfo.callbackStr,
		widType    : "S",
		height     : "550px"
	});
};

/**
 * 텔레피아 메일전송 팝업을 오픈한다.
 * 
 * @date 2019.09.30
 * @author 송병기(tpsdk)
 * @memberOf csCom
 */
csCom.openTelepiaMailPop = function(popupInfo) {
	if (popupInfo && popupInfo.xml && popupInfo.url) {
	    var $form  = $("<form></form>");
	    var newwin = window.open('about:blank','gw_mail','top=0, left=0, width=1014, height=694, status=yes, toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=no');
	    newwin.focus();  //새창을 띄울때 항상 위
	    
	    $form.attr("target", "gw_mail");
	    $form.attr("action", popupInfo.url);
	    $form.attr("method", "post");
	    $form.attr("accept-language", "ko");
	    $form.appendTo('body');
	    
	    var $input = $("<input></input>");
	    $input.attr({type : "hidden", name : "Message", id : "Message", value : popupInfo.xml});
	    $input.appendTo($form);
	    $form.submit();
	}
};

/**
 * 동적 그리드를 생성한다.
 * 
 * @date 2019.06.21
 * @author 신설연 (tpshinsy1)
 * @memberOf csCom
 * @param {String} grdId       그리드ID
 * @param {Object} gridInfo    gridViewInfo
 * @param {Object} parentObj   gridView를 감싸는 group
 * @param {String} [callbackStr] 후처리Function
 * 
 * csCom.createDynamicGrd(grdId, gridInfo, parentObj, callbackStr) {
 */
csCom.createDynamicGrd = function (grdId, gridInfo, parentObj, callbackStr) {
    var gridViewStr = "";
    var strGrid     = gridInfo.grid;
    var arHeader    = gridInfo.header;
    var arColumn    = gridInfo.column;
    var arSubTotal  = gridInfo.subTotal;
    var arFooter    = gridInfo.footer;
   
    //그리드 태그
    gridViewStr = strGrid;
    
    //그리드 헤더
    gridViewStr += '<w2:header id="' + grdId + '_header" style="">';
   
    for (var i = 0; i < arHeader.length; i++) {
        gridViewStr += '<w2:row id="' + grdId + '_headerRow' + i + '" style="">';

        for (var j = 0; j < arHeader[i].length; j++) {
            gridViewStr += arHeader[i][j];
        }
        
        gridViewStr += '</w2:row>';
    }
	
    gridViewStr += '</w2:header>';
   
    //그리드 컬럼
    gridViewStr += '<w2:gBody id="' + grdId + '_gBody" style="">';
    gridViewStr += '<w2:row style="" id="' + grdId + '_row1">';
    
    for (var i = 0; i < arColumn.length; i++) {
        gridViewStr += arColumn[i];
    }
    
    gridViewStr += '</w2:row>';
    gridViewStr += '</w2:gBody>';
    
    //소계행
    if (arSubTotal) {
	    if (arSubTotal.length > 0) {
	    	gridViewStr += '<w2:subTotal id="' + grdId + '_subtotal" style="" targetColumnID="upperCdNm">';
	    	gridViewStr += '<w2:row style="" id="' + grdId + '_row3">';
	    	
	    	for (var i = 0; i < arSubTotal.length; i++) {
	    		gridViewStr += arSubTotal[i];
	    	}
	    	
	    	gridViewStr += '</w2:row>';
	    	gridViewStr += '</w2:subTotal>';
	    }
    }
    
    //합계행
    if (arFooter) {
	    if (arFooter.length > 0) {
	    	gridViewStr += '<w2:footer id="' + grdId + '_footer" style="">';
	    	gridViewStr += '<w2:row style="" id="' + grdId + '_row2">';
	    	
	    	for (var i = 0; i < arFooter.length; i++) {
	    		gridViewStr += arFooter[i];
	    	}
	    	
	    	gridViewStr += '</w2:row>';
	    	gridViewStr += '</w2:footer>';
	    }
    }
    
    gridViewStr += "</w2:gridView>";
    
    WebSquare.util.dynamicCreate(grdId, "gridView", gridViewStr, parentObj);

    if (callbackStr) {
    	(new Function(callbackStr + "();"))();
    }
};

/**
 * 권한 여부를 리턴한다.
 * 
 * @date 2019.08.23
 * @author 송병기 (tpsbk)
 * @memberOf csCom
 * @returns {boolean} 권한 여부
 */
csCom.authIn = function () {
	var asUserAuth = csCom.getAsUserAuth();
	var asAuthGrpCd = asUserAuth.asAuthGrpCd;	//AS권한그룹코드
	
	if (typeof(asAuthGrpCd) == "string") {
		return String.prototype.in.apply(asAuthGrpCd, Array.prototype.slice.call(arguments));
	}
	return false;
	//return (gcm.WHOLE_ATTR_CD||gcm.BZDP_ATTR_CD||gcm.DEPT_ATTR_CD) == "CF06902";
};

/**
 * 전자보증팝업
 * @date     2019.08.28
 * @author   신설연 (tpshinsy1)
 * @memberOf csCom
 * @param    guarScrtObj
 * @example
 * viewGuarScrtPopup(guarScrtObj)
 */
csCom.viewGuarScrtPopup = function(info) {
	
	com.popup_open({
		popup_name	: "보증서 보기",
		data		: {
			contractType	: info.contractType,	// 1:외주 2:자재 3:하자
			guaranteeType	: info.guaranteeType,	// 1:입찰보증서  2:계약보증서 3:하자보증서 4:선급보증서 (이외에는 전자보증 없음)
			grtcertOrd		: info.grtcertOrd,		// 기간:1 금액:2 그 외 0
													// 계약보증서구분	CF01810:당초	CF01820:기간변경	CF01830:금액변경	CF01840:기간및금액변경
													// 선급보증서구분	CF01910:당초	CF01920:기간연장	CF01930:선급금추가
													// 하자보증서는 없음
			guarIntuCd		: info.guarIntuCd,		// 보증사 코드
			siteCd			: info.siteCd,			// 현장코드
			cntrtNo			: info.cntrtNo,			// 계약번호
			cntrtDgr		: info.cntrtDgr,		// 계약차수
			guarNo			: info.guarNo,			// 보증번호(안 보내도 됨)
			inUser			: info.inUser,			// 온라인 보증에 대해 승인 반려 권한이 있는 사용자인 경우 Y
			elecGuarPrgsStusCd	: info.elecGuarPrgsStusCd	// 보증상태코드[CF017]
		},
		url			: "/ux/epro/PO60300000P.xml",
		widType		: "XL",
		height		: "650",
		type		: "browser",
		callbackFn	: info.callback		//예: "scwin.popupCallback"
	});
};

/**
 * 동적으로 DataMap 생성
 * @date     2019.10.08
 * @author   송병기 (tpsbk)
 * @memberOf csCom
 * @param {String} id DataMap의 ID
 * @param {Object[]} keys DataMap의 키 목록
 * @example
 * csCom.createDataMap("dsTestMap", [
 *     {id: "key1", dataType: "text"},
 *     {id: "key2", dataType: "number"},
 * ]);
 * 
 */
csCom.createDataMap = function (id, keys) {
	$p.data.create({
		id : id,
		type : "dataMap",
		option : {
			baseNode : "map"
		},
		keyInfo : keys
	});
};

/**
 * DataMap 혹은 DataList 삭제
 * @date     2022.09.13
 * @author   mylee
 * @memberOf csCom
 * @param {String} id DataMap 혹은 DataList ID
 * @example
 * csCom.removeDataSetList("dsTestMap");
 * 
 */
csCom.removeDataSetList = function (id) {
	$p.data.remove(id);
};

/**
 * 동적으로 DataList 생성
 * @date     2019.10.08
 * @author   송병기 (tpsbk)
 * @memberOf csCom
 * @param {String} id DataList의 ID
 * @param {Object[]} columns DataMap의 컬럼 목록
 * @example
 * csCom.createDataMap("dsTestList", [
 *     {id: "column1", dataType: "text"},
 *     {id: "column2", dataType: "number"},
 * ]);
 * 
 */
csCom.createDataList = function (id, columns) {
	$p.data.create({
		id : id,
		type : "dataList",
		option : {
			baseNode : "list",
			repeatNode : "map",
			saveRemovedData : true
		},
		columnInfo : columns
	});
};

csCom.transComma = function (val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

csCom.nvl = function(obj, val) {
	if (obj === null || obj === undefined || obj === "") {
		return val;
	}

	return obj;
};


csCom.downLoadExcel = function(grdObj, options, infoArr) {

    if (!options) {
        options = {
            hiddenVisible : false,
            fileName : "excel.xlsx"
        }
    }

    // excel 다운로드시 기본 설정으로 화면내의 hidden컬럼을 removeColumns에 포함시킨다.
    // 이를 원치 않을 경우 options.hiddenVisible = 'true' 로 설정한다.
    if (!options.hiddenVisible) {
        var grdCnt = grdObj.getTotalCol();

        var hiddenColIndex = [];
        for (var idx = 0; idx < grdCnt; idx++) {
            if (!grdObj.getColumnVisible(idx)) {
                hiddenColIndex.push(idx);
            }
        }
        // hidden 컬럼이 있는 경우만 추가할 수 있도록 (2016.10.28 추가)
        if (hiddenColIndex.length > 0) {
            if (options.removeColumns && options.removeColumns.length > 0) {
                options.removeColumns = options.removeColumns + "," + hiddenColIndex.join(',');
            } else {
                options.removeColumns = hiddenColIndex.join(',');
            }

            // 중복 요소 제거
            var _removeColumnArr = options.removeColumns.split(",");
            options.removeColumns = _removeColumnArr.reduce(function(a, b) {
                if (a.indexOf(b) < 0) {
                    a.push(b);
                }
                return a;
            }, []).join(',');
        }
    }

    var _fontName = "맑은 고딕";

    var options = {
        fileName : options.fileName || "excel.xlsx", //String, [defalut: excel.xlsx] 다운로드하려는 파일의 이름으로 필수 입력 값이다.
        sheetName : options.sheetName || "sheet", //String, [defalut: sheet] excel의 sheet의 이름
        type : options.type || "0", //String, [defalut: 0] type이 0인 경우 실제 데이터 1인 경우 눈에 보이는 데이터를  2이면 들어가 있는 data 그대로(filter무시 expression 타입의 셀은 나오지 않음)
        removeColumns : options.removeColumns || "", //String, [defalut: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
        removeHeaderRows : options.removeHeaderRows || "", //String, [defalut: 없음]	다운로드시 excel에서 삭제하려는 Header의 row index(여러 개일 경우 ,로 구분)
        foldColumns : options.foldColumns || "", //String, [defalut: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
        startRowIndex : options.startRowIndex || 0, //Number, excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
        startColumnIndex : options.startColumnIndex || 0, //Number, excel파일에서 그리드의 데이터가 시작되는 열의 번호(헤더 포함)
        headerColor : options.headerColor || "", //String, excel파일에서 그리드의 header부분의 색
        headerFontName : options.headerFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 header부분의 font name
        headerFontSize : options.headerFontSize || "10", //String, excel파일에서 그리드의 header부분의 font size
        headerFontColor : options.headerFontColor || "", //String, excel파일에서 그리드의 header부분의 font색
        bodyColor : options.bodyColor || "#FFFFFF", //String, excel파일에서 그리드의 body부분의 색
        bodyFontName : options.bodyFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 body부분의 font name
        bodyFontSize : options.bodyFontSize || "10", //String, excel파일에서 그리드의 body부분의 font size
        bodyFontColor : options.bodyFontColor || "", //String, excel파일에서 그리드의 body부분의 font색
        subTotalColor : options.subTotalColor || "#CCFFCC", //String, [defalut: #CCFFCC] excel파일에서 그리드의 subtotal부분의 색
        subTotalFontName : options.subTotalFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font name
        subTotalFontSize: options.subTotalFontSize || "10", //String, [defalut: 10] excel파일에서 그리드의 subtotal부분의 font size
        subTotalFontColor : options.subTotalFontColor || "", //String, [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font색
        footerColor : options.footerColor || "#008000", //String, [defalut: #008000] excel파일에서 그리드의 footer부분의 색
        footerFontName : options.footerFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 footer부분의 font name
        footerFontSize : options.footerFontSize || "10", //String, [defalut: 10] excel파일에서 그리드의 footer부분의 font size
        footerFontColor : options.footerFontColor || "", //String, [defalut: 없음] excel파일에서 그리드의 footer부분의 font색
        oddRowBackgroundColor : options.oddRowBackgroundColor || "", //String, excel파일에서 그리드 body의 홀수줄의 배경색
        evenRowBackgroundColor : options.evenRowBackgroundColor || "", //String, [defalut: 없음] excel파일에서 그리드 body의 짝수줄의 배경색
        rowNumHeaderColor : options.rowNumHeaderColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 배경색
        rowNumHeaderFontName : options.rowNumHeaderFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트이름
        rowNumHeaderFontSize : options.rowNumHeaderFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트크기
        rowNumHeaderFontColor : options.rowNumHeaderFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트색상
        rowNumBodyColor : options.rowNumBodyColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 배경색
        rowNumBodyFontName : options.rowNumBodyFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트이름
        rowNumBodyFontSize : options.rowNumBodyFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트크기
        rowNumBodyFontColor : options.rowNumBodyFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트색상
        rowNumFooterColor : options.rowNumFooterColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 배경색
        rowNumFooterFontName : options.rowNumFooterFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트이름
        rowNumFooterFontSize : options.rowNumFooterFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트크기
        rowNumFooterFontColor : options.rowNumFooterFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트색상
        rowNumSubTotalColor : options.rowNumSubTotalColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 배경색
        rowNumSubTotalFontName : options.rowNumSubTotalFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트이름
        rowNumSubTotalFontSize : options.rowNumSubTotalFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트크기
        rowNumSubTotalFontColor : options.rowNumSubTotalFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트색상
        rowNumHeaderValue : options.rowNumHeaderValue || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Header 영역의 출력값
        rowNumVisible : options.rowNumVisible || "false", //String, [defalut: false] 순서출력 유무
        showProcess : WebSquare.util.getBoolean(options.showProcess) || true, //Boolean, [defalut: true] 다운로드 시 프로세스 창을 보여줄지 여부
        massStorage : WebSquare.util.getBoolean(options.massStorage) || true, //Boolean, [defalut: true] 대용량 다운로드 여부 (default는 true 이 옵션을 true로 하고 showConfirm을 false로 한 경우에 IE에서 신뢰할만한 사이트를 체크하는 옵션이 뜬다.)
        showConfirm : WebSquare.util.getBoolean(options.showConfirm) || false, //Boolean, [defalut: false] 다운로드 확인창을 띄울지 여부(옵션을 킨 경우 advancedExcelDownload를 호출후 사용자가 window의 버튼을 한번더 클릭해야 한다. massStorage는 자동으로 true가 된다)
        dataProvider : options.dataProvider || "", //String, [defalut: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Provider Package
        providerRequestXml : options.providerRequestXml || "", //String, [defalut: 없음] Provider 내부에서 사용할 XML 문자열
        userDataXml : options.userDataXml || "", //String, [defalut: 없음] 사용자가 서버모듈 개발 시 필요한 데이터를 전송 할 수 있는 변수
        bodyWordwrap : WebSquare.util.getBoolean(options.bodyWordwrap) || false, //Boolean, [defalut: false] 다운로드시 바디의 줄 바꿈 기능
        useEuroLocale : options.useEuroLocale || "false", //String, [defalut: false] 다운로드시 유로화 처리 기능(,와 .이 반대인 경우처리)
        useHeader : options.useHeader || "true", //String, [defalut: true] 다운로드시 Header를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
        useSubTotal : options.useSubTotal || "false", //String, [defalut: false] 다운로드시 SubTotal을 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력), expression을 지정한 경우 avg,sum,min,max,targetColValue,숫자를 지원 함.
        useSubTotalData: options.useSubTotalData || "false",
        useFooter : options.useFooter || "true", //String, [defalut: true] 다운로드시 Footer를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
        useFooterData : options.useFooterData|| "false",
        separator : options.separator || ",", //String, [defalut: ,] 다운로드시 서버로 데이터 전송할때, 데이터를 구분짓는 구분자, default는 comma(,)
        subTotalScale : options.subTotalScale || -1, //Number, [defalut: -1] 다운로드시 subTotal 평균계산시 소수점 자리수를 지정
        subTotalRoundingMode : options.subTotalRoundingMode || "", //String, [defalut: 없음] 다운로드시 subTotal 평균계산시 Round를 지정 한다. ("CEILING","FLOOR","HALF_UP")
        useStyle : csCom.nvl(options.useStyle, "true"), //String, [defalut: true] 다운로드시 css를 제외한, style을 excel에도 적용할 지 여부 (배경색,폰트)
        freezePane : options.freezePane || "", //String, [defalut: ""] 틀고정을 위한 좌표값 및 좌표값의 오픈셋 ( ex) freezePane="3,4" X축 3, Y축 4에서 틀고정, freezePane="0,1,0,5" X축 0, Y축 1에서 X축으로 0, Y축으로 5로 틀공정  )
        autoSizeColumn : options.autoSizeColumn || "true", //String, [defalut: false] 너비자동맞춤 설정 유무 - 2016.08.18 옵션 설정을 true로 변경
        displayGridlines : options.displayGridlines || "", //String, [defalut: false] 엑셀 전체 셀의 눈금선 제거 유무
        colMerge : csCom.nvl(options.colMerge, "true"), //String, [defalut: true] colMerge된 컬럼을 Merge해서 출력 할 지 여부
        colMergeTextAlign : options.colMergeTextAlign || "center", //String [default: center] colMerge된 컬럼의 textAlign설정 (bottom, center, top 설정)
        mergeCell : options.mergeCell || "false", //String, //String, [default: false] gridView mergeCell API로 cell 머지시, excel에도 동일하게 머지되어 다운로드 할지 여부
        useDataFormat : csCom.nvl(options.useDataFormat, "true"), //String, [defalut: 없음] 그리드 dataType이 text인 경우, 엑셀의 표시형식 '텍스트' 출력 유무( "true"인 경우 표시형식 텍스트, "false"인 경우 표시형식 일반 출력)
        indent : csCom.nvl(options.indent, "2"), //String, [defalut: 없음] 그리드 dataType이 drilldown인 경우, indent 표시를 위한 공백 삽입 개수, default값은 0
        columnMove : options.columnMove || "", //String, [defalut: false] 그리드 컬럼이동시 이동된 상태로 다운로드 유무 ( "true"인경우 컬럼이동 순서대로 출력 )
        columnOrder : options.columnOrder || "", //String, [defalut: 없음] 엑셀 다운로드시 다운로드되는 컬럼 순서를 지정 할 수 있는 속성 ( ex) "0,3,2,1"로 지정시 지정한 순서로 다운로드된다 )
        fitToPage : options.fitToPage || "false", //String, [defalut: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
        landScape : options.landScape || "false", //String, [defalut: false] 엑셀 프린터 출력시 가로 방향 출력 유무
        fitWidth : options.fitWidth || "1", //String, [defalut: 1] 엑셀 프린터 출력시 용지너비
        fitHeight : options.fitHeight || "1", //String, [defalut: 1] 엑셀 프린터 출력시 용지높이
        scale : options.scale || "100", //String, [defalut: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
        pageSize : options.pageSize || "A4" //String, [defalut: A4] 엑셀 프린터 출력시 인쇄용지 설정 ( ex) "A3", "A4", "A5", "B4" )
    };
    
    if (infoArr) {
    	if (!$.isArray(infoArr)) {
    		infoArr = [infoArr];
    	}
    	
    	for (var i = 0; i < infoArr.length; i++) {
    	    infoArr[i] = {
	            rowIndex : infoArr[i].rowIndex || 0, //Number, 내용을 표시할 행번호
	            colIndex : infoArr[i].colIndex || 0, //Number, 내용을 표시할 열번호
	            rowSpan : infoArr[i].rowSpan || 0, //Number, 병합할 행의 수
	            colSpan : infoArr[i].colSpan || 0, //Number, 병합할 열의 수
	            text : infoArr[i].text || "", //String, 표시할 내용
	            textAlign : infoArr[i].textAlign || "left", //String, 표시할 내용의 정렬 방법 left, center, right
	            fontSize : infoArr[i].fontSize || "10px", //String, font size 설정 20px, 10px, 5px
	            fontName : infoArr[i].fontName || _fontName, //String, font name 설정
	            color : infoArr[i].color || "", //String, font color 설정 red, blue, green
	            fontWeight : infoArr[i].fontWeight || "", //String, font weight 설정 bold
	            drawBorder : infoArr[i].drawBorder || "false", //String, cell의 border지정 true, false
	            wordWrap : infoArr[i].wordWrap || "", //String, cell의 줄 바꿈 기능 true, false
	            bgColor : infoArr[i].bgColor || "" //String, cell의 배경 color 설정 red, blue, green
	        };
    	}
    }

    grdObj.advancedExcelDownload(options, infoArr);
};

(function () {
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(search, pos) {
			return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
		};
	}

	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(searchString, position) {
			var subjectString = this.toString();
			if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		  };
	}
	
	
	if (!String.prototype.in) {
		Number.prototype.in =
		String.prototype.in = function() {
			var val = this.valueOf();
			for(var i in arguments) {
				if (val === arguments[i]) {
					return true;
				}
			}
			return false;
		};
	}
	
	if (!String.prototype.notIn) {
		Number.prototype.notIn =
		String.prototype.notIn = function() {
			var val = this.valueOf();
			for(var i in arguments) {
				if (val === arguments[i]) {
					return false;
				}
			}
			return true;
		};
	}
	
})();