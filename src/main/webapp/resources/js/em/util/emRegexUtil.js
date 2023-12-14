/**
 * 파일명 : emEtcUtil js
 * 설  명 : EM에서 정규식 관련 JavaScript
 * 
 *    수정일      		수정자      	수정내용
 * ------------  ---------   -------------
 * << 개정이력(Modification Information) >>
 *    수정일         |       수정자            |          수정내용                   
 *  ------------|-------------------|------------------------------------------------
 *  2019.12.06  |   tpohhj1             | 최초 생성  
 */

/** 
 * 	tpohhj1
 * 	정수 포맷 체크 
 **/
function emIntegerFormatCheck(checkValue) {	
	var pattern = /^[+-]?[0-9]+$/;
	return pattern.test(checkValue);
}

/** 
 * 	tpohhj1
 * 	실수 포맷 체크 
 **/
function emDoubleFormatCheck(checkValue) {	
	var pattern = /^[+-]?\d+(\.?\d*)$/;
	return pattern.test(checkValue);
}

/**
 * tpohhj1
 * 전화번호 - 처리
 */
function emTelNoFormat(checkValue) {
	var rs = "";
	
	if(emIntegerFormatCheck(checkValue)) {
		rs = checkValue.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
	} else {
		rs = checkValue;
	}
	
	return rs;
}