;
/**util 관련 Function Start*/

/**
 * 메인 화면에서 업무 화면을 오픈하는 Frame Mode 정보를 반환한다.
 *
 * @date 2018.11.14
 * @memberOf com
 * @author InswaveSystems
 */
com.getFrameMode = function() {
    return gcm.FRAME_MODE;
};


/**
 * 특정 컴포넌트에 바인된 DataList나 DataMap의 정보를 반환한다.
 *
 * @date 2018.01.15
 * @memberOf com
 * @param {Object} comObj callerObj 컴포넌트 객체
 * @returns {Object} dataCollection정보
 */
com.getDataCollection = function(comObj) {
    try {
        if ((typeof comObj !== "undefined") && (typeof comObj.getRef === "function")) {
            var ref = comObj.options.ref;
            if ((typeof ref !== "undefined") && (ref !== "")) {
                var refArray = ref.substring(5).split(".");
                if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
                    var dataObjInfo = {};
                    dataObjInfo.runtimeDataCollectionId = comObj.getScope().id + "_" + refArray[0];
                    dataObjInfo.dataColletionId = refArray[0];
                    dataObjInfo.columnId = refArray[1];
                    return dataObjInfo;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    } catch (e) {
        console.log("[com.getDataCollection] Exception :: " + e.message);
    }
};

/**
 * DataCollection 객체의 변경된 데이터가 있는지 검사한다.
 *
 * @date 2018.01.16
 * @memberOf com
 * @param {Object} dcObjArr DataCollection 또는 배열
 * @author InswaveSystems
 * @returns {Boolean} 검사결과 (true or false)
 */
com.checkModified = function(dcObjArr) {
    if (com.getObjectType(dcObjArr) === "array") {
        for (var dcObj in dcObjArr) {
            if (com.getObjectType(dcObj) === "object") {
                if (checkModfied(dcObj) === false) {
                    return false;
                }
            }
        }
    } else if (com.getObjectType(dcObjArr) === "object") {
        return checkModfied(dcObj);
    }

    return true;

    function checkModfied(dcObj) {
        if ((typeof dcObj !== "undefined") && (!!dcObj)) {
            var modifiedIndex = dcObj.getModifiedIndex();
            if (modifiedIndex.length === 0) {
                com.alert("변경된 데이터가 없습니다.");
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
};


/**
 * 해당 그룹 안의 컴포넌트에서 엔터키가 발생하면 해당 컴포넌트의 값을 DataColletion에 저장하고 objFunc 함수를 실행한다.
 *
 * @date 2018.02.15
 * @param {Object} grpObj 그룹 객체
 * @param {Object} objFunc 함수 객체
 * @param {Number} rowIndex DataList가 바인딩된 gridView인 경우 ==> 현재 포커스된 focusedRowIndex [ex. gridViewId.getFocusedRowIndex()]
 *				 <br/>아닌 경우 ==> rowIndex는 생략
 * @memberOf com
 * @author InswaveSystems
 * @example
 * com.setEnterKeyEvent(grp_AuthorityDetail, scwin.search);
 * // return 예시) "엔터키가 발생 -> 해당 함수 실행 및 DataColletion에 UI 컴포넌트에 입력된 데이터를 DataCollection에 저장"
 */
com.setEnterKeyEvent = function(grpObj, objFunc) {
    var objArr = WebSquare.util.getChildren(grpObj, {
        excludePlugin : "group trigger textbox output calendar image span",
        recursive : true
    });

    try {
        for (var i = 0; i < objArr.length; i++) {
            try {
                if (typeof objFunc === "function") {
                    objArr[i].bind("onkeyup", function(e) {
                        if (e.keyCode === 13) {
                            if (typeof this.getRef === "function") {
                                var ref = this.getRef();
                                var refArray = ref.substring(5).split(".");
                                if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
                                    var dataCollectionName = refArray[0];
                                    var columnId = refArray[1];
                                    var dataCollection = this.getScopeWindow().$p.getComponentById(dataCollectionName);
                                    var dataType = dataCollection.getObjectType().toLowerCase();
                                    if (dataType === "datamap") {
                                        dataCollection.set(columnId, this.getValue());
                                    } else if ((dataType === 'datalist') && (typeof rowIndex !== "undefined")) {
                                        dataCollection.setCellData(dataCollection.getRowPosition(), columnId, this.getValue());
                                    }
                                }
                                objFunc();
                            }
                        }
                    });
                }
            } catch(e) {
                $p.log("[com.setEnterKeyEvent] Exception :: " + e.message);
            }
        }
    } catch(e) {
        $p.log("[com.setEnterKeyEvent] Exception :: " + e.message);
    } finally {
        objArr = null;
    }
};


/**
 * 현재 화면의 웹스퀘어 page 경로를 반환한다.
 *
 * @date 2016.07.19
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 현재 페이지의 경로
 * @example
 * com.getPageUrl();
 * // return 예시) "/ui/BM/BM001M01.xml"
 */
com.getPageUrl = function() {
    var pArr = document.location.href.split("w2xPath=");
    var oArr = pArr[1].split("&");
    return oArr[0];
};
/**
 * contextRoot가 포함된 path를 반환한다.
 *
 * @date 2016.11.16
 * @memberOf com
 * @param {String} path 파일경로(Context가 포함되지 않은)
 * @return {String} Context가 포함된 파일경로
 * @example
 * // context가 /sample 인경우\er/confirm.xml");
 * // return 예시) "/sample/ui/SP/Parameter/confirm.xml"
 */
com.getFullPath = function(path) {
    var rtn_path = "";
    if (gcm.CONTEXT_PATH == "") {
        rtn_path = path;
    } else {
        rtn_path = gcm.CONTEXT_PATH + path;
    }
    return rtn_path;
};

/**
 * 문자열 왼쪽에 일정길이(maxLen) 만큼 '0'으로 채우기
 *
 * @date 2014.12.10
 * @param {String} str 포멧터를 적용할 문자열
 * @param {Number} maxLen 0 으로 채울 길이
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 일정길이 만큼 0 으로 채워진 문자열
 * @example
 * com.fillZero("24", 4);
 * // return 예시) "0024"
 *
 * com.fillZero("11321", 8);
 * // return 예시) "00011321"
 */
com.fillZero = function(str, maxLen) {
    var len = str;
    var zero = "";

    if (typeof str == 'number')  len = '' + str;

    if (len.length < maxLen) {
        for (var i=len.length; i<maxLen; i++) {
            zero += "0";
        }
    }
    return  (zero + '' + str);
}

/**
 * JSON Object로 변환해서 반환한다.
 *
 * @date 2014.12.09
 * @param {String} str JSON 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {Object} JSON 객체 or null
 * @example
 * // 유효하지 않은 JSON 문자열 일 경우
 * com.getJSON("");
 * // return 예시)	null
 *
 * // 유효한 JSON 문자열
 * var json = '{"tbx_sPrjNm":"1","tbx_sPrtLv":"2","tbx_sReqLv":"3"}';
 * com.getJSON(json);
 * // return 예시)	{tbx_sPrjNm: "1", tbx_sPrtLv: "2", tbx_sReqLv: "3"}
 */
com.getJSON = function(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};

/**
 * XML, JSON 객체를 String 타입으로 반환한다.
 *
 * @date 2014.12.09
 * @param {Object} object String으로 변환할 JSON 객체
 * @memberOf com
 * @author InswaveSystems
 * @return {String} String으로 변환된 객체
 */
com.strSerialize = function(object) {
    if (typeof object == 'string') {
        return object;
    } else if (com.isJSON(object)) {
        return JSON.stringify(object);
    } else if (com.isXmlDoc(object)) {
        return WebSquare.xml.serialize(object);
    } else {
        return object;
    }
};

/**
 * JSON Object인지 여부를 검사한다.
 *
 * @date 2014.12.09
 * @param {Object} jsonObj JSON Object가 맞는지 검사할 JSON Object
 * @memberOf com
 * @author InswaveSystems
 * @return {Boolean} true or false
 * @example
 * com.isJSON("");
 * // return 예시) false
 * com.isJSON( {"tbx_sPrjNm": "1", "tbx_sPrtLv": "2", "tbx_sReqLv": "3"} );
 * // return 예시) true
 */
com.isJSON = function(jsonObj) {
    if (typeof jsonObj !== 'object')
        return false;
    try {
        JSON.stringify(jsonObj);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * XML Document 객체인지 여부를 검사한다.
 *
 * @date 2014.12.09
 * @memberOf com
 * @param {Object} data XML Document 객체인지 여부를 검사한다.
 * @author InswaveSystems
 * @return {Boolean} true or false
 */
com.isXmlDoc = function(data) {
    if (typeof data != 'object')
        return false;
    if ((typeof data.documentElement != 'undefined' && data.nodeType == 9) || (typeof data.documentElement == 'undefined' && data.nodeType == 1)) {
        return true;
    }
    return false;
};

/**
 * 객체의 typeof 값을 반환하며 typeof의 값이 object인 경우 array, json, xml, null로 체크하여 반환한다.
 *
 * @date 2016.12.20
 * @param {Object} obj type을 반환 받을 객체(string,boolean,number,object 등)
 * @author InswaveSystems
 * @return {String} 객체의 타입으로 typeof가 object인 경우 array, json, xml, null로 세분화하여 반환한다. 그외 object타입이 아닌경우 원래의 type(string,boolean,number 등)을 반환한다.
 * @example
 * com.getObjectType("WebSquare");
 * // return 예시) "string"
 * com.getObjectType({"name":"WebSquare"});
 * // return 예시) "json"
 * com.getObjectType(["1","2"]);
 * // return 예시) "array"
 */
com.getObjectType = function(obj) {
    var objType = typeof obj;
    if (objType !== 'object') {
        return objType;
    } else if (obj.constructor === {}.constructor) {
        return 'json';
    } else if (obj.constructor === [].constructor) {
        return 'array';
    } else if (obj == null) {
        return 'null';
    } else {
        /* var tmpDoc = WebSquare.xml.parse("<data></data>");
        if (obj.constructor === tmpDoc.constructor || obj.constructor === tmpDoc.firstElementChild.constructor) {
            return 'xml';
        } else {
            return objType;
        }*/
        return objType;
    }
};

/**
 * 주민번호 문자열에 Formatter(######-#######)를 적용하여 반환한다.
 *
 * @date 2016.08.02
 * @param {String} str 주민번호 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 주민번호 문자열
 * @example
 * com.transIdNum("1234561234567");
 * // return 예시) "123456-1234567"
 */
com.transIdNum = function(str) {
    var front = String(str).substr(0,6);
    var back = String(str).substr(6,7);
    var output = front+"-"+back;

    return output;
};

/**
 * 전화번호, setDisplayFormat("###-####-####") - 입력된 str에 포메터를 적용하여 반환한다.
 *
 * @date 2016.08.02
 * @param {String} str 포멧터를 적용할 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transPhone("0212345678");
 * // return 예시) "02-1234-5678"
 * com.transPhone("021234567");
 * // return 예시) "02-123-4567"
 * com.transPhone("03112345678");
 * // return 예시) "031-1234-5678"
 * com.transPhone("0311234567");
 * // return 예시) "031-123-4567"
 */
com.transPhone = function(str) {
    return str.replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$/, "$1-$2-$3");
};

/**
 * 시간 - 입력된 String 또는 Number에 포메터를 적용하여 반환한다.
 *
 * @date 2016.08.02
 * @param {String} value 시간 Formatter를 적용한 값 (String 또는 Number 타입 지원)
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transTime("123402");
 * // return 예시) "12:34:02"
 */
com.transTime = function(value) {
    var hour = String(value).substr(0, 2);
    var minute = String(value).substr(2, 2);
    var second = String(value).substr(4, 2);
    var output = hour + ":" + minute + ":" + second;

    return output;
};

/**
 * 소수점 2자리에서 반올림 처리를 한다.
 *
 * @date 2016.08.02
 * @param {String} value 소수점 2자리 반올림 처리를 할 값 (String 또는 Number 타입 지원)
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 소숫점 2자리 반올림 처리를 한 숫자 값
 * @example
 * com.transRound( "23.4567" );
 * // return 예시) "23.46"
 */
com.transRound = function(value) {
    return Math.round(Number(value) * 100) / 100;
};

/**
 * 소수점 2자리에서 내림 처리를 한다.
 *
 * @date 2016.08.02
 * @param {String} value 소수점 2자리 내림 처리를 할 값 (String 또는 Number 타입 지원)
 * @memberOf com
 * @author InswaveSystems
 * @return {Number} 소숫점 2자리 내림 처리를 한 숫자 값
 * @example
 * com.transFloor(23.4567);
 * // return 예시) 23.45
 */
com.transFloor = function(value) {
    return Math.floor(Number(str) * value) / 100;
};

/**
 * 소수점 2자리에서 반올림 후 퍼센트(%)를 붙여서 반환한다.
 *
 * @date 2016.08.02
 * @param {String} value Percent(%) 포맷터를 적용할 값  (String 또는 Number 타입 지원)
 * @param {String} type 적용할 포멧터 형식
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transCeil(23.4567);
 * // return 예시) 23.46
 * com.transCeil(78.567, "percent");
 * // return 예시) 78.57%
 */
com.transCeil = function(value, type) {
    var output = "";
    if (type == "percent") {
        output = Math.ceil(Number(value) * 100) / 100 + "%";
    } else {
        output = Math.ceil(Number(value) * 100) / 100;
    }
    return output;
};

/**
 * ex)세번째자리마다 콤마 표시, 금액, setDisplayFormat("#,###&#46##0", "fn_userFormatter2") - 입력된 str에 포메터를 적용하여 반환한다.<p>
 *
 * @date 2016.08.02
 * @param {String} value String or Number 포멧터를 적용할 값 (String 또는 Number 타입 지원)
 * @param {String} type 적용할 포멧터 형식(Default:null,dollar,plusZero,won)
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transComma("12345");
 * // return 예시) 12,345
 * com.transComma("12345", "dollar");
 * // return 예시) $12,345
 * com.transComma("12345", "plusZero");
 * // return 예시) 123,450
 * com.transComma("12345", "won");
 * // return 예시) 12,345원
 */
com.transComma = function(value, type) {
    var amount;

    if (type == "plusZero") {
        amount = new String(value) + "0";
    } else {
        amount = new String(value);
    }

    amount = amount.split(".");

    var amount1 = amount[0].split("").reverse();
    var amount2 = amount[1];

    var output = "";
    for (var i = 0; i <= amount1.length - 1; i++) {
        output = amount1[i] + output;
        if ((i + 1) % 3 == 0 && (amount1.length - 1) !== i)
            output = ',' + output;
    }

    if (type == "dollar") {
        if (!amount2) {
            output = "$ " + output;
        } else {
            output = "$ " + output + "." + amount2;
        }
    } else if (type == "won") {
        if (!amount2) {
            output = output + "원";
        } else {
            output = output + "." + amount2 + "원";
        }
    } else {
        if (!amount2) {
            output = output + "";
        } else {
            output = output + "." + amount2;
        }
    }

    return output;
}

/**
 * 금액 콤마 삽입(3자리마다 콤마를 삽입 한다.)
 *
 * @memberOf uc
 * @param <String:Y>
 *            sValue
 * @param <boolean:N>
 *            isAbs 음수 사용 여부.
 * @return {String}
 * @example com.formatComma("-123456789","false");
 */
com.formatComma = function(sValue, isAbs) {
    if (com.isEmpty(sValue))
        return "";
    var parts = sValue.toString().split(".");
    var regStr = WebSquare.util.getBoolean(isAbs) ? /[^0-9]+/ : /[^-0-9]+/;
    parts[0] = (parseInt(parts[0], 10) + "").replace(regStr, "").replace(
            /\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};


/**
 * 텍스트 - 입력된 str에 포메터를 적용하여 반환한다.
 *
 * @date 2016.08.02
 * @param {String} str String or Number 포멧터를 적용할 값
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transText("1");
 * // return 예시) 1
 * com.transText("12");
 * // return 예시) 12
 * com.transText("123");
 * // return 예시) 1.23
 * com.transText("1234");
 * // return 예시) 12.34
 * com.transText("12345");
 * // return 예시) 123.345
 * com.transText("123456");
 * // return 예시) 1234.56
 * com.transText("1234567");
 * // return 예시) 12345.67
 */
com.transText = function(str) {
    var amount = new String(str);
    var result;

    if (amount.length < 3) {
        result = amount.substr(0, amount.length);
    } else {
        result = amount.substr(0, amount.length - 2) + "." + amount.substr(amount.length - 2, amount.length);
    }
    return result;
}

/**
 * 날짜 - 입력된 str에 포메터를 적용하여 반환한다.
 *
 * @date 2016.08.02
 * @param {String} str 포멧터를 적용할 파라메터 (String 또는 Number 타입 지원)
 * @param {String} type 적용할 포멧터 형식 Default:null,slash,date
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transDate(20120319, "slash");
 * // return 예시) 12/03/19
 * com.transDate(20120319, "date");
 * // return 예시) 2012/03/19
 * com.transDate(20120319, "colon");
 * // return 예시) 2012:03:19
 * com.transDate(20120319, "dash");
 * // return 예시) 2012-03-19
 * com.transDate(20120319);
 * // return 예시) 2012년 03월 19일
 */
com.transDate = function(str, type) {
    var output = "";
    var date = new String(str);

    if (type == "slash") {
        date = date.substring(2, date.length);
        for (var i = 0; i <= date.length - 1; i++) {
            output = output + date[i];
            if ((i + 1) % 2 == 0 && (date.length - 1) !== i)
                output = output + "/";
        }
    } else if (type == "date") {
        if (date.length == 8) {
            output = date.substr(0, 4) + "/" + date.substr(4, 2) + "/" + date.substr(6, 2);
        }
    } else if (type == "colon") {
        if (date.length == 8) {
            output = date.substr(0, 4) + ":" + date.substr(4, 2) + ":" + date.substr(6, 2);
        }
    } else if (type == "dash") {
        if (date.length == 8) {
            output = date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
        }
    } else {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6, 2);
        var output = year + "년 " + month + "월 " + day + "일";
    }
    return output;
};

/**
 * displayFormatter - 입력된 str에 포메터를 적용하여 반환한다.
 *
 * @date 2016.08.03
 * @param {String} str 포멧터를 적용할 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 포멧터가 적용된 문자열
 * @example
 * com.transUpper("google.com");
 * // return 예시) "GOOGLE.COM"
 */
com.transUpper = function(str) {
    return str.toUpperCase();
};

/**
 * 문자(char)의 유형을 리턴한다.
 *
 * @date 2016 08.02
 * @param {String} str 어떤 유형인지 리턴받을 문자
 * @memberOf com
 * @author InswaveSystems
 * @return {Number} 유니코드 기준 <br><br>
 * 한글음절[ 44032 ~ 55203 ] => 1 <br>
 * 한글자모[ 4352 ~ 4601 ] => 2 <br>
 * 숫자[ 48 ~ 57 ] => 4 <br>
 * 특수문자[ 32 ~ 47 || 58 ~ 64 || 91 ~ 96 || 123 ~ 126 ] => 8 <br>
 * 영문대[ 65 ~ 90 ] => 16 <br>
 * 영문소[ 97 ~ 122 ] => 32 <br>
 * 기타[그외 나머지] => 48
 * @example
 * com.getLocale("가");
 * // return 예시)1
 * com.getLocale("ㅏ");
 * // return 예시)2
 * com.getLocale("1");
 * // return 예시)4
 * com.getLocale("!");
 * // return 예시)8
 * com.getLocale("A");
 * // return 예시)16
 * com.getLocale("a");
 * // return 예시)32
 * com.getLocale("¿");
 * // return 예시)48
 */
com.getLocale = function(str) {
    var locale = 0;
    if (str.length > 0) {
        var charCode = str.charCodeAt(0);

        if (charCode >= 0XAC00 && charCode <= 0XD7A3) { // 한글음절.[ 44032 ~ 55203 ]
            locale = 0X1; // 1
        } else if ((charCode >= 0X1100 && charCode <= 0X11F9) || (charCode >= 0X3131 && charCode <= 0X318E)) { // 한글자모.[ 4352 ~ 4601 ]
            locale = 0X2; // 2
        } else if (charCode >= 0X30 && charCode <= 0X39) { // 숫자.[ 48 ~ 57 ]
            locale = 0X4; // 4
        } else if ((charCode >= 0X20 && charCode <= 0X2F) || (charCode >= 0X3A && charCode <= 0X40) || (charCode >= 0X5B && charCode <= 0X60)
                || (charCode >= 0X7B && charCode <= 0X7E)) { // 특수문자
            locale = 0X8; // 8
        } else if (charCode >= 0X41 && charCode <= 0X5A) { // 영문 대.[ 65 ~ 90 ]
            locale = 0X10; // 16
        } else if (charCode >= 0X61 && charCode <= 0X7A) { // 영문 소.[ 97 ~ 122 ]
            locale = 0X20; // 32
        } else { // 기타
            locale = 0X30; // 48
        }
    }
    return locale;
};

/**
 * 입력받은 문자열이 한글이면 true, 아니면 false를 리턴한다.
 *
 * @date 2016.08.02
 * @param {String} str 한글 유형인지 검증할 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {Boolean} true or false
 * @example
 * com.isKorean("");
 * // return 예시) false
 * com.isKorean("무궁화꽃이");
 * // return 예시) true
 */
com.isKorean = function(str) {
    if (str != null && str.length > 0) {
        var locale = 0;
        for (var i = 0; i < str.length; i++) {
            locale = com.getLocale(str.charAt(i));
        }
        if ((locale & ~0x3) == 0) {
            return true;
        }
    }
    return false;
};

/**
 * 종성이 존재하는지 여부를 검사한다.
 *
 * @date 2016.08.02
 * @param {String} str 종성의 여부를 검사할 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {Boolean} true or false
 * @example
 * com.isFinalConsonant("종서")
 * // return 예시) false
 * com.isFinalConsonant("종성")
 * // return 예시) true
 * com.isFinalConsonant("입니다")
 * // return 예시) false
 *	com.isFinalConsonant("입니당")
 * // return 예시) true
 */
com.isFinalConsonant = function(str) {
    var code = str.charCodeAt(str.length - 1);
    if ((code < 44032) || (code > 55197)) {
        return false;
    }
    if ((code - 16) % 28 == 0) {
        return false;
    }
    return true;
};

/**
 * 단어 뒤에 '은'이나 '는'을 붙여서 반환한다.
 *
 * @date 2016.08.02
 * @param {String} str 은, 는 붙일 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {String} 변환된 문자열
 * @example
 * com.attachPostposition("나");
 * // return 예시)"나는"
 * com.attachPostposition("나와 너");
 * // return 예시)"나와 너는"
 * com.attachPostposition("그래서");
 * // return 예시)"그래서는"
 * com.attachPostposition("그랬습니다만");
 * // return 예시)"그랬습니다만은"
 */
com.attachPostposition = function(str) {
    if (com.isFinalConsonant(str)) {
        str = str + "은 ";
    } else {
        str = str + "는 ";
    }
    return str;
};

/**
 * 입력받은 문자열에 한글이 포함되어 있으면 true, 아니면 false를 리턴한다.
 *
 * @date 2016.08.02
 * @param {String} str 한글이 포함되어 있는지 검증 받을 문자열
 * @memberOf com
 * @author InswaveSystems
 * @return {Boolean} true or false
 * @example
 * com.isKoreanWord("abcd무궁화"); //return 예시) true
 * com.isKoreanWord("abcd"); //return 예시) false
 */
com.isKoreanWord = function(str) {
    var c;
    for ( var i = 0; i < str.length; i++) {
        c = str.charAt(i);
        if (com.isKorean(c)) {
            return true;
        }
    }
    return false;
};



/**
 * 메일주소 체크한다.
 *
 * @date 2014. 12. 10.
 * @memberOf com
 * @param {String} str 메일주소
 * @return {Boolean} 정상이면 공백("")을 반환, 그외는 에러 메시지 반환
 * @example com.isEmail("emailTest@email.com")
 */
com.checkEmail = function(str) {
    if (typeof str != "undefined" && str != "") {
        var format = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (format.test(str)) {
            return  true;
        } else {
            return  false;
        }
    }
    return  true;
};

/**
 * 종성이 존재하는지 여부를 검사한다.
 *
 * @date 2018.01.15
 * @private
 * @memberOf
 * @param {String} str 문자열
 * @returns {Boolean} true : 종성이 존재, false 그외
 */
com._isFinalConsonant = function(str) {
    var code = str.charCodeAt(str.length - 1);
    if ((code < 44032) || (code > 55197)) {
        return false;
    }
    if ((code - 16) % 28 == 0) {
        return false;
    }
    return true;
};

/**utils function******************************************/
/**
 * 탭을 오픈한다.
 *
 * @date 2019.01.21
 * @private
 * @memberOf
 * @param {String} title 문자열
 * @param {String} id 문자열
 * @param {String} url 문자열
 */
com._openTab = function(title,id,url,isSelfClose) {
	
    gcm.MENU_ID = id;
    gcm.MENU_TITLE = title;
    gcm.MENU_URL = url;
    
    if(com.isEmpty(gcm.tab_main)){

        setTimeout(function(){
                    if(!com.isEmpty(isSelfClose) && isSelfClose){
                        gcm._container.closeWindow(gcm._container.getSelectedWindowId())
                    }
                    gcm._container.createWindow( title // (필수) title         : 툴바의 네임레이어에 표시되는 타이틀.
                                               , null                // (필수) iconUrl       : 현재는 사용되지 않으며 null로 입력한다.(각 윈도우의 아이콘 url 문자열)
                                               , url             // (필수) src           : window에 link할 페이지의 URL.
                                               , null                // (옵션) windowTitle   : window의 헤더에 표시될 타이틀로 null 이나 ""입력시 title값이 출력.
                                               ,id // (옵션) windowId      : window ID로 null 이나 ""입력시 title이 id로 생성.
                                               , "selectWindow"      // (옵션) openAction    : [existWindow, newWindow, selectWindow]existWindow : id가 동일한 윈도우가 떠있으면 그 윈도우를 사용하여 다시 표시 / newWindow : 항상 새로운 창을 생성 / selectWindow : id가 동일한 창이 있으면 그 윈도우를 선택
                                               , "com.closeScreen"   // (옵션) closeAction   : window가 닫힐 때 동작을 지정하는 함수명(return은 boolean으로 하여야 함 false일 경우 닫기 중지, true일 경우 닫기)
                                               , null                // (옵션) windowTooltip : 툴바의 네임레이어에 표현될 tooltip.(미입력시 windowTitle이 tooltip으로 셋팅됨)
                                               );

        }, 100);
    }else{
        if(!com.isEmpty(isSelfClose) && isSelfClose){
            gcm.tab_main.deleteTab(gcm.tab_main.getSelectedTabIndex())
        }
        var closableOpt = url.indexOf("index") > -1? "false": "true";
        var contentID = id;
        var tabOpt  ={label:title,closable:closableOpt};
        var contentsOpt = {src:url};

        if( !contentsOpt.src || contentsOpt.src==""){
            alert('화면이 준비중입니다.');  						// 대체할 메세지 창??????
            return ;
        }
        var tabOptions = {
                label : tabOpt.label || "",
                openAction : tabOpt.openAction || "exist",  // 새창으로 열기. // exist/select/new
                closable : tabOpt.closable || true
            };

        /*
        try{
            $.each(gcm.tab_main.tabArr, function(idx, item) {
                if( item.userTabID == gcm.MENU_ID ) {
                    gcm.tab_main.deleteTab(idx);
                    tabOptions = {
                        label : tabOpt.label || "",
                        openAction : tabOpt.openAction || "new",
                        closable : tabOpt.closable || true
                    };
                    return false;
                }
            });
        } catch(e) {}
        */

        var contentsOptions = {
                frameMode : "wframe",
                wframe : true,
                scope: true,
                src : contentsOpt.src || ""
        };

        var tabID = gcm.tab_main.addTab(contentID, tabOptions, contentsOptions);
        var tabIndex = gcm.tab_main.getTabIndex( tabID );
        if( !gcm.tab_main.isLoaded( tabIndex ) ){
            gcm.tab_main.setSelectedTabIndex( tabIndex );
        }
        gcm.tab_main.setLabelText(tabIndex,tabOptions.label);
    }
    com.autoHeight();
};

com.closeScreen = function(){
    console.log("화면이 닫힙니다.");
    return true;
};

com.deleteAllTab = function(){
    var _13f=gcm.tab_main.getTabCount();
    for(var i=_13f-1;i>=3;i--){gcm.tab_main.deleteTab(i);}
    gcm.tab_main.setSelectedTabIndex(0);
};

/*
 *
 * .
 *  - detailOpen
 * @date 2019.03.26
 * @private
 * @memberOf
 * @param {String} title 문자열
 * @param {String} url 문자열
 * @param {Object} JSON형태의 데이터
 * @param {String[]} 개인화 및 화면 타이틀 배열
 * var _title = "탭 TITLE";//Tab의 label에서 보여질 title
 * var _id = "탭 ID";//Detail 탭으로 사용할 id
 * var _srcUrl = "/ux/cf/CF00000000U.xml"; //탭화면에 사용할 DetailPage xml 경로
 * var _data = {_data1:"전달할 데이터1",_data2:"전달할 데이터2",...};//JSON형태의 전달할 데이터
 * var _navi = new Array( "메뉴ID", "메뉴명", "메뉴경로명" )
 * com.detailSelf(_title,_srcUrl,_data);
*/
com.detailOpen = function(title, id, url, openOpt, data, navi){
	setTimeout(function(){
		com.detailOpenCall(title, id, url, openOpt, data, navi);
	}, 100);
};

com.detailOpenCall = function(title, id, url, openOpt, data, navi){
    if (typeof navi !== "undefined") {
        if (typeof navi == "string") {
            alert('메뉴관련 변수는 배열이어야 합니다.');
            return;
        }
        if (navi.length > 0) {
            if (navi.length != 3) {
                alert('화면 타이틀 관련 필수 값이 부족합니다.');
                return;
            }
            if (navi[0]== "") {
                alert('메뉴ID 값을 입력하세요.');
                return;
            }
            if (navi[1] == "") {
                alert('메뉴 명을 입력 하세요.');
                return;
            }
            if (navi[2] == "") {
                alert('메뉴 경로를 입력 하세요.');
                return;
            }
            gcm.MENU_ID = navi[0];
            gcm.MENU_TITLE = navi[1];
            gcm.MENU_URL = navi[2];
        }
    }

    if($w.isPopup()){
        openOpt = "1";
    }


    // 현재 탭을 다른 화면으로 로딩한다
    if ( openOpt == "1" ) {
        // 이미 열려있으면 삭제

        if($w.isPopup())
        {
            data.w2xPath = url;
            $w.url(url, {"param": data });
        }
        else
        {
            var tabIdx = gcm.tab_main.getTabIndex(id);
            if ( tabIdx > 0 ) {
                gcm.tab_main.deleteTab( tabIdx );
            }

            //페이지 전달시 data set..
            if(!com.isEmpty(data)){
                com.setParam(data);
            }
            var _locfr = gcm.tab_main.getFrame(gcm.tab_main.getSelectedTabIndex());
            _locfr.setSrc(url);
            var tabIndex = gcm.tab_main.getTabIndex( gcm.tab_main.getSelectedTabID() );
            if( !gcm.tab_main.isLoaded( tabIndex ) ){
                gcm.tab_main.setSelectedTabIndex( tabIndex );
            }
            gcm.tab_main.setLabelText(tabIndex,title);

        }

    // 새탭을 오픈한다.
    } else if ( openOpt == "2" ) {
        
        var closableOpt = url.indexOf("index") > -1? "false": "true";
        var contentID = id;
        var tabOpt  ={label:title,closable:closableOpt};
        var contentsOpt = {src:url};

        // 이미 열려있으면 삭제
        var tabIdx1 = gcm.tab_main.getSelectedTabIndex();
        var tabIdx2 = gcm.tab_main.getTabIndex(id);
        
        // 호출되는 화면이 이미 열려있는 경우
        if ( tabIdx2 > 0 ) {
        	 
            gcm.tab_main.deleteTab( tabIdx2 );
  
            // 호출되는 화면이 현재 화면보다 뒤에 있는 경우
            if ( tabIdx1 < tabIdx2 ) {
                tabIdx1 = tabIdx1 + 1;		// 새로 열릴 탭 위치는 현재탭 +1
            }
        } else {	// 호출되는 화면이 열려있지 않은 경우
            tabIdx1 = tabIdx1 + 1;		// 새로 열릴 탭 위치는 현재탭 +1
        }
        
        //페이지 전달시 data set..
        if(!com.isEmpty(data)){
            com.setParam(data);
        }

        if( !contentsOpt.src || contentsOpt.src==""){
            alert('화면이 준비중입니다.');  						// 대체할 메세지 창??????
            return ;
        }
        var tabOptions = {
                label : tabOpt.label || "",
                openAction : tabOpt.openAction || "exist",  // 새창으로 열기. // exist/select/new
                closable : tabOpt.closable || true,
                addTabIndex : tabIdx1						// 탭 생성위치 지정
            };
        var contentsOptions = {
                frameMode : "wframe",
                wframe : true,
                scope: true,
                src : contentsOpt.src || ""
        };

        var tabID = gcm.tab_main.addTab(contentID, tabOptions, contentsOptions);
        var tabIndex = gcm.tab_main.getTabIndex( tabID );
        //console.log('tab isLoaded =========>', tabID, tab_main.isLoaded( tabIndex ));
        if( !gcm.tab_main.isLoaded( tabIndex ) ){
            gcm.tab_main.setSelectedTabIndex( tabIndex );
        }
        gcm.tab_main.setLabelText(tabIndex,tabOptions.label);
    } else if ( openOpt == "3" ) {
        var popOps = {
                popup_name : title
               ,type : "browser"
               ,modal : false //true || false
               ,url : url
               ,data :  data
               ,width : "1366"
               ,height : "768"
               ,callbackFn:"scwin.fnPopupCallback"
        };

        com.popup_open(popOps);
    }
};

/*
 * 부모페이지로부터 전달받은 데이터를 전달한다.
 *
 * @date 2019.03.11
 * @private
 * @memberOf
 * @param {String} key 문자열 찾을 키값
 * @param {String} isDel boolean 읽으면서 삭제하기 설정 ://default : true,
 *
 *
 * */
com.getDetailTabData = function(key,isDel){
    var _rtn = com.getPageData(key);
    var _isDel = com.isEmpty(isDel)? true :isDel;
    if(_isDel){
        com.removePageData(key);
    }
    return _rtn;
};

/*
 * 부모페이지로부터 전달받은 데이터를 전달한다.
 *
 * @date 2019.03.26
 * @private
 * @memberOf
 * @param {String} key 문자열 찾을 키값
 *
 * */
com.getParam = function(_key){
    return WebSquare.net.getParameter(_key);
};

/*
 * 부모페이지로부터 전달받은 JSON 데이터를 전달한다.
 *
 * @date 2019.03.28
 * @private
 * @memberOf
 * @param 전달 받은 JSON DATA전체
 *
 * */
com.getAllParam = function(){
    // 전체 파라미터 호출
    var param = WebSquare.net.getAllParameter();

    // 현재 메뉴아이디로 저장되어 있는 값이 있을 경우 그것을 호출한다.
    if( param["menuId_" + gcm.MENU_ID] != undefined ) {
        return JSON.parse(param["menuId_" + gcm.MENU_ID]);
    } else {
        return param;
    }
};

/*
 * 현재 메뉴에서 전달받은 JSON 데이터를 가져온다.
 *
 * @date 2019.03.28
 * @private
 * @memberOf
 * @param 메뉴에서 전달 받은 JSON DATA전체
 *
 * */
com.getMenuParam = function(){
    var object = WebSquare.net.getParameter('menuId_' + gcm.MENU_ID);
    return JSON.parse(object);
};

/*
 * 다음 페이지로전달 할 데이터를 셋팅한다.
 *
 * @date 2019.03.26
 * @private
 * @memberOf
 * @param {Object} data값
 *
 * */
com.setParam = function(data){

    // 전체 파라미터 호출
    var param = WebSquare.net.getAllParameter();

    // 전체 파라미터에서 menuId로 저장되어있는 값 추출하여 newParam에 저장
    var newParam = {};
    $.each(param, function(key, paramdata) {
        if( key.match("^menuId") ){
            // 메뉴닫기로 들어왔을 경우에는 해당 메뉴 파라미터는 제외시킨다
            if( $.type(data) === "string" && data != "" ) {
                if( data.match("^MNU") ) {
                    if( key != 'menuId_'+data ) {
                        newParam[key] = paramdata;
                    }
                }
            } else {
                newParam[key] = paramdata;
            }
            //console.log(key + "==========>>>>>>>>" + newParam[key]);
        }
    });

    // 저장된 파라미터 초기화
    WebSquare.net.paramObj = {};

    // 생성된 파라미터 저장
    if( $.type(data) === "string" ) {
        //if( data == "" || Object.keys(newParam).length == 0 ){
            //WebSquare.net._setParameter("");
        //} else {
            WebSquare.net._setParameter(newParam);
        //}
    } else {
        newParam['menuId_' + gcm.MENU_ID] = JSON.stringify(data); // 현재메뉴저장
        $.extend(data, newParam); // newParam을 data에 합치기
        WebSquare.net._setParameter(data);
    }
};

/*
 * Detail 화면이 닫힐때 호출됩니다.
 * */
com.closeDetailScreen = function(){
    console.log("Detail 화면이 닫힙니다.");
    return true;
};

/**
 * Object 의 빈값 여부를 반환 한다. null, undefined, '', {}, [] 일때 true
 *
 * @memberOf com
 * @param {Object:Y}
 *            obj
 * @return {boolean}
 * @example com.isEmpty({"foo":"bar"});
 */
com.isEmpty = function(obj) {

    if (obj == null || !obj)
        return true;
    if (typeof obj === 'number' || typeof obj === 'boolean')
        return false;
    if ((obj === '') || (obj === 'null'))
        return true;
    if (WebSquare.util.isArray(obj) && obj.length == 0)
        return true;
    return $.isEmptyObject(obj);
};

com.getFrameId = function() {
    return $p.getFrameId();
};




/**
 * 데이터객체 동적 생성
 *
 * @memberOf com
 * @param {String}
 *            dataType "dataList" || "dataMap"
 * @param {String}
 *            id 데이터객체에 부여할 id
 * @param {Array}
 *            columnArr column배열 정보
 * @example //List 타입의 데이터[=DataList] //CASE 1. id만 지정하는경우 var columnArr_id =
 *          ["key","code","codeName"];
 *          com.createDataObj("dataList","dlt_sample",columnArr_id); //CASE 2.
 *          id와 name정보를 지정하는경우 var columnArr_idname =
 *          [["key","키값"],["code","코드값"],["codeName","코드네임값"]];
 *          com.createDataObj("dataList","dlt_sample",columnArr_idname);
 *
 *
 * //Map 타입의 데이터[=DataMap] //CASE 1. id만 지정하는경우 var columnArr =
 * ["key","code","codeName"];
 * com.createDataObj("dataMap","dma_sample",columnArr); //CASE 2. id와 name정보를
 * 지정하는경우 var columnArr_idname =
 * [["key","키값"],["code","코드값"],["codeName","코드네임값"]];
 * com.createDataObj("dataMap","dma_sample",columnArr_idname);
 *
 */
com.createDataObj = function(type, id, columnArr) {
    var dataStr = "";
    if (typeof $w.data[id] !== 'undefined')
        $w.data.remove(id);
    var dl_op = {
        dataMap : [ "Map", "key" ],
        dataList : [ "List", "column" ]
    };
    var t = dl_op[type];
    dataStr += "<w2:data" + t[0] + " id=\"" + id + "\"><w2:" + t[1] + "Info>";
    for (var i = 0; i < columnArr.length; i++) {
        if (typeof columnArr[i] == "string") {// id로만 들어온경우로 판단함
            dataStr += "<w2:" + t[1] + " id=\"" + columnArr[i]
                    + "\" dataType=\"text\" />";
        } else {// object형태로 들어옴{id:"",name:""}==> ["",""]//[0]:id,[1]:name으로 변경
            dataStr += "<w2:" + t[1] + " id=\"" + columnArr[i][0]
                    + "\" name=\"" + columnArr[i][1]
                    + "\" dataType=\"text\" />";
        }
    }

    dataStr += "</w2:" + t[1] + "Info></w2:data" + t[0] + ">";
    $w.data.create(dataStr);
};


/**
* [일반] 마이 메뉴 목록 정보 조회
*
* com.setMyMenu(gcm.CD_KEY["Menu"])
*
*/
com.setMyMenu = function(_key){
    com.createDataObj("dataMap", "dsMenu", [ "userId" ,"etc" ]);
    var _dmObj = $w.getComponentById("dsMenu");
    _dmObj.set("userId", "");
    ajaxLib.ajax("/cf/CFCommon/selectTcfMenuMngList", {
        mode : "asynchronous"
    , requestData : _dmObj.getJSON()
    , callback : "com.setMyMenuGlobalCb"
    , errCallback : "com.setMyMenuGlobalErr"
    });
    return false;
};

com.setMyMenuGlobalCb = function(res,e){
    var _objList = res.data.tcfMenuMngList;
    gcm.MENU_LIST = JSON.stringify(_objList)||[];

    if(gcm.tab_main != undefined){
        var indexTabObj = gcm.tab_main.scope_obj.getObj("scwin");

        if (typeof(indexTabObj["fnSetMenuGenertor"]) == "function"){
            indexTabObj["fnSetMenuGenertor"]();
        }

        if (typeof(indexTabObj["fnSetMenu"]) == "function"){
            indexTabObj["fnSetMenu"]();
        }
    }
};

com.setMyMenuGlobalErr = function(){

};

com.udc6Time = function(val) {

    var strRtn = val;
    var strLen = strRtn.length;

    if (strLen == 1 ){
        strRtn = com.lpad(strRtn, 2, "0");
        strRtn = com.rpad(strRtn, 6, "0");
    }else if (strLen >= 2 ){
        strRtn = com.rpad(strRtn, 6, "0");
    }

    var hh,mm,ss;
    hh = strRtn.substring(0,2);
    mm = strRtn.substring(2,4);
    ss = strRtn.substring(4,6);

    if (hh < "00" || hh > "23"){
        return  "9999";
    }
    if (mm < "00" || mm > "59"){
        return  "9999";
    }
    if (ss < "00" || ss > "59"){
        return  "9999";
    }

    return  strRtn;
};


com.udc4Time = function(val) {

    var strRtn = val;
    var strLen = strRtn.length;

    if (strLen == 1 ){
        strRtn = com.lpad(strRtn, 2, "0");
        strRtn = com.rpad(strRtn, 4, "0");
    }else if (strLen >= 2 ){
        strRtn = com.rpad(strRtn, 4, "0");
    }

    var hh,mm;
    hh = strRtn.substring(0,2);
    mm = strRtn.substring(2,4);

    if (hh < "00" || hh > "23"){
        return  "9999";
    }
    if (mm < "00" || mm > "59"){
        return  "9999";
    }

    return  strRtn;
};


/**
 * 문자열이 지정 길이 보다 적으면 앞에 특정 문자열을 넣음
 * var : 비교할 문자열
 * len : 문자열 길이
 * ch : 추가할 문자열
 */
com.lpad = function lpad(val, len, ch) {
    var strlen = val.toString().trim().length;
    var ret = "";
    var alen = len - strlen;
    var astr = "";
    for (var i = 0; i < alen; ++i) {
        astr = astr + ch;
    }
    ret = astr + val.toString().trim();
    return ret;
};


/**
 * 문자열이 지정 길이 보다 적으면 뒤에 특정 문자열을 넣음
 * var : 비교할 문자열
 * len : 문자열 길이
 * ch : 추가할 문자열
 */
com.rpad = function lpad(val, len, ch) {
    var strlen = val.toString().trim().length;
    var ret = "";
    var alen = len - strlen;
    var astr = "";
    for (var i = 0; i < alen; ++i) {
        astr = astr + ch;
    }
    ret = val.toString().trim() + astr;
    return ret;
};


/**
 * idDate : 날짜를 체크하는 함수
 * sDate  : 날짜값
 */
com.isDate = function lpad(sDate) {

    sDate = sDate.replaceAll(".", "");
    sDate = sDate.replaceAll("/", "");
    if( sDate == "99991231" ) return true;

    return valLib.checkDate(sDate, false);
};
/**
 * isYearMonth : 년월을 체크하는 함수
 * sYYYYMM     : 년월값
 */
com.isYearMonth = function lpad(sYYYYMM) {

    sYYYYMM = sYYYYMM.replaceAll(".", "");
    sYYYYMM = sYYYYMM.replaceAll("/", "");
    sYYYYMM = sYYYYMM+"01";
    return valLib.checkDate(sYYYYMM, false);
};

com.addTab = function( contentID, tabOpt, contentsOpt){
    if( !contentsOpt.src || contentsOpt.src==""){
        alert('화면이 준비중입니다.');  						// 대체할 메세지 창??????
        return ;
    }

    var tabOptions = {
            label : tabOpt.label || "",
            openAction : tabOpt.openAction || "exist",  // 새창으로 열기. // exist/select/new
            closable : tabOpt.closable || true
        };
    var contentsOptions = {
            frameMode : "wframe",
            wframe : true,
            scope: true,
            src : contentsOpt.src || ""
    };

    var tabID = gcm.tab_main.addTab(contentID, tabOptions, contentsOptions);
    var tabIndex = gcm.tab_main.getTabIndex( tabID );
    //console.log('tab isLoaded =========>', tabID, tab_main.isLoaded( tabIndex ));
    if( !gcm.tab_main.isLoaded( tabIndex ) ){
        gcm.tab_main.setSelectedTabIndex( tabIndex );
    }


};

/**
* [일반] 메세지 전체 정보 조회
*
* com.setMsgInfo(gcm.CD_KEY["Menu"])
*
*/
com.setMsgInfo = function(_key){
    com.createDataObj("dataMap", "dsMsgInfo", [ "cd" ,"etc"]);
    var _dmObj = $w.getComponentById("dsMsgInfo");
    _dmObj.set("userId", "");
    ajaxLib.ajax("/cf/CFCommon/selectTcfMsgInfoList", {
        mode : "synchronous"
    , requestData : _dmObj.getJSON()
    , callback : "com.setMsgInfoGlobalCb"
    , errCallback : "com.setMsgInfoGlobalErr"
    });
    return false;
};

com.setMsgInfoGlobalCb = function(res,e){
    var _compInfo = JSON.parse(e.requestBody);
    var _infoArr = _compInfo.etc.split(":");
    var _compId = _infoArr[0];
    var _dataComp = $w.getComponentById(_compId);
    gcm.MSG_INFO_LIST = JSON.stringify(res.data.tcfMsgInfoList);
    _dataComp.setJSON(res.data.tcfMsgInfoList);
};

com.setMsgInfoGlobalErr = function(){

};

/**
 * 메세지 창을 호출한다.
 * messageCd : 메세지코드
 * srt1 : 변경할 문자열1
 * srt2 : 변경할 문자열2
 * srt3 : 변경할 문자열3
 * focusId : focus로 이동할 focusId
 */
com.showMessage = function(messageCd, str1, str2, str3, focusId, row, col){

    var msgCd = messageCd;

    if (com.isEmpty(gcm.MSG_INFO_LIST)) {
        com.setMsgInfo(gcm.CD_KEY["Msg"]);
    }

    var msgInfoList = gcm.MSG_INFO_LIST;

    var msgCn       = "";
    var msgTypeCd   = "";
    var title       = "";
    var msgTypeCdS   = ""; // Session에서 DB값 조회

    if (msgInfoList == null || msgInfoList == "underfined" || msgInfoList == "") {
        if (msgCd == '500') {
            msgCn = '시스템 오류 입니다.';
        }
    } else {
        var msgList = JSON.parse(msgInfoList);
        msgCn = com.sessionTcfMsgSearch(msgList, msgCd, "", "");
        if ( typeof msgCn == "undefined" || msgCn == '') {
            if (msgCd == '500') {
                msgCn = '시스템 오류 입니다.';
            }
        }else{

            if( strLib.isEmpty(str1) ){
                msgCn = msgCn.replace("$1", "");
            }else{
                msgCn = msgCn.replace("$1", str1);
            }

            if( strLib.isEmpty(str2) ){
                msgCn = msgCn.replace("$2", "");
            }else{
                msgCn = msgCn.replace("$2", str2);
            }

            if( strLib.isEmpty(str3) ){
                msgCn = msgCn.replace("$3", "");
            }else{
                msgCn = msgCn.replace("$3", str3);
            }

        }
    }

    if ( messageCd.length > 3 ){
    	msgTypeCdS = com.sessionTcfMsgTypeCdSearch (msgList, msgCd, "", "");
   
        if ( msgTypeCdS == 'CF036A' ){		msgTypeCd = 'A';	}
        else if ( msgTypeCdS == 'CF036E' ){		msgTypeCd = 'E';	}
        else if ( msgTypeCdS == 'CF036I' ){		msgTypeCd = 'I';	}
        else if ( msgTypeCdS == 'CF036N' ){		msgTypeCd = 'N';	}
        else if ( msgTypeCdS == 'CF036W' ){		msgTypeCd = 'W';	}
        // msgTypeCd = messageCd.substring(2, 3);     
    }else{
        msgTypeCd = 'E';
    }

    if ( msgTypeCd == 'A' ){		title = '조치';	}
    else if ( msgTypeCd == 'E' ){		title = '오류';	}
    else if ( msgTypeCd == 'I' ){		title = '정보';	}
    else if ( msgTypeCd == 'N' ){		title = '정상';	}
    else if ( msgTypeCd == 'W' ){		title = '경고';	}

    var popOps = {
        popup_name:  title
                       ,url:"/ux/common/showMessage.xml"
                       ,data :  { msgCd : msgCd
                                , msgCn : msgCn
                                , msgTypeCd : msgTypeCd
                                , focusId : focusId
                                 }
                    ,wType:"M"
                    //,width:"400"
                       ,height:"290"
        };
        if (!strLib.isEmpty(focusId)){
            gcm.focusId =focusId;
            var _comp = $w.getComponentById(gcm.focusId);//.focus();
            if(_comp.getPluginName() == "gridView"){
                //검증
                if (strLib.isEmpty(row)){
                    alert("FocusRow가 존재하지 않습니다.");
                    return ;
                }
                if (strLib.isEmpty(col)){
                    alert("FocusCol가 존재하지 않습니다.");
                    return ;
                }
                gcm.focusRow = row;
                gcm.focusCol = col;
            }
            popOps.callbackFn = "com.callBackFocus";
        }
        com.popup_open(popOps);
        //$('.w2window').addClass('alert');
};

com.callBackFocus = function(){
    var _comp = $w.getComponentById(gcm.focusId);

    if(_comp.getPluginName() == "gridView"){
        _comp.setFocusedCell(gcm.focusRow, gcm.focusCol, true);
    }else{
        _comp.focus();
    }
};

/**
 * 주민등록번호 유효성 체크 결과를 반환한다.
 * icNum : 주민등록번호
 * return : true, false
 */
com.chkIcNo = function( icNum ){

    // 테스트 편의를 위한 임시 999999-8888888
    if ( icNum == "9999998888888" ){
        return true;
    }

    var checkID = new Array(2,3,4,5,6,7,8,9,2,3,4,5);
    var i = 0, sum = 0;
    var temp = 0;
    var yy = "";

    if(icNum.length != 13) {
        return false;
    }
    for(i=0;i<13;i++) {
        if(icNum.charAt(i)<'0' || icNum.charAt(i)>'9') {
            return false;
        }
    }

    //foreigner PersonID Pass
    if (icNum.substring(6,13) == "5000000" || icNum.substring(6,13) == "6000000"
    || icNum.substring(6,13) == "7000000" || icNum.substring(6,13) == "8000000") {
        return true;
    }

    for(i=0;i<12;i++){
        sum += icNum.charAt(i) * checkID[i];
    }

    temp = sum - Math.floor(sum/11)*11;
    temp = 11 - temp;
    temp = temp - Math.floor(temp/10)*10;

    // 나이 (-) 체크
    if( icNum.charAt(6) == '1' || icNum.charAt(6) == '2' || icNum.charAt(6) == '5' || icNum.charAt(6) == '6' ) {
        yy = "19";
    } else {
        yy = "20";
    }

    if( parseInt(com.getCurrentYear()) - parseInt(yy + icNum.substring(0,2) ) < 0 ) {
        return false;
    }

    //외국인 주민번호 체크로직 추가
    if( icNum.charAt(6) != '5' && icNum.charAt(6) != '6' && icNum.charAt(6) != '7' && icNum.charAt(6)!= '8' ) {
        if( temp==eval(icNum.charAt(12)) ) {
            return true;
        } else {
            return false;
        }
    } else {
        if( (temp + 2)%10 == eval(icNum.charAt(12)) ) {
            return true;
        } else {
            return false;
        }
    }
    return false;

};

/**
 * 사업자번호 유효성 체크 결과를 반환한다.
 * bizNum : 사업자번호
 * return : true, false
 */
com.chkBizNo = function( bizNum ){

    // 테스트 편의를 위한 임시 999-88-77777
    if ( bizNum == "9998877777" ){
        return true;
    }

    var sum = 0;
    var aBizID =new Array(10);
    var checkID =new Array("1","3","7","1","3","7","1","3","5");

    for (var i=0;i<10;i++){
        aBizID[i] = bizNum.substring(i,i+1);
    }
    for (var i=0;i<9;i++){
        sum += aBizID[i]*checkID[i];
    }

    sum = sum + parseInt((aBizID[8]*5)/10) ;
    var temp = sum%10;
    var temp1 = 0;

    if( temp != 0 ) {
        temp1 = 10 - temp;
    } else {
        temp1 = 0;
    }

    if( temp1 != aBizID[9] ) {
        return false;
    }
    return true;

};

/**
 * 법인번호 유효성 체크 결과를 반환한다.
 * corpNum : 법인번호
 * return : true, false
 */
com.chkCorpNo = function( corpNum ){
	
    // 테스트 편의를 위한 임시 999999-8888888  
    //  한경기전 체크로직오류로  임시로 추가  , 모래내서중양대시장정비사업 추가 (by shryu1 2019-10-22)  , 국진건설 추가   , 주식회사 연수종합건설(2201110031950) 추가 ,(주)케이디파워 추가(1101110727595)    , 서정건설추가(1756110003469)
    if ( corpNum == "9999998888888" || corpNum == "1101110414031"  || corpNum =="1145710008002" || corpNum =="1154110015609" || corpNum =="1342110043465" || corpNum =="2201110031950" || corpNum =="1101110727595"  || corpNum =="1756110003469" ){
        return true; 
    }
// console.log("corpNum=={}",corpNum);
    var checkID = new Array(1,2,1,2,1,2,1,2,1,2,1,2);
    var sCorpNo = corpNum;

    var lV1 = 0;
    var nV2 = 0;
    var nV3 = 0;

    for( var i=0 ; i<12 ; i++ ) {
        lV1 = parseInt(sCorpNo.substring(i, i+1)) * checkID[i];

        if(lV1 >= 10) {
            nV2 += lV1 % 10;
        } else {
            nV2 += lV1;
        }
    }
//    console.log("nV2=={}",nV2);
    nV3 = nV2 % 10;
//    console.log("nV3=={}",nV3);
    if( nV3 > 0 ) {
        nV3 = 10 - nV3;
    } else {
        nV3 = 0;
    }
//    console.log("check  nV3=={}",nV3);
//    console.log("sCorpNo.substring(12,13)=={}",sCorpNo.substring(12,13));
    if( sCorpNo.substring(12,13) != nV3) {
        return false;
    }
    return true;

};


/**
 * 모듈별 페이지에서 사용할 전역데이터를 설정한다.
 * @memberOf com
 * @param {String}module
 *            저장할 문자열 모듈값
 * @param {String}key
 *            저장할 문자열 키값
 * @param {Object}options
 *            저장할 데이터 object
 * @example var opt = {};
 * com.setMdData("CF",key,opt);
 *
 * */
com.setMdData = function(module, key, obj) {
    if (com.isEmpty(module) || com.isEmpty(key) || com.isEmpty(obj)) {
        return;
    }
    var _key = module + key;
    com.setSessionData(_key, obj);
};


/**
 * 모듈별 페이지에서 지정한 전역데이터를 반환한다.
 * @memberOf com
 * @param {String}module
 *            저장된 문자열 모듈값
 * @param {String}key
 *            저장된 문자열 키값
 * @example
 *
 * var _data = com.getMdData("CF",key);
 *
 * */
com.getMdData = function(module, key) {
    if (com.isEmpty(module) || com.isEmpty(key)) {
        return;
    }
    var _key = module + key;
    return com.getSessionData(_key);
};

/**
 * 모듈별 페이지에서 지정한 전역데이터를 제거한다.
 * @memberOf com
 * @param {String}module
 *            저장된 문자열 모듈값
 * @param {String}key
 *            저장된 문자열 키값
 * @example
 *
 * var _data = com.getMdData("CF",key);
 *
 * */
com.removeMdData = function(module, key) {
    if (com.isEmpty(module) || com.isEmpty(key)) {
        return;
    }
    var _key = module + key;
    return com.removeSessionData(_key);
};


/**
 * 전역에 사용할 데이터를 저장한다.[use sessionStorage]
 *
 * @memberOf com
 * @param {String}key
 *            저장할 문자열 키값
 * @param {Object}options
 *            저장할 데이터 object
 * @example var opt = {};
 * com.setSessionData(key,opt);
 */
com.setSessionData = function(key, obj) {
    if (com.isEmpty(key) || com.isEmpty(obj)) {
        //alert("[common.js][com.setSessionData] 저장하실 데이터를 입력하십시오! key ["+key+"], obj ["+obj+"]");
        return;
    }
    sessionStorage.setItem(key, JSON.stringify(obj));
};

/**
 * 특정 데이터를 삭제한다.
 *
 * @memberOf com
 * @param {String}key
 *            저장할 문자열 키값
 *
 * @example var key = "";
 * com.removeSessionData(key);
 */
com.removeSessionData = function(key) {
    if (com.isEmpty(key) ) {
        alert("[common.js][com.removeSessionData] 삭제하실 데이터를 입력하십시오");
        return;
    }
    sessionStorage.removeItem(key);
};



/**
 * 전역에 사용할 데이터를 호출한다.[use sessionStorage]
 *
 * @memberOf com
 * @param {String}key
 *            저장한 문자열 키값
 * @example var options = {}; com.getSessionData(key);
 */
com.getSessionData = function(key) {
    var storageObject = {};
    try {
        storageObject = JSON.parse(sessionStorage.getItem(key), "{}");
    } catch (e) {
        storageObject = {};
    }
    return storageObject;
};




/**
 * 전역에 사용할 데이터를 저장한다.
 *
 * @memberOf com
 * @param {String}key
 *            저장할 문자열 키값
 * @param {Object}options
 *            저장할 데이터 object
 * @example var options = {}; com.setPageData(key,options);
 */
com.setPageData = function(key, obj) {
    if (com.isEmpty(key) || com.isEmpty(obj)) {
        alert("[common.js][com.setPageData] 저장하실 데이터를 입력하십시오");
        return;
    }
    WebSquare.localStorage.setItem(key, JSON.stringify(obj));
};

/**
 * 전역에 사용할 데이터를 호출한다.
 *
 * @memberOf com
 * @param {String}
 *            key 호출할 키값
 * @example var options = {}; com.getPageData(key);
 */
com.getPageData = function(key) {
    var storageObject = {};
    try {
        storageObject = JSON.parse(WebSquare.localStorage.getItem(key), "{}");
    } catch (e) {
        storageObject = {};
    }
    return storageObject;
};

/**
 * 전역에 사용한 데이터를 제거한다.
 *
 * @memberOf com
 * @param {String}
 *            key 제거할 키값
 * @example var options = {}; com.removePageData(key);
 */
com.removePageData = function(key) {
    try {
        WebSquare.localStorage.removeItem(key);
    } catch (e) {
    console.log("com.removePageData error");
    }
};

/**
 * 페이지 이동 또는 탭 생성 또는 xml 호출시 필수적으로 token 검사를 해야 한다.
 *
 * @memberOf com
 * @param {String}
 *            _callBack 성공 후 호출 함수 이름
 *            _errCallBack 에러 후 호출 함수 이름
 * @example var options = {}; com.getPageData(key);
 */
com.tokenCheck = function(_callBack, _errCallBack) {
    ajaxLib.ajax("/cf/CFCommon/tokenValidCheck", {
        mode : "synchronous"
        , requestData : ""
        , callback : _callBack
        , errCallback : _errCallBack
    });
};



com.getCurrentYear = function(){

    var today = new Date();
    var year  = today.getFullYear();

    return year;
};

com.getCurrentMonth = function(){

    var today = new Date();
    var month = today.getMonth();

    month = com.lpad(month, 2, "0");

    return month;
};

com.getCurrentDay = function(){

    var today = new Date();
    var day   = today.getDate();

    day = com.lpad(day, 2, "0");

    return day;
};
com.getCurrentDate = function(){

    var sDate = "";
    var today = new Date();
    var year  = today.getFullYear();
    var month = today.getMonth();
    var day   = today.getDate();

    month = com.lpad(month, 2, "0");
    day   = com.lpad(day, 2, "0");

    sDate = year+""+month+""+day;

    return sDate;
};

com.chkDec3d2 = function(val){
// TEST중......
    var iSize = 3;
    var fSize = 2;

    var nGb;
    var rtn

    val = val.replace("-", "");             // replaceAll을 사용하면 여러개 제거됨.
    nGb = val.toString().split(".");

    //alert(nGb[0] + "/"+ nGb[1]);

    if (typeof nGb[0] !== "undefined"){
        if ( com.isNumStr(nGb[0]) && nGb[0].length > iSize ){
            nGb[0] = nGb[0].substring(0, iSize);
            rtn = nGb[0];
        }
    }
    //alert("1:"+rtn);
    if (typeof nGb[1] !== "undefined"){
        if ( com.isNumStr(nGb[1]) && nGb[1].length > fSize ){
            nGb[1] = nGb[1].substring(0, fSize);
            rtn = rtn + "." + nGb[1];
        }
    }
    //alert("2:"+rtn);
    return rtn;
}
com.chkDecDigit = function(val, intSize, fracSize){

    var iSize = intSize;
    var fSize = fracSize;

    var nGb;

    val = val.replace("-", "");             // replaceAll을 사용하면 여러개 제거됨.
    nGb = val.toString().split(".");

    if ( !com.isNumStr(nGb[0]) || nGb[0].length > iSize ){
        return false;
    }
    if ( !com.isNumStr(nGb[1]) || nGb[1].length > fSize){
        return false;
    }

    return true;
}

com.isNumStr = function(sValue) {

    if (com.isEmpty(sValue)){
        return false;
    }

    return /^[0-9+]*$/.test(sValue);
};

com.phoneFormat = function(str) {

    var delimeter1 = "-";
    var delimeter2 = "-";

    var firstDelimeterPos = 3;
    var maxLength = 11 + delimeter1.length + delimeter2.length;

    if( str.indexOf("02") == 0 ) {
        firstDelimeterPos -= 1;
        maxLength -= 1;
    }

    // limit max length
    if( str.length > maxLength ) {
        str = str.substr(0, maxLength);
    }

    // remove delimeter
    var regExp = new RegExp("[0-9]*", 'g');
    var result = (str + "").match(regExp);
    str = result.join("");

    // 1588-1588, 0506-1234-1234
    if ( str.length == 8 || str.length == 12 ){
        firstDelimeterPos = 4;
    }

    // 1st delimeter
    if( str.length > firstDelimeterPos ) {
        str = str.substr(0, firstDelimeterPos) + delimeter1 + str.substr(firstDelimeterPos, str.length);
    }

    // 2nd delimeter
    if( str.length > firstDelimeterPos + delimeter1.length + 4 ) {
        str = str.substr(0, str.length-4) + delimeter2 + str.substr(str.length-4, str.length);
    }

    return str;

};
/** pagelist 관련 start **/
/*
 * PageList Object 를 자동으로 setting 합니다.
 * 방법 :
 *  1. step before(사전준비)
 *   - 각 pageList의 Property 에
 *    userData1 : svc_id( 해당 페이지 리스트와 관련있는 ajax의 svcId )
 *    userData2 : callback( 해당페이지 리스트 클릭후 처리할 callback. argument로 현재선택되어있는 index값이
 * 반환됩니다. )
 *
 * step 1 : PageList Object 가 있는 화면에서 scwin.onpageload상단에 com.pageListObj.init()을
 * 입력합니다.
 *
 * step 2 : 조회 완료 후 (대체로 ajax callback) 이벤트 함수에서
 *   var paramObj = {
 *                   max:"100" --> 페이지의 총 Count를 입력합니다. [필수]
 *                   ,svcId:"logInTcfUserInfo" --> 해당서비스 id 고정[필수] 이부분은 그대로 사용합니다.
 *                   ,current:1--> 페이지리스트에서 특정 페이지로 고정을 위해(상세->목록 등) 필요한 값 default 는 1이다
 *                   };
 * com.pageListObj.max(paramObj);//--> 페이지리스트에 최대 페이지를 설정하며 현재 페이지의 index값을 반환합니다.
 *
 * info 1 : pageList 의 userData2에 등록된 callback은 해당 pageList가 클릭되었을때 call하며 선택된
 * index값을 argument로 전달합니다. 대체로 pageList를 클릭한후 바로 조회를 할수있도록 처리하므로 조회와 관련된
 * function 을 입력하여 활용하시면 되겠습니다.
 *
 */

com.pageListObj = {
    isPageListEvent : false,
    pageInfoSimpleArr : new Array(),
    init : function() {

        var objList = this.findObjArr("pageList");
        if (objList.length <= 0) {
            delete (com.pageListObj);
            return;
        }
        this.pageInfoSimpleArr = [];

        for ( var i = 0; i < objList.length; i++) {
            var a = objList[i];
            // 페이지 리스트의 간단정보
            var listSimpleInfo = {
                page_Id : a.id,
                svc_Id : a.options.userData1,
                callBack : a.options.userData2
            }
            this.pageInfoSimpleArr.push(listSimpleInfo);
            a.bind("onviewchange", this.chkEvent);// 페이지 리스트에 클릭 등록--> 최초
                                                    // 진입시점에 init한다.
        }
    },

    findObjArr : function(id) {
        // 해당 하는 component의 id를 array형태로 반환한다.

        var cp = $w.comp;//전체 component
        var compArr = new Array();
        for ( var attr in cp) {
            var obj = cp[attr];
            for ( var attr1 in obj) {
                if (attr1 == "_wTagName") {
                    if (obj[attr1] == id) {
                        //내페이지의 pageList를 담는다.
                        if(obj.id.indexOf($p.id) > -1){
                            compArr.push(obj);
                        }
                    }
                }
            }
        }
        return compArr;
    },
    chkEvent : function() {// 해당 페이지 리스트 클릭시 발생합니다.
        com.pageListObj.isPageListEvent = true;
        WebSquare.util.getGlobalFunction($p.id + this.options.userData2)(
                arguments[0].newSelectedIndex);
    },
    max : function(obj) {// submit done에서 호출....
        // for (var pl of this.pageInfoSimpleArr){
        for ( var i = 0; i < this.pageInfoSimpleArr.length; i++) {
            var pl = this.pageInfoSimpleArr[i];
            var svc_id = com.isEmpty(obj.svcId) ? "nullId" : obj.svcId;

            if (pl.svc_Id == svc_id) {
                var comp = $w.comp[pl.page_Id];
                if (!com.pageListObj.isPageListEvent) {
                    // pageList click이 아닌경우// 조회완료 후
                    comp.setCount(obj.max);
                    var i_current = 1;
                    if( obj.current != undefined ) {
                        i_current = obj.current;
                    }
                    comp.setSelectedIndex(i_current);
                    return 1;
                } else {
                    // pageList click인 경우
                    com.pageListObj.isPageListEvent = false;
                    return comp.selectedIndex;
                }
            }
        }
    }
};

/** pagelist 관련 finish **/
/**
inputType중 소숫점이하 자릿수를 체크하여 ceil,round,floor
기능을 제공한다.

key 구조

C : CEIL  // 올림
R : ROUND // 근처의 정수형 숫자로 반환한다
F : FLOOR // 내림

C/R/F + 소숫점이하를 적용할 숫자:

ex) C2 : 소숫점 둘째자리 이하에서 올림
    R2 : 소숫점 둘째자리 이하에서 4이하 내림 5이상 올림
    F2 : 소숫점 둘째자리 이하에서 내림

var IptInfoArr = [
                    {//소숫점 세째자리 이하에서 올림을 적용할 inputBox들
                    C3 : ["ipt1","ipt2","ipt3",,"grd_gridView1:col1|col3"...]
                    },{//소숫점 둘째자리 이하에서 올리거나 내림을 적용할 inputBox들
                    R2 : ["ipt4","ipt5","ipt6",...]
                    },{//소숫점 넷째자리 이하에서 내림을 적용할 inputBox들
                    F4 : ["ipt7","ipt8","ipt9",...]
                    }
                 ];
 com.transFormatter(IptInfoArr);
**/
com.transFormatter = function(IptInfoArr){
 var orderString = "";
 var order = "";//명령
 var pos = "";//위치
 var colId = "";//columnId
    $.each(IptInfoArr,function(key,_data){
        $.each(_data,function(_order,_iptArr){
            orderString = _order;
            order = orderString.substring(0,1);//명령
            pos = orderString.substring(1);//위치
            $.each(_iptArr,function(_idx,_compId){//inputComponent 처리
                   var _c = _compId.split(":");
                var _comp = $p.getComponentById(_c[0]);
                var _compType = _comp.getPluginName();

                if( _compType == "input"){
                    //input type
                    _comp.setDisplayFormatter("com.formatComma");
                    _comp.setDataType("number");
                    _comp.setAllowChar("0-9.");
                    _comp.setUserData("pos",pos);
                    _comp.setUserData("order",order);
                    //change Event
                    _comp.addEvent("onchange",function(){
                    var sValue = this.getValue();
                    var _pos = this.getUserData("pos");
                    var _order = this.getUserData("order");

                    //this.options.displayFormatter = "com.formatComma";
                    var parts = sValue.toString().split(".");
                    //소수부
                    var r1 = parts[1].substring(0,_pos);
                    var r2 = parts[1].substring(_pos,_pos+1);
                    var nVal = r1 +"."+r2;
                     switch(_order){//pos
                        case "C":
                        nVal = Math.ceil(nVal);
                            break;
                        case "R":
                        nVal = Math.round(nVal);
                            break;
                        case "F":
                        nVal = Math.floor(nVal);
                            break;
                            default :  nVal="0";
                        }
                        parts[1] = nVal + "";
                       this.setValue(parts.join("."));
                    });
                }else if (_compType == "gridView"){
                //그리드 뷰
                    colId = _c[1].split("|");
                    $.each(colId,function(key,col){
                        var _userData = pos + "^^" + order + "^^" + col;
                        _comp.setColumnDisplayFormatter(col,"com.formatComma");
                        _comp.setColumnOption(col,"dataType","number");
                        _comp.setColumnOption(col,"allowChar","0-9.");
                        _comp.setColumnOption(col,"userData1",_userData);
                    });

                    _comp.addEvent("onviewchange",function(arg){
                        var col_id = this.getColumnID(arg.colIndex);
                        var uData = this._dataList.getColumnOption(col_id,"userData1");
                        if(!com.isEmpty(uData)){
                            var pArr = uData.split("^^");
                            var _pos = pArr[0];
                            var _order = pArr[1];
                            var _colId = pArr[2];
                            if(col_id == _colId){
                                var sValue = arg.newValue;
                                var parts = sValue.toString().split(".");
                              //소수부
                                var r1 = parts[1].substring(0,_pos);
                                var r2 = parts[1].substring(_pos,_pos+1);
                                var nVal = r1 +"."+r2;
                                 switch(_order){//pos
                                    case "C":
                                    nVal = Math.ceil(nVal);
                                        break;
                                    case "R":
                                    nVal = Math.round(nVal);
                                        break;
                                    case "F":
                                    nVal = Math.floor(nVal);
                                        break;
                                        default :  nVal="0";
                                 }
                                  parts[1] = nVal + "";
                                 this._dataList.setCellData(arg.rowIndex,arg.colIndex,parts.join("."));
                            }
                        }
                    });
            }

            });
        });
    });
};

/**
* [일반] 화면 권한 정보 조회
*
* com.setAuthInfo('메뉴ID') --> setAuthInfo('CF00000000U')
*
*/
com.setAuthInfo = function(_menuId){
    com.createDataObj("dataMap", "dsAuth", [ "menuId", "etc" ]);
    var _dmObj = $w.getComponentById("dsAuth");
    _dmObj.set("menuId", _menuId);
    ajaxLib.ajax("/cf/CFCommon/selectPrcgAttrAuthGrpList", {
        mode : "synchronous"
    , requestData : _dmObj.getJSON()
    , callback : "com.setAuthGlobalCb"
    , errCallback : "com.setAuthGlobalErr"
    });
    return false;
};

/**
* [일반] 화면 권한 정보 조회 결과값
*
* 화면 메뉴 권한 결과값
*
* 배열 gcm.AUTH_GRP_CD 값을 조회해서 권한 그룹명을 조회한다.
*
* 	for (var i = 0; i < gcm.AUTH_GRP_CD.length; i++) {
* 		var authGrpCd = gcm.AUTH_GRP_CD[i];
* 		authGrpCd => 권한그룹코드
* 	}
*
* 배열 gcm.PRCG_AUTH_CD 값을 조회해서 CF03901 : 전사, CF03902 : 소속사업부, CF03903 : 소속팀을 조회한다.
* 	for (var i = 0; i < gcm.PRCG_AUTH_CD.length; i++) {
* 		var grpCd = gcm.PRCG_AUTH_CD[i];
* 		grpCd => 권한그룹 종류 (CF03901 : 전사, CF03902 : 소속사업부, CF03903 : 소속팀)
* 	}
*
* 배열 gcm.AUTH_ATTR_CD 값을 조회해서 CF06902 : 입력(CURD), CF06901 : 조회(R) 권한을 조회한다.
*
* 	for (var i = 0; i < gcm.AUTH_ATTR_CD.length; i++) {
* 		var auth = AUTH_ATTR_CD[i];
* 		auth ==> 처리속성 (CF06901 : 조회, CF06902 : 입력)
* 	}
*
* 배열 gcm.SEL_SCTR_LIST 값을 조회해서 SELECT 박스 또는 조회검색 조건에 조회 할 수 있는 부문을 선택한다.
*
* 	for (var i = 0; i < gcm.SEL_SCTR_LIST.length; i++) {
* 		var srch = gcm.SEL_SCTR_LIST[i];
* 		srch => 검색 조회 박스 (CF070K020000 : 토목, CF070K030000 : 건축, CF070K040000 : 플랜트, CF070K050000 : 주택)
* 	}
*/
com.setAuthGlobalCb = function(res,e){
    var authGrpList = res.data.tcfAuthGrpList;
    var authGrpInqrSctrList = res.data.tcfAuthGrpInqrSctrList;
    
    var concatWholeAttrCd = "";  //전사속성권한 concat
    var concatBzdpAttrCd  = "";  //사업부속성권한 concat
    var concatDeptAttrCd  = "";  //부서속성권한 concat
    var wholeAttrCnt = 0         //전사속성 cnt
    var bzdpAttrCnt  = 0         //사업부속성 cnt
    var deptAttrCnt  = 0         //부서속성 cnt

    if (authGrpList.length > 0) {
        for (var i = 0; i < authGrpList.length; i++) {
            gcm.AUTH_GRP_CD[i]  = authGrpList[i].authGrpId;
            gcm.PRCG_AUTH_CD[i] = authGrpList[i].prcgAuthGrpCd;
            gcm.AUTH_ATTR_CD[i] = authGrpList[i].prcgAttrCd;
            
            if (authGrpList[i].prcgAuthGrpCd == "CF03901") {//전사속성권한
            	
            	if(wholeAttrCnt > 0)
            	{
            		concatWholeAttrCd += ",";
            	}
            	
            	concatWholeAttrCd += authGrpList[i].prcgAttrCd;
            	
            	wholeAttrCnt++;
            	
            } else if (authGrpList[i].prcgAuthGrpCd == "CF03902") {//사업부속성권한
            	
            	if(bzdpAttrCnt > 0)
            	{
            		concatBzdpAttrCd += ",";
            	}
            	
            	concatBzdpAttrCd += authGrpList[i].prcgAttrCd;
            	
            	bzdpAttrCnt++;
            	
            } else if (authGrpList[i].prcgAuthGrpCd == "CF03903") {//부서속성권한
            	
            	if(deptAttrCnt > 0)
            	{
            		concatDeptAttrCd += ",";
            	}
            	
            	concatDeptAttrCd += authGrpList[i].prcgAttrCd;
            	
            	deptAttrCnt++;
            	
            }
        }
    }
    
    //전사 , 사업부 , 부서 권한 set
    gcm.WHOLE_ATTR_CD = com.comparePrcgAttrCd(concatWholeAttrCd); // 전사속성권한    (CF06901 : 조회, CF06902 : 입력)
    gcm.BZDP_ATTR_CD  = com.comparePrcgAttrCd(concatBzdpAttrCd);  // 사업부 속성권한 (CF06901 : 조회, CF06902 : 입력)
    gcm.DEPT_ATTR_CD  = com.comparePrcgAttrCd(concatDeptAttrCd);  // 부서 속성권한   (CF06901 : 조회, CF06902 : 입력)
    
    if (authGrpInqrSctrList.length > 0) {
        for (var i = 0; i < authGrpInqrSctrList.length; i++) {
            gcm.SEL_SCTR_LIST[i] = authGrpInqrSctrList[i].sctrLvCd;
        }
    }
    console.log('=== 권한 종류별 조회 값 gcm.PRCG_AUTH_CD gcm.AUTH_ATTR_CD gcm.SEL_SCTR_LIST !!! ');
    console.log("gcm.WHOLE_ATTR_CD ::: " + gcm.WHOLE_ATTR_CD);
    console.log("gcm.BZDP_ATTR_CD ::: " + gcm.BZDP_ATTR_CD);
    console.log("gcm.DEPT_ATTR_CD ::: " + gcm.DEPT_ATTR_CD);
    console.log("=========== gcm.PRCG_AUTH_CD ========================");
    console.log(gcm.PRCG_AUTH_CD);
    console.log("=========== gcm.AUTH_ATTR_CD ========================");
    console.log(gcm.AUTH_ATTR_CD);
    console.log("=========== gcm.SEL_SCTR_LIST ========================");
    console.log(gcm.SEL_SCTR_LIST);
};

com.comparePrcgAttrCd = function(concatCode){
	var resultVal = "";
	
	if(concatCode == null || concatCode == "" ) return resultVal;
	
	//CF06901 : 조회, CF06902 : 입력 >> 입력 , 조회 있을시 입력으로 set
	if(concatCode.indexOf('CF06902') > -1 )
    {
		resultVal = "CF06902"; //입력
    }
    else if(concatCode.indexOf('CF06901') > -1 )
    {
    	resultVal = "CF06901"; //조회
    }
	
	return resultVal;
}

com.setAuthGlobalErr = function(){

};

/**
* 	화면 버튼 권한을 관리하는 정보 조회
*
* setAuthBtnAllInfo()
*
*/
com.setAuthBtnAllInfo = function(){
    com.createDataObj("dataMap", "dsAuthAllInfo", [ "upperCd" ]);
    var _dmObj = $w.getComponentById("dsAuthAllInfo");
    _dmObj.set("upperCd", "CF041");

    ajaxLib.ajax("/cf/CF00000002U/selectTcfCodeListAuthBtn", {
        mode : "asynchronous"
        , requestData : _dmObj.getJSON()
        , callback : "com.setAuthBtnAllInfoGlobalCb"
        , errCallback : "com.setAuthBtnAllInfoGlobalErr"
    });
    return false;
};

/**
* 	화면 버튼 권한을 관리하는 정보 조회 결과값
*
*/
com.setAuthBtnAllInfoGlobalCb = function(res,e){
    var codeList = res.data.codeList;

    if (codeList.length > 0) {
        for (var i = 0; i < codeList.length; i++) {
            gcm.AUTH_INCLUDE_IDS[i] = codeList[i].cd;
        }
    }
    console.log('=== 전체 권한 버튼 조회 값: gcm.AUTH_INCLUDE_IDS -----');
    console.log(gcm.AUTH_INCLUDE_IDS);
};

com.setAuthBtnAllInfoGlobalErr = function(){

};


/*
 * 권한에 따른 button을 설정한다.
 * config.xml의 postScript에서 호출함
 * */
com.authBtnCtrl = function(){
	
    var pgrp = $("#"+$p.getFrameId()+" .content_body");

    if(pgrp.length > 0){
        var grp = pgrp[0];
        var group = $p.getComponentById(grp.id);
        // control대상 id
        var includeIds = gcm.AUTH_INCLUDE_IDS ;
        // 화면 접근시 버튼 권한 정보
        var chkIds = gcm.AUTH_ATTR_CD ;

        //대상 component
        var _lcomponents = [];
        //1. 그룹이하의 대상 플러그인 component list를 추출한다.
        if(group.getPluginName() == "group"){
            var compArr = group.getAllChildren();
            //2. anchor중 권한에 해당하는 btn id는 모두 담는다.
            $.each(compArr,function(idx,comp){
                if(comp.getPluginName() == "anchor"){
                    $.each(includeIds,function(c,id){
                        if(comp.id.indexOf(id)>-1){
                            _lcomponents.push(comp);
                        }
                    });
                }
            });

            //console.log(' includeIds :: ');
            //console.log(includeIds);
            //console.log(' chkIds :: ');
            //console.log(chkIds);

            var btnType = "1";

            for (var i = 0; i < chkIds.length; i++) {
                var grpAttr = chkIds[i];
                console.log(i + ' == grpAttr :: ' + grpAttr);

                if (grpAttr == "CF06902") {	//입력
                    btnType = "2";
                }
            }

            for (var i = 0; i < includeIds.length; i++) {

                if (btnType == "1") {
                    $.each(_lcomponents, function(idx,comp){

                        var _lid = comp.id;
                        //console.log(' _lid :: ' + _lid + '--- includeIds['+i+'] ::: ' + includeIds[i] + '--- _lid.search(includeIds['+i+']) ::: ' + _lid.search(includeIds[i]));

                        if (_lid.search(includeIds[i]) > -1) {

                            if (includeIds[i] == "btnNew") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnCopy") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnTemplate") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnInit") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnExcelUpl") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnAddFile") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnDelRow") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnAddRow") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnSave") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnCancel") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnDel") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnApprRequest") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnApprForm") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnApprCancel") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnApproval") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnApprReject") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnEdit") {
                                comp.addClass("hide");
                            } else if (includeIds[i] == "btnConfirm") {
                                comp.addClass("hide");
                            }
                        }
                    });
                }
            }

            /**
            $.each(_lcomponents, function(idx,comp){
                var _lid = comp.id;
                console.log(idx + " ::::=== comp.id :::" + _lid);
                console.log("btnFind ::: " + _lid.search("btnFind") );
            });

            //3. 현재 페이지에서 사용하고자하는 component id와 비교하여 대상이 존재하면 show 없으면 hide처리한다.
            $.each(_lcomponents,function(idx,comp){
                //
                var _lid = comp.id;

                console.log(idx + " ::::=== comp.id :::" + _lid);

                var tf = chkIds.find(function(el){ return _lid == el});

                console.log(tf);

                if(tf){
                    comp.show();
                }else{
                    comp.hide();
                }
            }); */
        }
    }
};

/* drag & drop */
com.ulDragDrop = function(_comp){

    var dragSrcEl = null;

    function handleDragStart(e) {
        console.log("handleDragStart");
      // Target (this) element is the source node.
      dragSrcEl = this;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.outerHTML);

      this.classList.add('dragElem');
    }
    function handleDragOver(e) {
        console.log("handleDragOver");
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      this.classList.add('over');
      e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
      return false;
    }

    function handleDragEnter(e) {
        console.log("handleDragEnter");
      // this / e.target is the current hover target.
    }

    function handleDragLeave(e) {
        console.log("handleDragLeave");
      this.classList.remove('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) {
        console.log("handleDrop");        
      // this/e.target is current target element.

      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        //alert(this.outerHTML);
        //dragSrcEl.innerHTML = this.innerHTML;
        //this.innerHTML = e.dataTransfer.getData('text/html');
        this.parentNode.removeChild(dragSrcEl);
        var dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin',dropHTML);
        var dropElem = this.previousSibling;
        addDnDHandlers(dropElem);

      }
      this.classList.remove('over');
      return false;
    }

    function handleDragEnd(e) {
        console.log("handleDragEnd");
      // this/e.target is the source node.
      this.classList.remove('over');

      /*[].forEach.call(cols, function (col) {
        col.classList.remove('over');
      });*/
    }

    function addDnDHandlers(elem) {
      console.log("addDnDHandlers");
      elem.addEventListener('dragstart', handleDragStart, false);
      elem.addEventListener('dragenter', handleDragEnter, false)
      elem.addEventListener('dragover', handleDragOver, false);
      elem.addEventListener('dragleave', handleDragLeave, false);
      elem.addEventListener('drop', handleDrop, false);
      elem.addEventListener('dragend', handleDragEnd, false);

    }

    var cols = document.querySelectorAll('#'+_comp.id+' li');
    [].forEach.call(cols, addDnDHandlers);

};
/*
스캐줄캘린더의 날짜를 이동한다.
*/
com.fullCalendarChange = function(_comp, _val){
    try {
        var m = "";
        if (_val.length == 14) {
            m = $W._d.formatDate(_val, "yyyy-MM-ddTHH:mm:SS", _comp.options.ioFormat + "HHmmSS");
        } else {
            m = $W._d.formatDate(_val, "yyyy-MM-dd", _comp.options.ioFormat);
        }
        $("#" + _comp.id).fullCalendar("gotoDate", m);
    } catch (e) {
        $W.exception.printStackTrace(e, null, this);
    }
};

/*
 * 탭 헤더 부분을 선택되지않은 것처럼 처리한다.
 * */
com.ghostTabSelect = function(){
    var htap = gcm.tab_main.tabArr[gcm.tab_main.selectedIndex];
    $("#"+htap.tabID).removeClass("w2tabcontrol_selected");
};

/*
 * wframe팝업에서 호출한 부모의 func을 실행한다.
 *
 * 사용예)
 * 부모창 script:
 * scwin.something = function(arg){
 * 	console.log(arg);// "반환값"이 출력 됩니다.
 * };
 *
 * 팝업창 script :
 * var rtn_val = "반환값";
 * com.executeParentFunc("scwin.something",rtn_val);
 * */
com.executeParentFunc = function(_funcNm, _val){

    var _tarFrame = opener.$w || $w;

    if(com.isEmpty(_funcNm)){
        console.log("팝업명이 없습니다.");
        return false;
    }
    var _obj = _funcNm.split(".");
    if(_obj.length < 2){
        return false;
    }
    var data = _val || "";
    var _func = _tarFrame.getComponentById(com.pframeId).getObj(_obj[0])[_obj[1]];
    if(com.isEmpty(_func)){
        console.log("해당 팝업 없습니다.");
        return false;
    }
    _func(data);
};
/**util 관련 Function Finish*/
;


/*
 * 이하 날짜를 YYYYMMDD 형태로 반환한다
 * 현재날짜/7일30일90일전/전주시작종료일/전달시작종료일/전년시작종료일/1~4분기시작종료일
 *
 * 사용예)
 * 파라미터(이하 모든 종류에 가능) : 반환할종류(week~quarter), 날짜(Object or String)
 * com.transDateType("now")           // 오늘날짜
 * com.transDateType("now",new Date())// 오늘날짜 Date함수
 * com.transDateType("now","20190415")// 오늘날짜 String
 *
 * 아래처럼 frDay, toDay로 시작하는 경우 뒤 숫자에 따라 해당일만큼 값이 차감 처리
 *
 * com.transDateType("frDay7")        // 일주일전시작 : 위의 예시처럼 파마메터 추가시 해당일 기준처리됨
 * com.transDateType("toDay7")        // 일주일전끝 : 위의 예시처럼 파마메터 추가시 해당일 기준처리됨
 * com.transDateType("frDay30")       // 한달전시작
 * com.transDateType("toDay30")       // 한달전끝
 * com.transDateType("frDay90")       // 60일전시작
 * com.transDateType("toDay90")       // 60일전끝
 *
 * 이하는 고정값
 * com.transDateType("frLastWeek")    // 전주시작
 * com.transDateType("toLastWeek")    // 전주끝
 * com.transDateType("frLastMonth")   // 전달시작
 * com.transDateType("toLastMonth")   // 전달끝
 * com.transDateType("frLastYear")    // 전년시작
 * com.transDateType("toLastYear")    // 전년끝
 * com.transDateType("frLastYear2")    // 2년전시작
 * com.transDateType("toLastYear2")    // 2년전끝
 * com.transDateType("frLastYear3")    // 3년전시작
 * com.transDateType("toLastYear3")    // 3년전끝
 * com.transDateType("frQuarter1")    // 1분기시작
 * com.transDateType("toQuarter1")    // 1분기끝
 * com.transDateType("frQuarter2")    // 2분기시작
 * com.transDateType("toQuarter2")    // 2분기끝
 * com.transDateType("frQuarter3")    // 3분기시작
 * com.transDateType("toQuarter3")    // 3분기끝
 * com.transDateType("frQuarter4")    // 4분기시작
 * com.transDateType("toQuarter4")    // 4분기끝
 *
 * */
com.transDateType = function(value, sdate) {

    // sdate값이 없으면 기본값으로 처리한다
    if( sdate == undefined ) {
        sdate = new Date();
    } else if (typeof sdate === 'string') {
        var yyyy,mm,dd;
        yyyy = sdate.substr(0, 4);
        mm  = sdate.substr(4, 2);
        dd  = sdate.substr(6, 2);
        sdate = new Date(yyyy, mm - 1, dd);
    }

    // 날짜를 YYYYMMDD형태로 가져온다.
    var getDateFormat = function(date, check){
        var now = new Date(date);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var lastDay = (new Date( year, month, 0)).getDate(); // 이번달 마지막 날짜
        if ((""+month).length == 1) month = "0" + month;
        if ((""+day).length == 1) day = "0" + day;
        if ((""+lastDay).length == 1) lastDay = "0" + lastDay;
        // check값이 true가 아닐경우 해당월 마지막 날짜를 반환한다.
        return check == true ? year +""+ month +""+ day : year +""+ month +""+ lastDay;
    };

    // 주어진 날짜만큼 차감한 날짜를 가져온다(값이 없으면 현재날짜yyyyMMdd)
    var getChgDate = function(date, value) {
        date.setDate(date.getDate()-(value != undefined ? value : 0));
        return getDateFormat(date, true);
    };

    // 전주 첫날짜 마지막날짜
    var getWeekFirstLastDay = function(date, check) {
        date.setDate(date.getDate()-7); // 전주
        var currentWeekDay = date.getDay();
        var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
        var wkStart = new Date(new Date(date).setDate(date.getDate() - lessDays));
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
        return check == true ? getDateFormat(wkStart,true) : getDateFormat(wkEnd,true);
    };

    // 전달 첫날짜 마지막날짜
    var getMonthFirstLastDay = function(date, check) {
        date.setDate(1);
        date.setMonth(date.getMonth()-1); // 전달
        return getDateFormat(date, check);
    };

    // 전년 첫날짜 마지막날짜
    var getYearFirstLastDay = function(date, check) {
        date.setDate(1);
        date.setYear(date.getFullYear()-1); // 전년
        if( check == true ) {
            date.setMonth(0);
            return getDateFormat(date, check);
        } else {
            date.setMonth(11);
            return getDateFormat(date, check);
        }
    };

    // 2년전 첫날짜 마지막날짜
    var getYearSecondLastDay = function(date, check) {
        date.setDate(1);
        date.setYear(date.getFullYear()-2); //  2년전
        if( check == true ) {
            date.setMonth(0);
            return getDateFormat(date, check);
        } else {
            date.setMonth(11);
            return getDateFormat(date, check);
        }
    };
    
    // 3년전 첫날짜 마지막날짜
    var getYearThirdLastDay = function(date, check) {
        date.setDate(1);
        date.setYear(date.getFullYear()-3); // 3년전
        if( check == true ) {
            date.setMonth(0);
            return getDateFormat(date, check);
        } else {
            date.setMonth(11);
            return getDateFormat(date, check);
        }
    };
    
    // 분기별
    var getQuarterFirstLastDay = function(date, quarter, check) {
        date.setDate(1);
        if( quarter == 1 ) {
            check == true ? date.setMonth(0) : date.setMonth(2);
        } else if( quarter == 2 ) {
            check == true ? date.setMonth(3) : date.setMonth(5);
        } else if( quarter == 3 ) {
            check == true ? date.setMonth(6) : date.setMonth(8);
        } else if( quarter == 4 ) {
            check == true ? date.setMonth(9) : date.setMonth(11);
        }
        return getDateFormat(date, check);
    };

    if( value.match("^frDay") ) {
        var dayInt = parseInt(value.replace("frDay",""));
        value = getChgDate(sdate, dayInt);
    } else if( value.match("^toDay") ) {
        value = getChgDate(sdate);
    }

    switch(value){
        case "now" : value = getChgDate(sdate); break;
        case "frLastWeek" : value = getWeekFirstLastDay(sdate, true); break;
        case "toLastWeek" : value = getWeekFirstLastDay(sdate, false); break;
        case "frLastMonth" : value = getMonthFirstLastDay(sdate, true); break;
        case "toLastMonth" : value = getMonthFirstLastDay(sdate, false); break;
        case "frLastYear" : value = getYearFirstLastDay(sdate, true); break;
        case "toLastYear" : value = getYearFirstLastDay(sdate, false); break;
        case "frLastYear2" : value = getYearSecondLastDay(sdate, true); break;
        case "toLastYear2" : value = getYearSecondLastDay(sdate, false); break;
        case "frLastYear3" : value = getYearThirdLastDay(sdate, true); break;
        case "toLastYear3" : value = getYearThirdLastDay(sdate, false); break;        
        case "frQuarter1" : value = getQuarterFirstLastDay(sdate, 1, true); break;
        case "toQuarter1" : value = getQuarterFirstLastDay(sdate, 1, false); break;
        case "frQuarter2" : value = getQuarterFirstLastDay(sdate, 2, true); break;
        case "toQuarter2" : value = getQuarterFirstLastDay(sdate, 2, false); break;
        case "frQuarter3" : value = getQuarterFirstLastDay(sdate, 3, true); break;
        case "toQuarter3" : value = getQuarterFirstLastDay(sdate, 3, false); break;
        case "frQuarter4" : value = getQuarterFirstLastDay(sdate, 4, true); break;
        case "toQuarter4" : value = getQuarterFirstLastDay(sdate, 4, false); break;
        default: value = getChgDate(sdate);
    }

    return value;
}


/**
 * 겸직 부서 코드 /부서명
 */
com.setCcrtDeptInfo = function(){

    com.createDataObj("dataList", "dsRvtDept", [ "deptCd" ]);
    var _dsList = $w.getComponentById("dsRvtDept");

    _dsList.setJSON(JSON.parse(sessionStorage.getItem("tcfCcrtDeptList")));


//	var _curIdx = _dsList.insertRow();
//	_dsList.setCellData(_curIdx, "deptCd", sessionStorage.getItem("deptCd"));

    // 부서코드 없는 행 삭제
//	var _rowIndexArr =  _dsList.getMatchedIndex( "deptCd" , "" , false , 0 , _dsList.getRowCount() - 1 );
//	_dsList.removeRows( _rowIndexArr );

     ajaxLib.ajax("/em/emcomm/selectRvtDeptCdForSessionList", {
        mode : "asynchronous"
    , requestData : {tcfCcrtDeptList : _dsList.getAllJSON()}
    , callback : "com.setCcrtDeptInfoGlobalCb"
    , errCallback : "com.setCcrtDeptInfoGlobalErr"
    });

    return false;

};

/**
 * 겸직 부서 코드 /부서명 성공 후처리
 */
com.setCcrtDeptInfoGlobalCb = function(res,e){
    gcm.EM_RVT_DEPT_LIST = JSON.stringify(res.data.dsRcvDeptCdList);
};

/**
 * 겸직 부서 코드 /부서명 에러 후처리
 */
com.setCcrtDeptInfoGlobalErr = function(){

};

/**
 * 전자결재 : 파라메터세팅
 */
com.setAprvSendObject = function(param){

    var dsMap = importAprvMain.getWindow().dsAprvMap;
    dsMap.set("jobGbCd", param.jobGbCd);
    dsMap.set("importUrl", param.importUrl);
    dsMap.set("importHtmlYn", param.importHtmlYn);  //param.importHtmlYn -> 기존 이미지 첨부에서 HTML 로 변환 하는 것으로 변경
    dsMap.set("aprvTtl", param.aprvTtl);
    dsMap.set("rvwrEmpno", param.rvwrEmpno);
    dsMap.set("fnlAprprEmpno", param.fnlAprprEmpno);
    dsMap.set("aprvPrcgNm", param.aprvPrcgNm);
    dsMap.set("aprvPrcgEventNm", param.aprvPrcgEventNm);
    dsMap.set("aprvDocModiPsblYn", param.aprvDocModiPsblYn);
    dsMap.set("aprlnModiPsblYn", param.aprlnModiPsblYn);
    dsMap.set("aprvAtchModiPsblYn", "Y");	//param.aprvAtchModiPsblYn  --> 일단 무조건 결재단계별 첨부파일이 가능 하도록 변경.
    dsMap.set("aflId", param.aflId);
    dsMap.set("aprvAflId", param.aprvAflId);
    dsMap.set("popupWidth", param.popupWidth);
    dsMap.set("popupHeight", param.popupHeight);
    dsMap.set("isTestYn", 'N');
    dsMap.set("menuId", gcm.MENU_ID );
    dsMap.set("anchorUrl", param.anchorUrl );
    dsMap.set("anchorUrlMsg", param.anchorUrlMsg );    
    dsMap.set("relatedDocumentIds", param.relatedDocumentIds );
    dsMap.set("aprvAtchAreaYn", param.aprvAtchAreaYn );
    dsMap.set("aprvAddAflId", param.aprvAddAflId);
    dsMap.set("anchorReportJrfId", param.anchorReportJrfId);				//레포트 파일ID
    dsMap.set("anchorReportLinkMsg", param.anchorReportLinkMsg);		    //리포트 클릭해서 실행할 명칭.
    dsMap.set("anchorReportParam", param.anchorReportParam);      			//레포트 PARAM -- dataMap 에서 내부 json 을 먹지 않는 관계로 sring 처럼 변환해서 사용,
    dsMap.set("anchorReportJobGbCd", param.anchorReportJobGbCd);        	//업무파트 
    dsMap.set("anchorReportCallbackurl", param.anchorReportCallbackurl);	//기존 레포트 callbackurl 참고.--         
}

/**
 * 전자결재 : 결재
 */
com.aprvSend = function(param){
    com.setAprvSendObject(param);
    importAprvMain.getWindow().scwin.btnAprvSend_onclick();
};

/**
 * 전자결재 : 의견달기->결재
 */
com.aprvSendEditor = function(param){
    com.setAprvSendObject(param);
    importAprvMain.getWindow().scwin.btnAprvSendEditor_onclick();
};

/**
 * 전자결재 : 결재미리보기 페이지에서 부모창 파라메터 가져오기
 */
com.getAprvParam = function(param){
    return $p.getFrame().getParentFrame().getParentFrame().getParentFrame().getObj(param);
};

/**
 * 전자결재: 결재등록번호 확인
 */
com.getAprvNo = function(){
    var no =  importAprvMain.getWindow().dsAprvMap.get("resultAprvNo");

    if (no == null ||  no == ""){
        no = 0;
    }
    return no;
};

/**
 * 결재 팝업
 * @param {String} aprvNo -> 결재번호
 */
com.aprvPopup = function(aprvNo, flag){
	var popOps = {
			pid : "approvalProcPopup" + "_" + new Date().getTime(),
	        url : "/ux/cf/cf0400/CF04000025P.xml",
	        modal : true,
	        popup_name : "결재",
	        callbackFn : "scwin.fnPopApprovalCallBack",
	        width  : "1350",
	        height : "800",
	        data : {
					 paramKeyAprvNo : aprvNo	//결재번호
					 ,paramKeyFlag : flag		//구분 [DRAFT:결재요청, APPROVAL:결재 승인/반려]
	        }
	    };
	com.popup_open(popOps);	
};

/**
 * 결재현황 팝업 : 업무팀 단일 버튼 사용시
 * @param {String} aprvNo -> 결재번호
 */
com.aprvViewPopup = function(aprvNo){
    if( aprvNo == undefined || aprvNo == "" ) {
        alert("결재번호가 입력되지 않았습니다.");
        return;
    }
    var popOps = {
            url : "/ux/cf/cf0400/CF04000025P.xml",
            popup_name : "결재",
            callbackFn : "",
            width  : "1350",
            height : "800",
            data : {
					 paramKeyAprvNo : aprvNo	//결재번호
            }
        };
    com.popup_open(popOps);
    /*
    ajaxLib.ajax("/cf/CFAprv/selectTcfAprvPopup", {
        requestData: {aprvNo : aprvNo},
        callback: function(result, e){
            var data = result.data.aprvData;
            var xml = data.aprvXml;
            var url = data.telepiaUrl;
            var $form = $("<form></form>");
            var newwin = window.open('about:blank','transForm','top=0,left=0,width=1014,height=694,status=yes,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=no');
            newwin.focus(); //새창을 띄울때 항상 위
            $form.attr("target", "transForm");
            $form.attr("action", url);
            $form.attr("method", "post")
            $form.attr("accept-language", "ko")
            $form.appendTo('body');
            var $input = $("<input></input>");
            $input.attr({
                type: "hidden",
                name: "Message",
                id: "Message",
                value: xml
            });

            $input.appendTo($form);
            $form.submit(); //텔레피아에 form전송
        },
        errCallback: function(result, e){
            alert(result);
        }
    })
    */
};

/**
 * 결재문서조회 팝업 : 업무팀 단일 버튼 사용시
 * @param {JSON} aprvInfo
 */
com.aprvDocViewPopup = function(gwDocNo){
    if( gwDocNo == undefined || gwDocNo == "" ) {
        alert("텔레피아 문서번호가 입력되지 않았습니다.");
        return;
    }
    ajaxLib.ajax("/cf/CFAprv/selectTcfAprvView", {
        requestData: { gwDocNo : gwDocNo },
        callback: function(result, e){
            //텔레피아로 form전송
            var data = result.data.aprvData;
            var xml  = data.aprvXml;
            var url  = data.telepiaUrl;
            var $form = $("<form></form>");

            var newwin = window.open('about:blank','transForm','top=0,left=0,width=1014,height=694,status=yes,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=no');
            newwin.focus();
            $form.attr("target", "transForm");
            $form.attr("action", url);
            $form.attr("method", "post")
            $form.attr("accept-language", "ko")
            $form.appendTo('body');

            var $input = $("<input></input>");
            $input.attr({
                type : "hidden",
                name : "Message",
                id : "Message",
                value : xml
            });

            $input.appendTo($form);
            $form.submit();
        },
        errCallback: function(result, e){
            alert(result);
        }
    })
};

/**
 * UBI Report 팝업
 * @param {String} jrfId -> UBI jrf파일명
 * @param {JSON} param -> 파라미터 : json ex) { test1 : 'test', test2 : 'test' }
 * @param {String} jobGbCd -> 업무구문 : ex) CF
 * @param {String} callbackurl -> 콜백URL : 생략가능, http://koffice.sdcit.co.kr 를 제외한 /ubi4/ubiCallbackTest 입력
 *
 * 샘플 : com.ubiReportPopup("ubi_sample.jrf", {test1:'test'}, "CF", "/ubi4/ubiCallbackTest");
 *
 * 콜백URL의 실행 : 리포트 프린트 및 저장(내보내기) 할 때 발생 프린트/저장 구분 ubifunc:'print' / ubifunc:'export'로
 * 파라메터 전송 Controller 에서 파라메터를 받아 분기처리(CFEtcController 의 ubi4CallbackTest 참조)
 *
 */
com.ubiReportPopup = function(jrfId, param, jobGbCd, callbackurl) {
    var data = "";
    var jsonparam = "";
    for(var key in param) data += key + "#" + param[key] + "#";
    data += "USER_NM" + "#" + sessionStorage.userNm + "#" // 사용자
    data += "USER_ID" + "#" + sessionStorage.userId + "#" // 사용자ID

    for(var key in param) jsonparam += key + "#" + param[key] + "#|";
    jsonparam += "USER_NM" + "#" + sessionStorage.userNm + "#|" // 사용자
    jsonparam += "USER_ID" + "#" + sessionStorage.userId + "#" // 사용자ID

    // 콜백 URL처리
    var sonourl = "";
    if( callbackurl != undefined && callbackurl != "" && callbackurl != null ) {
        sonourl = KOFFICE_MAIN_URL + callbackurl; // koffice 콜백 URL
    }

    var url = UBI_HTML_URL; // UBI리포트 HTML페이지 변수 개발서버
    
    console.log("UBI_HTML_URL : " + UBI_HTML_URL);
    console.log("jsonparam : " + jsonparam);
    console.log("sonourl : " + sonourl);
    console.log("jrf : " + jobGbCd.toLowerCase() + '/' +jrfId);
    
    var $form = $('<form></form>');
    $form.attr('action', url);
    $form.attr('method', 'post');
    $form.attr('target', 'watchwin');
    $form.appendTo('body');
    var _jrf = $('<input type="hidden" value="'+ jobGbCd.toLowerCase() + '/' +jrfId+'" name="jrf">');
    var _arg = $('<input type="hidden" value="'+data+'" name="arg">');
    var _jsonparam = $('<input type="hidden" value="'+jsonparam+'" name="jsonparam">');
    var _resid = $('<input type="hidden" value="serppo" name="resid">');
    var _sonourl = $('<input type="hidden" value="'+sonourl+'" name="sonourl">');
    $form.append(_jrf).append(_arg).append(_jsonparam).append(_resid).append(_sonourl);
    var features ='height=900, width=980, status=no, scrollbars=yes, resizable=yes';
    window.open("", 'watchwin', features);

    $form.submit();
};

/*
 * 퀵메뉴 팝업
 */
com.quickMenuPopup = function(param){

    var quickMenuSeq    =  param.quickMenuSeq;
    var cnntMthdCd      =  param.cnntMthdCd;       //연동방식코드[CF086]
    var quickMenuPathNm =  param.quickMenuPathNm;  //퀵_메뉴_경로_명
    var ppupOptNm       =  param.ppupOptNm;        //팝업옵션
    var quickMenuTtl    =  param.quickMenuTtl;     //퀵메뉴제목

    if(ppupOptNm == "" ||  ppupOptNm == null)
    {
        ppupOptNm = "top=1, left=1, width=1200,height=800,resizable=yes,toolbar=no,scrollbars=yes,menubar=no,status=yes, location=no";
    }
    if("CF086F" == cnntMthdCd)//일반업무(GET방식)인경우 미리 할당된 변수 replace (@@empno@@: 사번, @@userId@@: 텔레피아 ID)
    {
        quickMenuPathNm = quickMenuPathNm.replaceAll("@@empno@@",sessionStorage.getItem("userEmpno") ).replaceAll("@@userId@@",sessionStorage.getItem("userId") );

    }

    ajaxLib.ajax("/ep/EP20050002U/selectLinkData", {
         mode       : "synchronous"
        ,requestData:  {
                          quickMenuSeq      : quickMenuSeq
                         ,quickMenuPathNm   : quickMenuPathNm
                         ,cnntMthdCd        : cnntMthdCd
                       }
        ,callback : function(result,e) {

            var varbList        = result.data.varbList;
            var telepiaAuthInfo = result.data.telepiaAuthInfo;
            var menuData        = result.data.menuData;
            var $input          = null;
            var paramObj        = null;

            if("CF086A" == cnntMthdCd)
            {//텔레피아
                console.log("telepiaAuthInfo >> " + telepiaAuthInfo);

                var $form = $("<form></form>");
                window.open('about:blank', quickMenuSeq, ppupOptNm);
                $form.attr("target", quickMenuSeq);
                   $form.attr("action", quickMenuPathNm);
                $form.attr("method", "post");
                $form.attr("accept-language", "ko")
                $form.appendTo('body');

                $input = $("<input></input>");
                $input.attr({type:"hidden",  name:"Message",  id:"Message",  value:telepiaAuthInfo});
                $input.appendTo($form);

                $input = $("<input></input>");
                $input.attr({type:"hidden",  name:"isTelepiaYN",  id:"isTelepiaYN",  value:"true"});
                $input.appendTo($form);

                $form.submit();
            }
            else if("CF086B" == cnntMthdCd || "CF086E" == cnntMthdCd || "CF086F" == cnntMthdCd)
            {//인사업무 , 일반업무  ,일반업무(GET방식)

                //get방식 고려
                param.ppupOptNm       = ppupOptNm;
                param.quickMenuPathNm = quickMenuPathNm;

                paramObj = new Object();
                paramObj.param = param;
                paramObj.varbList = varbList;

                //로컬스토리지에 값세팅
                localStorage.setItem("quickMenuData",JSON.stringify(paramObj));

                window.open('/websquare/websquare.html?w2xPath=/WEB-INF/ux/ep/EP20050002P.xml', quickMenuSeq, ppupOptNm);

            }
            else if("CF086G" == cnntMthdCd)
            {

                var gubunKey = "B@I#Z$P%L^A&Y";
                var indexKey = Math.floor(Math.random()*(12-0+1)) + 0;
                var targetKey = "";
                if(indexKey >0){
                    targetKey +=  gubunKey.substring(indexKey,gubunKey.length);
                    targetKey +=  gubunKey.substring(0,indexKey);
                }else{
                    targetKey = gubunKey;
                }

                var nowDate = new Date();
                var userId     = sessionStorage.getItem("userId") || ''
                var email      = sessionStorage.getItem('email')||'';
                var dateFormat = $w.getFormattedDate( nowDate , "yyyyMMddHHmmss" );
                var randomKey  = userId+"_"+dateFormat+nowDate.getMilliseconds()+"_"+btoa(targetKey);

                var json = { "BP_USR_ID"    : email
                           , "USR_ID"       : userId
                           , "SW_CRTC_KEY"  : 'bbeeaf8c-fded-4b0c-855e-b7a95a6acb92'
                           , "CPLD_RDM_KEY" : randomKey
                           , "APP_SEQ"      : "" };

                param.ppupOptNm       = ppupOptNm;
                param.quickMenuPathNm = quickMenuPathNm;

                paramObj = new Object();
                paramObj.param = param;
                paramObj.varbList = varbList;
                paramObj.JSONData = JSON.stringify(json);

                //로컬스토리지에 값세팅
                localStorage.setItem("quickMenuData",JSON.stringify(paramObj));

                window.open('/websquare/websquare.html?w2xPath=/WEB-INF/ux/ep/EP20050002P.xml', quickMenuSeq, ppupOptNm);

            }
            else if("CF086D" == cnntMthdCd)
            {//ERP업무 탭으로

                if(menuData == null)
                {
                    alert("해당메뉴가 없습니다.");
                    return;
                }

                gcm.MENU_TITLE = menuData.menuNm;
                gcm.MENU_ID    = menuData.menuId;
                gcm.MENU_URL   = menuData.scrPathNm;
                
                var indexWindow   = gcm.tab_main.getScopeWindow();
        		var indexLeftArea = indexWindow.grpLeftArea;
        		
        		$("#"+indexLeftArea.id).find('> li').removeClass('on');
        		$('.wrap').removeClass('lnb_on');

        		indexWindow.scwin.fnAddRemoveClass("N", "N", "N", "N","N","N");
        		indexWindow.scwin.fnRemoveWrapQucikMenu();
        		
                com.setAuthInfo(menuData.menuId);

                com._openTab(gcm.MENU_TITLE, gcm.MENU_ID, gcm.MENU_URL);

            }
            else if("CF086C" == cnntMthdCd)
            {//포탈업무 팝업으로
 
            	var _width ="1400";
            	var _height ="900";
               if( quickMenuPathNm == "/ux/ep/staf_welfare.xml"){
            	   var _arrOpt = ppupOptNm.replaceAll(" ","").split(",");
            	   
            	   _arrOpt.forEach(function(item,index){
            		   if(item.toLowerCase().indexOf("width")>=0){
            			  var  _tmpWidth =item.split("=");
            			  _width= _tmpWidth[1];
            		   }
            		   if(item.toLowerCase().indexOf("height")>=0){
             			  var  _tmpHeight =item.split("=");
             			  _height= _tmpHeight[1];
             		   }            		   
            		   
            	   });
               }
                var popOps = {
                         url        : quickMenuPathNm
                        ,type       :"browser"
                        ,height     : _height
                        ,width      : _width
                        ,popup_name : quickMenuTtl
                        ,resizable  :true
                        ,scrollbars :true
                        ,data       : {menuNm : quickMenuTtl }
                };
                com.popup_open(popOps);
          }
        },
        errCallback: function(result,e) { }
    });
};

/*
 * 법인카드내역 팝업호출
 */
com.fnBizplayBusinessCardPopup = function(appSeq){
	var left = (screen.width / 2 - 600);
    var top = (screen.height / 2 - 350);
    var url = "";
    
    if(appSeq == '11107'){ //카드 정산
    	url = "/ux/ep/EP20050003P.xml"
    }else if(appSeq == '89'){ //카드결제
    	url = "/ux/ep/EP20050004P.xml"
    }
    
	var popOps = {
            url        : url
          , modal      :false
          , top        : top
          , left       : left
          , type       :"browser"
          , height     :"900"
          , width      :"1400"
          , popup_name :'corpCardDetailPopup'
          , resizable  :true
          , scrollbars :true
          , data       : {"appSeq" :appSeq}
	};

	com.popup_open(popOps);	
    
};

/*
 * 공지사항 팝업 호출
 */
com.fnCallTelepiaNotice = function(oid){
	
	if(oid == null || oid == "") {
		alert("공지사항 oid가 업습니다.");
		return;
	}
	
	var obj = new Object();
	obj.bbsType = "1";
	obj.oid     = oid;
	
	var left = (screen.width / 2 - 450);
    var top = (screen.height / 2 - 450);
	var width = "950";
	var height = "770";	
	
	var popOps = {
			 url         :"/ux/ep/EP10050004P.xml"
			, type       :"browser"
			, modal      :false
			, height     : height
			, width      : width
			, popup_name : "notiBbsView"
			, resizable  :true            
           , data 		: obj
       };
       com.popup_open(popOps);
}

/*
 * 공지에서  설문조사 팝업 호출
 */
com.fnCallSurveyNotice = function(sNum,w,h){
	
	if(sNum == null || sNum == "") {
		alert("설문조사  id가 업습니다.");
		return;
	}
	var userEmpno = sessionStorage.getItem("userEmpno");
	
	var url ="http://app.sdcit.co.kr/survey/user"+sNum+".asp?no="+sNum;
    var $form = $("<form></form>");

    var newwin = window.open('about:blank','surveyForm','top=0,left=0,width='+w+',height='+h+',status=yes,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=no');
    newwin.focus();
    $form.attr("target", "surveyForm");
    $form.attr("action", url);
    $form.attr("method", "post")
    $form.attr("accept-language", "ko")
    $form.appendTo('body');

    var $input = $("<input></input>");
    $input.attr({
        type : "hidden",
        name : "sabun",
        id : "sabun",
        value : userEmpno
    });

    $input.appendTo($form);
    $form.submit();
}

/*
 * index_tab timer rest
 */
com.fnIndexTabTimerRest = function(){

    if(gcm.tab_main != undefined)
    {
        var obj =  gcm.tab_main.scope_obj.getObj("scwin");

        if (typeof(obj["fnTimerReset"]) == "function"){
            obj["fnTimerReset"]();
        }
    }
};

/*인감 관리자 체크*/
com.fnUseSealAdminCheck = function(){
    var deptCd          = sessionStorage.getItem("deptCd") || '';
    var userEmpno       = sessionStorage.getItem("userEmpno") || '';
    var tkotAdminDeptCd = gcm.khProp.tkotAdminDeptcd;
    var tkotAdminEmpNo  = gcm.khProp.tkotAdminEmpno;

    //인감관리자부서코드
    if(tkotAdminDeptCd.indexOf(deptCd) > -1)
    {
        return true;
    }

    //인감관리 사번
    if(tkotAdminEmpNo.indexOf(userEmpno) > -1)
    {
        return true;
    }

    return false;
}

/*인감 관리자 부서코드*/
com.fnGetUseSealAdminDeptCd = function(){
    return gcm.khProp.tkotAdminDeptcd;
};

/*인감 관리자 사번*/
com.fnGetUseSealAdminEmpno = function(){
    return gcm.khProp.tkotAdminEmpno;
};

/*인감 영업소 사번*/
com.fnGetUseSealBusinessEmpno = function(){
    return gcm.khProp.sealBusinessOfficeEmpno;
};

/*인감 영업소 부서코드*/
com.fnGetUseSealBusinessDeptCd = function(){
    return gcm.khProp.sealBusinessOfficeDeptCd;
};

/*인감 결재 완료 코드 */
com.fnGetSealAprvCpltCd = function() {
    return gcm.khProp.tkotAprvCpltCd;
};

/*인감 결재중 코드 */
com.fnGetSealAprvingCd = function() {
    return gcm.khProp.tkotAprvingCd;
};

/*인감 결재중 코드 */
com.fnGetSealOutConfirmCd = function() {
    return gcm.khProp.tkotOutConfirmCd;
};

/*인감 결재중 코드 */
com.fnGetSealInConfirmCd = function() {
    return gcm.khProp.tkotInConfirmCd;
};

/*법무팀 부서 코드 */
com.fnGetJdafTeamCd = function() {
    return gcm.khProp.jdafTeamCd;
};

/**
//---------------------------------------------------------------------------------------------------------------------------
// 증빙이미지 등록
//---------------------------------------------------------------------------------------------------------------------------
// IF03 : http://localhost:6530/KHAccScan?METHOD=IF03&WORK_CD=Y001&REF_KEY=20190515000009&SLIP_TYPE_GB_CD=EM09302&INV_NO=Y190515-ERPPJT1-0014&USER_ID=506396&SERVERINFO=http://*****
//- 파라미터 : METHOD  ( 메소드명 )
// WORK_CD ( 전표 유형 번호 )
// REF_KEY ( 참조 키 )
// SLIP_TYPE_GB_CD  ( AS_IS에서 SOURCE )
// INV_NO ( 전표번호 )
// USER_ID
// SERVERINFO : http://***** ( 개발 )
//---------------------------------------------------------------------------------------------------------------------------
 */

function saveEvidence(WORK_CD, REF_KEY, SLIP_TYPE_GB_CD,INV_NO, USER_ID){

    var EDMS_SERVER_URL = gcm.khProp.edmsServerUrl; //"http://*****"; // 개발

    var if_gubun = "IF03"

    var sendUrl = 'http://localhost:6530/KHAccScan';
        sendUrl += '?' + 'METHOD=' + if_gubun ;
        sendUrl += '&EdmsWebCall=Y';
        sendUrl += '&WORK_CD=' + WORK_CD;
        sendUrl += '&REF_KEY=' + REF_KEY;
        sendUrl += '&SLIP_TYPE_GB_CD=' + SLIP_TYPE_GB_CD;
        sendUrl += '&INV_NO=' + INV_NO;
        sendUrl += '&USER_ID=' + USER_ID;
        sendUrl += '&SERVERINFO=' + EDMS_SERVER_URL;



    //openExe(sendUrl);
    edms.serverExec(sendUrl);
}

/**
//---------------------------------------------------------------------------------------------------------------------------
//증빙이미지 추가 등록
//---------------------------------------------------------------------------------------------------------------------------
//IF03 : http://localhost:6530/KHAccScan?METHOD=IF03&WORK_CD=Y001&REF_KEY=20190515000009&SLIP_TYPE_GB_CD=EM09302&INV_NO=Y190515-ERPPJT1-0014&USER_ID=506396&ADD_SCAN=Y&SERVERINFO=http://*****
//- 파라미터 : METHOD  ( 메소드명 )
//WORK_CD ( 전표 유형 번호 )
//REF_KEY ( 참조 키 )
//SLIP_TYPE_GB_CD  ( AS_IS에서 SOURCE )
//INV_NO ( 전표번호 )
//USER_ID
//ADD_SCAN (스캔정보)
//SERVERINFO : http://***** ( 개발 )
//---------------------------------------------------------------------------------------------------------------------------
*/
function saveEvidenceAdd(WORK_CD, REF_KEY, SLIP_TYPE_GB_CD,INV_NO, USER_ID, ADD_SCAN){

    var EDMS_SERVER_URL = gcm.khProp.edmsServerUrl; //"http://*****"; // 개발

    var if_gubun = "IF03"

    var sendUrl = 'http://localhost:6530/KHAccScan';
        sendUrl += '?' + 'METHOD=' + if_gubun ;
        sendUrl += '&EdmsWebCall=Y';
        sendUrl += '&WORK_CD=' + WORK_CD;
        sendUrl += '&REF_KEY=' + REF_KEY;
        sendUrl += '&SLIP_TYPE_GB_CD=' + SLIP_TYPE_GB_CD;
        sendUrl += '&INV_NO=' + INV_NO;
        sendUrl += '&USER_ID=' + USER_ID;
        sendUrl += '&ADD_SCAN=' + ADD_SCAN;
        sendUrl += '&SERVERINFO=' + EDMS_SERVER_URL;



    //openExe(sendUrl);
    edms.serverExec(sendUrl);
}
/**
//---------------------------------------------------------------------------------------------------------------------------
// 증빙이미지 전체보기 (조회만 가능)
//---------------------------------------------------------------------------------------------------------------------------
// IF08 : http://localhost:6530/KHAccScan?METHOD=IF08&WORK_CD=Y001&REF_KEY=20190515000009&SLIP_TYPE_GB_CD=EM09302&INV_NO=Y190515-ERPPJT1-0014&USER_ID=506396&SERVERINFO=http://*****
//- 파라미터 : METHOD  ( 메소드명 )
// WORK_CD ( 전표 유형 번호 )
// REF_KEY ( 참조 키 )
// SLIP_TYPE_GB_CD  ( AS_IS에서 SOURCE )
// INV_NO ( 전표번호 )
// USER_ID
// SERVERINFO : http://***** ( 개발 )
//---------------------------------------------------------------------------------------------------------------------------
 */
function getEvidence(WORK_CD, REF_KEY, SLIP_TYPE_GB_CD,INV_NO, USER_ID){

    var EDMS_SERVER_URL = gcm.khProp.edmsServerUrl; //"http://*****"; // 개발

    var if_gubun = "IF08"

    var sendUrl = 'http://localhost:6530/KHTotView';
        sendUrl += '?' + 'METHOD=' + if_gubun ;
        sendUrl += '&EdmsWebCall=Y';
        sendUrl += '&WORK_CD=' + WORK_CD;
        sendUrl += '&REF_KEY=' + REF_KEY;
        sendUrl += '&SLIP_TYPE_GB_CD=' + SLIP_TYPE_GB_CD;
        sendUrl += '&INV_NO=' + INV_NO;
        sendUrl += '&USER_ID=' + USER_ID;
        sendUrl += '&SERVERINFO=' + EDMS_SERVER_URL;

    //openExe(sendUrl);
    edms.serverExec(sendUrl);
}

/**
 * 전자증빙클라이언트 프로그램 호출 함수
 * 3초후 클라이언트와 정상통신 되지 않으면 설치페이지 유도
*/
function openExe(sendUrl){
    var EDMS_SERVER_URL = gcm.khProp.edmsServerUrl; //"http://*****"; // 개발
    var $openExe = window.open(sendUrl);
    var timeout_trigger = 	window.setTimeout(
                            function(){
                                if($openExe.closed){

                                } else {
                                    window.open(EDMS_SERVER_URL + "/login.do?method=setup");
                                    $openExe.close();
                                }
                            }, 3000);
}

var edms = {
        serverExec : function(url){
            //edms.loader("on");
            $jsonp.send(url , {
                callbackName: 'edmsCallback',
                onSuccess: function(json){
                    //edms.loader("off");
                },
                onTimeout: function(){
                    //설치페이지 유도
                    //$(location).attr("href", G_SERVER_URL + "/login.do?method=setup");
                    location.href = gcm.khProp.edmsServerUrl + "/login.do?method=setup";
                },
                timeout: 3
            });
        }
};
var $jsonp = (function(){
    var that = {};

    that.send = function(src, options) {
    var callback_name = options.callbackName || 'callback',
        on_success = options.onSuccess || function(){},
        on_timeout = options.onTimeout || function(){},
        timeout = options.timeout || 10; // sec

    var timeout_trigger = window.setTimeout(function(){
        window[callback_name] = function(){};
        on_timeout();
    }, timeout * 1000);

    window[callback_name] = function(data){
        window.clearTimeout(timeout_trigger);
        on_success(data);
    }

    var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.src = src;

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    return that;
})();

/**
//---------------------------------------------------------------------------------------------------------------------------
// 다건 증빙이미지 등록
//---------------------------------------------------------------------------------------------------------------------------
//- 파라미터 : METHOD  ( 메소드명 )
// WORK_CD ( 전표 유형 번호 )
// REF_KEY ( 참조 키 ) 구분자 ' , '
// INV_NO ( 전표번호 ) 구분자 ' , '
// USER_ID
// 참조번호와 전표번호의 수가 같지 않다면 에러
//---------------------------------------------------------------------------------------------------------------------------
 */
function saveMultiEvidence(WORK_CD, REF_KEY, INV_NO, USER_ID){
var EDMS_SERVER_URL = gcm.khProp.edmsServerUrl;

var if_gubun = "IF13"

var sendUrl = 'http://localhost:6530/KHAccScan';
    sendUrl += '?' + 'METHOD=' + if_gubun ;
    sendUrl += '&EdmsWebCall=Y';
    sendUrl += '&WORK_CD=' + WORK_CD;
    sendUrl += '&REF_KEY=' + REF_KEY;
    sendUrl += '&INV_NO=' + INV_NO;
    sendUrl += '&USER_ID=' + USER_ID;
    sendUrl += '&SERVERINFO=' + EDMS_SERVER_URL;
    //openExe(sendUrl);
    edms.serverExec(sendUrl);
}

/**
//---------------------------------------------------------------------------------------------------------------------------
// 다건 증빙이미지 조회
//---------------------------------------------------------------------------------------------------------------------------
//- 파라미터 : METHOD  ( 메소드명 )
// WORK_CD ( 전표 유형 번호 )
// REF_KEY ( 참조 키 ) 구분자 ','
// USER_ID
//---------------------------------------------------------------------------------------------------------------------------
*/
//function getMultiEvidence(REF_KEY, USER_ID){
function getMultiEvidence(REF_KEY, INV_NO, USER_ID){
var EDMS_SERVER_URL = gcm.khProp.edmsServerUrl;

var if_gubun = "IF12"

var sendUrl = 'http://localhost:6530/KHTotView';
    sendUrl += '?' + 'METHOD=' + if_gubun ;
    sendUrl += '&EdmsWebCall=Y';
    sendUrl += '&REF_KEY=' + REF_KEY;
    sendUrl += '&INV_NO=' + INV_NO;
    sendUrl += '&USER_ID=' + USER_ID;
    sendUrl += '&SERVERINFO=' + EDMS_SERVER_URL;
    //openExe(sendUrl);
    edms.serverExec(sendUrl);
}

/**
 * 스마트빌 : 화면에서 세금계산서 출력을 위한 Script
 */
function viewSmartbill(CONVERSATION_ID, TYPE){
     var SMARTBILL_SERVER_URL = "http://165.141.187.37:30000"; // 개발

     var sendUrl = SMARTBILL_SERVER_URL + '/dti/api/v1/view/';
     sendUrl += CONVERSATION_ID;
     sendUrl += '?stype=' + TYPE;
     window.open(sendUrl);
}

/*
 * DEXT5 에디터 실행 : 실행을 위해서는 iframe객체가 선행되어야 한다.
 *
 * var _option = {
 *       dFrameId : "dext5Editor"
 *     , dBlockId : editGroup.id // editGroup.id, $p.getPopupId()(팝업) 등 블록을 지정할 그룹이나 객체의 아이디
 *     , dCallBackFn : "testFunction" // 콜백함수명. 생성함수는 scwin이 붙어야 한다. 실제 실행 시 만들어지는 형태 : scwin.testFunction()
 * };
 * com.fnViewDextEditor(_option);
 *
 * 블록킹을 위해서는 jquery.blockUI.js 이 등록되어있어야함.
 * 예) <script type="text/javascript" src="/resources/js/lib/util/jquery.blockUI.js"></script>
 *
 * width는 원하는 사이즈로 입력(% 혹은 px사용), height는 100%가 안됨으로 입력 받아야 한다.
 * 예) <w2:iframe src="" style="width:100%;height:415px;" id="dext5Editor"></w2:iframe>
 *
 * 에디터 참조사항
 * 1. 에디터에서 작성한 내용을 가져 오거나(get...Value API), 에디터에 작성된 내용을 set(set...Value API)할 수 있습니다.
 *    예) $("#"+dext5Editor.id)[0].contentWindow.DEXT5.getBodyValue();
 *
 * 2. get과 set API는 서로 짝이 맞는 API로 사용하는 것을 권장합니다.
 *    예) getHtmlValueEx API를 사용하시면, 에디터에 set 할 때도 setHtmlValueEx API,
 *        getBodyValue API를 사용하시면, 에디터에 set 할 때도 setBodyValue API
 * 3. get과 set API는 아래 예제 이외에도 여러가지 API가 있어 시스템 환경에 맞게 사용하시면 됩니다.
 *    get API : getHtmlValueExWithDocType, getHtmlValueEx, getHtmlValue, getBodyValueEx, getBodyValue
 *    set API : setHtmlValueExWithDocType, setHtmlValueEx, setHtmlValue, setBodyValueEx, setBodyValue
 *
 *    // 현재 멀티가 아님으로 아이디 dext5editor는 생략가능합니다.
 *    DEXT5.getHtmlValue('dext5editor'); // <html> 테그 내부 불러오기 함수실행
 *    DEXT5.setHtmlValue(htmlValue, 'dext5editor'); // <html> 테그 내부 세팅 함수실행
 *    DEXT5.getBodyValue('dext5editor'); // <body> 테그 내부 불러오기 함수실행
 *    DEXT5.setBodyValue(htmlValue, 'dext5editor'); // <body> 테그 내부 세팅 함수실행
 *    DEXT5.getBodyTextValue('dext5editor'); // <body> 테그 내부 텍스트만 불러오기 함수실행
 *
 *    //  getBodyValueEx 는 body포함 내역 가져오며 getHtmlValueEx 는 html포함 내역 가져온다
 *    // <body> 태그 내부의 텍스트 가져옴 : DEXT5.getBodyTextValue("dext5editor");
 *    // 커셔위치에 HTML 소스 삽입 : DEXT5.setInsertHTML(value, "dext5editor");
 *    // 에디터 작성가능 여부 : DEXT5.setEditorBodyEditable(true, "dext5editor")
*/

com.fnViewDextEditor = function(option) {
	
	var iframeSrc = "/dext5Editor?dFrameId="+option.dFrameId;

    if( option.dBlockId != "" ) {
        iframeSrc+="&dBlockId="+option.dBlockId;
        $("#"+option.dBlockId).block({overlayCSS:{backgroundColor:'#000',opacity:0.2}, message: null });
    }

    if( option.dCallBackFn != "" ) {
        iframeSrc+="&dCallBackFn="+option.dCallBackFn;
    }
    
    if( option.xssYn != "" ) {
    	iframeSrc+="&xssYn="+option.xssYn;
    }

    var dFrameId = option.dFrameId.substring(option.dFrameId.lastIndexOf("_")+1, option.dFrameId.length);

    com.$w.getFrame().getObj(dFrameId).setSrc(iframeSrc);
};

/*
 * 퀵메뉴 ERP 탭
 */
/*
com.fnErpPageTap = function(result, e) {
    com._openTab(gcm.MENU_TITLE, gcm.MENU_ID, gcm.MENU_URL);
};
*/
