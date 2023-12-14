requires("/resources/js/em/util/emStringUtil.js?version=1");
requires("/resources/js/em/util/emRegexUtil.js?version=1.01");
requires("/resources/js/em/util/emJsonUtil.js?version=1");

/**
 * 파일명 : emEtcUtil js
 * 설  명 : EM에서 금액관련 Util JavaScript
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
 *  jsonList의 각 열의 금액을 원하는 단위로 변경해서 리턴 
 *	parameter : 
 *	    jsonList   :  변경할 jsonList 값
 *		targetJson :  변경을 원하는 jsonList key 값 및 원하는단위를 가지고 있는 json 객체
 *			ex ) 
 *				jsonList : [
 *					{ "amt1" : 1000, "amt2" : 2000, "amt3" : 3000, ....},
 *					{ "amt1" : 5000, "amt2" : 5000, "amt3" : 10000, ....},
 *					.....
 *				]  
 *				targetJson : {
 *					"amt1" : {
 *						"calculation" : ""    - 계산방식
 *													곱셈 : multiply, 나눗셈 : division
 *													default : division
 *						"unit" : 100,         - 변경할 단위 
 *													공백일시 단위를 계산하지 않고 값 그대로 리턴
 *													default : 공백
 * 						"round" : {			  - 변경할 올림, 반올림, 버림 여부
 * 							"action" : ""       올림 : ceil, 반올림 : round, 버림 : floor
 *                                              default : floor
 *                                              
 * 							"digits" : 0	  - 액션에 해당되는 자릿수 
 * 												default : 0
 *                      },         				      
 *						"comma" : ""          - 3자리 콤마추가여부
 *														추가 : y, 추가안함 : n
 *														default : n
 *					},
 *					"amt2" : {
 *						"unit" : 1000
 *					}
 *				}
 *
 *				return
 *					[
 *						{"amt1" : 10, "amt2" : 2, "amt3" : 3000, ....},
 *						{"amt1" : 50, "amt2" : 5, "amt3" : 10000, ....},
 *						....
 *					] 
 */
function emJsonListAmtUnitFormat(jsonList, targetJson) {
	var resultJsonList = emJsonArrayClone(emNvl(jsonList, []));
	
	if ( resultJsonList.length > 0 
			&& Object.keys(emNvl(targetJson, {})).length > 0 ) {
		for(var i=0; i<resultJsonList.length; i++) {
			for(var targetJsonKey in targetJson) {
				var resultJsonListDetailValue = resultJsonList[i][targetJsonKey];
				/** 실수만 계산 **/
				if ( emDoubleFormatCheck(resultJsonListDetailValue) ) {
					resultJsonListDetailValue = emNvl(resultJsonList[i][targetJsonKey], 0);
					if ( resultJsonListDetailValue != 0 ) {
						var targetJsonDetail = emNvl(targetJson[targetJsonKey], []);
						/** option get value **/
						var calculation = emNvl(targetJsonDetail["calculation"], "division");
						var unit = emNvl(targetJsonDetail["unit"], "");
						var round = emNvl(targetJsonDetail["round"], {"action":"floor","digits":0});
						var comma = emNvl(targetJsonDetail["comma"], "n");
						
						if ( emIntegerFormatCheck(unit) && unit != 0 ) {
							var roundDigits = emNvl(round["digits"], 0) * 1;
							if ( round["action"] == "ceil" ) {
								/** 올림 **/
								if ( calculation == "division" ) {
									/** 나누기 **/								
									resultJsonList[i][targetJsonKey] = emCustomCeil(resultJsonListDetailValue / unit*1, roundDigits)*1;
								} else {
									/** 곱하기 **/
									resultJsonList[i][targetJsonKey] = emCustomCeil(resultJsonListDetailValue * unit*1, roundDigits)*1;
								}
							} else if ( round["action"] == "round" ) {
								/** 반올림 **/
								if ( calculation == "division" ) {
									/** 나누기 **/								
									resultJsonList[i][targetJsonKey] = (resultJsonListDetailValue / unit*1).toFixed(roundDigits)*1;
								} else {
									/** 곱하기 **/
									resultJsonList[i][targetJsonKey] = (resultJsonListDetailValue * unit*1).toFixed(roundDigits)*1;
								}
							} else {
								/** 버림 **/
								if ( calculation == "division" ) {
									/** 나누기 **/								
									resultJsonList[i][targetJsonKey] = emCustomFloor(resultJsonListDetailValue / unit*1, roundDigits)*1;
								} else {
									/** 곱하기 **/
									resultJsonList[i][targetJsonKey] = emCustomFloor(resultJsonListDetailValue * unit*1, roundDigits)*1;
								}
							}
							
							if ( comma == "Y" ) {
								resultJsonList[i][targetJsonKey] = emAddComma(resultJsonList[i][targetJsonKey]);
							} 
						} // end if( unit != "" )
					} // end if ( resultJsonListDetailValue != 0 )
				} // end if( emDoubleFormatCheck(resultJsonListDetailValue) )
			} // end for(var targetJsonKey in targetJson)
		} // end for(var i=0; i<resultJsonList.length; i++) 
		return resultJsonList;	
	} else {
		return jsonList;
	}
}

/**
 * tpohhj1
 * 3자리 Comma 추가
 */
function emAddComma(n) {
	if ( emDoubleFormatCheck(n) ) {
		var result = '';
		var nArr = n.toString().split(".");
		var reg = /(^[+-]?\d+)(\d{3})(\.\d+)?/;
		nArr[0] += '';
		while (reg.test(nArr[0]))
			nArr[0] = nArr[0].replace(reg, '$1' + ',' + '$2');
		
		if ( nArr.length == 2 ) {
			result = nArr[0]+"."+emNvl(nArr[1], '')
		} else {
			result = nArr[0];
		}
		return result;	
	} else {
		return 0;
	}
}

/**
 * tpohhj1 
 * 원하는 자리수서 올림 
 */
function emCustomCeil(value, digits) {
	var returnValue = emNvl(value, 0);
	digits = emNvl(digits, 0);
	
	if(returnValue != 0 && emIntegerFormatCheck(digits) ) {
		var digitsNum = Math.pow(10, digits);
		returnValue = Math.ceil(returnValue*digitsNum) / digitsNum;
		if ( digits < 0 ) {
			digits = digitsNum;
		}
		return returnValue.toFixed(digits);
	} else {
		return returnValue;
	}
}

/**
 * tpohhj1 
 * 원하는 자리수서 버림
 */
function emCustomFloor(value, digits) {
	var returnValue = emNvl(value, 0);
	digits = emNvl(digits, 0);
	
	if(returnValue != 0 && emIntegerFormatCheck(digits) ) {
		var digitsNum = Math.pow(10, digits);
		returnValue = Math.floor(returnValue*digitsNum) / digitsNum;
		if ( digits < 0 ) {
			digits = digitsNum;
		}
		return returnValue.toFixed(digits);
	} else {
		return returnValue;
	}
}