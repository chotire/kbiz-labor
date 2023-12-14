var prCom = {};

//업무구분 코드
prCom["JOB_GB_CD"]          = "PR";

//파일업로드 허용 확장자
prCom["FILE_EXT"]           = "txt,xlsx,doc,pdf,docx,ppt,pptx";

//파일COL뷰(col1,col2,col3,col4)
prCom["FILE_DEFAULT_COL"]   = "col2";

//파일입력가능
prCom["FILE_DEFAULT_INS"]   = "INS";

/*************************************************************************************/
//CONFIRM
prCom["CFM_SAVE"]           = "저장 하시겠습니까?";

//CONFIRM
prCom["CFM_DELETE"]         = "삭제 하시겠습니까?";

//CONFIRM
prCom["CFM_APRV"]           = "결재기안처리 하시겠습니까?";

//CONFIRM
prCom["CFM_ALL_APRV_U"]     = "결재승인 하시겠습니까?";

//CONFIRM
prCom["CFM_ALL_APRV_C"]     = "결재기안 하시겠습니까?";
/*************************************************************************************/

//결재화면
prCom["APPR_URL"]           = "/ux/cf/CF00350502P.xml";

//결재요청팝업창
prCom["APPR_REQUEST_POPUP"] = "결재요청";

//결재승인팝업창
prCom["APPR_PROC_POPUP"]    = "결재승인";

//결재승인팝업창
prCom["APPR_FIND_POPUP"]    = "결재현황";

//결재팝업창 width
prCom["APPR_WIDTH"]         = "600";

//결재팝업창 height
prCom["APPR_HEIGHT"]        = "500";


/**
 * page초기화
 */
prCom.initFrame = function(obj){
	$p = obj;
};

/**
 * PR내부일괄승인
 * @private
 * @param aprvJobCd     
 * @param intAprvNo     
 * @param intAprvStusCd 
 * @example
 *
 * fnAllAprvUpdate("PR100070", intAprvNoList, "CF00702")
 */
prCom.fnAllAprvUpdate = function(aprvJobCd, intAprvNoList, intAprvStusCd){
	var resultCd;
	var paramData = {};
	
	paramData.aprvJobCd     = aprvJobCd;		 //PR690(내부결재처리구분)
	paramData.intAprvNoList     = intAprvNoList; //내부결재번호 List
	paramData.intAprvStusCd = intAprvStusCd;	 //내부결재상태코드[CF041]
	
	//서비스 호출
	ajaxLib.ajax("/pr/prcomm/updatePrAllTcfIntAprv", {
        mode		: "synchronous",
        requestData	: JSON.stringify(paramData),
        errCallback : "",
        callback    : function (result, e) {
        	resultCd = "success";
  	    }
    });
	
	if(resultCd == "success") {
		return true;
	}
	
	return false;
};

/**
 * PR내부일괄기안 
 * @private
 * @param aprvJobCd     
 * @param intAprvNo     
 * @param intAprvStusCd 
 * @example
 *
 * fnAllAprvInsert("PR100070", intAprvList)
 */
prCom.fnAllAprvInsert = function(aprvJobCd, intAprvList){
	var resultCd;
	var paramData = {};
	
	paramData.aprvJobCd     = aprvJobCd;		//PR690(내부결재처리구분)
	paramData.intAprvList   = intAprvList;	    //결재대상 List
	
	//서비스 호출
	ajaxLib.ajax("/pr/prcomm/insertPrAllTcfIntAprv", {
        mode		: "synchronous",
        requestData	: JSON.stringify(paramData),
        errCallback : "",
        callback    : function (result, e) {
        	resultCd = "success";
  	    }
    });
	
	if(resultCd == "success") {
		return true;
	}
	
	return false;
};

/**
 * PR내부결재후처리
 * @private
 * @param aprvJobCd     : PR690(내부결재처리구분)
 * @param intAprvNo     : 승인ID
 * @param intAprvStusCd : 내부결재상태코드[CF041]
 * @example
 *
 * prCom.fnAprvSave("PR100020", "20190404_130638_813", "CF00701", sParam)
 */
prCom.fnAprvSave = function(aprvJobCd, intAprvNo, intAprvStusCd, paramData) {
	
	var resultCd;
	
	paramData.aprvJobCd     = aprvJobCd;		//PR690(내부결재처리구분)
	paramData.intAprvNo     = intAprvNo;		//승인ID
	paramData.intAprvStusCd = intAprvStusCd;	//내부결재상태코드[CF041]

	//서비스 호출
	ajaxLib.ajax("/pr/prcomm/updatePrAprvAfterStatus", {
        mode		: "synchronous",
        requestData	: JSON.stringify(paramData),
        errCallback : "",
        callback    : function (result, e) {
        	resultCd = "success";
  	    }
    });
	
	if(resultCd == "success") {
		return true;
	}
	
	return false;
};

/**
 * 공통결재팝업호출
 * @private
 * @param gubunCd       : gcm.APPR_REQUEST, gcm.APPR_PROC, gcm.APPR_FIND
 * @param paramData     : paramData
 * @example
 *
 * prCom.fnAprvProcPopup(gcm.APPR_REQUEST, paramData)
 */
prCom.fnAprvProcPopup = function(gubunCd, paramData) {

	var popupName = ""; //결재창명
	var apprEmpno = ""; //승인자사번
	var apprEmpNm = ""; //승인자명
	
	//결재창명
	if(!com.isEmpty(paramData.popupName)) {
		popupName = paramData.popupName;
	}
	else {
		//기본값(결재요청)
		if(gubunCd == gcm.APPR_REQUEST) {
			popupName = prCom.APPR_REQUEST_POPUP;
		}
		//기본값(결재승인)
		else if(gubunCd == gcm.APPR_PROC) {
			popupName = prCom.APPR_PROC_POPUP;
		}
		//기본값(결재현황)
		else if(gubunCd == gcm.APPR_FIND) {
			popupName = prCom.APPR_FIND_POPUP;
		}
	}
	
	//승인자사번
	if(paramData.apprEmpno != undefined) {
		apprEmpno = paramData.apprEmpno;
		apprEmpNm = paramData.userNm;
	}
	else {
		apprEmpno = sessionStorage.userEmpno;
		apprEmpNm = sessionStorage.userNm;
	}
	
	//결재요청
	if(gubunCd == gcm.APPR_REQUEST) {
	
		var popOps = {
				 popup_name: popupName
	            ,url:prCom.APPR_URL
				,data:{ gubunCd:gcm.APPR_REQUEST			// gcm.APPR_REQUEST, gcm.APPR_PROC, gcm.APPR_FIND
		            , intAprvNo:""
		            , cancelYn:"" 							// 승인을 취소할 수 있는 경우 “Y”
		            , intAprvTtl:paramData.intAprvTtl		// 내부결재제목
			        , intAprvReqOpinCn:""					// 내부_결재_요청_의견_내용
			        , apprEmpno:apprEmpno			        // 승인자사번
			        , apprEmpNm:apprEmpNm			        // 승인자명
			        , intAprvAproOpinCn:""					// 내부_결재_승인_의견_내용
			        , jobGbCd:prCom.JOB_GB_CD				// 업무구분코드(PR)
			        , menuId:""								// 메뉴ID
			        , scrUrl:""								// 화면_URL
		        	, refN1ItmlNm:paramData.refN1ItmlNm		// 참조항목1
		        	, refN2ItmlNm:paramData.refN2ItmlNm		// 참조항목2
		        	, refN3ItmlNm:paramData.refN3ItmlNm		// 참조항목3
	  			 }
		        ,width:  prCom.APPR_WIDTH
		        ,height: prCom.APPR_HEIGHT
	           ,callbackFn:paramData.callbackFn
		    };
	
		com.popup_open(popOps);
	}
	//승인/반려
	else if(gubunCd == gcm.APPR_PROC) {
		
		var popOps = {
				 popup_name: popupName
	            ,url:prCom.APPR_URL
				,data:{ gubunCd:gcm.APPR_PROC				// gcm.APPR_REQUEST, gcm.APPR_PROC, gcm.APPR_FIND
		            , intAprvNo:paramData.intAprvNo
		            , cancelYn:"" 							// 승인을 취소할 수 있는 경우 “Y”
		            , intAprvTtl:""							// 내부결재제목
			        , intAprvReqOpinCn:""					// 내부_결재_요청_의견_내용
			        , apprEmpno:""							// 승인자사번
			        , apprEmpNm:""							// 승인자명
			        , intAprvAproOpinCn:""					// 내부_결재_승인_의견_내용
			        , jobGbCd:""          					// 업무구분코드
			        , menuId:""								// 메뉴ID
			        , scrUrl:""								// 화면_URL
	   			 }
		        ,width: prCom.APPR_WIDTH
		        ,height:prCom.APPR_HEIGHT
	            ,callbackFn:paramData.callbackFn
		    };

		com.popup_open(popOps);
	}
	//결재현황
	else if(gubunCd == gcm.APPR_FIND) { 
		
		var popOps = {
				 popup_name: popupName
	            ,url:prCom.APPR_URL
				,data:{ gubunCd:gcm.APPR_FIND				// gcm.APPR_REQUEST, gcm.APPR_PROC, gcm.APPR_FIND
		            , intAprvNo:paramData.intAprvNo
		            , cancelYn:paramData.cancelYn 			// 승인을 취소할 수 있는 경우 “Y”
		            , intAprvTtl:""							// 내부결재제목
			        , intAprvReqOpinCn:""					// 내부_결재_요청_의견_내용
			        , apprEmpno:""							// 승인자사번
			        , apprEmpNm:""							// 승인자명
			        , intAprvAproOpinCn:""					// 내부_결재_승인_의견_내용
			        , jobGbCd:""          					// 업무구분코드
			        , menuId:""								// 메뉴ID
			        , scrUrl:""								// 화면_URL
	   			 }
		        ,width: prCom.APPR_WIDTH
		        ,height:prCom.APPR_HEIGHT
	            ,callbackFn:paramData.callbackFn
		    };

		com.popup_open(popOps);
	}	
};

/**
 * 파일공통처리
 * @private
 * @param id        : 파일id
 * @param col       : 보이는갯수(col1,col2,col3,col4)
 * @param menuId    : 화면id
 * @param saveFlag  : 저장flag(INS : CUD 버튼 허용, "" : CUD 버튼 불가)
 * @example
 *
 * prCom.fnAflIdSet("aflId", "col3", "PR00050001U", "INS")
 */
prCom.fnAflIdSet = function(id, col, menuId, saveFlag) {

	//보이는갯수
	com.getUdcComp(id, "gen_aflList").addClass(col);

	//첨부버튼
	com.setUdcValue(id, "jobGbCd",  prCom.JOB_GB_CD);
	com.setUdcValue(id, "menuId",   menuId);
	com.setUdcValue(id, "fileSize", prCom.FILE_DEFAULT_INS);
	com.setUdcValue(id, "fileExt",  prCom.FILE_EXT);
	com.setUdcValue(id, "usage",    saveFlag);
};

/**
 * 보증팝업
 * @private
 * @param guarScrtObj     : guarScrtObj
 * @example
 *
 * prCom.fnAprvProcPopup(gcm.APPR_REQUEST, paramData)
 */
prCom.viewGuarScrtPopup = function(guarScrtObj) {
	console.log(guarScrtObj);
	var popupParam = {};
	
	var contractType	= '2';	// 1:외주 2:자재 3:하자
	var guaranteeType	= '' ;	// 1:입찰보증서  2:계약보증서 3:하자보증서 4:선급보증서
	var grtcertOrd		= '0';	// 기간:1 금액:2 그 외 0
	var guarIntuCd		= guarScrtObj.guarIntuCd;
	var inUser = "N";
	
	if(guarScrtObj.guarJobGbVal == 'SC03201'){guaranteeType = '2';}
	if(guarScrtObj.guarJobGbVal == 'SC03203'){guaranteeType = '4';}
	if(guarScrtObj.guarJobGbVal == 'SC03208'){guaranteeType = '3';}
	
	if(guarScrtObj.guarChgGbCd == 'CF01820'){grtcertOrd = '1'}
	if(guarScrtObj.guarChgGbCd == 'CF01830'){grtcertOrd = '2'}
	
	if(guarScrtObj.inUser == "Y"){ inUser = "Y"}
	
	popupParam['contractType']			= contractType;                
	popupParam['guaranteeType']			= guaranteeType;
	popupParam['grtcertOrd']			= grtcertOrd;
	popupParam['guarIntuCd']			= guarScrtObj.guarIntuCd;
	popupParam['siteCd']				= guarScrtObj.siteCd;
	popupParam['cntrtNo']				= guarScrtObj.cnsldDocNo;
	popupParam['cntrtDgr']				= guarScrtObj.cnsldDocDgr;
	popupParam['inUser']				= inUser;
	popupParam['guarNo']				= "";
	popupParam['contgrttype']         = guarScrtObj.guarChgGbCd;
	popupParam['elecGuarPrgsStusCd']	= guarScrtObj.guarPrgsStusCd;
	
	var reqDt = guarScrtObj["reqDt"] || "";
	popupParam['p_reqdate']	= reqDt;
	
	var popOps = {
			popup_name	: "보증서 보기"
		,	data		: popupParam
   		,	url			: "/ux/epro/PO60300000P.xml"
   		//,	widType		: "M"
   		,	height		: "770"
   	    ,   width           : "900"
   		,	type		: "browser"
   		,	callbackFn	: "scwin.popupCallback"
		,   resizable       : true
        ,   useMaximize     : true
        ,   scrollbars      : true
 	};
 	
		com.popup_open(popOps);
}

/**
 * 소수점 3자리에서 내림 처리를 한다.
 *
 * @param {String} value 소수점 3자리 내림 처리를 할 값 (String 또는 Number 타입 지원)
 * @return {Number} 소숫점 3자리 내림 처리를 한 숫자 값
 * @example
 * prCom.transFloor(23.4567);
 * // return 예시) 23.456
 */
prCom.transFloor = function(value) {
	return Math.floor(Number(value) * 1000) / 1000;
};

/**
 * 소수점 3자리에서 내림 처리를 한다.
 *
 * @param {String} value 소수점 3자리 내림 처리를 할 값 (String 또는 Number 타입 지원)
 * @return {Number} 소숫점 3자리 내림 처리를 한 숫자 값
 * @example
 * prCom.transFloor(23.4567);
 * // return 예시) 23.456
 */
prCom.transFloor2 = function(value) {
	return Math.floor((Number(value) * 1000).toFixed(3)) / 1000;
};
