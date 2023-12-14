/**
 * @target Cookie, LocalStorage, SessionStorage 관련 공통함수
 */

/**
 * Cookie 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class cookieLib
 * @namespace cookieLib
 */
var cookieLib = {};

requires("/resources/js/cookie/js.cookie.js");

/**
 * LocalStorage 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class localLib
 * @namespace localLib
 */
var localLib = {};

/**
 * SessionStorage 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class sessionLib
 * @namespace sessionLib
 */
var sessionLib = {};

/**
 * cookieLib.get(key) - Cookie에서 지정한 키의 값을 반환합니다.<br>
 * cookieLib.set(key, value) - Cookie에 지정한 키와 값을 설정합니다.<br>
 * cookieLib.setAsync(key, value) - Cookie에 지정한 키와 값을 비동기로 설정합니다.<br>
 * cookieLib.setWithExpires(key, value, days) - Cookie에 지정한 키와 값을 지정한 날짜동안 유지되도록 설정합니다.<br>
 * cookieLib.del(key) - Cookie에서 지정한 키의 값을 삭제합니다.
 * 
 * localLib.get(key) - LocalStorage에서 지정한 키의 값을 반환합니다.<br>
 * localLib.getAll() - LocalStorage에 저장된 모든 키와 값을 JSON 개체로 반환합니다.<br>
 * localLib.set(key, value) - LocalStorage에 지정한 키와 값을 설정합니다.<br>
 * localLib.del(key) - LocalStorage에서 지정한 키의 값을 삭제합니다.<br>
 * localLib.clear() - 도메인 LocalStorage의 모든 값을 삭제합니다.
 * 
 * sessionLib.get(key) - SessionStorage에서 지정한 키의 값을 반환합니다.<br>
 * sessionLib.getAll() - SessionStorage에 저장된 모든 키와 값을 JSON 개체로 반환합니다.<br>
 * sessionLib.set(key, value) - SessionStorage에 지정한 키와 값을 설정합니다.<br>
 * sessionLib.del(key) - SessionStorage에서 지정한 키의 값을 삭제합니다.<br>
 * sessionLib.clear() - 도메인 SessionStorage의 모든 값을 삭제합니다.
 */

/**
 * Cookie에서 지정한 키의 값을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf cookieLib
 * @param {string} key - Cookie 키
 * @return {string} Cookie 값
 */
cookieLib.get = function(key) {
	try {
		var value = Cookies.get(key);
		return (value) ? value : "";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("cookieLib.get: " + e);
	}
};

/**
 * Cookie에 지정한 키와 값을 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf cookieLib
 * @param {string} key - Cookie 키
 * @param {string} value - Cookie 값
 */
cookieLib.set = function(key, value) {
	try {
		Cookies.set(key, value, {
			path : "/sono"
		});
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("cookieLib.set: " + e);
	}
};

/**
 * Cookie에 지정한 키와 값을 비동기로 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf cookieLib
 * @param {string} key - Cookie 키
 * @param {string} value - Cookie 값
 */
cookieLib.setAsync = function(key, value) {
	try {
		setTimeout(function() {
			Cookies.set(key, value, {
				path : "/sono"
			});
		}, 1);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("cookieLib.set: " + e);
	}
};

/**
 * Cookie에 지정한 키와 값을 지정한 날짜동안 유지되도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf cookieLib
 * @param {string} key - Cookie 키
 * @param {string} value - Cookie 값
 * @param {number} days - 유지할 날짜
 */
cookieLib.setWithExpires = function(key, value, days) {
	try {
		if (days) {
			Cookies.set(key, value, {
				path : "/sono",
				expires : days
			});
		} else {
			Cookies.set(key, value, {
				path : "/sono"
			});
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("cookieLib.setWithExpires: " + e);
	}
};

/**
 * Cookie에서 지정한 키의 값을 삭제합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf cookieLib
 * @param {string} key - Cookie 키
 */
cookieLib.del = function(key) {
	try {
		Cookies.remove(key, {
			path : "/sono"
		});
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("cookieLib.del: " + e);
	}
};

/**
 * LocalStorage에서 지정한 키의 값을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf localLib
 * @param {string} key - 키
 * @return {string} 값
 */
localLib.get = function(key) {
	try {
		var value = localStorage.getItem(key);
		return (value) ? value : "";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("localLib.get: " + e);
	}
};

/**
 * LocalStorage에 저장된 모든 키와 값을 JSON 개체로 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf localLib
 * @return {object} 모든 키와 값의 JSON 개체
 */
localLib.getAll = function() {
	try {
		var result = {};
		for ( var key in localStorage) {
			result[key] = localStorage[key];
		}

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("localLib.getAll: " + e);
	}
};

/**
 * LocalStorage에 지정한 키와 값을 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf localLib
 * @param {string} key - 키
 * @param {string} value - 값
 */
localLib.set = function(key, value) {
	try {
		localStorage.setItem(key, value);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("localLib.set: " + e);
	}
};

/**
 * LocalStorage에서 지정한 키의 값을 삭제합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf localLib
 * @param {string} key - 키
 */
localLib.del = function(key) {
	try {
		localStorage.removeItem(key);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("localLib.del: " + e);
	}
};

/**
 * 도메인 LocalStorage의 모든 값을 삭제합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf localLib
 */
localLib.clear = function() {
	try {
		localStorage.clear();
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("localLib.clear: " + e);
	}
};

/**
 * SessionStorage에서 지정한 키의 값을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf sessionLib
 * @param {string} key - 키
 * @return {string} 값
 */
sessionLib.get = function(key) {
	try {
		var value = sessionStorage.getItem(key);
		return (value) ? value : "";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("sessionLib.get: " + e);
	}
};

/**
 * SessionStorage에 저장된 모든 키와 값을 JSON 개체로 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf sessionLib
 * @return {object} 모든 키와 값의 JSON 개체
 */
sessionLib.getAll = function() {
	try {
		var result = {};
		for ( var key in sessionStorage) {
			result[key] = sessionStorage[key];
		}

		return result;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("sessionLib.getAll: " + e);
	}
};

/**
 * SessionStorage에 지정한 키와 값을 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf sessionLib
 * @param {string} key - 키
 * @param {string} value - 값
 */
sessionLib.set = function(key, value) {
	try {
		sessionStorage.setItem(key, value);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("sessionLib.set: " + e);
	}
};

/**
 * SessionStorage에서 지정한 키의 값을 삭제합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf sessionLib
 * @param {string} key - 키
 */
sessionLib.del = function(key) {
	try {
		sessionStorage.removeItem(key);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("sessionLib.del: " + e);
	}
};

/**
 * 도메인 SessionStorage의 모든 값을 삭제합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf sessionLib
 */
sessionLib.clear = function() {
	try {
		sessionStorage.clear();
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("sessionLib.clear: " + e);
	}
};