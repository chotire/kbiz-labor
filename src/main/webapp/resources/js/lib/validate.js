/**
 * @target 유효성 검사 관련 공통함수
 */

/**
 * 유효성 검사 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class valLib
 * @namespace valLib
 */
var valLib = {};

/**
 * valLib.initValStatus() - 유효성 검사 정보를 초기화합니다.<br>
 * valLib.validateGroup(group, dataCollection) - 그룹에 포함된 컴포넌트들의 입력값을 대상으로 일괄 유효성 검사를 수행합니다.<br>
 * valLib.extendValidation(component) - 추가적으로 확장한 사용자 정의 유효성 검사를 수행합니다.<br>
 * valLib.checkModified(dataCollection) - DataCollection 개체가 변경됐는지 검사합니다.<br>
 * valLib.getColumnName(component) - 특정 컴포넌트에 바인딩 된 DataList나 DataMap의 컬럼 이름을 반환합니다.<br>
 * valLib.validateGridView(gridView, validInfo) - GridView를 통해서 입력된 데이터에 대해서 유효성을 검증한다.
 * 
 * valLib.checkRegNo(value, checkEmpty) - 주민등록번호 유효성을 검사한다.<br>
 * valLib.checkForeignNo(value, checkEmpty) - 외국인등록번호 유효성을 검사한다.<br>
 * valLib.checkBizNo(value, checkEmpty) - 사업자등록번호 유효성을 검사한다.<br>
 * valLib.checkCorpNo(value, checkEmpty) - 법인등록번호의 유효성 여부를 반환합니다.<br>
 * valLib.checkPhone(value) - 국내 전화번호 유효성 여부를 반환합니다.<br>
 * valLib.isEmail(value, checkEmpty) - 이메일주소의 유효성을 검사한다.<br>
 * valLib.isDomain(value, checkEmpty) - 도메인의 유효성을 검사한다.<br>
 * valLib.isURL(value) - URL의 유효성 여부를 반환합니다.<br>
 * valLib.isIPv4(value) - IPv4의 유효성 여부를 반환합니다.<br>
 * valLib.checkLowHigh(value, lowValue, highValue, checkEmpty) - 지정한 최소값/최대값 범위 내에 포함되는지 여부를 확인합니다.<br>
 * valLib.checkDate(value, checkEmpty) - 날짜문자열이 YYYYMMDD 형식을 만족하는지 여부를 확인합니다.<br>
 * valLib.checkAlphaFirst(value) - 입력값이 영문자와 숫자로 구성되어 있고 첫글자가 영문자인지 여부를 확인합니다.<br>
 * valLib.checkYYYYMMDD(value) - 날짜 문자열이 YYYYMMDD 형식을 만족하면 원본 값을 반환하고 아니면 빈 문자열을 반환합니다.<br>
 * valLib.checkYYYYMM(value) - 날짜 문자열이 YYYYMM 형식을 만족하면 원본 값을 반환하고 아니면 빈 문자열을 반환합니다.
 */

/**
 * 유효성 검사 초기 상태
 * 
 * @date 2014. 12. 10.
 * @private
 * @memberOf valLib
 */
valLib.status = {
	isValid : true,
	objectName : "",
	columnId : "",
	rowIndex : 0,
	message : ""
};

/**
 * 유효성 검사 정보를 초기화합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 */
valLib.initValStatus = function() {
	valLib.status.isValid = true;
	valLib.status.objectName = "";
	valLib.status.columnId = "";
	valLib.status.rowIndex = 0;
	valLib.status.message = "";
};

/**
 * 그룹에 포함된 컴포넌트들의 입력값을 대상으로 일괄 유효성 검사를 수행합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {(object|string)} group - Group 컴포넌트 개체 또는 ID
 * @param {Object} dataCollection - DataCollection 개체 (DataList or DataMap)
 * @returns {boolean} 유효성 여부
 */
valLib.validateGroup = function(group, dataCollection, checkModified) {
	if (typeof group == "string") {
		group = commLib.getControlById(group);
		if (!group) {
			// 개발자 메시지: 영문지원 안 함
			throw "지정한 컴포넌트가 존재하지 않습니다.";
		}
	}
	
	if (checkModified == null) {
		checkModified = true;
	}

	if (checkModified && !valLib.checkModified(dataCollection)) {
		return false;
	}

	valLib.initValStatus();
	var children = WebSquare.util.getChildren(group, {
		excludePlugin : "group trigger textbox output calendar image span anchor gridView generator iframe upload",
		recursive : true
	});

	try {
		for (var i = 0; i < children.length; i++) {
			children[i].validate();
			if (valLib.status.isValid === true) {
				valLib.extendValidation(children[i]);
				if (valLib.status.isValid === false) {
					children[i].focus();
					return false;
				}
			} else {
				children[i].focus();
				return false;
			}
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.validateGroup: " + e);
	} finally {
		children = null;
	}
};

/**
 * 추가적으로 확장한 사용자 정의 유효성 검사를 수행합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {object} component - 컴포넌트 개체
 */
valLib.extendValidation = function(component) {
	try {
		var isHangul = strLib.defaultValue(component.getUserData("isHangul"), "", true).toLowerCase();
		var isEmail = strLib.defaultValue(component.getUserData("isEmail"), "", true).toLowerCase();
		var isDomain = strLib.defaultValue(component.getUserData("isDomain"), "", true).toLowerCase();
		var isNumber = strLib.defaultValue(component.getUserData("isNumber"), "", true).toLowerCase();
		var isFloat = strLib.defaultValue(component.getUserData("isFloat"), "", true).toLowerCase();
		var chkLowHigh = strLib.defaultValue(component.getUserData("chkLowHigh"), "", true).toLowerCase();
		var isDate = strLib.defaultValue(component.getUserData("isDate"), "", true).toLowerCase();
		var isRegNo = strLib.defaultValue(component.getUserData("isRegNo"), "", true).toLowerCase();
		var isBizNo = strLib.defaultValue(component.getUserData("isBizNo"), "", true).toLowerCase();
		var isCorpNo = strLib.defaultValue(component.getUserData("isCorpNo"), "", true).toLowerCase();
		var isAlphaFirst = strLib.defaultValue(component.getUserData("isAlphaFirst"), "", true).toLowerCase();

		var compValue = component.getValue();
		var compID = component.getID();
		var compName = valLib.getColumnName(component);
		var message = "";

		if (isHangul === "false" && strLib.isKorean(compValue)) {
			// valid.0003: 한글을 입력할 수 없는 항목입니다.
			message = commLib.getMessage("valid.0003", compName);
		} else if (isEmail === "true" && !valLib.isEmail(compValue, false)) {
			// valid.0004: 이메일 주소의 형식이 올바르지 않습니다.
			message = commLib.getMessage("valid.0004", compName);
		} else if (isDomain === "true" && !valLib.isDomain(compValue, false)) {
			// valid.0005: 도메인 형식이 올바르지 않습니다.
			message = commLib.getMessage("valid.0005", compName);
		} else if (isNumber === "true") {
			if (compValue.split("-").length > 2 || compValue.indexOf("+") > -1) {
				// valid.0006: 정수 형식이 올바르지 않습니다.
				message = commLib.getMessage("valid.0006", compName);
			} else {
				for (var i = 0; i < compValue.length; i++) {
					var c = compValue.charAt(i);
					if (c < '0' || c > '9') {
						if (c != "-") {
							// valid.0006: 정수 형식이 올바르지 않습니다.
							message = commLib.getMessage("valid.0006", compName);
							break;
						} else {
							if (c == "-" && i > 0) {
								// valid.0006: 정수 형식이 올바르지 않습니다.
								message = commLib.getMessage("valid.0006", compName);
								break;
							}
						}
					}
				}
			}
		} else if (isFloat === "true") {
			if (compValue.split(".").length > 2 || compValue.split("-").length > 2 || compValue.indexOf("+") > -1) {
				// valid.0007: 실수 형식이 올바르지 않습니다.
				message = commLib.getMessage("valid.0007", compName);
			} else {
				for (var i = 0; i < compValue.length; i++) {
					var c = compValue.charAt(i);
					if (c < '0' || c > '9') {
						if (c != "-" && c != ".") {
							// valid.0007: 실수 형식이 올바르지 않습니다.
							message = commLib.getMessage("valid.0007", compName);
							break;
						} else {
							if (c == "-" && i > 0) {
								// valid.0007: 실수 형식이 올바르지 않습니다.
								message = commLib.getMessage("valid.0007", compName);
								break;
							}
						}
					}
				}
			}
		} else if (chkLowHigh.split(" ").length == 2 && !isNaN(chkLowHigh.split(" ")[0]) && !isNaN(chkLowHigh.split(" ")[1])
				&& !valLib.checkLowHigh(compValue, chkLowHigh.split(" ")[0], chkLowHigh.split(" ")[1]), false) {
			// valid.0008: 입력값이 허용 범위를 벗어났습니다.
			message = commLib.getMessage("valid.0008", compName);
		} else if (isDate === "true" && !valLib.checkDate(compValue, false)) {
			// valid.0009: 날짜의 형식이 올바르지 않습니다.
			message = commLib.getMessage("valid.0009", compName);
		} else if (isRegNo === "true" && !valLib.checkRegNo(compValue, false) && !valLib.checkForeignNo(compValue, false)) {
			// valid.0010: 주민등록번호 형식이 올바르지 않습니다.
			message = commLib.getMessage("valid.0010", compName);
		} else if (isCorpNo === "true" && !valLib.checkCorpNo(compValue, false)) {
			// valid.0011: 법인등록번호 형식이 올바르지 않습니다.
			message = commLib.getMessage("valid.0011", compName);
		} else if (isBizNo === "true" && !valLib.checkBizNo(compValue, false)) {
			// valid.0012: 사업자등록번호 형식이 올바르지 않습니다.
			message = commLib.getMessage("valid.0012", compName);
		} else if (isAlphaFirst === "true" && !valLib.checkAlphaFirst(compValue)) {
			// valid.0013: 영문자로 시작되어야 하고 영문이나 숫자만 입력할 수 있는 항목입니다.
			message = commLib.getMessage("valid.0013", compName);
		}

		if (!strLib.isEmpty(message, true)) {
			valLib.status.isValid = false;
			valLib.status.objectName = compID;
			alert(message);
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.extendValidation: " + e);
	}
};

/**
 * 유효성 검사 실패시 출력할 메시지를 반환합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @returns {String} 메시지
 */
valLib.validateMsg = function() {
	try {
		var message = "";
		var invalidType = this.getType().toLowerCase(); // invalid 타입
		var invalidValue = this.getValue(); // invalid 타입별 설정값
		var callerObj = this.getCaller(); // validator를 호출한 컴포넌트
		var columnName = valLib.getColumnName(callerObj);

		switch (invalidType) {
		case "mandatory":
			// valid.0014: 필수입력 항목입니다.
			message = commLib.getMessage("valid.0014", columnName);
			break;
		case "minlength":
			// valid.0015: 최소 {1}자 이상 입력해야 합니다.
			message = commLib.getMessage("valid.0015", columnName, invalidValue);
			break;
		case "minbytelength":
			// valid.0016: 최소 {1}바이트 이상 입력해야 합니다.
			message = commLib.getMessage("valid.0016", columnName, invalidValue);
			break;
		case "maxlength":
			// valid.0017: 최대 {1}자까지만 입력할 수 있습니다.
			message = commLib.getMessage("valid.0017", columnName, invalidValue);
			break;
		case "maxbytelength":
			// valid.0018: 최대 {1}바이트까지만 입력할 수 있습니다.
			message = commLib.getMessage("valid.0018", columnName, invalidValue);
			break;
		}

		if (message !== "") {
			valLib.status.isValid = false;
		}
		valLib.status.objectName = callerObj.getID();
		alert(message);

		if (valLib.status.objectName !== "") {
			var obj = WebSquare.util.getComponentById(valLib.status.objectName);
			obj.focus();
		}

		return message;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.validateMsg: " + e);
	}
};

/**
 * DataCollection 개체가 변경됐는지 검사합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {object} dataCollection - DataCollection 개체
 * @return {boolean} 변경 여부
 */
valLib.checkModified = function(dataCollection) {
	try {
		if (typeof dataCollection !== "undefined") {
			var modifiedIndex = dataCollection.getModifiedIndex();
			if (modifiedIndex.length === 0) {
				// valid.0029: 변경된 데이터가 존재하지 않습니다.
				alert(commLib.getMessage("valid.0029"));
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}

	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkModified: " + e);
	}
};

/**
 * 특정 컴포넌트에 바인딩 된 DataList나 DataMap의 컬럼 이름을 반환합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {object} component - 컴포넌트 개체
 * @return {boolean} 변경 여부
 */
valLib.getColumnName = function(component) {
	try {
		// 명시적으로 validName 속성을 정의한 경우, validName의 우선순위가 가장 높다.
		var validName = component.getUserData("validName");
		if (!strLib.isEmpty(validName, true)) {
			return validName;
		}

		if (typeof component.getRef === "function") {
			var ref = component.getRef();

			if (strLib.isEmpty(ref, true)) {
				// 컴포넌트가 바인딩되어 있지 않은 경우
				return component.getID();
			} else {
				// 컴포넌트가 바인딩되어 있는 경우
				var refArray = ref.substring(5).split(".");
				var dataCollectionName = refArray[0];
				var columnId = refArray[1];
				if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
					var dataCollection = WebSquare.util.getComponentById(dataCollectionName);
					var dataType = dataCollection.getObjectType().toLowerCase();
					if (dataType === "datamap") {
						return dataCollection.getName(columnId);
					} else if (dataType === "datalist") {
						return dataCollection.getColumnName(columnId);
					}
				} else {
					return component.getID();
				}
			}
		} else {
			return component.getID();
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.getColumnName: " + e);
	}
};

/**
 * GridView를 통해서 입력된 데이터에 대해서 유효성을 검증한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf valLib
 * @param {object} gridView - 그리드뷰 개체
 * @param {object[]} validInfo - 데이터 유효성 검사 옵션 JSON 개체들의 배열
 * @param {string} validInfo[n].id - 대상 컬럼의 ID
 * @param {(boolean|object)} [validInfo[n].mandatory] - 필수입력 여부 또는 관련 정보 개체
 * @param {number} [validInfo[n].minlength] - 최소입력 길이
 * @param {boolean} [validInfo[n].isHangul] - 한글허용 여부
 * @param {boolean} [validInfo[n].isEmail] - 이메일 여부
 * @param {boolean} [validInfo[n].isDate] - YYYYMMDD 여부
 * @param {boolean} [validInfo[n].isNumber] - 정수 여부
 * @param {boolean} [validInfo[n].isFloat] - 실수 여부
 * @param {function} [validInfo[n].valFunc] - 사용자 지정 유효성 검사 함수
 * @param {boolean} [validInfo[n].fromDate] - 시작일자
 * @param {boolean} [validInfo[n].toDate] - 종료일자
 * @return {boolean} 유효성 여부
 */
valLib.validateGridView = function(gridView, validInfo, checkModified) {

	var dataList = commLib.getGridViewDataList(gridView);
	if (dataList === null) {
		return false;
	}
	
	if (checkModified == null) {
		checkModified = true;
	}

	valLib.initValStatus();

	try {
		var modifiedIdx = dataList.getModifiedIndex();
		if (checkModified && modifiedIdx.length === 0) {
			// valid.0029: 변경된 데이터가 존재하지 않습니다.
			alert(commLib.getMessage("valid.0029"));
			return false;
		}

		var modifiedData = dataList.getModifiedJSON();

		// ROW Loop
		for (var dataIdx = 0; dataIdx < modifiedData.length; dataIdx++) {

			var frArr = [];
			var toArr = [];
			var rowData = modifiedData[dataIdx];

			var rowStatus = rowData.rowStatus;
			if (valLib.status.isValid === false) {
				// 이미 유효성 검사에 실패한 상태
				break;
			} else if (rowStatus === "D" || rowStatus === "V" || rowStatus === "E") {
				// D: 삭제, V: 삽입 후 삭제, E: 제거
				continue;
			}

			// validInfo COLUMN Loop
			for (var valIdx = 0; valIdx < validInfo.length; valIdx++) {

				if (valLib.status.isValid === false) {
					// 이미 유효성 검사에 실패한 상태
					break;
				}

				var info = validInfo[valIdx];

				if (typeof info.id !== "undefined" && typeof rowData[info.id] !== "undefined") {

					var value = rowData[info.id];
					if (value != null) {
						value = value.toString();
					}

					if (typeof info.mandatory !== "undefined" && info.mandatory === true && value.length === 0) {
						// valid.0019: 필수입력 항목입니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0019"));
					} else if (typeof info.mandatory !== "undefined" && typeof info.mandatory === "object") {
						var reqColId = info.mandatory.reqColId;
						var reqVal = info.mandatory.reqVal;
						if (value.length === 0 && rowData[reqColId] == reqVal) {
							// valid.0019: 필수입력 항목입니다.
							setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0019"));
						}
					} else if (typeof info.minlength !== "undefined" && info.minlength > 0 && value.length < info.minlength) {
						// valid.0020: 최소 {0}자 이상 입력해야하는 항목입니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0020", info.minlength));
					} else if (typeof info.maxlength !== "undefined" && info.maxlength > 0 && value.length > info.maxlength) {
						// valid.0021: 최대 {0}자까지만 입력할 수 있습니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0021", info.maxlength));
					} else if (typeof info.maxbytelength !== "undefined" && info.maxbytelength > 0 && WebSquare.util.getStringByteSize(value) > info.maxbytelength) {
						// valid.0022: 최대 {0}바이트까지만 입력할 수 있습니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0022", info.maxbytelength));
					} else if (typeof info.isHangul !== "undefined" && info.isHangul === false && strLib.isKorean(value) === true) {
						// valid.0023: 한글을 입력할 수 없는 항목입니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0023"));
					} else if (typeof info.isEmail !== "undefined" && info.isEmail === true && valLib.isEmail(value, false) === false) {
						// valid.0024: 이메일 주소의 형식이 올바르지 않습니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0024"));
					} else if (typeof info.isDate !== "undefined" && info.isDate === true && valLib.checkDate(value, false) === false) {
						// valid.0025: 날짜의 형식이 올바르지 않습니다.
						setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0025"));
					} else if (typeof info.isNumber !== "undefined" && info.isNumber === true) {
						if (value.split("-").length > 2 || value.indexOf("+") > -1) {
							// valid.0026: 정수 형식이 올바르지 않습니다.
							setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0026"));
						} else {
							for (var i = 0; i < value.length; i++) {
								var c = value.charAt(i);
								if (c < '0' || c > '9') {
									if (c != "-") {
										// valid.0026: 정수 형식이 올바르지 않습니다.
										setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0026"));
										break;
									} else {
										if (c == "-" && i > 0) {
											// valid.0026: 정수 형식이 올바르지 않습니다.
											setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0026"));
											break;
										}
									}
								}
							}
						}
					} else if (typeof info.isFloat !== "undefined" && info.isFloat === true) {
						if (value.split(".").length > 2 || value.split("-").length > 2 || value.indexOf("+") > -1) {
							// valid.0027: 실수 형식이 올바르지 않습니다.
							setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0027"));
						} else {
							for (var i = 0; i < value.length; i++) {
								var c = value.charAt(i);
								if (c < '0' || c > '9') {
									if (c != "-" && c != ".") {
										// valid.0027: 실수 형식이 올바르지 않습니다.
										setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0027"));
										break;
									} else {
										if (c == "-" && i > 0) {
											// valid.0027: 실수 형식이 올바르지 않습니다.
											setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, commLib.getMessage("valid.0027"));
											break;
										}
									}
								}
							}
						}
					} else if (typeof info.valFunc === "function") {
						var resultMsg = info.valFunc(value);
						if (!strLib.isEmpty(resultMsg, true)) {
							setResult(info.id, modifiedIdx[dataIdx], dataList, gridView, resultMsg);
						}
					} else {
						if (info.fromDate !== "undefined" && info.fromDate === true) {
							frArr.push({
								row : modifiedIdx[dataIdx],
								colId : info.id,
								val : value
							});
						}

						if (info.toDate !== "undefined" && info.toDate === true) {
							toArr.push({
								row : modifiedIdx[dataIdx],
								colId : info.id,
								val : value
							});
						}
					}
				}

			} // validInfo COLUMN Loop

			// from ~ to 검사
			if (frArr.length > 0 && toArr.length > 0 && frArr.length == toArr.length) {
				for (var dIndex = 0; dIndex < frArr.length; dIndex++) {
					var frValue = frArr[dIndex].val.replace(/\D/gi, "");
					var toValue = toArr[dIndex].val.replace(/\D/gi, "");

					if (parseFloat(toValue) - parseFloat(frValue) < 0) {
						// valid.0028: 시작일자와 종료일자가 올바르지 않습니다.
						setResult(frArr[dIndex].colId, frArr[dIndex].row, dataList, gridView, commLib.getMessage("valid.0028"));
						break;
					}
				}
			}
		} // ROW Loop

		return valLib.status.isValid;

		// 유효성에 체크에 걸렸을 때 실행되는 함수
		function setResult(columnId, rowIndex, dataList, gridView, message) {
			
			var validName = "";
			for (var i = 0; i < validInfo.length; i++) {
				var validItem = validInfo[i];
				if (validItem.id == columnId) {
					if (validItem.validName) {
						validName = validItem.validName;
						break;
					}
				}
			}
			
			valLib.status.isValid = false;
			valLib.status.objectName = gridView.getID();
			valLib.status.columnId = columnId;
			valLib.status.rowIndex = rowIndex;
			valLib.status.message = message + " (" + (strLib.isEmpty(validName, true) ? dataList.getColumnName(columnId) : validName) + ")";
			alert(valLib.status.message);

			gridView.setFocusedCell(valLib.status.rowIndex, valLib.status.columnId, true);
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.validateGridView: " + e);

		return false;
	} finally {
		modifiedData = null;
		modifiedIdx = null;
		dataList = null;
		gridView = null;
	}
};

/**
 * 주민등록번호 유효성을 검사한다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.checkRegNo = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		// 13자리 숫자
		value = value.toString().trim().replace(/\D/g, "");
		if (isNaN(value) || value.length != 13) {
			return false;
		}

		// 이하 실제 검증로직
		var sum = 0;
		var check = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];

		for (var i = 0; i < 12; i++) {
			sum += parseInt(value.charAt(i), 10) * check[i];
		}

		if (parseInt(value.charAt(12), 10) != ((11 - (sum % 11)) % 10)) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkRegNo: " + e);
	}
};

/**
 * 외국인등록번호 유효성을 검사한다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.checkForeignNo = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		// 13자리 숫자
		value = value.toString().trim().replace(/\D/g, "");
		if (isNaN(value) || value.length != 13) {
			return false;
		}

		// 이하 실제 검증로직
		var odd = parseInt(value.charAt(7), 10) * 10 + parseInt(value.charAt(8), 10);
		if (odd % 2 != 0) {
			return false;
		}

		var sum = 0;
		var check = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];

		for (var i = 0; i < 12; i++) {
			sum += parseInt(value.charAt(i), 10) * check[i];
		}

		if (parseInt(value.charAt(12), 10) != ((((11 - (sum % 11)) % 10) + 2) % 10)) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkForeignNo: " + e);
	}
};

/**
 * 사업자등록번호 유효성을 검사한다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.checkBizNo = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		// 10자리 숫자
		value = value.toString().trim().replace(/\D/g, "");
		if (isNaN(value) || value.length != 10) {
			return false;
		}

		// 이하 실제 검증로직
		var sum = 0;
		var check = [ 1, 3, 7, 1, 3, 7, 1, 3, 5 ];

		for (var i = 0; i < 9; i++) {
			sum += parseInt(value.charAt(i), 10) * check[i];
		}
		sum += parseInt(parseInt(value.charAt(8), 10) * 5 / 10, 10);

		if (parseInt(value.charAt(9), 10) != ((sum % 10 > 0) ? 10 - (sum % 10) : 0)) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkForeignNo: " + e);
	}
};

/**
 * 법인등록번호의 유효성 여부를 반환합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.checkCorpNo = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		// 13자리 숫자
		value = value.toString().trim().replace(/\D/g, "");
		if (isNaN(value) || value.length != 13) {
			return false;
		}

		// 이하 실제 검증로직
		var sum = 0;

		for (var i = 0; i < 12; i++) {
			sum += parseInt(value.charAt(i), 10) * ((i % 2 == 0) ? 1 : 2);
		}

		if (parseInt(value.charAt(12), 10) != ((sum % 10 > 0) ? 10 - (sum % 10) : 0)) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkCorpNo: " + e);
	}
};

/**
 * 국내 전화번호 유효성 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @return {boolean} 유효성 여부
 */
valLib.checkPhone = function(value) {
	try {
		if (!value) {
			return false;
		}

		// 숫자
		value = value.toString().trim().replace(/\D/g, "");
		if (isNaN(value)) {
			return false;
		}

		// 이하 실제 검증로직
		if (value.length == 3 && (value.indexOf("11") == 0 || value.indexOf("12") == 0 || value.indexOf("13") == 0 || value.indexOf("18") == 0)) {
			// 11Y·12Y - 긴급 민원 신고
			// 13Y·18Y - 긴급 민원 신고
			return true;
		} else if (value.length == 8
				&& (value.indexOf("13") == 0 || value.indexOf("14") == 0 || value.indexOf("15") == 0 || value.indexOf("16") == 0 || value.indexOf("17") == 0
						|| value.indexOf("18") == 0 || value.indexOf("19") == 0)) {
			// 13YY - 공공기관 생활정보, 안내, 상담
			// 14YY - (예비; 기간통신사업자 부가서비스)
			// 15YY - 기간통신사업자 공통부가서비스 및 자율부가서비스 (전국대표번호 등)
			// 16YY - 기간통신사업자 공통부가서비스 (전국대표번호 등)
			// 18YY - 기간통신사업자 공통부가서비스 (전국대표번호 등)
			// 17YY·19YY - (예비)
			return true;
		} else {
			// 00Y - 국제전화
			// 01Y - 무선전화, 무선호출, 부가통신망
			// 0N0 - 공통 서비스 (각종 지능망 등)
			// 02 - 지역번호 (서울)
			// 03Y ~ 06Y - 지역번호
			// 08Y - 시외전화
			// 10Y - 통신 사업자 민원안내 등
			// 07Y, 09Y - (예비)
			var regExp = /^(02|0[0-1][1-9]|0[0-9]0|0[0-6]\d|1\d{2,3})(\d{3,4})(\d{4})*$/g;

			return regExp.test(value);
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkPhone: " + e);
	}
};

/**
 * 이메일주소의 유효성을 검사한다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.isEmail = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		var exclude = /[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/i;
		var check = /@[\w\-]+\./;
		var checkend = /\.[a-zA-Z]{2,3}$/i;

		return !((value.search(exclude) != -1) || (value.search(check) == -1) || (value.search(checkend) == -1));
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.isEmail: " + e);
	}
};

/**
 * 도메인의 유효성을 검사한다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.isDomain = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		var format = /(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;

		return format.test(value);
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.isEmail: " + e);
	}
};

/**
 * URL의 유효성 여부를 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @return {boolean} 유효성 여부
 */
valLib.isURL = function(value) {
	try {
		if (!value) {
			return false;
		}

		// 이하 실제 검증로직
		var regExp = /^(https?:\/\/)?((([a-z\d](([a-z\d-]*[a-z\d]))|([ㄱ-힣])*)\.)+(([a-zㄱ-힣]{2,}))|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/ig;

		return regExp.test(value.toString().trim());
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.isURL: " + e);
	}
};

/**
 * IPv4의 유효성 여부를 반환합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @return {boolean} 유효성 여부
 */
valLib.isIPv4 = function(value) {
	try {
		if (!value) {
			return false;
		}

		var value = value.toString().trim().replace(/\s/g, "");

		value = value.split(".");
		if (value.length != 4) {
			return false;
		}

		for (var i = 0; i < 4; i++) {
			if (isNaN(value[i])) {
				return false;
			}

			var ip = parseInt(value[i], 10);
			if (ip < 0 || ip > 255) {
				return false;
			}
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.isIPv4: " + e);
	}
};

/**
 * 지정한 최소값/최대값 범위 내에 포함되는지 여부를 확인합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {string} lowValue - 최소값
 * @param {string} highValue - 최대값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.checkLowHigh = function(value, lowValue, highValue, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		if (strLib.isEmpty(lowValue, true) || strLib.isEmpty(highValue, true)) {
			return false;
		}

		value = numLib.toFloat(value);
		lowValue = numLib.toFloat(lowValue);
		highValue = numLib.toFloat(highValue);

		if (isNaN(value) || isNaN(lowValue) || isNaN(highValue)) {
			return false;
		}

		if (lowValue != 0 && value < lowValue) {
			return false;
		}

		if (highValue != 0 && value > highValue) {
			return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkLowHigh: " + e);
	}
};

/**
 * 날짜문자열이 YYYYMMDD 형식을 만족하는지 여부를 확인합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @param {boolean} [checkEmpty] - 빈 문자열까지 체크할지 여부
 * @return {boolean} 유효성 여부
 */
valLib.checkDate = function(value, checkEmpty) {
	try {
		if (checkEmpty == null) {
			checkEmpty = true;
		}

		if (checkEmpty && strLib.isEmpty(value)) {
			return false;
		} else if (!checkEmpty && strLib.isEmpty(value)) {
			return true;
		}

		return !strLib.isEmpty(valLib.checkYYYYMMDD(value.replace(/\-/img, "")), "");
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkDate: " + e);
	}
};

/**
 * 입력값이 영문자와 숫자로 구성되어 있고 첫글자가 영문자인지 여부를 확인합니다.
 * 
 * @author SONG WONSEOK 보완
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @return {boolean} 유효성 여부
 */
valLib.checkAlphaFirst = function(value) {
	try {
		for (var i = 0; i < value.length; i++) {
			var char = value.charCodeAt(i);

			if (char < 48)
				return false;
			if (char > 122)
				return false;
			if (char > 57 && char < 65)
				return false;
			if (char > 90 && char < 97)
				return false;
			if (i == 0 && char >= 49 && char <= 58)
				return false;
		}

		return true;
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkAlphaFirst: " + e);
	}
};

/**
 * 날짜 문자열이 YYYYMMDD 형식을 만족하면 원본 값을 반환하고 아니면 빈 문자열을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @return {string} 원본 날짜/빈 문자열
 */
valLib.checkYYYYMMDD = function(value) {
	try {
		if (!value) {
			return "";
		}

		return dateLib.isYYYYMMDD(value) ? value : "";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkYYMMDD: " + e);
	}
};

/**
 * 날짜 문자열이 YYYYMM 형식을 만족하면 원본 값을 반환하고 아니면 빈 문자열을 반환합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 15.
 * @memberOf valLib
 * @param {string} value - 대상 입력값
 * @return {string} 원본 날짜/빈 문자열
 */
valLib.checkYYYYMM = function(value) {
	try {
		if (!value) {
			return "";
		}

		return dateLib.isYYYYMM(value) ? value : "";
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("valLib.checkYYMM: " + e);
	}
};