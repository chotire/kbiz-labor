requires("uiplugin.popup");

/**
 * 전체 Scope에서 공유되는 Global 전역 변수, 상수, 공통 함수를 정의한다.
 * 
 * gcm 객체는 WFrame Scope이 고려될 필요가 없고, 업무 개발자가 호출할 필요한 공통 함수나 속성만을 생성한다.
 * gcm 객체는 WFrame Scope별로 생성되지 않고, 전역 객체로 1개만 생성된다.
 * 
 * @version 3.0
 * @author InswaveSystems
 * @type gcm
 * @class gcm
 * @namespace gcm
 */
var gcm = {
	// 서버 통신 서비스 호출을 위한 Context Path
	CONTEXT_PATH : " ",
	
	// 서버 통신 서비스 호출을 위한 Service Url (Context Path 이하 경로)
	SERVICE_URL : "", 
	
	// 서버 통신 기본 모드 ( "asynchronous" / "synchronous")
	DEFAULT_OPTIONS_MODE : "asynchronous", 
	
	// 서버 통신 기본 미디어 타입
	DEFAULT_OPTIONS_MEDIATYPE : "application/json", 
	
	// 통신 상태 코드
	MESSAGE_CODE : {
		STATUS_ERROR : "E",
		STATUS_SUCCESS : "S",
		STATUS_WARNING : "W"
	},
	
	// 공통 코드 저장을 위한 DataList 속성 정보
	//DATA_PREFIX : "dlt_commonCode",
	DATA_PREFIX : "gb_code",
	
	/*
    "cd":"코드"
    "cdNm":"코드_명"
    "engNm":"영문_명"
    "abbNm":"약어_명"
    "upperCd":"상위코드"
    "cdLv":"코드_레벨"
    "cdOdr":"코드_순서"
    "charValN1":"문자_값_1"
    "charValN2":"문자_값_2"
    "charValN3":"문자_값_3"
    "charValN4":"문자_값_4"
    "charValN5":"문자_값_5"
    "nmbrValN1":"숫자_값_1"
    "nmbrValN2":"숫자_값_2"
    "nmbrValN3":"숫자_값_3"
    "nmbrValN4":"숫자_값_4"
    "nmbrValN5":"숫자_값_5"
    "useYn":"사용_여부"
    "epntYn":"말단_여부"
    "commCd":"공통코드"
    "commDtlCd":"공통상세코드"
    */	
	COMMON_CODE_INFO : {
		LABEL : "cdNm",
		VALUE : "allCd",
		FILED_ARR : [ "allCd", "cd", "cdNm" , "engNm" ,"abbNm", "upperCd", "cdLv", "cdOdr" ,"charValN1", "charValN2", "charValN3", "charValN4", "charValN5", "nmbrValN1", "nmbrValN2", "nmbrValN3", "nmbrValN4", "nmbrValN5", "useYn", "epntYn", "commCd", "commDtlCd"]		
	},

	// 유효성 검사 상태 정보 저장
	valStatus : { 
		isValid : true, 
		objectType : "", // 유효성 검사를 수행하는 컴포넌트 타입 : gridView, group
		objectName : "", 
		columnId : "", 
		rowIndex : 0,
		message : ""
	},
	
	// 업무 화면 오픈 Frame Mode 설정 ("iframe", "wframe")
	FRAME_MODE : "wframe",
	
	UDCINFO : {},
	
	POP_WIDTH_TYPE : {
		XXL: 1360,
		XL : 1272,
		L  : 1080,
		M  : 830,
		S  : 510,
		XS : 380,
		K  : 600
	},
	
	POP_CUSTOM_WIDTH_TYPE : "",
	
	CODE_LIST : {} ,
	MSG_INFO_LIST : {},
	DEPT_LIST : {},
	CODE_DTL_POOL_LIST : {},
	MENU_LIST : {},
	MENU_SRCH_LIST : {},	// 메뉴 검색 
	MENU_ID : "",			// 메뉴ID
	MENU_TITLE : "",		// 메뉴명
	MENU_URL : "",			// 메뉴경로
	WHOLE_ATTR_CD : "",		// 전사속성권한 (CF06901 : 조회, CF06902 : 입력)
	BZDP_ATTR_CD : "",		// 사업부 속성권한 (CF06901 : 조회, CF06902 : 입력)
	DEPT_ATTR_CD : "",		// 부서 속성권한 (CF06901 : 조회, CF06902 : 입력)
	AUTH_GRP_CD : [], 		// 권한그룹코드
	PRCG_AUTH_CD : [], 		// 처리권한그룹코드[CF03901 : 전사, CF03902 : 소속사업부, CF03903 : 소속팀]
	AUTH_ATTR_CD : [], 		// 처리속성코드 [CF06901 : 조회, CF06902 : 입력]	
	SEL_SCTR_LIST : [], 	// 셀렉트에 조회 할 수 있는 부서 부문레벨코드 CF070K020000 : 토목, CF070K030000 : 건축, CF070K040000 : 플랜트, CF070K050000 : 주택
	EM_RVT_DEPT_LIST : {},
	CD_KEY : 
	{
		"Pool":"tcfCodeDtlPoolList",
		"Code":"tcfCodeList",
		"Dept":"tcfDeptList",
		"Msg" :"tcfMsgInfoList",
		"Menu":"tcfMenuMngList"
	},
	AUTH_INCLUDE_IDS : [],//["btnFind","btnNew","btnCopy","btnTemplate","btnInit","btnExcelDwn","btnExcelUpl","btnFileView","btnAddFile","btnDelRow","btnAddRow","btnSave","btnCancel","btnDel","btnApprRequest","btnApprForm","btnApprCancel","btnApproval","btnApprReject","btnPrint","btnClose","btnReport","btnEdit","btnConfirm"],
	AUTH_CHECK_IDS : [],//["btnFindaaa","btnNew01","btnCopy02"]
			
	// 내부결재 처리를 위한 처리코드
	APPR_REQUEST	: "REQ",	// 승인요청
	APPR_PROC		: "PROC",	// 승인처리
	APPR_FIND		: "FIND",	// 승인현황조회

	// 내부결재 상태코드
	APPR_REQ : "CF00701",	// 미확정(요청)
	APPR_APR : "CF00702",	// 확정(승인)
	APPR_REJ : "CF00703",	// 반송(반려)
	APPR_CAN : "CF00705",	// 취소(승인취소)
		
	// 서버환경값
	SERVER_PROPERTY : "DEV",		// 개발서버
	

};

/**
 * 유효성 검사 실패에 대한 Alert 메시지 창이 닫힌 후에 수행되는 콜백 함수이다.
 * $p
 * @date 2018.04.15
 * @private
 * @memberOf
 * @author InswaveSystems
 * @returns
 */
gcm._groupValidationCallback = function() {
	if ((gcm.valStatus.objectName !== "") && (gcm.valStatus.isValid === false)) {
		var obj = $p.getComponentById(gcm.valStatus.objectName);
		if (gcm.valStatus.objectType === "gridView") {
			obj.setFocusedCell(gcm.valStatus.rowIndex, gcm.valStatus.columnId);
		} else if (gcm.valStatus.objectType === "group") {
			obj.focus();
		}
	}
};

/**
 * 다국어 처리함수
 * 
 * @date 2018.01.21
 * @private
 * @param {String} xmlUrl 전체 URL중 w2xPath이하의 경로
 * @memberOf
 * @author InswaveSystems
 * @example 
 * com.getI18NUrl( "/ui/DEV/result.xml" ); 
 * //return 예시)"/websquare/I18N?w2xPath=/ui/DEV/result.xml"
 * gcm._getI18NUrl( "/ui/SW/request.xml" ); 
 * //return 예시)"/websquare/I18N?w2xPath=/ui/SW/request.xml"
 * 
 */
gcm._getI18NUrl = function(xmlUrl){
if(xmlUrl.indexOf("http") > -1){
	return xmlUrl;
	}else{
	var locale = WebSquare.cookie.getCookie( "locale" );
		var _url = xmlUrl.replaceAll("/WEB-INF","");
	    if( locale == null || locale == '' ) {
	        return "/I18N?w2xPath="+_url;
	    } else {
	        return "/I18N?locale="+unescape(locale)+"&w2xPath="+_url;
	    }
	}
};


/**
 * 특정 컴포넌트가 속한 WFrame Scope을 반환한다.
 * 
 * @date 2018.06.11
 * @private
 * @param {Object} 컴포넌트 객체 또는 아이디(WFrame Scope 경로를 포함한 Full Path Id)
 * @memberOf
 * @author InswaveSystems
 */
gcm._getScope = function(comObj) {
	if (typeof comObj === "string") {
		var scopeObj = $p.getComponentById(comObj);
		if (scopeObj !== null) {
			return scopeObj.getScopeWindow();
		}
	} else {
		return comObj.getScopeWindow();
	}
}

gcm.getKhProperty = function(/** String */ key) {
	return gcm.khProp && gcm.khProp[key];
}

gcm.getKhProperty = function(/** String */ key, /** String */ defVal) {
	var v = gcm.khProp[key];
	if (v === undefined) {
		v = defVal;
	}
	return v;
}

gcm.isEnvProduct = function() {
	return gcm.getKhProperty('environment') == 'prd';
}

/**
 * 각 WFrame Scope별로 공유되는 Scope 전역 변수와 공통 함수를 정의한다.
 * 
 * com 객체는 WFrame Scope 업무 개발자가 호출해야할 공통 함수나 속성을 정의한다.
 * com 객체는 WFrame Scope 별로 생성되기 때문에 com 객체 내에 정의된 함수에서의 선언된 $p 객체는 
 * 해당 함수를 호출한 화면의 WFrame Scope 내의 $p를 참조하게 된다.
 * 
 * @version 3.0
 * @author InswaveSystems
 * @type com
 * @class com
 * @namespace com
 */
var com = {
	// Message Box ID 생성을 위한 순번
	MESSAGE_BOX_SEQ : 1
};


/**
 * 최상위 page를 index화면으로 이동 (/)
 *
 * @date 2016.08.05
 * @memberOf com
 * @author InswaveSystems
 */
com.goHome = function() {
	if (gcm.CONTEXT_PATH == "") {
		top.window.location.href = "/";
	} else {
		top.window.location.href = gcm.CONTEXT_PATH;
	}
};

/*
 * 로그아웃을 수행합니다.
 */
com.logOut = function(){
    ajaxLib.ajax("/logoff", {
    	  mode : "synchronous"
        , mediatype : "application/x-www-form-urlencoded; charset=UTF-8"
    });

	//sessionStorage 초기화
    sessionStorage.clear();
	var Backlen=history.length;   
	history.go(-Backlen);
	window.location.replace("/");
};

/*
 * 로그인체크를 수행합니다.
 */
com.logChk = function(){
    var resultLogChk = "true";
    ajaxLib.ajax("/logchk", {
          mode : "synchronous"
        , mediatype : "application/x-www-form-urlencoded; charset=UTF-8"
        , callback : function(result, e) {
            resultLogChk = result;
        }
    });
    return resultLogChk;
};

/*
 * 세션스토로지에 입력합니다.
 */
com.setSessionStorage = function(result){
    sessionStorage.clear();
    sessionStorage.setItem("accessToken", result.data.accessToken);             // Token 담는다
    sessionStorage.setItem("userId", result.data.accessUser.userId);            // 사용자 ID
    sessionStorage.setItem("userNm", result.data.accessUser.userNm);            // 사용자 이름    
    sessionStorage.setItem("userEmpno", result.data.accessUser.userEmpno);      // 사용자 사번
    sessionStorage.setItem("hrUserId", result.data.accessUser.hrUserId);        // 인사 사용자 사번
    sessionStorage.setItem("hrUserIdOrg", result.data.accessUser.hrUserIdOrg);        // 인사 사용자 사번
    sessionStorage.setItem("deptCd", result.data.accessUser.deptCd);            // 부서코드
    sessionStorage.setItem("deptNm", result.data.accessUser.deptNm);            // 부서이름
    sessionStorage.setItem("jbclCd", result.data.accessUser.jbclCd);            // 직급코드
    sessionStorage.setItem("jbclNm", result.data.accessUser.jbclNm);            // 직급코드명
    sessionStorage.setItem("jbposGbCd", result.data.accessUser.jbposGbCd);      // 직위구분코드
    sessionStorage.setItem("jbposGbNm", result.data.accessUser.jbposGbNm);      // 직위구분코드명
    sessionStorage.setItem("empGbCd", result.data.accessUser.empGbCd);          // 사원구분코드
    sessionStorage.setItem("incoTelNo", result.data.accessUser.incoTelNo);      // 사내전화번호
    sessionStorage.setItem("crryTelNo", result.data.accessUser.crryTelNo);      // 휴대전화번호    
    sessionStorage.setItem("photoPathNm", result.data.accessUser.photoPathNm);  /* 사진_경로_명 */    
    sessionStorage.setItem("dsgnCd", result.data.accessUser.dsgnCd);            /* 호칭코드 */
    sessionStorage.setItem("dsgnNm", result.data.accessUser.dsgnNm);            /* 호칭_명 */    
    sessionStorage.setItem("email", result.data.accessUser.email);              // 이메일 주소
    sessionStorage.setItem("userTypeGb", result.data.accessUser.userTypeGb);    // 사용자_유형_구분
    sessionStorage.setItem("goToWorkYn", result.data.accessUser.goToWorkYn);    // 출근여부
    sessionStorage.setItem("dpldrEmpno", result.data.accessUser.dpldrEmpno);    // 팀장(소장)사번
    sessionStorage.setItem("dpldrNm", result.data.accessUser.dpldrNm);          // 팀장(소장)명
    sessionStorage.setItem("hdofSiteGbCd", result.data.accessUser.hdofSiteGbCd);/* 본사현장구분코드[CF043] */  
    sessionStorage.setItem("lv1DeptCd", result.data.accessUser.lv1DeptCd);      /* 레벨1_부서코드 */
    sessionStorage.setItem("lv1DeptNm", result.data.accessUser.lv1DeptNm);      /* 레벨1_부서_명 */     
    sessionStorage.setItem("lv2DeptCd", result.data.accessUser.lv2DeptCd);      /* 레벨2_부서코드 */         
    sessionStorage.setItem("lv2DeptNm", result.data.accessUser.lv2DeptNm);      /* 레벨2_부서_명 */         
    sessionStorage.setItem("lv3DeptCd", result.data.accessUser.lv3DeptCd);      /* 레벨3_부서코드 */   
    sessionStorage.setItem("lv3DeptNm", result.data.accessUser.lv3DeptNm);      /* 레벨3_부서_명 */
    sessionStorage.setItem("lv4DeptCd", result.data.accessUser.lv4DeptCd);      /* 레벨4_부서코드 */
    sessionStorage.setItem("lv4DeptNm", result.data.accessUser.lv4DeptNm);      /* 레벨4_부서_명 */         
    sessionStorage.setItem("lv5DeptCd", result.data.accessUser.lv5DeptCd);      /* 레벨5_부서코드 */         
    sessionStorage.setItem("lv5DeptNm", result.data.accessUser.lv5DeptNm);      /* 레벨5_부서_명 */         
    sessionStorage.setItem("lv6DeptCd", result.data.accessUser.lv6DeptCd);      /* 레벨6_부서코드 */      
    sessionStorage.setItem("lv6DeptNm", result.data.accessUser.lv6DeptNm);      /* 레벨6_부서_명 */         
    sessionStorage.setItem("lv7DeptCd", result.data.accessUser.lv7DeptCd);      /* 레벨7_부서코드 */         
    sessionStorage.setItem("lv7DeptNm", result.data.accessUser.lv7DeptNm);      /* 레벨7_부서_명 */  
    sessionStorage.setItem("tcfCcrtDeptList", JSON.stringify(result.data.accessUser.tcfCcrtDeptList)); // 겸직부서 정보
    sessionStorage.setItem("sonoAdminYn", result.data.accessUser.sonoAdminYn);      /* 소노관리자여부 */  
};

/**
 * inputCalendar 날짜 validate 체크
 *
 * @date 2019.08.14
 * @author 정태수 (tpjts)
 * @memberOf smCom
 * @memberOf smCom
 * @param {String}
 *            value 컨트롤의 입력값
 * @param {String}
 *            ctrlId 컨트롤의 id
 *
 * validator 속성에 smCom.validateDate를 세팅 
 * 
 */
com.validateDate = function (value, ctrlId) {
	var resultValue = value;	//반환값
	if ( !com.isDate(value) ){
		com.showMessage("CFA0019", "일자", "", "", ctrlId); //$1을(를) 확인하십시오.
		resultValue = "";
	}
	return resultValue;
};

/*
 * 콘솔로그 크로스브라우징(구 익스용)
 */
if (typeof window.console == "undefined") {
    window.console = {
        log: function (msg) {}
    };
}

/** wframe data setting
 * 	valueObj = {
 * 		"wSubmitDataType" 	: 보낼 데이터타입
 *      "wSubmitDataName" 	: 보낼 데이터이름 (페이지에서 받을 명)
 *      "wSubmitData" 		: 보낼 데이터
 *  }  
 *  
 *  만약 위 형태로 지정안할시 valueObj를 그대로 json 타입으로 전송
 * **/
com.setWframeSubmitData = function(valueObj) {
	valueObj = valueObj || {};
	var wSubmitDataType = valueObj["wSubmitDataType"] || "json";
	var wSubmitDataName = valueObj["wSubmitDataName"] || "wframeParam";
	var wSubmitData = valueObj["wSubmitData"] || valueObj || {};
	
	var dataObject = {
		"type" : wSubmitDataType,
		"name" : wSubmitDataName,
		"data" : wSubmitData
	};
	
	var rsObj = {
		"dataObject" : dataObject
	};
	return rsObj;
};

/** 부서검색(한건인 경우 지정된 컨트롤 혹은 그리드 컬럼에 바로 세팅, 아닌 경우 자동으로 팝업을 호출함)
 * 	param = { targetScrnId     : 현재 열려있는 화면의 ID(해당화면의 실제 ID)
 *          , targetDataListId : 그리드id.getDataList() 값
 *          , targetDlIdx      : 현재 그리드의 위치
 *          , targetDeptCd     : 값을 세팅할 부서코드 컨트롤의 getID값 혹은 그리드의 부서코드 컬럼
 *		    , targetDeptNm     : 값을 세팅할 부서명 컨트롤의 getID값 혹은 그리드의 부서명 컬럼
 *		    , btnClicked       : 업무화면에서 버튼을 통해 들어오는지의 여부, 버튼을 통해 들어오면 true, 아니면 false
 *		    , callbackFn       : 콜백함수, 추가로 처리할 것 있으면 콜백함수명을 입력하면 됨
 *  }  
 *  
 * **/
com.searchDeptInfo = function(param) {
	let targetScrnId = param.targetScrnId == undefined ? "" : param.targetScrnId;
	
	if(targetScrnId !== "") {
		let targetDataListId  = param.targetDataListId  == undefined ? ""   : param.targetDataListId;
		let targetDlIdx       = param.targetDlIdx       == undefined ? ""   : param.targetDlIdx;
		let targetDeptCd      = param.targetDeptCd      == undefined ? ""   : param.targetDeptCd;
		let targetDeptNm      = param.targetDeptNm      == undefined ? ""   : param.targetDeptNm;
		let exptMappingDeptYn = param.exptMappingDeptYn == undefined ? ""   : param.exptMappingDeptYn;	//조회 시 매핑된 부서 제외 여부
		let btnClicked        = param.btnClicked        == undefined ? true : param.btnClicked;
		let callbackFn        = param.callbackFn        == undefined ? ""   : param.callbackFn;
		let isSelected = false;
		let targetObj = $w.getComponentById(targetScrnId).getWindow().$p;		//현재 열려있는 화면의 객체
	    
		//버튼을 클릭하지 않은 경우 먼저 직접 조회
		if(!btnClicked) {
	     	//서비스 호출 
	 		ajaxLib.ajax("/cf/CF00051000P/selectTcfDeptList", { 
	             mode			: "asynchronous", 
	             method 		: "Post", 
	             requestData	: { "deptCd" : ""
								  , "deptNm" : targetObj.getComponentById(targetDeptNm).getValue()
								  , "useYn" : ""
								  , "exptMappingDeptYn" : exptMappingDeptYn
	             				  }, 
	 			 callback		: function (result) {
	 			 	let resultInfo = result.data.dsTcfDeptList;
	 			 	if (resultInfo.length == 1) {
	 			 		if(targetDataListId !== "") {
	 			 			targetObj.getComponentById(param.targetDataListId).setCellData(targetDlIdx, targetDeptCd, resultInfo[0].deptCd);
	 			 			targetObj.getComponentById(param.targetDataListId).setCellData(targetDlIdx, targetDeptNm, resultInfo[0].deptNm);
	 			 		} else {
	 			 			targetObj.getComponentById(targetDeptCd).setValue(resultInfo[0].deptCd);
	 			 			targetObj.getComponentById(targetDeptNm).setValue(resultInfo[0].deptNm);
	 			 		}
	 			 		
	 			 		isSelected = true;
	 			 	}
	 			 },	 
	             errCallback	: "fnErrCallback" 
	         }); 
	    }
		
		//먼저 조회했을 때 부서정보가 매핑된 게 아니라면 팝업 호출
		if(!isSelected) {
		    var popOps = { popup_name : "부서선택"
		                 , url        : "/ux/cf/CF00051001P.xml" // 사용자팝업에 달린 그리드 부서 조회팝업
			             , data       : { "deptCd" : ""
									    , "deptNm" : !btnClicked ? targetObj.getComponentById(targetDeptNm).getValue() : ""
									    , "useYn" : ""
									    , "exptMappingDeptYn" : exptMappingDeptYn
									    , "targetScrnId" : targetScrnId
										, "targetDataListId" : targetDataListId
										, "targetDlIdx" : targetDlIdx
										, "targetDeptCd" : targetDeptCd
										, "targetDeptNm" : targetDeptNm
										}
			             , width      : "1047"
			             , height     : "520"
		            	 , callbackFn : callbackFn
		                 };
		    
		    com.popup_open(popOps);
		}
	}
};
