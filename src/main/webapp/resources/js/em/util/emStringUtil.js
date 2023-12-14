/**
 * 파일명 : emEtcUtil js
 * 설  명 : EM에서 스트링관련 Util JavaScript
 * 
 *    수정일      		수정자      	수정내용
 * ------------  ---------   -------------
 * << 개정이력(Modification Information) >>
 *    수정일         |       수정자            |          수정내용                   
 *  ------------|-------------------|------------------------------------------------
 *  2019.12.06  |   tpohhj1             | 최초 생성  
 */

/** 
 * tpohhj1
 * 	value 값 null체크 및 
 * 	value 			: 검사받을 값
 * 	replaceValue	: 대체할 값
 * 	
 * 	value 값이 null일 경우 replaceValue값으로 대체					
 * 	replaceValue가 null이면 ""로 응답
 **/
function emNvl(value, replaceValue) {
	if(typeof value == "undefined" || value == null || value == "") {
		if (typeof replaceValue == "undefined" || replaceValue == null) {
			value = "";			
		} else {
			value = replaceValue;			
		}
	}
	return value;
}