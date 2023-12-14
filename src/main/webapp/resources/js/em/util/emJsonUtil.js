/**
 * 파일명 : emEtcUtil js
 * 설  명 : EM에서 JSON 관련 Util JavaScript
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
 * jsonArray 객체 deep copy
 */
function emJsonArrayClone(obj) {
	if ( obj == null ) {
		return obj;
	}
	
	if (typeof(obj) == 'object' && obj.constructor == Array ) {
		var copyObj = [];
		for(var i=0; i<obj.length; i++) {
			copyObj[i] = emJsonClone(obj[i]);
		}
		return copyObj;
	} else {
		return obj;
	}
}

/**
 * tpohhj1
 * json 객체 deep copy
 */
function emJsonClone(obj) {
	if (obj == null ) {
		return obj;
	}
	
	if (typeof(obj) == 'object' && obj.constructor == Object ) {
		var copyObj = obj.constructor();
		for(var objAttr in obj) {
			if (obj.hasOwnProperty(objAttr)) {
				copyObj[objAttr] = emJsonClone(obj[objAttr]);
			}
		}
		return copyObj;
	} else {
		return obj;
	}
}