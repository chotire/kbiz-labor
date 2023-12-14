/**
 * @target 문자열, 숫자, 날짜 관련 공통함수
 */

/**
 * 문자열 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class strLib
 * @namespace strLib
 */
var strLib = {};

/**
 * 숫자 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class numLib
 * @namespace numLib
 */
var numLib = {};

/**
 * 날짜 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class dateLib
 * @namespace dateLib
 */
var dateLib = {};

/**
 * strLib.isEmpty(source, whitespace) - 지정한 문자열이 빈문자열인지 확인합니다.<br>
 * strLib.defaultValue(source, initValue, whitespace) - 지정한 문자열이 빈문자열이면 기본값을 반환하고, 아니면 원본값을 반환합니다. whitespace 인자를 true로 지정하면 여러 개의 공백 문자열도 빈문자열로 취급합니다.<br>
 * strLib.getByteLength(source) - 문자열의 Byte 길이를 반환합니다.<br>
 * strLib.DBCS_SBCS(source) - DBCS 문자열을 SBCS 문자열로 변환합니다.<br>
 * strLib.padLeft(source, size, char) - 지정한 길이가 될 때까지 문자열 좌측에 지정한 문자를 추가합니다.<br>
 * strLib.padLeftByte(source, size, char) - 지정한 Byte 길이가 될 때까지 문자열 좌측에 지정한 문자를 추가합니다.<br>
 * strLib.getLocale(source) - 문자(char)의 유형을 반환합니다.<br>
 * strLib.isKorean(source) - 입력받은 문자열에 한글이 포함되어 있으면 true, 아니면 false를 리턴합니다.<br>
 * strLib.onlyKorean(source) - 입력받은 문자열이 한글로만 구성되어 있는지 여부를 반환합니다.<br>
 * strLib.isFinalConsonant(source) - 전달된 단어에 종성이 존재하는지 여부를 반환합니다.<br>
 * strLib.attachPostposition(source, quotation) - 단어 뒤에 '은'이나 '는'을 붙여서 반환합니다.<br>
 * strLib.getBirthdayFromRRN(source) - 주민등록번호로부터 생년월일을 추출합니다.<br>
 * strLib.serialize(object) - XML Document 개체나 JSON 개체를 직렬화해서 반환합니다.<br>
 * strLib.parse(jsonString) - 지정한 JSON 문자열을 JSON 개체로 반환합니다.<br>
 * strLib.isJSON(object) - 전달된 개체가 JSON 개체인지 여부를 반환합니다. strLib.replaceBr_onchange(e) - xf:textarea 상의 줄바꿈을 <br/> 태그로 변경 하는 onchange 이벤트 핸들러. *
 * 
 * numLib.toFloat(number, scale) - 지정한 문자열을 지정한 스케일의 Float 형으로 반환합니다.<br>
 * numLib.addComma(number) - 지정한 숫자 문자열에 콤마를 추가합니다.<br>
 * numLib.toHangul(number) - 지정한 숫자를 한글 숫자로 반환합니다. (주의: 소숫점 이하는 처리하지 않습니다.)<br>
 * numLib.toHanja(number) - 지정한 숫자를 한자 숫자로 반환합니다. (주의: 소숫점 이하는 처리하지 않습니다.)<br>
 * numLib.checkPrecision(number, precision, scale) - 지정한 숫자가 정밀도와 스케일을 만족하는지 확인합니다.<br>
 * numLib.fillZero(number, size) - 지정한 길이만큼 숫자 좌측에 0을 채웁니다.<br>
 * numLib.validateNull(number) - 지정한 숫자 문자열이 null 이거나 올바른 숫자가 아니면 0을 반환합니다.<br>
 * numLib._toFloat(number) - [내부용] 지정한 문자열을 Float 형으로 반환합니다.<br>
 * numLib._toHangul(number) - [내부용] 지정한 숫자를 한글 숫자로 변환할 때 천의자리를 설정합니다.<br>
 * numLib._toHanja(number) - [내부용] 지정한 숫자를 한자 숫자로 변환할 때 천의자리를 설정합니다.
 * 
 * dateLib.getCurrentDate(pattern) - 지정한 패턴으로 서버의 현재 날짜 및 시간을 반환합니다. (y: Year, M: Month, d: Day, H: Hour, m: Minute, s: Second, S: Millisecond)<br>
 * dateLib.getFormattedString(objDate, pattern) - Date 개체를 지정한 패턴으로 변환한 날짜 문자열을 반환합니다. (y: Year, M: Month, d: Day, H: Hour, m: Minute, s: Second, S: Millisecond)<br>
 * dateLib.parse(dateString, pattern) - 지정한 패턴의 날짜 문자열을 Date 개체로 변환합니다. 패턴을 지정하지 않으면 yyyyMMdd 패턴이 기본으로 적용됩니다.<br>
 * dateLib.addHours(dateString, hours) - 지정한 날짜 문자열에 지정한 만큼의 시간을 날짜를 반환합니다.<br>
 * dateLib.addDays(dateString, days) - 지정한 날짜 문자열에 지정한 만큼의 날을 더한 날짜를 반환합니다.<br>
 * dateLib.addMonths(dateString, months) - 지정한 날짜 문자열에 지정한 만큼의 달을 더한 날짜를 반환합니다.<br>
 * dateLib.addYears(dateString, years) - 지정한 날짜 문자열에 지정한 만큼의 년도를 더한 날짜를 반환합니다.<br>
 * dateLib.diffDate(dateStringFrom, dateStringTo) - 지정한 날짜 문자열들 간의 날짜 차이를 반환합니다.<br>
 * dateLib.getLastDayOfMonth(dateString) - 지정한 날짜 문자열에 해당하는 달의 마지막 날짜를 반환합니다.<br>
 * dateLib.getDayOfWeek(dateString) - 지정한 날짜 문자열의 요일을 반환합니다.<br>
 * dateLib.getLunarDate(dateString) - 지정한 날짜 문자열의 음력 날짜 문자열을 반환합니다.<br>
 * dateLib.setDateDelimiter(dateString, delimiter) - yyyyMMdd 패턴의 날짜 문자열에 지정한 구분자를 설정합니다.<br>
 * dateLib.setTimeDelimiter(timeString, delimiter) - HHmm 패턴의 시간 문자열에 지정한 구분자를 설정합니다.<br>
 * dateLib.isLeaf(year) - 지정한 년도가 윤년인지 여부를 반환합니다.<br>
 * dateLib.isYYYYMMDD(dateString) - 지정한 문자열이 yyyyMMdd 패턴의 날짜 데이터인지 여부를 반환합니다.<br>
 * dateLib.isYYYYMM(dateString) - 지정한 문자열이 yyyyMM 패턴의 날짜(월) 데이터인지 여부를 반환합니다.<br>
 * dateLib.isHHMM(timeString) - 지정한 문자열이 HHmm 패턴의 시간 데이터인지 여부를 반환합니다.
 */

/**
 * 문자열 Trim 기능은 빈번하게 사용되는 기능이므로 prototype 형태로 구현합니다.
 */
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
	};
}

/**
 * 지정한 문자열이 빈문자열인지 확인합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @param {boolean} whitespace - 여러 개의 공백 문자열도 빈문자열로 취급할지 여부
 * @return {boolean} 빈문자열 여부
 */
strLib.isEmpty = function(source, whitespace) {
	try {
		if (source === null || source === undefined) {
			return true;
		}

		if (typeof (source) === "object") {
			// 개체
			var i = 0;
			for (key in source) {
				i++;
			}
			if (i === 0) {
				return true;
			}
		} else {
			// 문자열
			if (!whitespace) {
				whitespace = false;
			}

			source = source.toString().toLowerCase();
			if (whitespace) {
				source = source.trim();
			}
			if (source === "undefined" || source === "null" || source === "") {
				return true;
			}
		}

		return false;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.isEmpty: " + e);
	}
};

/**
 * 지정한 문자열이 빈문자열이면 기본값을 반환하고, 아니면 원본값을 반환합니다. whitespace 인자를 true로 지정하면 여러 개의 공백 문자열도 빈문자열로 취급합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @param {string} initValue - 기본값
 * @param {boolean} whitespace - 여러 개의 빈 문자열도 빈문자열로 취급할지 여부
 * @return {string} 원본값 또는 기본값
 */
strLib.defaultValue = function(source, initValue, whitespace) {
	try {
		if (strLib.isEmpty(source, whitespace)) {
			if (initValue == null) {
				return "";
			} else {
				return initValue;
			}
		} else {
			return source;
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.defaultValue: " + e);
	}
};

/**
 * 문자열의 Byte 길이를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @return {number} 문자열의 Byte 길이
 */
strLib.getByteLength = function(source) {
	try {
		if (!source) {
			return 0;
		}
		return WebSquare.util.getStringByteSize(source);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.getByteLength: " + e);
	}
};

/**
 * DBCS 문자열을 SBCS 문자열로 변환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @return {string} SBCS 문자열
 */
strLib.DBCS_SBCS = function(source) {
	try {
		var result = "";
		var length = source.length;

		for (var i = 0; i < length; i++) {
			var c = source.charCodeAt(i);
			if (c >= 65281 && c <= 65374 && c != 65340) {
				result += String.fromCharCode(c - 65248);
			} else if (c == 8217) {
				result += String.fromCharCode(39);
			} else if (c == 8221) {
				result += String.fromCharCode(34);
			} else if (c == 12288) {
				result += String.fromCharCode(32);
			} else if (c == 65507) {
				result += String.fromCharCode(126);
			} else if (c == 65509) {
				result += String.fromCharCode(92);
			} else {
				result += source.charAt(i);
			}
		}

		return result.trim();
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.DBCS_SBCS: " + e);
	}
};

/**
 * 지정한 길이가 될 때까지 문자열 좌측에 지정한 문자를 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @param {number} size - 결과 문자열 길이
 * @param {string} char - 추가될 문자
 * @return {string} 결과 문자열
 */
strLib.padLeft = function(source, size, char) {
	try {
		if (!source) {
			source = "";
		}
		source = source.toString();

		if (!size) {
			return source;
		}

		if (!char) {
			char = " ";
		}

		var result = source;
		for (var i = 0; i < size - source.length; i++) {
			result = char + result;
		}

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.padLeft: " + e);
	}
};

/**
 * 지정한 Byte 길이가 될 때까지 문자열 좌측에 지정한 문자를 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @param {number} size - 결과 Byte 문자열 길이
 * @param {string} char - 추가될 문자
 * @return {string} 결과 문자열
 */
strLib.padLeftByte = function(source, size, char) {
	try {
		if (!source) {
			source = "";
		}
		source = source.toString();

		if (!size) {
			return source;
		}

		if (!char) {
			char = " ";
		}

		if (strLib.getByteLength(char) > 1) {
			// 개발자 메시지: 영문지원 안 함
			throw "추가되는 문자는 1Byte 문자만 지정할 수 있습니다.";
		}

		var result = source;
		var byteLength = strLib.getByteLength(source);
		for (var i = 0; i < size - byteLength; i++) {
			result = char + result;
		}

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.padLeftByte: " + e);
	}
};

/**
 * 문자(char)의 유형을 반환합니다.
 * 
 * @author jeonkw
 * @date 2017. 05. 08.
 * @memberOf strLib
 * @param {string} source - 문자(char)
 * @return {number} 한글음절(1), 한글자모(2), 숫자(4), 특수문자(8), 영문대(16), 영문소(32), 기타(48)
 * @example strLib.getLocale(source);
 */
strLib.getLocale = function(source) {
	try {
		var locale = 0;
		if (source.length > 0) {
			var charCode = source.charCodeAt(0);

			if (charCode >= 0XAC00 && charCode <= 0XD7A3) {
				// 한글음절.[44032 ~ 55203]
				locale = 0X1; // 1
			} else if ((charCode >= 0X1100 && charCode <= 0X11F9) || (charCode >= 0X3131 && charCode <= 0X318E)) {
				// 한글자모.[4352 ~ 4601]
				locale = 0X2; // 2
			} else if (charCode >= 0X30 && charCode <= 0X39) {
				// 숫자.[48 ~ 57]
				locale = 0X4; // 4
			} else if ((charCode >= 0X20 && charCode <= 0X2F) || (charCode >= 0X3A && charCode <= 0X40) || (charCode >= 0X5B && charCode <= 0X60)
					|| (charCode >= 0X7B && charCode <= 0X7E)) {
				// 특수문자
				locale = 0X8; // 8
			} else if (charCode >= 0X41 && charCode <= 0X5A) {
				// 영문 대.[65 ~ 90]
				locale = 0X10; // 16
			} else if (charCode >= 0X61 && charCode <= 0X7A) {
				// 영문 소.[97 ~ 122]
				locale = 0X20; // 32
			} else {
				// 기타
				locale = 0X30; // 48
			}
		}
		return locale;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.getLocale: " + e);
	}
};

/**
 * 입력받은 문자열에 한글이 포함되어 있으면 true, 아니면 false를 리턴합니다.
 * 
 * @author jeonkw
 * @date 2017. 05. 08.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @return {boolean} 한글 포함 여부
 * @example strLib.isKorean("무궁화꽃이");
 */
strLib.isKorean = function(source) {
	try {
		if (source != null && source.trim().length > 0) {
			var locale = 0;
			for (var i = 0; i < source.length; i++) {
				locale = strLib.getLocale(source.charAt(i));
				if ((locale & ~0x3) == 0) {
					return true;
				}
			}
		}

		return false;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.isKorean: " + e);
	}
};

/**
 * 입력받은 문자열이 한글로만 구성되어 있는지 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @return {boolean} true/false
 */
strLib.onlyKorean = function(source) {
	try {
		if (!source) {
			return false;
		}

		// (0xAC00 <= c && c <= 0xD7A3) 초중종성이 모인 한글자
		// (0x3131 <= c && c <= 0x318E) 자음 모음
		for (var i = 0; i < source.length; i++) {
			var c = source.charCodeAt(i);
			if (!((0xAC00 <= c && c <= 0xD7A3) || (0x3131 <= c && c <= 0x318E))) {
				return false;
			}
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.onlyKorean: " + e);
	}
};

/**
 * 전달된 단어에 종성이 존재하는지 여부를 반환합니다.
 * 
 * @author jeonkw
 * @date 2017. 05. 08.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @return {boolean} 종성 존재 여부
 */
strLib.isFinalConsonant = function(source) {
	try {
		var code = source.charCodeAt(source.length - 1);
		if ((code < 44032) || (code > 55197)) {
			return false;
		}

		if ((code - 16) % 28 == 0) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.isFinalConsonant: " + e);
	}
};

/**
 * 단어 뒤에 '은'이나 '는'을 붙여서 반환합니다.
 * 
 * @author jeonkw
 * @date 2017. 05. 08.
 * @memberOf strLib
 * @param {string} source - 원본 단어
 * @param {boolean} [quotation] - 따옴표 추가 여부
 * @returns {string} 결과 문자열
 */
strLib.attachPostposition = function(source, quotation) {
	try {
		if (!quotation) {
			quotation = false;
		}

		if (strLib.isFinalConsonant(source)) {
			if (quotation) {
				source = "'" + source + "'은 ";
			} else {
				source = source + "은 ";
			}
		} else {
			if (quotation) {
				source = "'" + source + "'는 ";
			} else {
				source = source + "는 ";
			}
		}

		return source;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.attachPostposition: " + e);
	}
};

/**
 * 주민등록번호로부터 생년월일을 추출합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf strLib
 * @param {string} source - 원본 문자열
 * @return {string} 결과 문자열
 */
strLib.getBirthdayFromRRN = function(source) {
	try {
		source = source.replace(/\D/ig, "");
		if (source.length < 7 || isNaN(source)) {
			// 개발자 메시지: 영문지원 안 함
			throw "주민등록번호가 너무 짧거나 올바르지 않습니다.";
		}

		var yearPrefix = "";
		var yearIndexer = source.substr(6, 1);
		if (yearIndexer == "9" || yearIndexer == "0") {
			yearPrefix = "18";
		} else if (yearIndexer == "1" || yearIndexer == "2") {
			yearPrefix = "19";
		} else if (yearIndexer == "3" || yearIndexer == "4") {
			yearPrefix = "20";
		} else {
			return "";
		}

		return yearPrefix + source.substr(0, 2) + source.substr(2, 2) + source.substr(4, 2);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.getBirthdayFromRRN: " + e);
	}
};

/**
 * XML Document 개체나 JSON 개체를 직렬화해서 반환합니다.
 * 
 * @date 2017. 05. 15.
 * @memberOf strLib
 * @param {object} object - XML Document 개체 또는 JSON 개체
 * @returns {string} 직렬화된 문자열
 */
strLib.serialize = function(object) {
	try {
		if (typeof object == "string" || object == null) {
			return object;
		} else if (strLib.isJSON(object)) {
			return JSON.stringify(object);
		} else if (xmlLib.isXmlCoc(object)) {
			return WebSquare.xml.serialize(object);
		} else {
			return object;
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.serialize: " + e);
	}
};

/**
 * 지정한 JSON 문자열을 JSON 개체로 반환합니다.
 * 
 * @date 2017. 05. 15.
 * @memberOf strLib
 * @param {string} jsonString - 직렬화된 JSON 문자열
 * @returns {object} JSON 개체
 */
strLib.parse = function(jsonString) {
	try {
		var json = {};

		try {
			json = JSON.parse(jsonString);
		} catch (e2) {
			json = eval("(" + jsonString + ")");
		}

		return json;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.parse: " + e);
	}
};

/**
 * 전달된 개체가 JSON 개체인지 여부를 반환합니다.
 * 
 * @date 2014. 12. 10.
 * @memberOf strLib
 * @param {object} object - 검사할 개체
 * @returns {boolean} JSON 개체 여부
 */
strLib.isJSON = function(object) {
	try {
		if (typeof object !== "object") {
			return false;
		}

		try {
			JSON.stringify(object);
			return true;
		} catch (e) {
			return false;
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("strLib.isJSON: " + e);
	}
};

/**
 * TEXT AREA 줄바꿈 문자를 br 로 변경
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 */
strLib.replaceBr_onchange = function(e){
	
	var thisObjId = this.getID();
	var thisObjValue = this.getValue();
	var thisObjViewVersionName = thisObjId +"View";
	var dd = thisObjValue.replace(/(\n|\r\n)/g, "<br/>");
	
	try{$w.comp[thisObjViewVersionName].setValue(thisObjValue.replace(/(\n|\r\n)/g, "<br/>"));}catch(e){}
}


/**
 * 지정한 문자열을 지정한 스케일의 Float 형으로 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @param {number} scale - 스케일
 * @returns {number} 숫자
 */
numLib.toFloat = function(number, scale) {
	try {
		if (scale || scale == 0) {
			var power = Math.pow(10, scale);
			var result = numLib._toFloat(number);

			return Math.round(result * power) / power;
		} else {
			return numLib._toFloat(number);
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.toFloat: " + e);
	}
};

/**
 * 지정한 숫자 문자열에 콤마를 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @returns {string} 콤마가 추가된 숫자 문자열
 */
numLib.addComma = function(number) {
	try {
		var result = "";
		var decRight = "";
		var sign = "";

		number = numLib._toFloat(number).toString();
		if (number.charAt(0) == "-" || number.charAt(0) == "+") {
			sign = number.charAt(0);
			number = number.substr(1);
		}

		var pointPos = number.indexOf(".");
		if (pointPos > 0) {
			decRight = number.substr(pointPos);
			number = number.substr(0, pointPos);
		}

		var length = number.length;
		while (length > 3) {
			length -= 3;
			result = "," + number.substr(length, 3) + result;
		}
		result = sign + number.substr(0, length) + result + decRight;

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.addComma: " + e);
	}
};

/**
 * 지정한 숫자를 한글 숫자로 반환합니다. (주의: 소숫점 이하는 처리하지 않습니다.)
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @returns {string} 한글 숫자
 */
numLib.toHangul = function(number) {
	try {
		number = number.toString();

		var pointPos = number.indexOf(".");
		if (pointPos >= 0)
			number = number.substr(0, pointPos);

		number = number.replace(/[^0-9]/g, "");
		var jari = new Array("", "만", "억", "조", "경", "해");
		var index = 0;

		var result = "";
		var buffer;

		var length = number.length;
		while (length > 4) {
			buffer = numLib._toHangul(number.substr(length - 4));
			if (buffer != "")
				result = buffer + jari[index] + result;
			length -= 4;
			number = number.substr(0, length);
			index++;
		}
		buffer = numLib._toHangul(number);

		if (buffer != "")
			result = buffer + jari[index] + result;
		if (result == "")
			result = "영";

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.toHangul: " + e);
	}
};

/**
 * 지정한 숫자를 한자 숫자로 반환합니다. (주의: 소숫점 이하는 처리하지 않습니다.)
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @returns {string} 한자 숫자
 */
numLib.toHanja = function(number) {
	try {
		number = number.toString();

		var pointPos = number.indexOf(".");
		if (pointPos >= 0)
			number = number.substr(0, pointPos);

		number = number.replace(/[^0-9]/g, "");
		var jari = new Array("", "萬", "億", "兆", "京", "垓");
		var index = 0;

		var result = "";
		var buffer;

		var length = number.length;
		while (length > 4) {
			buffer = numLib._toHanja(number.substr(length - 4));
			if (buffer != "")
				result = buffer + jari[index] + result;
			length -= 4;
			number = number.substr(0, length);
			index++;
		}
		buffer = numLib._toHanja(number);

		if (buffer != "")
			result = buffer + jari[index] + result;
		if (result == "")
			result = "〇";

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.toHanja: " + e);
	}
};

/**
 * 지정한 숫자가 정밀도와 스케일을 만족하는지 확인합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @param {number} precision - 정밀도
 * @param {number} scale - 스케일
 * @returns {boolean} 유효성 여부
 */
numLib.checkPrecision = function(number, precision, scale) {
	try {
		if (!precision) {
			precision = 15;
		}

		if (!scale) {
			scale = 3;
		}

		var maxNumber = Math.pow(10, precision - scale);
		if (maxNumber <= number) {
			return false;
		} else if (-maxNumber >= number) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.checkPrecision: " + e);
	}
};

/**
 * 지정한 길이만큼 숫자 좌측에 0을 채웁니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @param {number} size - 결과 문자열 길이
 * @returns {string} 결과 문자열
 */
numLib.fillZero = function(number, size) {
	try {
		if (!size) {
			return number;
		}

		number = number.toString();

		var zero = "";
		var length = number.length;
		if (length < size) {
			for (var i = length; i < size; i++) {
				zero += "0";
			}
		}

		return zero + number;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.fillZero: " + e);
	}
};

/**
 * 지정한 숫자 문자열이 null 이거나 올바른 숫자가 아니면 0을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @returns {string} 결과 숫자
 */
numLib.validateNull = function(number) {
	try {
		if (!number) {
			return 0;
		}

		number = number.toString().trim();
		if (number == "" || number.toLowerCase() == "null") {
			return 0;
		}

		var sign = number.substr(0, 1);
		if (sign != "+" && sign != "-")
			sign = "";

		var value = number.replace(/[^\d\.]/ig, "");
		if (isNaN(value))
			return 0;
		else
			return (sign == "-") ? parseFloat(value) * -1 : parseFloat(value);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib.validateNull: " + e);
	}
};

/**
 * [내부용] 지정한 문자열을 Float 형으로 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf numLib
 * @param {string} number - 숫자 문자열
 * @returns {number} 콤마가 추가된 숫자 문자열
 */
numLib._toFloat = function(number) {
	try {
		if (!number) {
			return 0;
		}

		var result = parseFloat(number.toString().replace(/[^0-9\+\-\.]+/g, ""));
		if (isNaN(result))
			result = 0;
		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib._toFloat: " + e);
	}
};

/**
 * [내부용] 지정한 숫자를 한글 숫자로 변환할 때 천의자리를 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {number} number - 숫자 문자열
 * @returns {number} 한글 숫자
 */
numLib._toHangul = function(number) {
	try {
		var jari = new Array("", "십", "백", "천");
		var su = new Array("일", "이", "삼", "사", "오", "육", "칠", "팔", "구");

		number = number.toString();
		var length = number.length;

		var result = "";
		for (var i = 0; i < length; i++) {
			var char = parseInt(number.charAt(length - i - 1), 10);
			if (char > 0)
				result = su[char - 1] + jari[i] + result;
		}

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib._toHangul: " + e);
	}
};

/**
 * [내부용] 지정한 숫자를 한자 숫자로 변환할 때 천의자리를 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {number} number - 숫자 문자열
 * @returns {number} 한자 숫자
 */
numLib._toHanja = function(number) {
	try {
		var jari = new Array("", "十", "百", "千");
		var su = new Array("一", "二", "三", "四", "五", "六", "七", "八", "九");

		number = number.toString();
		var length = number.length;

		var result = "";
		for (var i = 0; i < length; i++) {
			var char = parseInt(number.charAt(length - i - 1), 10);
			if (char > 0)
				result = su[char - 1] + jari[i] + result;
		}

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("numLib._toHanja: " + e);
	}
};

/**
 * 지정한 패턴으로 서버의 현재 날짜 및 시간을 반환합니다. (y: Year, M: Month, d: Day, H: Hour, m: Minute, s: Second, S: Millisecond)
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} pattern - 날짜 패턴
 * @returns {string} 날짜 문자열
 */
dateLib.getCurrentDate = function(pattern) {
	try {
		return $w.getCurrentServerDate(pattern);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.getCurrentDate: " + e);
	}
};

/**
 * Date 개체를 지정한 패턴으로 변환한 날짜 문자열을 반환합니다. (y: Year, M: Month, d: Day, H: Hour, m: Minute, s: Second, S: Millisecond)
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {date} objDate - Date 개체
 * @param {string} pattern - 날짜 패턴
 * @returns {string} 날짜 문자열
 */
dateLib.getFormattedString = function(objDate, pattern) {
	try {
		if (!objDate || !objDate.getFullYear) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 Date 개체가 아닙니다.";
		}

		if (!pattern) {
			pattern = "yyyy-MM-dd HH:mm:ss";
		}

		return $w.getFormattedDate(objDate, pattern);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.getFormattedString: " + e);
	}
};

/**
 * 지정한 패턴의 날짜 문자열을 Date 개체로 변환합니다. 패턴을 지정하지 않으면 yyyyMMdd 패턴이 기본으로 적용됩니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {string} pattern - 날짜 패턴
 * @returns {Date} Date 개체
 */
dateLib.parse = function(dateString, pattern) {
	try {
		if (!pattern) {
			pattern = "yyyyMMdd";
		}
		return WebSquare.date.parseDate(dateString.replace(/\D/ig, ""), pattern.replace(/[^a-zA-Z]/ig, ""));
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.parse: " + e);
	}
};

/**
 * 지정한 날짜 문자열에 지정한 만큼의 시간을 날짜를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {string} hours - 더할 시간
 * @returns {string} 날짜 문자열
 */
dateLib.addHours = function(dateString, hours) {
	try {
		dateString = dateString.replace(/\D/ig, "").trim();
		if (dateString.length < 12 || !dateLib.isYYYYMMDD(dateString.substr(0, 8)) || !dateLib.isHHMM(dateString.substr(8, 4))) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜 및 시간이 아닙니다.";
		}

		if (!hours || parseInt(hours, 10).toString().replace(/\D/ig, "") == "") {
			hours = 0;
		}

		var current = dateLib.parse(dateString, "yyyyMMddHHmm");
		var result = new Date(current.getTime() + (parseInt(hours, 10) * 60 * 60 * 1000));

		return dateLib.getFormattedString(result, "yyyyMMddHHmm");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.addHours: " + e);
	}
};

/**
 * 지정한 날짜 문자열에 지정한 만큼의 날을 더한 날짜를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {string} days - 더할 날
 * @returns {string} 날짜 문자열
 */
dateLib.addDays = function(dateString, days) {
	try {
		dateString = dateString.replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		if (!days || parseInt(days, 10).toString().replace(/\D/ig, "") == "") {
			days = 0;
		}

		return $w.dateAdd(dateString, parseInt(days, 10));
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.addDays: " + e);
	}
};

/**
 * 지정한 날짜 문자열에 지정한 만큼의 달을 더한 날짜를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {string} months - 더할 달
 * @returns {string} 날짜 문자열
 */
dateLib.addMonths = function(dateString, months) {
	try {
		dateString = dateString.replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		if (!months || parseInt(months, 10).toString().replace(/\D/ig, "") == "") {
			days = 0;
		}

		var sYear = dateString.substring(0, 4);
		var sMonth = dateString.substring(4, 6);
		var sDay = dateString.substring(6, 8);

		var rYear = parseInt(sYear, 10);
		var rMonth = parseInt(sMonth, 10) + parseInt(months, 10);
		var rDay = parseInt(sDay, 10);

		if (rMonth < 1) {
			rYear = rYear - 1 + parseInt(rMonth / 12, 10);
			rMonth = rMonth + 12 - 12 * parseInt(rMonth / 12, 10);
		} else if (rMonth % 12 == 0) {
			rYear = rYear + (parseInt(rMonth / 12, 10) - 1);
			rMonth = 12;
		} else if (rMonth > 12) {
			rYear = rYear + parseInt(rMonth / 12, 10);
			rMonth = rMonth % 12;
		}

		if (rMonth < 10) {
			rMonth = "0" + rMonth;
		}

		var lastDate = dateLib.getLastDayOfMonth(rYear.toString() + rMonth.toString());
		if (parseInt(lastDate.substring(6, 8), 10) < rDay) {
			rDay = parseInt(lastDate.substring(6, 8), 10);
		}

		if (rDay < 10) {
			rDay = "0" + rDay;
		}

		var resultDate = rYear.toString() + rMonth.toString() + rDay.toString();

		// 기본일자가 달의 마지막 날이면 결과일자도 달의 마지막 날로 설정합니다.
		var checkLastDate = dateLib.getLastDayOfMonth(dateString.substring(0, 6));
		if (checkLastDate == dateString) {
			resultDate = dateLib.getLastDayOfMonth(resultDate);
		}
		return resultDate;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.addMonths: " + e);
	}
};

/**
 * 지정한 날짜 문자열에 지정한 만큼의 년도를 더한 날짜를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {string} years - 더할 년도
 * @returns {string} 날짜 문자열
 */
dateLib.addYears = function(dateString, years) {
	try {
		dateString = dateString.replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		var yyyy = parseInt(dateString.substring(0, 4), 10) + parseInt(years, 10);
		var resultDate = yyyy + dateString.substring(4, 8);

		if (!dateLib.isYYYYMMDD(resultDate)) {
			resultDate = dateLib.getLastDayOfMonth(resultDate.substring(0, 6) + "01");
		}

		return resultDate;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.addYears: " + e);
	}
};

/**
 * 지정한 날짜 문자열들 간의 날짜 차이를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateStringFrom - 시작 날짜 문자열
 * @param {string} dateStringTo - 끝 날짜 문자열
 * @returns {number} 날짜 차이
 */
dateLib.diffDate = function(dateStringFrom, dateStringTo) {
	try {
		dateStringFrom = dateStringFrom.toString().replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateStringFrom)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		dateStringTo = dateStringTo.toString().replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateStringTo)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		return $w.dateDiff(dateStringFrom, dateStringTo);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.diffDate: " + e);
	}
};

/**
 * 지정한 날짜 문자열에 해당하는 달의 마지막 날짜를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @returns {string} 마지막 날짜 문자열
 */
dateLib.getLastDayOfMonth = function(dateString) {
	try {
		if (!dateLib.isYYYYMMDD(dateString) && !dateLib.isYYYYMM(dateString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		var year = dateString.substring(0, 4);
		var month = dateString.substring(4, 6);
		var yearMonth = dateString.substring(0, 6);

		var isLeapYear = ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0));
		if (isLeapYear && month == "02") {
			return yearMonth + "29";
		} else if (!isLeapYear && month == "02") {
			return yearMonth + "28";
		} else if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
			return yearMonth + "31";
		} else {
			return yearMonth + "30";
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.getLastDayOfMonth: " + e);
	}
};

/**
 * 지정한 날짜 문자열의 요일을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {boolean} needEng - 영문 여부
 * @returns {string} 요일명
 */
dateLib.getDayOfWeek = function(dateString, needEng) {
	try {
		if (needEng == null) {
			needEng = false;
		}
		
		dateString = dateString.replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateString)) {
			throw "유효한 날짜가 아닙니다.";
		}

		var result = WebSquare.date.getDay(dateString);
		if (needEng) {
			switch (result) {
			  case "일요일": 
				  result = "SUN";
			      break;			  
			  case "월요일": 
				  result = "MON";
			      break;
			  case "화요일": 
				  result = "TUE";
			      break;
			  case "수요일": 
				  result = "WED";
			      break;
			  case "목요일": 
				  result = "THU";
			      break;
			  case "금요일": 
				  result = "FRI";
			      break;
			  case "토요일": 
				  result = "SAT";
			      break;
			  default: 
				  result = "";
			      break;
			}
		}
		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.getDayOfWeek: " + e);
	}
};

/**
 * 지정한 날짜 문자열의 음력 날짜 문자열을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @returns {string} 음력 날짜 문자열
 */
dateLib.getLunarDate = function(dateString) {
	try {
		dateString = dateString.replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		return WebSquare.date.toLunar(dateString);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.getLunarDate: " + e);
	}
};

/**
 * yyyyMMdd 패턴의 날짜 문자열에 지정한 구분자를 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @param {string} delimiter - 구분자
 * @returns {string} 구분자로 서식화된 날짜 문자열
 */
dateLib.setDateDelimiter = function(dateString, delimiter) {
	try {
		dateString = dateString.replace(/\D/ig, "").trim();
		if (!dateLib.isYYYYMMDD(dateString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 날짜가 아닙니다.";
		}

		if (!delimiter) {
			delimiter = "-";
		}

		return dateString.replace(/(\d{4})(\d{2})(\d{2})/ig, "$1" + delimiter + "$2" + delimiter + "$3");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.setDateDelimiter: " + e);
	}
};

/**
 * HHmm 패턴의 시간 문자열에 지정한 구분자를 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} timeString - 시간 문자열
 * @param {string} delimiter - 구분자
 * @returns {string} 구분자로 서식화된 시간 문자열
 */
dateLib.setTimeDelimiter = function(timeString, delimiter) {
	try {
		timeString = timeString.replace(/\D/ig, "").trim();
		if (!dateLib.isHHMM(timeString)) {
			// 개발자 메시지: 영문지원 안 함
			throw "유효한 시간이 아닙니다.";
		}

		if (!delimiter) {
			delimiter = ":";
		}

		return timeString.replace(/(\d{2})(\d{2})/ig, "$1" + delimiter + "$2");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.setTimeDelimiter: " + e);
	}
};

/**
 * 지정한 년도가 윤년인지 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} year - 년도 문자열
 * @returns {boolean} 윤년 여부
 */
dateLib.isLeaf = function(year) {
	try {
		try {
			if (isNaN(parseInt(year, 10))) {
				return false;
			}
		} catch (pe) {
			return false;
		}

		var leaf = false;
		if (year % 4 == 0) {
			leaf = true;

			if (year % 100 == 0)
				leaf = false;

			if (year % 400 == 0)
				leaf = true;
		}

		return leaf;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.isLeaf: " + e);
	}
};

/**
 * 지정한 문자열이 yyyyMMdd 패턴의 날짜 데이터인지 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @returns {boolean} 날짜 여부
 */
dateLib.isYYYYMMDD = function(dateString) {
	try {
		var regex = /^[0-9]{8}$/g;
		if (!dateString || !regex.test(dateString)) {
			return false;
		}

		var year = parseInt(dateString.substr(0, 4), 10);
		var month = parseInt(dateString.substr(4, 2), 10);
		var day = parseInt(dateString.substr(6, 2), 10);

		if (year < 1900 || year > 2999) {
			return false;
		}

		if (month < 1 || month > 12) {
			return false;
		}

		var lastdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			lastdays[1] = 29;
		}

		return (day >= 1 && day <= lastdays[month - 1]);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.isYYYYMMDD: " + e);
	}
};

/**
 * 지정한 문자열이 yyyyMM 패턴의 날짜(월) 데이터인지 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} dateString - 날짜 문자열
 * @returns {boolean} 날짜 여부
 */
dateLib.isYYYYMM = function(dateString) {
	try {
		var regex = /^[0-9]{6}$/g;
		if (!dateString || !regex.test(dateString)) {
			return false;
		}

		var year = parseInt(dateString.substr(0, 4), 10);
		var month = parseInt(dateString.substr(4, 2), 10);
		if (year < 1900 || year > 2999) {
			return false;
		}

		if (month < 1 || month > 12) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.isYYYYMM: " + e);
	}
};

/**
 * 지정한 문자열이 HHmm 패턴의 시간 데이터인지 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf numLib
 * @param {string} timeString - 시간 문자열
 * @returns {boolean} 시간 여부
 */
dateLib.isHHMM = function(timeString) {
	try {
		var regex = /^[0-9]{4}$/g;
		if (!timeString || !regex.test(timeString)) {
			return false;
		}

		var hour = parseInt(timeString.substr(0, 2), 10);
		var minute = parseInt(timeString.substr(2, 2), 10);
		if (hour < 0 || hour > 23) {
			return false;
		}

		if (minute < 0 || minute > 59) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("dateLib.isHHMM: " + e);
	}
};