/**
 * @target 서버통신 관련 공통함수
 */

/**
 * 서버통신 관련 공통함수를 제공하는 개체입니다.
 *
 * @type {object}
 * @class configLib
 * @namespace configLib
 */
var ajaxLib = {};
var msgCn;
/**
 * 지정한 옵션으로 서버와 AJAX 통신을 수행합니다.
 *
 * @author SONG WONSEOK
 * @date 2017. 06. 22.
 * @memberOf ajaxLib
 * @param {string} action - 서버의 API 액션 경로를 지정합니다
 * @param {object} options - 옵션 기타 사항들을 지정합니다.
 * @param {object} [options.mode] - 동기/비동기 모드를 지정합니다.<br>
 *            (asynchronous(기본값), synchronous)
 * @param {object} [options.mediatype] - 콘텐츠 유형을 지정합니다.<br>
 *            (application/xml, application/x-www-form-urlencoded, application/json(기본값), text/xml)
 * @param {object} [options.method] - HTTP 동사를 지정합니다.<br>
 *            (POST(기본값), GET, PUT, DELETE)
 * @param {object} [options.requestData] - 서버로 전달할 Request 데이터입니다.<br>
 *            mediatype과 일치하는 데이터 형식을 전달해야 합니다.
 * @param {object} [options.processMsg] - 메시지를 지정합니다.
 * @param {object} [options.requestHeader] - Request Header 정보를 담고 있는 JSON 개체
 * @param {object} [options.callback] - 콜백 함수명입니다.
 * @param {object} [options.errCallback] - 오류 콜백 함수명입니다.
 * @returns {object} 서버에서 반환한 데이터
 */
ajaxLib.ajax = function(action, options) {
    try {

        if (!action) {
            // 개발자 메시지: 영문지원 안 함
            throw "서버와 통신하기 위해서 필요한 액션 경로를 지정해주십시오.";
        } else if (!options) {
            // 개발자 메시지: 영문지원 안 함
            throw "서버와 통신하기 위해서 필요한 기타 사항들을 지정해주십시오.";
        }

        // 동기/비동기 모드를 지정합니다.
        var mode = options.mode || "asynchronous";

        // 콘텐츠 유형을 지정합니다.
        var mediatype = options.mediatype || "application/json";

        // HTTP 동사를 지정합니다.
        var method = options.method || "POST";

        // 메시지를 지정합니다.
        var processMsg = (typeof options.processMsg == "undefined") ? "처리 중 입니다." : options.processMsg;

        var requestData = {};

        // 서버로 전달할 Request 데이터입니다.
        if (options.requestData != '') {
            requestData = options.requestData;
        }

        /*
        if(sessionStorage.getItem("accessToken")){
            requestData["accessToken"] = sessionStorage.getItem("accessToken");
        }
        */

        requestData = strLib.serialize(requestData);

        // 콜백/오류 콜백 함수명입니다.
        var callback = options.callback || "";
        var errCallback = options.errCallback || "";

        //index.xml 에 있는 로그아웃 타이머 초기화
        if(gcm.tab_main != undefined) {
            var indexTab = gcm.tab_main.scope_obj.getObj("scwin");
            if (typeof(indexTab["fnTimerReset"]) == "function"){
                indexTab["fnTimerReset"]();
            }
        }

        //open 팝업에서 호출시
        try {
            if($w.isPopup()) {
                var winPopParam = JSON.parse(sessionStorage.winpopParam);
                var parentId    = winPopParam.dataObj.data.pframeId;
                if(parentId != undefined && parentId != "") {
                    var parentObj = opener.frames[parentId].getWindow().com;
                    //utils.js 에 있는 fnindexTabTimerReset 호출
                    if (typeof(parentObj["fnIndexTabTimerRest"]) == "function"){
                        parentObj["fnIndexTabTimerRest"]();
                    }
                }
            }
        } catch(e) {
            console.log("eee :"+e.toString());
        }

        var result = null;

        /* CSRF 설정
        var token = $("meta[name='_csrf']").attr("content") || "";
        var headerName = $("meta[name='_csrf_header']").attr("content") || "";
        if( headerName != "" ) {
            options.requestHeader = options.requestHeader || {};
            options.requestHeader[headerName] = token;
        }
        */
        $w.ajax({
            action : action,
            mode : mode,
            mediatype : mediatype,
            method : method.toUpperCase(),
            processMsg : processMsg,
            requestData : requestData,
            /* CSRF 설정
            requestHeader : options.requestHeader,
            */
            beforeAjax : function(e) {
                // 삭제처리 : 스프링 시큐리티 처리
                /*
                if(location.href.indexOf("/ux/cf/CF00050000U.xml") == -1 &&
                    WebSquare.w2xPath  != "/ux/cf/CF00050000U.xml" &&

                    location.href.indexOf("/ux/po/po0500/PO05000006U.xml") == -1 &&
                    WebSquare.w2xPath  != "/ux/po/po0500/PO05000006U.xml" &&

                    location.href.indexOf("/notifyAprv") == -1
                ){
                     if(com.isEmpty(sessionStorage.getItem("accessToken"))){
                         alert("accessToken이 없습니다.\n로그아웃 처리 합니다.");
                         com.logOut();
                         return false;
                     }
                }
                */
            },
            success : function(e) {
                result = ajaxLib._callBackAjax(e, {
                    result : "SUCCESS",
                    argument : requestData,
                    callback : callback,
                    mediatype : mediatype.toLowerCase(),
                    mode : mode.toLowerCase()
                });
            },
            error : function(e) {
                ajaxLib._callBackAjax(e, {
                    result : "ERROR",
                    argument : requestData,
                    errCallback : errCallback,
                    mediatype : mediatype.toLowerCase(),
                    mode : mode.toLowerCase()
                });
            }
        });

        return result;
    } catch (e) {
        $W.exception.printStackTrace(e);
        commLib.log("ajaxLib.ajax: " + e);
    }
};

/**
 * [내부용] 서버와 AJAX 통신을 수행한 결과를 처리하고 사용자가 지정한 콜백을 수행합니다.
 *
 * @author SONG WONSEOK
 * @date 2017. 06. 22.
 * @memberOf ajaxLib
 * @param {object} e - XHR 이 매개변수로 반환한 개체입니다.
 * @param {object} statusObj - 요청에 전달된 정보와 상태 정보를 담고 있습니다.
 * @returns {object} 서버에서 반환한 데이터
 */
ajaxLib._callBackAjax = function(e, statusObj) {
    try {
        // 서버에서 반환된 결과를 정리합니다.
        var responseBody = null;
        var responseText = null;
        if (statusObj.mediatype == "application/json") {
            if (statusObj.result == "SUCCESS") {
                responseText = e.responseText;
            } else {
                responseText = e.responseBody.replaceAll("text/", "");
            }
            if (strLib.isEmpty(responseText, true)) {
                responseBody = {};
            } else if (responseText && (responseText.trim().indexOf("{") == 0 || responseText.trim().indexOf("[") == 0)) {
                responseBody = strLib.parse(responseText.trim());
            } else {
                responseBody = null;
            }
        } else if (statusObj.mediatype == "application/xml") {
            responseBody = WebSquare.xml.parse("<ret />");
            if (typeof e.responseBody != "undefined") {
                responseBody = WebSquare.xml.parse(e.responseBody);
            }
        } else {
            responseBody = e.responseText;
        }

        if (statusObj.result == "SUCCESS") {
            // AJAX 통신 성공 후처리를 수행합니다.
            /*
            if(responseBody != null && responseBody.accessToken != null && responseBody.accessToken != ""){
                sessionStorage.setItem("accessToken", responseBody.accessToken);
            }
            */
            // 일반 오류메시지 처리
            var needErrorCallback = false;
            if (responseBody && responseBody.msgCode && responseBody.msgCode == "error") {
                needErrorCallback = true;

                if (responseBody.msgErrorCode) {
                    var msgErrorCode = responseBody.msgErrorCode;
                    if (msgErrorCode == "validationError") {
                        // valid.0001: 서버 측 유효성 검사에 실패했습니다.
                        alert(commLib.getMessage("valid.0001"));
                    } else if (msgErrorCode == "duplicateKeyError") {
                        // valid.0002: 중복된 데이터가 이미 존재합니다.
                        alert(commLib.getMessage("valid.0002"));
                    } else if (msgErrorCode == "serverError") {
                        // sysm.0001: 서버에서 알 수 없는 오류가 발생했습니다.
                        alert(commLib.getMessage("sysm.0001"));
                    } else if (msgErrorCode == "loginError" || msgErrorCode == "detailError") {
                        // 로그인 오류는 화면에서 별도 처리
                        needErrorCallback = false;
                    } else if (msgErrorCode == "SessionInvalidError") {
                        commLib.moveToLoginPage();
                    } else {
                        // sysm.0001: 서버에서 알 수 없는 오류가 발생했습니다.
                        alert(commLib.getMessage("sysm.0001"));
                    }
                } else {
                    // sysm.0001: 서버에서 알 수 없는 오류가 발생했습니다.
                    alert(commLib.getMessage("sysm.0001"));
                }
            }
            if (needErrorCallback) {
                // 사용자 지정 오류 콜백을 수행합니다.
                if (statusObj.errCallback != "") {

                    if ( typeof statusObj.callback == "function") {
                        statusObj.callback(responseBody, e);
                    } else if ( typeof statusObj.callback == "string") {
                        var _cb = statusObj.errCallback.replace(_key,"").replaceAll(".","");
                        var errCallback = _tmp[_cb];
                        if (errCallback && typeof errCallback == "function") {
                            console.log('Call back 함수로 간다.');
                            errCallback(responseBody, e);
                        }
                    }
                }
            } else {
                // 사용자 지정 콜백을 수행합니다.
                if (statusObj.callback != "") {

                    if ( typeof statusObj.callback == "function") {
                        statusObj.callback(responseBody, e);
                    } else if ( typeof statusObj.callback == "string") {

                        var arg = com.$w || [];
                        var _key = statusObj.callback.split(".")[0] == "com"? "com" : "scwin";
                        var _cb = statusObj.callback.replace(_key,"").replaceAll(".","");
                        try{
                            var _tmp = arg.getFrame().getObj(_key);
                                var callback = _tmp[_cb];
                                if (callback && typeof callback == "function") {
                                    callback(responseBody, e);
                                }
                        }catch(e){
                            console.log("eee :"+e.toString());
                        }
                    }
                }
            }

            if (statusObj.mode == "synchronous") {
                return responseBody;
            }
        } else if (statusObj.result == "ERROR") {

            // 이곳에 권한, 세션종료 관련 처리코딩 : function(e, statusObj)
            // 특정 값에서는 이하가 처리
            // alert("로그아웃 처리 합니다.");
            // com.logOut();
            //debugger;
            // AJAX 통신 실패 후처리를 수행합니다.
            var msgCd = responseBody.data.code;
            var msgCn = responseBody.data.message;
            var msgParam = responseBody.data.msgVal;
            var msgYn = "N";
            var url = "";
            console.log('msgCd = <{}> ,msgCn = <{}> ,msgParam = <{}> ' , msgCd ,msgCn ,msgParam);
            if (msgCd == 'CFA0000' || msgCd == 'CFA0005' || msgCd == 'CFA0004') {
                sessionStorage.clear();
                msgYn = "Y";
            } else {
                if (com.isEmpty(gcm.MSG_INFO_LIST)) {
                    com.setMsgInfo(gcm.CD_KEY["Msg"]);
                }

                var msgList = JSON.parse(gcm.MSG_INFO_LIST);
                var len = msgList.length;

                for(i = 0; i < len; i++) {
                    if (msgCd == msgList[i].msgCd) {
                        msgCn = msgList[i].msgCn;
                        msgYn = "Y";
                    }
                }
            }

            if ((msgYn == "N" && msgCn.indexOf("invalid session") < 0) || (msgCd == 'CFE0014')) {
                url = "/ux/common/genError.xml";
            } else {
                url = "/ux/common/errorAlertP.xml"
            }

            if (msgParam != null && msgParam != undefined && msgParam.length > 0) {
                for (var i = 0; i < msgParam.length; i++) {
                    var msgVal = "$" + (i+1);
                    msgCn = msgCn.replace(msgVal, msgParam[i]);
                }
            }

            var popOps = {
                    popup_name	: "에러 메시지"
                    ,url  		: url
                       ,data 		: { msgCd : msgCd , msgCn : msgCn}
                       ,width		: "400"
                       ,height		: "300"
            };

            com.popup_open(popOps);

            $('.w2window').addClass('alert');
        }
    } catch (e) {
        $W.exception.printStackTrace(e);
        commLib.log("ajaxLib._callBackAjax: " + e);
    }
};
