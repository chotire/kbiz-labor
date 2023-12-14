/**
 * @target 문자열 서식 관련 공통함수
 */

/**
 * 문자열 서식 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class fmtLib
 * @namespace fmtLib
 */
var fmtLib = {};

/**
 * fmtLib.setOnlyNumber(controls) - 지정한 컨트롤들을 오직 숫자만 입력할 수 있도록 설정합니다.<br>
 * fmtLib.onlyNumberKeyDown(e) - onkeydown 이벤트 발생 시, 숫자만 입력을 허용합니다.<br>
 * fmtLib.onlyNumberBlur(e) - onblur 이벤트 발생 시, 숫자 이외의 문자를 제거합니다.<br>
 * fmtLib.setOnlyNumberSign(controls) - 지정한 컨트롤들을 오직 숫자, '+', '-', '.'만 입력할 수 있도록 설정합니다.<br>
 * fmtLib.onlyNumberSignKeyDown(e) - onkeydown 이벤트 발생 시, 숫자, '+', '-', '.'만 입력을 허용합니다.<br>
 * fmtLib.onlyNumberSignBlur(e) - onblur 이벤트 발생 시, 숫자, '+', '-', '.' 이외의 문자를 제거합니다.<br>
 * fmtLib.setOnlyAlpha(controls) - 지정한 컨트롤들을 오직 알파벳만 입력할 수 있도록 설정합니다.<br>
 * fmtLib.onlyAlphaKeyDown(e) - onkeydown 이벤트 발생 시, 알파벳만 입력을 허용합니다.<br>
 * fmtLib.onlyAlphaBlur(e) - onblur 이벤트 발생 시, 알파벳 이외의 문자를 제거합니다.<br>
 * fmtLib.setOnlyAlphaUpper(controls) - 지정한 컨트롤들을 오직 알파벳 대문자만 입력할 수 있도록 설정합니다.<br>
 * fmtLib.OnlyAlphaUpperKeyDown(e) - onkeydown 이벤트 발생 시, 알파벳 대문자만 입력을 허용합니다.<br>
 * fmtLib.setOnlyNumberAlpha(controls) - 지정한 컨트롤들을 오직 숫자와 알파벳만 입력할 수 있도록 설정합니다.<br>
 * fmtLib.OnlyNumberAlphaKeyDown(e) - onkeydown 이벤트 발생 시, 숫자와 알파벳만 입력을 허용합니다.<br>
 * fmtLib.OnlyNumberAlphaBlur(e) - onblur 이벤트 발생 시, 숫자와 알파벳 이외의 문자를 제거합니다.<br>
 * fmtLib.setOnlyNumberAlphaUpper(controls) - 지정한 컨트롤들을 오직 숫자와 알파벳 대문자만 입력할 수 있도록 설정합니다.<br>
 * fmtLib.OnlyNumberAlphaUpperKeyDown(e) - onkeydown 이벤트 발생 시, 숫자와 알파벳 대문자만 입력을 허용합니다.<br>
 * fmtLib._isAllowKeys(e) - [내부용] 입력을 제한하는 중에도 허용되어야 할 제어 문자 등을 지정합니다.<br>
 * fmtLib.fmtrIdentityNumber(value) - 10자리/13자리 주민등록번호, 외국인등록번호, 사업자등록번호, 법인등록번호 등에 대한 서식을 지정합니다.<br>
 * fmtLib.fmtrMaskedIdentityNumber(value) - 10자리/13자리 주민등록번호, 외국인등록번호, 사업자등록번호, 법인등록번호 등에 대한 마스크 처리된 서식을 지정합니다.<br>
 * fmtLib.fmtrBRNumber(value) - 10자리 사업자등록번호 등에 대한 서식을 지정합니다.<br>
 * fmtLib.fmtrMaskedBRNumber(value) - 10자리 사업자등록번호 등에 대한 마스크 처리된 서식을 지정합니다.<br>
 * fmtLib.fmtrRRNumber(value) - 13자리 주민등록번호, 외국인등록번호, 법인번호 등에 대한 서식을 지정합니다.<br>
 * fmtLib.fmtrMaskedRRNumber(value) - 13자리 주민등록번호, 외국인등록번호, 법인번호 등에 대한 마스크 처리된 서식을 지정합니다.<br>
 * fmtLib.fmtrPhoneNumber(value) - 전화번호에 대한 서식을 지정합니다.<br>
 * fmtLib.fmtrMaskedPhoneNumber(value) - 전화번호에 대한 마스크 처리된 서식을 지정합니다.<br>
 * fmtLib.fmtrUpper(value) - 대문자 서식을 지정합니다.<br>
 * fmtLib.fmtrYN(value) - 예/아니오 서식을 지정합니다.<br>
 * fmtLib.fmtrYB(value) - 여/부 서식을 지정합니다.<br>
 * fmtLib.fmtrUseYN(value) - 사용/미사용 서식을 지정합니다.<br>
 * fmtLib.fmtrPadLeftZero2(value) - 길이가 2가 될 때까지 값의 좌측에 0을 추가합니다.<br>
 * fmtLib.fmtrPadLeftZero4(value) - 길이가 4가 될 때까지 값의 좌측에 0을 추가합니다.<br>
 * fmtLib.fmtrPadLeftZero5(value) - 길이가 5가 될 때까지 값의 좌측에 0을 추가합니다.<br>
 * fmtLib.fmtrPadLeftZero10(value) - 길이가 10이 될 때까지 값의 좌측에 0을 추가합니다.<br>
 * fmtLib.fmtrHtmlEncode(value) - HTML 문자열을 Encode하여 서식화합니다.<br>
 * fmtLib.fmtrFileSize(value) - 파일 크기를 서식화합니다.
 * 
 * fmtLib.normalizeHHMM(value) - 지정한 HHMM 형식의 문자열을 보정한다.
 */

/**
 * 지정한 컨트롤들을 오직 숫자만 입력할 수 있도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {(string|string[]|object|object[])} controls - 대상 컨트롤들의 ID, ID 배열, 개체 및 개체 배열입니다.
 */
fmtLib.setOnlyNumber = function(controls) {
	try {
		if (!controls) {
			return;
		}

		if (!$.isArray(controls)) {
			controls = [ controls ];
		}

		if ($.isArray(controls)) {
			for (var index = 0; index < controls.length; index++) {
				control = controls[index];
				if (typeof control == "string") {
					control = commLib.getControlById(control);
				}

				if (!control) {
					// 개발자 메시지: 영문지원 안 함
					throw "지정한 컨트롤이 존재하지 않습니다.";
				}

				var preSet = control.getUserData("fmtLib.setOnlyNumber");
				if (typeof preSet == "undefined" || preSet == "N") {
					control.bind("onkeydown", fmtLib.onlyNumberKeyDown);
					control.bind("onblur", fmtLib.onlyNumberBlur);

					control.setUserData("fmtLib.setOnlyNumber", "Y");
				}
			}
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.setOnlyNumber: " + e);
	}
};

/**
 * onkeydown 이벤트 발생 시, 숫자만 입력을 허용합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib.onlyNumberKeyDown = function(e) {
	try {
		if (!fmtLib._isAllowKeys(e) && !(!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 96 && e.keyCode <= 105)) {
			WebSquare.event.stopEvent(e);
			e.returnValue = false;
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.onlyNumberKeyDown: " + e);
	}
};

/**
 * onblur 이벤트 발생 시, 숫자 이외의 문자를 제거합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 */
fmtLib.onlyNumberBlur = function(e) {
	try {
		var control = commLib.getControlById(e.currentTarget.id);
		var value = control.getValue().trim();

		if (value.length > 0) {
			control.setValue(value.replace(/\D/g, ""));
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.onlyNumberBlur: " + e);
	}
};

/**
 * 지정한 컨트롤들을 오직 숫자, '+', '-', '.'만 입력할 수 있도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {(string|string[]|object|object[])} controls - 대상 컨트롤들의 ID, ID 배열, 개체 및 개체 배열입니다.
 */
fmtLib.setOnlyNumberSign = function(controls) {
	try {
		if (!controls) {
			return;
		}

		if (!$.isArray(controls)) {
			controls = [ controls ];
		}

		if ($.isArray(controls)) {
			for (var index = 0; index < controls.length; index++) {
				control = controls[index];
				if (typeof control == "string") {
					control = commLib.getControlById(control);
				}

				if (!control) {
					// 개발자 메시지: 영문지원 안 함
					throw "지정한 컨트롤이 존재하지 않습니다.";
				}

				var preSet = control.getUserData("fmtLib.setOnlyNumberSign");
				if (typeof preSet == "undefined" || preSet == "N") {
					control.bind("onkeydown", fmtLib.onlyNumberSignKeyDown);
					control.bind("onblur", fmtLib.onlyNumberSignBlur);

					control.setUserData("fmtLib.setOnlyNumberSign", "Y");
				}
			}
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.setOnlyNumberSign: " + e);
	}
};

/**
 * onkeydown 이벤트 발생 시, 숫자, '+', '-', '.'만 입력을 허용합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib.onlyNumberSignKeyDown = function(e) {
	try {
		if (!fmtLib._isAllowKeys(e) && !(!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) && !((e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 107 || e.keyCode == 109 || e.keyCode == 110) &&
		// 키패드숫자, 키패드 '-', '+', '.'
		!(!e.shiftKey && (e.keyCode == 189 || e.keyCode == 190)) && // -.
		!(e.shiftKey && e.keyCode == 187)) { // +
			WebSquare.event.stopEvent(e);
			e.returnValue = false;
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.onlyNumberSignKeyDown: " + e);
	}
};

/**
 * onblur 이벤트 발생 시, 숫자, '+', '-', '.' 이외의 문자를 제거합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 */
fmtLib.onlyNumberSignBlur = function(e) {
	try {
		var control = commLib.getControlById(e.currentTarget.id);
		var value = control.getValue().trim();

		if (value.length > 0) {
			var sign = "";
			if (value.substr(0, 1) == "-" || value.substr(0, 1) == "+") {
				sign = value.substr(0, 1);
			}
			value = sign + value.replace(/\-/g, "").replace(/\+/g, "");
			control.setValue(numLib.addComma(numLib.toFloat(value)));
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.onlyNumberSignBlur: " + e);
	}
};

/**
 * 지정한 컨트롤들을 오직 알파벳만 입력할 수 있도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {(string|string[]|object|object[])} controls - 대상 컨트롤들의 ID, ID 배열, 개체 및 개체 배열입니다.
 */
fmtLib.setOnlyAlpha = function(controls) {
	try {
		if (!controls) {
			return;
		}

		if (!$.isArray(controls)) {
			controls = [ controls ];
		}

		if ($.isArray(controls)) {
			for (var index = 0; index < controls.length; index++) {
				control = controls[index];
				if (typeof control == "string") {
					control = commLib.getControlById(control);
				}

				if (!control) {
					// 개발자 메시지: 영문지원 안 함
					throw "지정한 컨트롤이 존재하지 않습니다.";
				}

				var preSet = control.getUserData("fmtLib.setOnlyAlpha");
				if (typeof preSet == "undefined" || preSet == "N") {
					control.bind("onkeydown", fmtLib.onlyAlphaKeyDown);
					control.bind("onblur", fmtLib.onlyAlphaBlur);

					control.setUserData("fmtLib.setOnlyAlpha", "Y");
				}
			}
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.setOnlyAlpha: " + e);
	}
};

/**
 * onkeydown 이벤트 발생 시, 알파벳만 입력을 허용합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib.onlyAlphaKeyDown = function(e) {
	try {
		if (!fmtLib._isAllowKeys(e) && !(e.keyCode >= 65 && e.keyCode <= 90)) {
			WebSquare.event.stopEvent(e);
			e.returnValue = false;
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.onlyAlphaKeyDown: " + e);
	}
};

/**
 * onblur 이벤트 발생 시, 알파벳 이외의 문자를 제거합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 */
fmtLib.onlyAlphaBlur = function(e) {
	try {
		var control = commLib.getControlById(e.currentTarget.id);
		var value = control.getValue();

		if (value.length > 0) {
			control.setValue(value.replace(/[^a-z]/gi, ""));
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.onlyAlphaBlur: " + e);
	}
};

/**
 * 지정한 컨트롤들을 오직 알파벳 대문자만 입력할 수 있도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {(string|string[]|object|object[])} controls - 대상 컨트롤들의 ID, ID 배열, 개체 및 개체 배열입니다.
 */
fmtLib.setOnlyAlphaUpper = function(controls) {
	try {
		if (!controls) {
			return;
		}

		if (!$.isArray(controls)) {
			controls = [ controls ];
		}

		if ($.isArray(controls)) {
			for (var index = 0; index < controls.length; index++) {
				control = controls[index];
				if (typeof control == "string") {
					control = commLib.getControlById(control);
				}

				if (!control) {
					// 개발자 메시지: 영문지원 안 함
					throw "지정한 컨트롤이 존재하지 않습니다.";
				}

				var preSet = control.getUserData("fmtLib.setOnlyAlphaUpper");
				if (typeof preSet == "undefined" || preSet == "N") {
					control.bind("onkeydown", fmtLib.OnlyAlphaUpperKeyDown);

					control.setUserData("fmtLib.setOnlyAlphaUpper", "Y");
				}
			}
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.setOnlyAlphaUpper: " + e);
	}
};

/**
 * onkeydown 이벤트 발생 시, 알파벳 대문자만 입력을 허용합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib.OnlyAlphaUpperKeyDown = function(e) {
	try {
		if (!fmtLib._isAllowKeys(e) && !(e.keyCode >= 65 && e.keyCode <= 90)) {
			WebSquare.event.stopEvent(e);
			e.returnValue = false;
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.OnlyAlphaUpperKeyDown: " + e);
	}
};

/**
 * 지정한 컨트롤들을 오직 숫자와 알파벳만 입력할 수 있도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {(string|string[]|object|object[])} controls - 대상 컨트롤들의 ID, ID 배열, 개체 및 개체 배열입니다.
 */
fmtLib.setOnlyNumberAlpha = function(controls) {
	try {
		if (!controls) {
			return;
		}

		if (!$.isArray(controls)) {
			controls = [ controls ];
		}

		if ($.isArray(controls)) {
			for (var index = 0; index < controls.length; index++) {
				control = controls[index];
				if (typeof control == "string") {
					control = commLib.getControlById(control);
				}

				if (!control) {
					// 개발자 메시지: 영문지원 안 함
					throw "지정한 컨트롤이 존재하지 않습니다.";
				}

				var preSet = control.getUserData("fmtLib.setOnlyNumberAlpha");
				if (typeof preSet == "undefined" || preSet == "N") {
					control.bind("onkeydown", fmtLib.OnlyNumberAlphaKeyDown);
					control.bind("onblur", fmtLib.OnlyNumberAlphaBlur);

					control.setUserData("fmtLib.setOnlyNumberAlpha", "Y");
				}
			}
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.setOnlyNumberAlpha: " + e);
	}
};

/**
 * onkeydown 이벤트 발생 시, 숫자와 알파벳만 입력을 허용합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib.OnlyNumberAlphaKeyDown = function(e) {
	try {
		if (!fmtLib._isAllowKeys(e) && !(!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 96 && e.keyCode <= 105) && !(e.keyCode >= 65 && e.keyCode <= 90)) {
			WebSquare.event.stopEvent(e);
			e.returnValue = false;
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.OnlyNumberAlphaKeyDown: " + e);
	}
};

/**
 * onblur 이벤트 발생 시, 숫자와 알파벳 이외의 문자를 제거합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 */
fmtLib.OnlyNumberAlphaBlur = function(e) {
	try {
		var control = commLib.getControlById(e.currentTarget.id);
		var value = control.getValue();

		if (value.length > 0) {
			control.setValue(value.replace(/[^0-9a-z]/gi, ""));
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.OnlyNumberAlphaBlur: " + e);
	}
};

/**
 * 지정한 컨트롤들을 오직 숫자와 알파벳 대문자만 입력할 수 있도록 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {(string|string[]|object|object[])} controls - 대상 컨트롤들의 ID, ID 배열, 개체 및 개체 배열입니다.
 */
fmtLib.setOnlyNumberAlphaUpper = function(controls) {
	try {
		if (!controls) {
			return;
		}

		if (!$.isArray(controls)) {
			controls = [ controls ];
		}

		if ($.isArray(controls)) {
			for (var index = 0; index < controls.length; index++) {
				control = controls[index];
				if (typeof control == "string") {
					control = commLib.getControlById(control);
				}

				if (!control) {
					// 개발자 메시지: 영문지원 안 함
					throw "지정한 컨트롤이 존재하지 않습니다.";
				}

				var preSet = control.getUserData("fmtLib.setOnlyNumberAlphaUpper");
				if (typeof preSet == "undefined" || preSet == "N") {
					control.bind("onkeydown", fmtLib.OnlyNumberAlphaUpperKeyDown);

					control.setUserData("fmtLib.setOnlyNumberAlphaUpper", "Y");
				}
			}
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.setOnlyNumberAlphaUpper: " + e);
	}
};

/**
 * onkeydown 이벤트 발생 시, 숫자와 알파벳 대문자만 입력을 허용합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib.OnlyNumberAlphaUpperKeyDown = function(e) {
	try {
		if (!fmtLib._isAllowKeys(e) && !(!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 96 && e.keyCode <= 105) && !(e.keyCode >= 65 && e.keyCode <= 90)) {
			WebSquare.event.stopEvent(e);
			e.returnValue = false;
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.OnlyNumberAlphaUpperKeyDown: " + e);
	}
};

/**
 * [내부용] 입력을 제한하는 중에도 허용되어야 할 제어 문자 등을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {object} e - 이벤트 개체
 * @return {boolean} 허용 여부
 */
fmtLib._isAllowKeys = function(e) {
	try {
		var keyCode = e.keyCode;
		if (e.ctrlKey && (keyCode == 67 || keyCode == 86)) {
			// ctrl+c, ctrl+v
			return true;
		} else if (keyCode == 8) {
			// backspace
			return true;
		} else if (keyCode == 46) {
			// delete
			return true;
		} else if (keyCode == 9 || keyCode == 13 || keyCode == 16 || keyCode == 17 || keyCode == 18 || keyCode == 19 || keyCode == 20 || keyCode == 25 || keyCode == 27 || keyCode == 45 || keyCode == 144 || keyCode == 145) {
			// tab, ctrl, alt, cpaslock, shift
			return true;
		} else if (keyCode == 91 || keyCode == 92 || keyCode == 93) {
			// window key
			return true;
		} else if (keyCode >= 33 && keyCode <= 36) {
			// home, end, pageup, pagedown
			return true;
		} else if (keyCode >= 37 && keyCode <= 40) {
			// arrow
			return true;
		} else if (keyCode >= 112 && keyCode <= 123) {
			// fn1~12
			return true;
		}

		return false;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib._isAllowKeys: " + e);
	}
};

/**
 * 10자리/13자리 주민등록번호, 외국인등록번호, 사업자등록번호, 법인등록번호 등에 대한 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrIdentityNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (value.length == 10) {
			return value.replace(/(\d{3})(\d{2})(\d{5})/ig, "$1-$2-$3");
		} else if (value.length == 13) {
			return value.replace(/(\d{6})(\d{7})/ig, "$1-$2");
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrIdentityNumber: " + e);
	}
};

/**
 * 10자리/13자리 주민등록번호, 외국인등록번호, 사업자등록번호, 법인등록번호 등에 대한 마스크 처리된 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 마스크 처리 및 서식화된 값
 */
fmtLib.fmtrMaskedIdentityNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (value.length == 10) {
			return value.replace(/(\d{3})(\d{2})(\d{1})(\d{4})/ig, "$1-$2-$3****");
		} else if (value.length == 13) {
			return value.replace(/(\d{6})(\d{1})(\d{6})/ig, "$1-$2******");
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrMaskedIdentityNumber: " + e);
	}
};

/**
 * 10자리 사업자등록번호 등에 대한 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrBRNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (value.length == 10) {
			return value.replace(/(\d{3})(\d{2})(\d{5})/ig, "$1-$2-$3");
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrBRNumber: " + e);
	}
};

/**
 * 10자리 사업자등록번호 등에 대한 마스크 처리된 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 마스크 처리 및 서식화된 값
 */
fmtLib.fmtrMaskedBRNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (value.length == 10) {
			return value.replace(/(\d{3})(\d{2})(\d{1})(\d{4})/ig, "$1-$2-$3****");
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrMaskedBRNumber: " + e);
	}
};

/**
 * 13자리 주민등록번호, 외국인등록번호, 법인번호 등에 대한 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrRRNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (value.length == 13) {
			return value.replace(/(\d{6})(\d{7})/ig, "$1-$2");
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrRRNumber: " + e);
	}
};

/**
 * 13자리 주민등록번호, 외국인등록번호, 법인번호 등에 대한 마스크 처리된 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 마스크 처리 및 서식화된 값
 */
fmtLib.fmtrMaskedRRNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (value.length == 13) {
			return value.replace(/(\d{6})(\d{1})(\d{6})/ig, "$1-$2******");
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrMaskedRRNumber: " + e);
	}
};

/**
 * 전화번호에 대한 서식을 지정합니다.
 * 
 * 00Y 국제전화<br>
 * 01Y 무선전화, 무선호출, 부가통신망<br>
 * 0N0 공통 서비스 (각종 지능망 등)<br>
 * 02 지역번호 (서울)<br>
 * 03Y ~ 06Y 지역번호<br>
 * 08Y 시외전화<br>
 * 10Y 통신 사업자 민원안내 등<br>
 * 11Y·12Y 긴급 민원 신고<br>
 * 13Y·18Y 긴급 민원 신고<br>
 * 13YY 공공기관 생활정보, 안내, 상담<br>
 * 15YY 기간통신사업자 공통부가서비스 및 자율부가서비스 (전국대표번호 등)<br>
 * 16YY 기간통신사업자 공통부가서비스 (전국대표번호 등)<br>
 * 18YY 기간통신사업자 공통부가서비스 (전국대표번호 등)
 * 
 * 07Y, 09Y (예비)<br>
 * 14YY (예비; 기간통신사업자 부가서비스)<br>
 * 17YY·19YY (예비) 리턴 : 서식화된 값
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrPhoneNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}
		value = value.trim();

		if (value.length > 4 && value.length <= 8 && (value.indexOf("13") == 0 || value.indexOf("14") == 0 || value.indexOf("15") == 0 || value.indexOf("16") == 0 || value.indexOf("17") == 0 || value.indexOf("18") == 0 || value.indexOf("19") == 0)) {
			// 13YY 공공기관 생활정보, 안내, 상담
			// 14YY (예비; 기간통신사업자 부가서비스)
			// 15YY 기간통신사업자 공통부가서비스 및 자율부가서비스 (전국대표번호 등)
			// 16YY 기간통신사업자 공통부가서비스 (전국대표번호 등)
			// 18YY 기간통신사업자 공통부가서비스 (전국대표번호 등)
			// 17YY·19YY (예비)
			return value.replace(/\D/g, "").replace(/^(\d{4})(\d{1,4})*$/, "$1-$2");
		} else {
			// 기타
			return value.replace(/\D/g, "").replace(/^(02|0[0-1][1-9]|0[0-9]0|0[0-6]\d|1\d{2,3})(\d{3,4})(\d{4})*$/, "$1-$2-$3").replace(/--/, "-").replace(/-$/, "");
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrPhoneNumber: " + e);
	}
};

/**
 * 전화번호에 대한 마스크 처리된 서식을 지정합니다.
 * 
 * 00Y 국제전화<br>
 * 01Y 무선전화, 무선호출, 부가통신망<br>
 * 0N0 공통 서비스 (각종 지능망 등)<br>
 * 02 지역번호 (서울)<br>
 * 03Y ~ 06Y 지역번호<br>
 * 08Y 시외전화<br>
 * 10Y 통신 사업자 민원안내 등<br>
 * 11Y·12Y 긴급 민원 신고<br>
 * 13Y·18Y 긴급 민원 신고<br>
 * 13YY 공공기관 생활정보, 안내, 상담<br>
 * 15YY 기간통신사업자 공통부가서비스 및 자율부가서비스 (전국대표번호 등)<br>
 * 16YY 기간통신사업자 공통부가서비스 (전국대표번호 등)<br>
 * 18YY 기간통신사업자 공통부가서비스 (전국대표번호 등)
 * 
 * 07Y, 09Y (예비)<br>
 * 14YY (예비; 기간통신사업자 부가서비스)<br>
 * 17YY·19YY (예비) 리턴 : 서식화된 값
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 마스크 처리 및 서식화된 값
 */
fmtLib.fmtrMaskedPhoneNumber = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (!value) {
			value = "";
		}
		value = value.trim();

		if (value.length > 4 && value.length <= 8 && (value.indexOf("13") == 0 || value.indexOf("14") == 0 || value.indexOf("15") == 0 || value.indexOf("16") == 0 || value.indexOf("17") == 0 || value.indexOf("18") == 0 || value.indexOf("19") == 0)) {
			// 13YY 공공기관 생활정보, 안내, 상담
			// 14YY (예비; 기간통신사업자 부가서비스)
			// 15YY 기간통신사업자 공통부가서비스 및 자율부가서비스 (전국대표번호 등)
			// 16YY 기간통신사업자 공통부가서비스 (전국대표번호 등)
			// 18YY 기간통신사업자 공통부가서비스 (전국대표번호 등)
			// 17YY·19YY (예비)
			return value.replace(/\D/g, "").replace(/^(\d{4})(\d{1,4})*$/, "$1-$2");
		} else {
			// 기타
			return value.replace(/\D/g, "").replace(/^(02|0[0-1][1-9]|0[0-9]0|0[0-6]\d|1\d{2,3})(\d{3,4})(\d{1})(\d{3})*$/, "$1-$2-$3***").replace(/--/, "-").replace(/-$/, "");
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrMaskedPhoneNumber: " + e);
	}
};

/**
 * 대문자 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrUpper = function(value) {
	try {
		if (!value) {
			value = "";
		}

		return value.trim().toUpperCase();
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrUpper: " + e);
	}
};

/**
 * 예/아니오 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrYN = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (strLib.isEmpty(value, true)) {
			return "";
		}

		return (value.toUpperCase() == "Y") ? "예" : "아니오";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrYN: " + e);
	}
};

/**
 * 여/부 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrYB = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (strLib.isEmpty(value, true)) {
			return "";
		}

		return (value.toUpperCase() == "Y") ? "여" : "부";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrYB: " + e);
	}
};

/**
 * 사용/미사용 서식을 지정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrUseYN = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (strLib.isEmpty(value, true)) {
			return "";
		}

		return (value.toUpperCase() == "Y") ? "사용" : "미사용";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrUseYN: " + e);
	}
};

/**
 * 길이가 2가 될 때까지 값의 좌측에 0을 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrPadLeftZero2 = function(value) {
	try {
		if (!value) {
			value = "";
		}

		return strLib.padLeft(value, 2, "0");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrPadLeftZero2: " + e);
	}
};

/**
 * 길이가 4가 될 때까지 값의 좌측에 0을 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrPadLeftZero4 = function(value) {
	try {
		if (!value) {
			value = "";
		}

		return strLib.padLeft(value, 4, "0");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrPadLeftZero4: " + e);
	}
};

/**
 * 길이가 5가 될 때까지 값의 좌측에 0을 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrPadLeftZero5 = function(value) {
	try {
		if (!value) {
			value = "";
		}

		return strLib.padLeft(value, 5, "0");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrPadLeftZero5: " + e);
	}
};

/**
 * 길이가 10이 될 때까지 값의 좌측에 0을 추가합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrPadLeftZero10 = function(value) {
	try {
		if (!value) {
			value = "";
		}

		return strLib.padLeft(value, 10, "0");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrPadLeftZero10: " + e);
	}
};

/**
 * HTML 문자열을 Encode하여 서식화합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrHtmlEncode = function(value) {
	try {
		if (!value) {
			value = "";
		}

		return value.replace(/</mg, "&lt;").replace(/>/mg, "&gt;");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrHtmlEncode: " + e);
	}
};

/**
 * 파일 크기를 서식화합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 05.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 서식화된 값
 */
fmtLib.fmtrFileSize = function(value) {
	try {
		if (!value) {
			value = "";
		}

		if (strLib.isEmpty(value, true)) {
			return "";
		}

		value = numLib.toFloat(value);
		if (isNaN(value))
			return "";

		if (value < 1024) {
			return numLib.addComma(value) + " Bytes";
		} else if (1024 <= value && value < 1048576) {
			return numLib.addComma(parseInt(value / 1024, 10)) + " KB";
		} else if (1048576 <= value) {
			return numLib.addComma(parseInt(value / 1048576, 10)) + " MB";
		}

		return "";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.fmtrFileSize: " + e);
	}
};

/**
 * 지정한 HHMM 형식의 문자열을 보정한다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 07. 31.
 * @memberOf fmtLib
 * @param {string} value - 원본 문자열
 * @return {string} 보정된 값
 */
fmtLib.normalizeHHMM = function(value) {
	try {
		var hh = Math.floor(value / 100);
		var mm = value % 100;

		if (mm > 59) {
			hh++;
			mm = mm % 60;
		}

		value = (hh * 100 + mm).toString();
		if (value.length < 4) {
			var maxValue = 4 - value.length;
			for (i = 0; i < maxValue; i++) {
				value = "0" + value;
			}
		}

		return value;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("fmtLib.normalizeHHMM: " + e);
	}
};