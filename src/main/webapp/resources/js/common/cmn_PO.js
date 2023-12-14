var poCom = com;

/**
 * 색상값을 설정한다.
 *
 * @date 2019.05.17
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @example
    poCom.color.wrng
 */
poCom.color = {
	wrng : "#FF0000"  //경보색
};

/**
 * 휴대전화번호의 유효성을 검사한다.
 *
 * @date 2019.05.17
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} value 컨트롤의 입력값
 *            
 * @returns 휴대전화번호의 유효성 검사 결과가 성공이면 true 실패면 false를 리턴한다.
 * @example
 */
poCom.validateCrryTelNo = function (value) {
	value = value.split("-").join("");

	var regPhone = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

	return regPhone.test(value);
};

/**
 * 선택한 현장을 세션에 설정한다.
 *
 * @date 2019.05.17
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} siteCd 현장코드
 * @param {String} bloCd 블록코드
 *            
 * @returns 
 * @example
 */
poCom.setSelSite = function(siteCd, bloCd) {
	ajaxLib.ajax("/po/po6015/PO60150505U/selectTcsSiteList", {
        mode		: "synchronous",
        requestData	: {
        	            tradeCd      : sessionStorage.tradeCd
        	          , searchSiteCd : siteCd
        	          , searchBloCd  : bloCd
        	          },
		callback	: function(result, e) {
			var dsTcsSiteList = result.data.dsTcsSiteList;

			//세션설정
			sessionStorage.setItem("selCsSiteCd", dsTcsSiteList[0].siteCd);
			sessionStorage.setItem("selCsSiteNm", dsTcsSiteList[0].siteNm);
			sessionStorage.setItem("selCsBloCd",  dsTcsSiteList[0].bloCd);
		}
    });
};

/**
 * 입력객체에 호수의 길이 유효성검사를 하고 앞에 '0'을 삽입하여 자리수를 맞춘다(onblur에 사용)
 *
 * @date 2019.05.21
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} ctrlId 컨트롤의 id
 *            
 * @returns 
 * @example
 */
poCom.setValidHouseNum = function(ctrlId) {
	var ctrl  = $p.getComponentById(ctrlId);
	var value = "";
	
	if (ctrl.getValue) {
		value = ctrl.getValue().toString();
	}
	else {
		value = ctrl.value.toString();
	}
	
	if (value.length > 0) {
		if (poCom.isHouseNum(value)) {
			if (value.length === 3) {
				if (ctrl.setValue) {
					ctrl.setValue(com.lpad(value, 4, "0"));
				}
				else {
					ctrl.value = com.lpad(value, 4, "0");
				}
			}
		}
		else {
			com.showMessage("POE0002", "호수");  //$1 입력이 잘못 되었습니다.
			return false;
		}
	}
};

/**
 * 문자열이 호수의 형태인지 확인한다.
 *
 * @date 2019.05.21
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} value String 문자열
 *            
 * @returns 
 * @example
 */
poCom.isHouseNum = function(value) {

	// 지하층
	if (value.charAt(0).toUpperCase() === "B") {
		if (WebSquare.util.isNumber(WebSquare.util.parseInt(value.substring(1, 4), ""))) {
			return (value.length === 4) ? true : false;
		}
		else {
			return false;
		}
	}
	// 일반
	else {
		if (WebSquare.util.isNumber(WebSquare.util.parseInt(value, 0))) {
			return (value.length === 3 || value.length === 4) ? true : false;
		}
		else {
			return false;
		}
	}
};

/**
 * 호수의 존재여부를 체크한다
 *
 * @date 2019.05.21
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} id     컨트롤의 id
 * @param {String} siteCd 현장코드
 * @param {String} bloCd  블록코드
 * @param {String} dong   동
 * @param {String} ho     호
 *            
 * @returns {boolean} 호수존재여부 true / false
 * @example
 * var popupInfo = {
 *                   id     : ibxSearchHo.id
 *                 , siteCd : dsSearchParamMap.get("searchSiteCd")
 *                 , bloCd  : dsSearchParamMap.get("searchBloCd")
 *                 , dong   : sbxSearchDong.getValue()
 *                 , ho     : ibxSearchHo.getValue()
 *                 }
 * 
 * poCom.validHo(popupInfo);
 */
poCom.validHo = function(popupInfo) {
	var bResult = true;

	if (popupInfo.ho.length > 0) {
		ajaxLib.ajax("/po/po6015/PO60150505U/selectIsExistDongHo", {
	        mode		: "synchronous",
	        requestData	: {
	                        searchSiteCd : popupInfo.siteCd
	                      , searchBloCd  : WebSquare.util.parseInt(popupInfo.bloCd)
	                      , searchDong   : popupInfo.dong
	                      , searchHo     : popupInfo.ho
	                      },
			callback	: function(result, e) {
				if (!result.data.isExistDongHo) {
		 			com.showMessage("POA0018", "해당 호수");  //$1이(가) 존재하지 않습니다.
		 			$p.getComponentById(popupInfo.id).focus();
		 			bResult = false;
				}
			}
	    });
	}

	return bResult;
};

/**
 * 작업지시서 팝업을 오픈한다.
 * 
 * @date 2019.05.22
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {Array}  arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {Array}  arrSearchParamMap JSONArray 형태로 검색조건파라미터
 * @param {String} callbackStr 콜백함수명
 * @example
 */
poCom.openWorkWkiPop = function(arrChkList, arrSearchParamMap, callbackStr) {
	var popOps = {
            popup_name : "작업지시서"
          , url        : "/WEB-INF/ux/po/po6015/PO60150545P.xml"
          , data       : {
                           arrChkList        : arrChkList
                         , arrSearchParamMap : arrSearchParamMap
                         }
          , widType    : "S"
          , height     : "280"
    	  , callbackFn : callbackStr
          };

	com.popup_open(popOps);
};

/**
 * 작업완료확인서 팝업을 오픈한다.
 * 
 * @date 2019.06.03
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {Array}  arrChkList JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {Array}  arrSearchParamMap JSONArray 형태로 검색조건파라미터
 * @param {String} callbackStr 콜백함수명
 */
poCom.openWorkCpltCondcPop = function(arrChkList, arrSearchParamMap, callbackStr) {
	var popOps = {
            popup_name : "작업완료확인서"
          , url        : "/WEB-INF/ux/po/po6015/PO60150565P.xml"
          , data       : {
				           arrChkList        : arrChkList
						 , arrSearchParamMap : arrSearchParamMap
                         }
          , widType    : "S"
          , height     : "280"
    	  , callbackFn : callbackStr
          };

	com.popup_open(popOps);
};

/**
 * 완료처리 팝업을 오픈한다.
 * 
 * @date 2019.05.22
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {Array}  arrChkList  JSONArray 형태로 원인변경 처리하기 위해 선택한 데이터 배열
 * @param {String} callbackStr 후처리함수
 * @example
 */
poCom.openDeftCpltPrcgPop = function(arrChkList, callbackStr) {
	var cnt = 0;
	for (var i = 0; i < arrChkList.length; i++) {
		if (arrChkList[i].deftPrcgStusCd === "CS09001B" ||  //실접수
		    arrChkList[i].deftPrcgStusCd === "CS09001C" ||  //재하자
		    arrChkList[i].deftPrcgStusCd === "CS09001E") {  //가완료
			cnt++;
		}
	}

	if (cnt > 0) {
		var popOps = {
		               popup_name : "작업완료처리"
		             , url        : "/WEB-INF/ux/po/po6015/PO60150525P.xml"
	                 , data       : arrChkList
		             , widType    : "S"
		             , height     : "236"
			         , callbackFn : callbackStr
		             };

		com.popup_open(popOps);
	
		return true;
	}
	else {
		return false;
	}
};

/**
 * 처리경과 팝업을 오픈한다.
 * 
 * @date 2019.05.22
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} deftNo 하자번호
 * @example
 */
poCom.openPrcgElpsPop = function(deftNo) {
	var popOps = {
	               popup_name : "처리경과"
	             , url        : "/WEB-INF/ux/po/po6015/PO60150530P.xml"
                 , data       : {deftNo: deftNo}
	             , widType    : "M"
	             , height     : "393"
	             };

 	com.popup_open(popOps);
};

/**
 * 도면정보 팝업을 오픈한다.
 * 
 * @date 2019.05.22
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} siteCd 현장코드
 * @param {String} bloCd  블록코드
 * @param {String} pytpCd 평면코드 
 * @example
 */
poCom.drawInfoPop = function(siteCd, bloCd, pytpCd) {
	var popOps = {
                   popup_name : "도면정보"
                 , url        : "/WEB-INF/ux/po/po6015/PO60150540P.xml"
                 , data       : {
                                  searchSiteCd : siteCd
                                , searchBloCd  : bloCd
                                , searchPytpCd : pytpCd
                                }
                 , widType    : "S"
         		 , height     : "502"
                 }
	com.popup_open(popOps);
};

/**
 * 이미지 첨부파일 팝업을 오픈한다.
 * 
 * @date 2019.05.22
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @example
 * var popupInfo = {
 *                   popupTitle  : "사진보기"                                  //팝업타이틀(기본값 : 이미지 보기)
 *                 , menuId      : "PO60150505U"                               //화면메뉴ID
 *                 , aflId       : ""                                          //첨부파일ID
 *                 , jobGbCd     : "PO"                                        //업무구분코드(기본값 : "PO")
 *                 , fileExt     : "*.*"                                       //파일확장자(기본값 : *.*)
 *                 , usage       : ""                                          //파일첨부팝업 수정여부(기본값 : INS)
 *                 , height      : "150px"                                     //팝업높이(기본값 : 850px)
 *                 , callbackStr : $p.id + "scwin.openImgAflListPop_callback"  //후처리함수
 *                 }
 * 
 * poCom.openImgAflListPop(popupInfo);
 */
poCom.openImgAflListPop = function(popupInfo) {
	var popOps = {
	               popup_name : (WebSquare.util.isNull(popupInfo.popupTitle) ? "이미지 보기" : popupInfo.popupTitle)
	             , url        : "/WEB-INF/ux/po/pocomm/imgAflPopup.xml"
                 , data       : {
                                  menuId  : (WebSquare.util.isNull(popupInfo.menuId)  ? ""    : popupInfo.menuId)
                	            , aflId   : (WebSquare.util.isNull(popupInfo.aflId)   ? ""    : popupInfo.aflId)
                	            , jobGbCd : (WebSquare.util.isNull(popupInfo.jobGbCd) ? "PO"  : popupInfo.jobGbCd)
                	            , fileExt : (WebSquare.util.isNull(popupInfo.fileExt) ? "*.*" : popupInfo.fileExt)  //*.* : 제한없음, "..." : 기술한 확장자 첨부불가
                	            , usage   : (WebSquare.util.isNull(popupInfo.usage)   ? "INS" : popupInfo.usage)    //INS : CUD 버튼 허용, "" : CUD 버튼 불가
                                }
	             , widType    : "M"
	             , height     : (WebSquare.util.isNull(popupInfo.height) ? "580px" : popupInfo.height)
	             , callbackFn : (WebSquare.util.isNull(popupInfo.callbackStr) ? "" : popupInfo.callbackStr)
	             };

	com.popup_open(popOps);
};

/**
 * report 호출
 *
 * @date 2019.05.31
 * @author 신설연 (tpshinsy1)
 * @memberOf poCom
 * @memberOf poCom
 * @param {String} jrfId jrf파일명
 * @param {Array}  param 파라미터
 * @example
   poCom.openReport(jrfId, param);
 */
poCom.openReport = function(jrfId, param) {
	console.log(jrfId);
	console.log(param);
	var data = "";

	for (var key in param) {
        data += key + "#" + param[key] + "#";
	}

	data += "USER_NM" + "#" + sessionStorage.userNm + "#";  // 접속자명
	
	var url   = "/ubi4/ubihtml";
    var $form = $('<form></form>');
    $form.attr('action', url);
    $form.attr('method', 'post');
    $form.attr('target', 'watchwin');
    $form.appendTo('body');

    var _jrf   = $('<input type="hidden" value="'+jrfId+'"  name="jrf">');
    var _arg   = $('<input type="hidden" value="'+data+'"   name="arg">');
    var _resid = $('<input type="hidden" value="UBIHTML_PO" name="resid">');

    $form.append(_jrf).append(_arg).append(_resid);

    var features = 'height=900, width=980, status=no, scrollbars=yes, resizable=yes';
    window.open("", 'watchwin', features);
    
    $form.submit();
};
