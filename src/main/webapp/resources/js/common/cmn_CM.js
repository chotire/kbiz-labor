/**
 * 1. smCom 은 업무별로 정의하시면 되겠습니다.
 * 2. 이하 구현하신 함수를 cmn.js의 함수명과 동일한경우 overriding합니다.
 */


var cmCom = com;//smCom 은 업무별로 정의하시면 되겠습니다.  

cmCom.initFunction = function(popupInfo){
	console.log("over riding ");
//	cmCom.setSite(popupInfo);
};


/**
 * 선택한 현장을 세션에 설정한다.
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param {object}
 *            현장코드 팝업
 * @author yanghj
 * @example
 */
cmCom.setSite = function (wfmKeySiteInfo) {
    
	if( !com.isEmpty(sessionStorage.cmSiteCd)  ){
		if( wfmKeySiteInfo.ibxKeySiteCd != undefined && wfmKeySiteInfo.ibxKeySiteCd ){
			wfmKeySiteInfo.ibxKeySiteCd.setValue(sessionStorage.cmSiteCd);   //현장 코드
			wfmKeySiteInfo.ibxKeySiteNm.setValue(sessionStorage.cmSiteNm);    //현장 명
		}
	} else {
		if(gcm.WHOLE_ATTR_CD != "" || gcm.BZDP_ATTR_CD != ""){//전사, 사업부 권한이 존재할경우 마지막으로 개설된 현장의 현장코드로 셋팅
	        ajaxLib.ajax("/cm/cm0500/CM05000001P/selectBasicDept", {
	        	mode : "synchronous",
	            requestData : {
			    				wholeAttrCd : gcm.WHOLE_ATTR_CD,	//전사 CRUD 권한
			    				bzdpAttrCd  : gcm.BZDP_ATTR_CD,		//사업부 CRUDP 권한
			    				deptAttrCd  : gcm.DEPT_ATTR_CD,		//부서단위 CRUDP 권한
			    				selSctrList : gcm.SEL_SCTR_LIST		//사업구분 권한
	            			},
	            callback :function(result, e){
	    			sessionStorage.setItem("cmSiteCd", result.data.siteCd);
	    			sessionStorage.setItem("cmSiteNm", result.data.siteNm);
	    			
	    			wfmKeySiteInfo.ibxKeySiteCd.setValue(result.data.siteCd);   //현장 코드
	    			wfmKeySiteInfo.ibxKeySiteNm.setValue(result.data.siteNm);    //현장 명
	            },
	            errCallback : function(result, e){
	            	console.log(e);
	            }
	        });			
		} else {//부서단위 권한일 경우 세션 현장코드를 셋팅
			if( sessionStorage.getItem("deptCd") != null && sessionStorage.getItem("deptCd") != "" ){
				var _locDeptCdTmp = sessionStorage.getItem("deptCd");
				var _locDeptCd = _locDeptCdTmp.substring(0, 6);
				
				sessionStorage.setItem("cmSiteCd", _locDeptCd);
				sessionStorage.setItem("cmSiteNm", sessionStorage.getItem("deptNm"));
				
				wfmKeySiteInfo.ibxKeySiteCd.setValue(_locDeptCd);   //현장 코드
				wfmKeySiteInfo.ibxKeySiteNm.setValue(sessionStorage.getItem("deptNm"));    //현장 명			
			}
		}
	}
	
};

/**
 * 선택한 부서를 세션에 설정한다.
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param {object}
 *            부소코드 팝업
 * @author yanghj
 * @example
 */
cmCom.setDept = function (wfmKeyDeptInfo) {
	
	if( !com.isEmpty(sessionStorage.cmDeptCd)  ){
		if( wfmKeyDeptInfo.ibxKeySiteCd != undefined && wfmKeyDeptInfo.ibxKeySiteCd ){
			wfmKeyDeptInfo.ibxKeySiteCd.setValue(sessionStorage.cmDeptCd);   //부서 코드
			wfmKeyDeptInfo.ibxKeySiteNm.setValue(sessionStorage.cmDeptNm);   //부서 명
		}
	} else {
		
//		if( sessionStorage.getItem("tcfCcrtDeptList") != null && sessionStorage.getItem("tcfCcrtDeptList") != ""){
//			if( JSON.parse(sessionStorage.getItem("tcfCcrtDeptList")) != null 
//			 && JSON.parse(sessionStorage.getItem("tcfCcrtDeptList"))[0] != null ){
//				if( JSON.parse(sessionStorage.getItem("tcfCcrtDeptList"))[0].deptCd.length > 5){
//					var sDeptCd = JSON.parse(sessionStorage.getItem("tcfCcrtDeptList"))[0].deptCd.substring(0,6);
//					var sDeptNm = JSON.parse(sessionStorage.getItem("tcfCcrtDeptList"))[0].deptNm;
//					
//					sessionStorage.setItem("cmDeptCd", sDeptCd);
//					sessionStorage.setItem("cmDeptNm", sDeptNm);
//					
//					wfmKeyDeptInfo.ibxKeySiteCd.setValue(sDeptCd)   			//부서 코드
//					wfmKeyDeptInfo.ibxKeySiteNm.setValue(sDeptNm)    	//부서 명
//				}
//			}
//		}
		
	}
};

/**
 * 원천세 구분 코드를 가져온다.
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param (pId, sMenuId)
 *            원천세 구분 코드
 * @author yanghj
 * @example
 */
cmCom.getLaborGbn = function (pId, sMenuId) {

	if( pId.indexOf(sMenuId) > 0 ){
		return "TX";
	}else{
		return "";
	}
	
};

/**
 * 원천세 구분명를 가져온다.
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param (sLaborGbn)
 *            원천세 구분 코드
 * @author yanghj
 * @example
 */
cmCom.getSiteDeptNm = function (sLaborGbn) {
	
	if( sLaborGbn == "TX" ){
		return "부서";
	}else{
		return "현장";
	}
	
};

/**
 * 원장,부서 구분에 따라 객체를 가져온다.
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param (sLaborGbn, wfmKeySiteInfo, wfmKeyDeptInfo,spnSiteDept)
 * @author yanghj
 * @example
 */
cmCom.setSiteOrDept = function (sLaborGbn, wfmKeySiteInfo, wfmKeyDeptInfo,spnSiteDept) {

    wfmKeySiteInfo.hide();
    wfmKeyDeptInfo.hide();
    
    if( sLaborGbn == "TX"){
		 wfmKeyDeptInfo.show();
		 cmCom.setDept(wfmKeyDeptInfo.getWindow());
		 spnSiteDept.setLabel( "부서명" );
		 return wfmKeyDeptInfo;
    }else{
        wfmKeySiteInfo.show();
        cmCom.setSite(wfmKeySiteInfo.getWindow());
        spnSiteDept.setLabel( "현장명" );
        return wfmKeySiteInfo;
	}
	
};

/**
 * 숫자로 변환한다.
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param (sValue, nDefaultValue )
 * @author yanghj
 * @example
 */
cmCom.parseInt= function(sValue, nDefaultValue ) {

    var nReturnValue = 0;
 
    if( nDefaultValue == undefined  || nDefaultValue == ""){
        nDefaultValue = 0;
    }     
   
    if( sValue == undefined  || sValue == ""){
        sValue = nDefaultValue;
    }
    
    nReturnValue = eval(sValue);
    return nReturnValue;
};

/**
 * 년월 포멧 설정하기
 *
 * @date 2019.03.04
 * @memberOf cmCom
 * @param (dateString, delimiter)
 *            
 * @author yanghj
 * @example
 */
cmCom.formatYyyyMm= function(dateString, delimiter) {

//	var sCloseYm = sValue ;
	var sDate =  dateString;
	if (!delimiter) {
		delimiter = "-";
	}
	
	if( sDate.length > 4 ) {
		sDate = sDate.substring(0,4) + delimiter + sDate.substring(4); 
	} else {
		sDate = "";
	}
    
    return sDate;
};

cmCom.checkEndDate= function(sStartDate, sEndDate) {
	
//	var sCloseYm = sValue ;
	var sDate =  dateString;
	if (!delimiter) {
		delimiter = "-";
	}
	
	if( sDate.length > 4 ) {
		sDate = sDate.substring(0,4) + delimiter + sDate.substring(4); 
	} else {
		sDate = "";
	}
	
	return sDate;
};

cmCom.checkFgnno= function(fgnno) {
	debugger;
    var sum=0;
    var odd=0;
    buf = new Array(13);
    for(i=0; i<13; i++) { buf[i]=parseInt(fgnno.charAt(i)); }
    odd = buf[7]*10 + buf[8];
    if(odd%2 != 0) { return false; }
/* 2013년 변경 로직(11번째값체크없앰) 추가(20140731,CRQ000000055120)
    if( (buf[11]!=6) && (buf[11]!=7) && (buf[11]!=8) && (buf[11]!=9) ) {
            return false;
    }
*/
    multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
    for(i=0, sum=0; i<12; i++) { sum += (buf[i] *= multipliers[i]); }
    sum = 11 - (sum%11);
    if(sum >= 10) { sum -= 10; }
    sum += 2;
    if(sum >= 10) { sum -= 10; }
    if(sum != buf[12]) { return false }
    return true;
};

/** 
  	첨부파일 보여주는 곳 
	genObjList : w2:generator ul 객체
	param : {
		"udcAflList" : "com.udcAflList(alfId) 값",
		"liIdNm" : "w2:generator tagname li id 값",
		"liAnchorIdNm" : "w2:generator tagname li 내 anchor id 값"
	}
**/
cmCom.grawAfl = function(genObjList, param) {
	var param = param || {};
	var objectConstructor = ({}).constructor;
	var arrayConstructor = ([]).constructor;
	
	if ( genObjList != null && param.constructor == objectConstructor ) {
		genObjList.removeAll(); // 초기화
		var udcAflList = param["udcAflList"] || [];
		var udcAflListLength = udcAflList.length || 0;
		var liIdNm = param["liIdNm"] || "";
		var liAnchorIdNm = param["liAnchorIdNm"] || "";
		
		if( udcAflList.constructor == arrayConstructor && udcAflListLength > 0 
				&& liIdNm != "" && liAnchorIdNm != "") {
			$.each(udcAflList,function(key, data) {
                var idx = genObjList.insertChild();
                var gen_Obj = genObjList.getChild(idx, liIdNm);

                var t = gen_Obj.insertChild();
                var btn_obj = gen_Obj.getChild(t, liAnchorIdNm);
                var dFileSizeInit = "<span style='display:none;'>"+data.aflNm+"("+data.fileSize+"byte)</span>";
                var dFileSize = "("+data.fileSize+"byte)";

                btn_obj.setValue(data.aflNm + dFileSize + dFileSizeInit);
                btn_obj.setUserData("userData", data);
                
                var href = "/cf/CF00350000P/downloadMAV?aflp="+data.aflp;
                $("#"+btn_obj.getID()).off("click").on("click", function() {
                    $.fileDownload(href);
                     return;
                });
            }); // end $.each
		} // end if(aflId != "" && liIdNm != "" && liAnchorIdNm != "")
	} // end if ( param.constructor == objectConstructor )
};