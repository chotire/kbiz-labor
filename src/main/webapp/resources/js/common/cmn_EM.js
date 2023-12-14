/**
 * 1. emCom 은 업무별로 정의하시면 되겠습니다.
 * 2. 이하 구현하신 함수를 cmn.js의 함수명과 동일한경우 overriding합니다.

 * 하자 Scope에서 공유되는 전역 변수, 상수, 공통 함수를 정의한다.
 * 
 * @version 1.0
 * @author EM
 * @type emCom
 * @class emCom
 * @namespace gcmmgCom
 */
var emCom = com;//mgCom 은 업무별로 정의하시면 되겠습니다.

var callBackInfo = {};	//콜백정보

emCom.initFunction = function(){
	console.log("over riding ");
};

/**
 * 회계 계정과목 선택 팝업을 호출한다.
 *
 * @date 2019.04.05
 * @author EM
 * @memberOf emCom
 * @example
    openAcctCd();
 */
emCom.openAcctCd = function(popupInfo) {
	
	var popOps = {
			       popup_name : "회계 계정과목 선택"
                 , url        : "/ux/em/em0090/EM00900012P.xml"
                 , data       : {
                	              acctCd  : (WebSquare.util.isNull(popupInfo.acctCd) ? "" : popupInfo.acctCd)
		                        , acctNm  : (WebSquare.util.isNull(popupInfo.acctNm) ? "" : popupInfo.acctNm)
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "M"
                 , height     : "500"
	             };
	
 	com.popup_open(popOps);
};

/**
 * 전표 계정과목 선택 팝업을 호출한다.
 *
 * @date 2019.04.11
 * @author EM
 * @memberOf emCom
 * @example
    openTemAcctCd();
 */
emCom.openTemAcctCd = function(popupInfo) {
	
	var popOps = {
			       popup_name : "전표 계정과목 선택"
                 , url        : "/ux/em/em0090/EM00900013P.xml"
                 , data       : {
                	              acctCd  : (WebSquare.util.isNull(popupInfo.acctCd) ? "" : popupInfo.acctCd)
		                        , acctNm  : (WebSquare.util.isNull(popupInfo.acctNm) ? "" : popupInfo.acctNm)
		                        , slipMngScrGbCd : (WebSquare.util.isNull(popupInfo.slipMngScrGbCd) ? "" : popupInfo.slipMngScrGbCd)
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "M"
                 , height     : "500"
	             };
	
 	com.popup_open(popOps);
};

/**
 * 귀속부서조회 팝업을 호출한다.
 *
 * @date 2019.04.05
 * @author EM
 * @memberOf emCom
 * @example
    openRvtDeptCd();
 */
emCom.openRvtDeptCd = function(popupInfo) {
	
	var popOps = {
			       popup_name : "귀속부서조회"
                 , url        : "/ux/em/em0090/EM00900002P.xml"
                 , data       : {
                	              rvtDeptCd  : (WebSquare.util.isNull(popupInfo.rvtDeptCd) ? "" : popupInfo.rvtDeptCd)
		                        , rvtDeptNm  : (WebSquare.util.isNull(popupInfo.rvtDeptNm) ? "" : popupInfo.rvtDeptNm)
		                        , wrtDeptCd  : (WebSquare.util.isNull(popupInfo.wrtDeptCd) ? "" : popupInfo.wrtDeptCd)
		                        }
        		 , callbackFn : popupInfo.callbackStr
                 , widType    : "M"
                 , height     : "500"
	             };
	
 	com.popup_open(popOps);
};

/**
 * 로그인 부서가 회계팀이면 true 아니면 false.
 *
 * @date 2019.04.05
 * @author EM
 * @memberOf emCom
 * @example
    emCom.isAccoutTeam();
 */
emCom.isAccoutTeam = function() {
	
	if(sessionStorage.getItem("deptCd") == "K400160") {
		return true;
	} else {
		return false;
	}
  
}