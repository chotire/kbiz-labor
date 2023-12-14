
var scCom = {};

//page object set
scCom.initFrame = function(obj){
	$p = obj;
}

//업무구분 코드
scCom["jobGbCd"] = "SC";

//파일업로드 허용 확장자
scCom["fileExt"] = "3ga,3gp,3gpp,alz,amr,avi,bmp,csv,dmxls,dmxlsx,doc,docx,dot,dvf,dwg,egg,gif,hwp,jpeg,jpg,m4a,mdi,mp3,mp4,pcx,pdf,png,ppsx,ppt,pptx,psd,psr,rar,rtf,tif,tiff,txt,wav,wma,xls,xlsb,xlsm,xlsx,xlt,xps,zip,z01,z02,z03,z04,z05";

//협력회사 팝업
scCom.fnOpenPopTradeCd = function(cd, fnCallBack){
	var popOps = {
			popup_name : "협력회사현황"
			,type      : "browser"
			,modal     : false
			,url       : "/ux/sc/sc2000/SC20000517P.xml"
			,data      : {tradeCd: cd}
			,width     : "1265"
			,height    : "700"
			,callbackFn: fnCallBack
			,resizable : true
			,useMaximize : true
	};
    com.popup_open(popOps);
};


//파일첨부 - 단일
scCom.fnFileAddSingle = function(sAflId, sMenuId, callbackFn, fileExt, sUsage, sJobGbCd, wType, height){
	
	if(sJobGbCd == null || sJobGbCd == ""){
		sJobGbCd = scCom.jobGbCd;
	}
	
	if(fileExt == null || fileExt == ""){
		fileExt = scCom.fileExt
	}
	
	if(wType == null || wType == ""){
		wType = "M";
	}
	
	if(height == null || height == ""){
		height = 270;
	}
	
	if(sUsage == null || sUsage == ""){
		sUsage = "INS";
	}

 	var popOps = {
			pid: "AflPopup"+"_" +new Date().getTime()
			,url:"/ux/cf/CF00350002P.xml"
			,modal : true //true || false
			,popup_name:"파일 첨부"
			,callbackFn : callbackFn
			,widType : wType
			,height : height
			,data : {
					aflId   : sAflId,
					jobGbCd : sJobGbCd,
					menuId  : sMenuId,
					fileExt : fileExt,
					usage   : sUsage
				}
 		};

	com.popup_open(popOps);
};


// 멀티 첨부파일 세팅
scCom.setUdcFileAdd = function(udcObj, sAflId, sMenuId, sUsage, sFileSize, sJobGbCd, sFileExt){
	if(sJobGbCd == null || sJobGbCd == ""){
		sJobGbCd = scCom.jobGbCd;
	}
	
	if(sFileExt == null || sFileExt == ""){
		sFileExt = scCom.fileExt
	}
	
	if(sUsage == null || sUsage == "") {
		sUsage = "";
		com.getUdcComp(udcObj, "btnAddFile").addClass("hide");
	}
	
	if(sFileSize == null) sFileSize = "";
	
	com.setUdcValue( udcObj		, "jobGbCd"	, sJobGbCd);
	com.setUdcValue( udcObj		, "menuId"	, sMenuId);
	com.setUdcValue( udcObj		, "aflId"	, sAflId);
	com.setUdcValue( udcObj		, "fileExt"	, sFileExt);
	com.setUdcValue( udcObj		, "usage"	, sUsage);
	com.setUdcValue( udcObj		, "fileSize", sFileSize);
};



//보증서 보기팝업 외부 호출용
scCom.btnGuarViewPop = function(info, callback) {
	
	var contractType	= "1";				// 1:외주 2:자재 3:하자
	var guaranteeType	= "2";				// 1:입찰보증서  2:계약보증서 3:하자보증서 4:선급보증서
	var grtcertOrd		= "0";				// 보증순번(?)기간:1 금액:2 그 외 0
	var guarIntuCd		= info.guarIntuCd;	// 보증사코드
	var inUser			= "Y";				// 온라인 보증에 대해 승인 반려 권한이 있는 사용자인 경우 Y
	
	/*현장메뉴 접근인 경우 inUser = N 셋팅 */	
	var fnc = $p.getFrame().getParentFrame().getObj("scwin");
	scwin.mode = fnc["getMode"]();	//create 계약서작성, prgs 진행현황,  plc 진행현황현장, end 완료, plcEnd 완료현장
	if(scwin.mode =="plc" || scwin.mode =="prgsPlc" ) {	//2020.03.18 CRQ000000149409
		//현장메뉴(plc(최초),prgsPlc(변경))에서 접근하면 groupInUserView(승인/거부/반려사유) 비활성화
		inUser = "N";	
	}
	
	// guaranteeType
	if(info.rqrdPprGbCd == "SC03201"){guaranteeType = "2";}
	if(info.rqrdPprGbCd == "SC03203"){guaranteeType = "4";}
	if(info.rqrdPprGbCd == "SC03208"){guaranteeType = "3";}
	
	// grtcertOrd
	// 계약보증서구분	CF01810:당초	CF01820:기간변경	CF01830:금액변경	CF01840:기간및금액변경
	// 선급보증서구분	CF01910:당초	CF01920:기간연장	CF01930:선급금추가
	if(info.guarChgGbCd == "CF01820" || info.guarChgGbCd == "CF01920"){grtcertOrd = "1"}
	if(info.guarChgGbCd == "CF01830" || info.guarChgGbCd == "CF01930"){grtcertOrd = "2"}
	
	// 2019.10.17 요청사항 수정 
	// TSC_SUBCT_CNTRT_GRNTL.ISS_DT(발급일자)가 2019.10.14 이전 데이터는 grtcertOrd를 "0"으로 넘겨줌.
	if(!com.isEmpty(info.issDt) && info.issDt < "20191014"){
		grtcertOrd = "0";
	}
	
	// 온라인 보증에 대해 승인 반려 권한이 있는 사용자인 경우 Y
	if(info.inUser == "N") inUser = "N";
	
	
	var popOps = {
			popup_name	: "보증서 보기"
		,	data		: {
							"contractType"			: contractType	// 1:외주 2:자재 3:하자
						  , "guaranteeType"			: guaranteeType	// 1:입찰보증서  2:계약보증서 3:하자보증서 4:선급보증서
						  , "grtcertOrd"			: grtcertOrd	// 기간:1 금액:2 그 외 0
						  , "guarIntuCd"			: guarIntuCd	// 보증사코드
						  , "inUser"				: inUser		// 권한
						  , "siteCd"				: info.siteCd	// 현장코드
						  , "cntrtNo"				: info.cntrtNo	// 계약번호
						  , "cntrtDgr"				: info.cntrtDgr	// 계약차수
						  , "guarNo"				: ""			// 보증번호(안 보내도 됨)
						  , "elecGuarPrgsStusCd"	: info.elecGuarPrgsStusCd	// 보증상태코드[CF017]
						  , "contgrttype"           : info.guarChgGbCd // 보증서구분
		}
   		,	url			: "/ux/epro/PO60300000P.xml"
   		//,	widType		: "M"
   		,	height		: "780"
   		,	width		: "900"
   		,	type		: "browser"
   		,	callbackFn	: callback
   		,	resizable	: true
	    ,	useMaximize	: true
	    ,	scrollbars	: true
 	};
 	
	com.popup_open(popOps);
	
};


// contextmenu(그리드 우클릭 이벤트) 오픈 시 보여줄 메뉴를 설정 한다.
// 사용예시
// 적용할 화면의 gridview에 ev:oncontextopen="scCom.common_oncontextopen" 추가
scCom.common_oncontextopen = function(row,col) {
	// return false; // 컨텍스트 메뉴를 보여주지 않습니다.
	// return { hideSystemMenu: false } // 전체 시스템 메뉴를 보여주지 않습니다.
	return {
		/*
		// - SystemMenu (기본 메뉴)
		// ColumnHide : 선택 컬럼 숨기기					// ColumnShowAll : 전체 컬럼 숨기기 해제
		// ColumnFix : 선택 컬럼 틀고정						// ColumnUnfixAll : 전체 컬럼 틀고정 취소
		// ColumnAdjustWidth : 선택 컬럼 크기 자동 맞추기	// ColumnAdjustAuto : 전체 컬럼 크기 자동 맞추기
		// FoldAll : 전체 그룹 접기							// UnfoldAll : 전체 그룹 펼치기
		// Group : 선택 그룹			// Ungroup : 선택 컬럼 그룹 해제		// UngroupAll : 전체 그룹 해제
		*/
		hideSystemMenu: [ "Group", "ColumnAdjustAuto", "ColumnAdjustWidth" ]	// 특정 항목의 시스템 메뉴를 보여주지 않습니다.
		/* 사용자정의 메뉴를 추가한다.
		, appendMenu: [{
			label:"사용자 정의 메뉴1",
			// 사용자 메뉴의 표시 문자열
			userMenuId:"userColumnHide",
			// 사용자 메뉴의 id, 해당 컨텍스트 메뉴가 클릭될때, 입력값으로 전달됨
			className:"userMenu"
			// 사용자 메뉴의 스타일 클래스 이름
		}], // 시스템 메뉴 아래에, 사용자 메뉴를 추가합니다.
		*/
	};
};

/*

string형의 숫자로 반환

*/
scCom.fn_toNumberString = function(value){
	var retVal = "0";
	if(value!=null){
		value = value.toString();
		value = value.replaceAll(",", "");
		var numVal = scCom.fnCkNaN(value);
		retVal = numVal.toString();
	}
	return retVal;
}

//숫자값 체크후 숫자 반환
scCom.fnCkNaN = function(inputVal) {
	var retVal = 0;
	if(!isNaN(inputVal)){
		retVal = Number(inputVal);
	}
	return retVal;
}
