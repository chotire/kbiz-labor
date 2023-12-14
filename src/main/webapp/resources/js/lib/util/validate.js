;
/**validate 관련 Function Start*/



/** 
 * 인자로 넘겨준 component 객체들에 req 클래스 셋팅과 mandatory 셋팅을 지원한다.
 * @date 2019.02.13
 * @memberOf com
 * @param {Object} mandatory setting대상 component 지정
 * @returns {Void}
 * @example
 * 
 * var _compArr = [textBox1,selectbox2,...]
 * com.setMandatory(_compArr);
 * 
*/
com.setMandatory = function( compArr ){
	
    $.each(compArr , function(idx,_comp){
        var _compType = _comp.getPluginName();        
        switch(_compType){
        case "selectbox":
        case "input":
        	break;
        }
        _comp.addClass("req");
        _comp.setMandatory(true);        
    });
};

/** 
 * 인자로 넘겨준 component 객체들에 req 클래스 해제 와  mandatory를 해제한다. 
 * @date 2019.02.13
 * @memberOf com
 * @param {Object} mandatory release대상 component 지정
 * @returns {Void}
 * @example
 * 
 * var _compArr = [textBox1,selectbox2,...]
 * com.releaseMandatory(_compArr);
 * 
*/
com.releaseMandatory = function( compArr ){
    $.each(compArr , function(idx,_comp){
        var _compType = _comp.getPluginName();        
        switch(_compType){
        case "selectbox":
        case "input":
        	break;
        }
        _comp.removeClass("req");
        _comp.setMandatory(false);        
    });
};

/** 
 * 현재페이지의 모든 mandatory되어있는 상태를 초기화합니다.
 *  
 * @date 2019.02.13
 * @memberOf com
 * @param {Void}
 * @returns {Void}
 * @example
 * 
 * com.releaseAllMandatory();
 * 
*/
com.releaseAllMandatory = function(){
	var _jqCompArr = $("#"+$p.getFrame().id +" .req");	
    $.each(_jqCompArr , function(idx,_comp){        
        var comp  = $w.getComponentById(_comp.id);
        var _type = comp.getPluginName();        
        switch(_type){
        	case "selectbox":
        	case "input":
        		comp.removeClass("req");
                comp.setMandatory(false);
        	break;
        }                
    });
};

/**
 * 그룹안에 포함된 컴포넌트의 입력 값에 대한 유효성을 검사한다.
 * 컴포넌트 속성 유효성 검사를 수행하고, valInfoArr 유효성 검사 옵션에 대해서 유효성 검사를 수행한다.
 * valInfoArr 유효성 검사 옵션 파라미터를 전달하지 않은 경우 컴포넌트 속성(mandatory, allowChar, ignoreChar, maxLength, maxByteLength, minLength, minByteLength)에 대해서만 유효성 검사를 수행한다.
 * 
 * 1. 인자값으로 group만 준경우 group안의 component들중 mandatory가 true인 component를 추출한다. 
 *    1.1. 값이 없는 component를 err class를 준다. -end
 *    
 * 2. 인자값으로 group과 그룹내부의 component array값을 받는다.체크할 대상도 같이 받는다.기본 mandatory 
 * 
 * @date 2019.02.13
 * @memberOf com
 * @param {Object} grpObj 그룹 컴포넌트 객체
 * @param {Object[]} grpObj내부의 특정 component객체 Array
 * @returns {Boolean} 유효성 검사 결과
 * @example
 * 
 * var valInfo = [ groupObj, inputCompId1, inputCompId2,...];
 * 
 * if (com.validateGroup(valInfo)) {
 *	 if (confirm("변경된 데이터를 저장하시겠습니까?")) {
 *		 ajaxLib.ajax...수행
 *	 }
 * }
 * 
 * @description
 *  ※ 필수 입력, 입력 허용 문자, 입력 허용 불가 문자, 최대, 최소 입력 문자수 설정은 컴포넌트의 속성에서 설정한다. <br/>
 *  - mandatory : 필수 입력 항목 여부 <br/>
 */
com.validateGroup = function( checkCompArr ) {	
	var _flag = true;
	var objType = com.getObjectType(checkCompArr);
	if(objType == "array"){
	$.each(checkCompArr,function(idx,_comp){
		//comp가 group인경우 group내부의 component중 req Class와  mandatory가 적용되어있는component확인
		var _compType = _comp.getPluginName();
		var obj;
		switch(_compType){
			case "group":
				var objArr = WebSquare.util.getChildren(_comp, {
					excludePlugin : "group trigger textbox output calendar image span anchor pageInherit wframe itemTable",
					recursive : true
				});
				for (var objIdx in objArr) {
					obj = objArr[objIdx];
					if ((typeof objArr[objIdx].validate === "function") && (objArr[objIdx].validate() === false) && obj.hasClass("req")) {  
						obj.addClass("err");
						_flag = false;
						continue;
					}
				}			
			break;
			case "selectbox":
			case "input":
				obj = _comp;
			
				if ((typeof obj.validate === "function") && (obj.validate() === false) && obj.hasClass("req")) {  
					obj.addClass("err");
					_flag = false;
				}
				break;
		}
		
	});
	
	}else{//단독객체 하나
		var _compType = checkCompArr.getPluginName();
		var obj;
		switch(_compType){
			case "group":
				var objArr = WebSquare.util.getChildren(checkCompArr, {
					excludePlugin : "group trigger textbox output calendar image span anchor pageInherit wframe itemTable",
					recursive : true
				});
				for (var objIdx in objArr) {
					obj = objArr[objIdx];
					if ((typeof objArr[objIdx].validate === "function") && (objArr[objIdx].validate() === false) && obj.hasClass("req")) {  
						obj.addClass("err");
						_flag = false;
						continue;
					}
				}			
			break;
			case "selectbox":
			case "input":
				obj = checkCompArr;
				if ((typeof obj.validate === "function") && (obj.validate() === false) && obj.hasClass("req")) {  
					obj.addClass("err");
					_flag = false;
				}
				break;
		}
		
	}
	try {		
		if(!_flag){			
			com.showMessage("CFW0001");		//필수 입력 항목입니다.
		}				
		return _flag;
	} catch(e) {
		console.log("[com.validateGroup] Exception :: Object Id : " + obj.getID() + ", Plug-in Name: " + obj.getPluginName() + ", "+ e.message);
	} finally {		
		console.log("finally");
	}
};


/**
 * GridView를 통해서 입력된 데이터에 대해서 유효성을 검증한다.
 * 
 * @date 2018.01.19
 * @memberOf com
 * @param {Object} gridViewObj GridView 객체
 * @param {Object[]} options 데이터 유효성 검증 옵션
 * @param {String} options[].id 유효성 검사 대상 DataCollection 컬럼 아이디
 * @param {Boolean} options[].mandatory 필수 입력 값 여부
 * @param {Number} options[].minLength 최소 입력 자리수
 * @param {requestCallback} options[].valFunc 사용자 유효성 검사 함수
 * @param {Object} tacObj GridView가 포함된 TabControl 컴포넌트 객체
 * @param {String} tabId GridView가 포함된 TabControl 컴포넌트의 Tab 아이디
 * @returns {Boolean} 유효성검사 결과
 * @since 2015.08.05
 * @example 
 * var valInfo = [ {id: "grpCd", mandatory: true, minLength: 5}, 
 *				 {id: "grpNm", mandatory: true} ];
 * 
 * if (com.validateGridView(grd_MenuAuthority, valInfo)) {
 *	 if (confirm("변경된 데이터를 저장하시겠습니까?")) {
 *		 scwin.saveGroup();
 *	 }
 * }
 * 
 * var valInfo = [ { id : "prntMenuCd", mandatory : true }, 
 *				 { id : "menuCd", mandatory : true, 
 *					 valFunc : function() {
 *						 if (dmaMenu.get("prntMenuCd") == dmaMenu.get("menuCd")) {
 *							 return "상위 메뉴 코드와 메뉴 코드가 같아서는 안됩니다.";
 *						 }
 *					 } },
 *				  { id : "menuNm", mandatory : true }, 
 *				  { id : "menuLevel", mandatory : true }, 
 *				  { id : "menuSeq", mandatory : true }, 
 *				  { id : "urlPath", mandatory : true },
 *				  { id : "isUse", mandatory : true } ];
 * 
 * if (com.validateGridView(grd_MenuAuthority, valInfo, tacMenuInfo, "tabMenuInfo1") == false) {
 *	 return false;
 * }
 * @description 
 * * 입력 허용 문자, 입력 허용 불가 문자, 최대 입력 문자수 설정은 GridView의 Column의 속성에서 설정한다. <br/>
 * - allowChar : 입력 허용 문자 <br/>
 * - ignoreChar : 입력 허용 불가 문자 <br/>
 * - maxLength : 최대 입력 문자수 <br/>
 */
com.validateGridView = function(gridViewObj, valInfoArr, tacObj, tabId) {
	
	if (gridViewObj === null) {
		return false;
	}
	
	var dataList = com.getGridViewDataList(gridViewObj);
	if (dataList === null) {
		$p.log("Can not find the datalist of '" + gridViewObjId + "' object.");
		return false;
	}

	var valStatus = {
		isValid : true,
		message : "",
		error : [] // { columnId: "", columnName: "", rowIndex: 0, message: "" }
	};

	try {
		var modifiedIdx = dataList.getModifiedIndex();

		for (var dataIdx = 0; dataIdx < modifiedIdx.length; dataIdx++) {
			var modifiedData = dataList.getRowJSON(modifiedIdx[dataIdx]);
			if (modifiedData.rowStatus === "D") {
				continue;
			}
			for (var valIdx in valInfoArr) {
				var valInfo = valInfoArr[valIdx];
				if ((typeof valInfo.id !== "undefined") && (typeof modifiedData[valInfo.id] !== "undefined")) {

				    var value = modifiedData[valInfo.id];
				    if( typeof value != "number" ){
				        value = value.trim();
				    }

					if ((typeof valInfo.mandatory !== "undefined") && (valInfo.mandatory === true) && (value.length === 0)) {
						_setResult(modifiedIdx[dataIdx], dataList, gridViewObj.getID(), valInfo.id, "필수 입력 항목 입니다.");
					} else if ((typeof valInfo.minLength !== "undefined") && (valInfo.minLength > 0) && (value.length < valInfo.minLength)) {
						_setResult(modifiedIdx[dataIdx], dataList, gridViewObj.getID(), valInfo.id, "최소 길이 " + valInfo.minLength + "자리 이상으로 입력해야 합니다.");
					} else if (typeof valInfo.valFunc === "function") {
						var resultMsg = valInfo.valFunc(value, modifiedData);
						if ((typeof resultMsg !== "undefined") && (resultMsg !== "")) {
							_setResult(modifiedIdx[dataIdx], dataList, gridViewObj.getID(), valInfo.id, resultMsg);
						}
					}
				}
				
				if (valStatus.error.length > 0) {
					break;
				}
			}
		}

		if (valStatus.error.length > 0) {
			valStatus.isValid = false; 
			valStatus.message = "유효하지 않은 값이 입력 되었습니다";
			
			if ((typeof tacObj !== "undefined") && (typeof tabId !== "undefined") && (tabId !== "")) {
				var tabIndex = tacObj.getTabIndex(tabId);
				tacObj.setSelectedTabIndex(tabIndex);
			}

			gcm.valStatus.isValid = false;
			gcm.valStatus.objectType = "gridView";
			gcm.valStatus.objectName = valStatus.error[0].comObjId ;
			gcm.valStatus.columnId = valStatus.error[0].columnId; 
			gcm.valStatus.rowIndex = valStatus.error[0].rowIndex;
			
			com.showMessage("CFW0010", valStatus.error[0].message);		//가변 조합된 메시지 처리
		}
		
		return valStatus.isValid;

		function _setResult(rowIndex, dataList, gridViewObjId, columnId, message) {
			var errIdx = valStatus.error.length;
			valStatus.error[errIdx] = {};
			valStatus.error[errIdx].columnId = columnId;
			valStatus.error[errIdx].comObjId = gridViewObjId;
			valStatus.error[errIdx].columnName = dataList.getColumnName(columnId);
			valStatus.error[errIdx].rowIndex = rowIndex;
			valStatus.error[errIdx].message = com.attachPostposition(valStatus.error[errIdx].columnName) + " " + message;
		}
	} catch(e) {
		$p.log("[com.validateGridView] Exception :: " + e.message);
	} finally {
		modifiedData = null;
		modifiedIdx = null;
		dataList = null;
		gridViewObj = null;
	}
};


/**
 * 유효성 검사 실패시 출력할 메시지를 반환한다.
 * 
 * @date 2014.12.10
 * @private
 * @memberOf com
 * @author InswaveSystems
 * @returns {String} 유효성 검사 결과 메시지
 */
com.validateMsg = function() {
	var msg = "";
	var invalidType = this.getType();   // invalid 타입
	var invalidValue = this.getValue(); // invalid 타입별 설정값
	
	var callerObj = null;
	if (typeof this.getCaller === "function") {
		callerObj = this.getCaller();
	} else if (typeof this.userFunc !== "undefined") {
		callerObj = $p.getComponentById(this.userFunc.arguments[1]);
	} else {
		return;
	}
	
	var scopeCom = gcm._getScope(callerObj).com;
	var columnName = scopeCom.getColumnName(callerObj);
	
	switch (invalidType) {
		case "mandatory":
			msg = scopeCom.attachPostposition(columnName) + "필수 입력 항목 입니다.";
			break;
		case "minLength":
			msg = scopeCom.attachPostposition(columnName) + "최소 길이 " + invalidValue + "자리 이상으로 입력해야 합니다.";
			break;
		case "minByteLength":
			msg = scopeCom.attachPostposition(columnName) + "최소 길이 " + invalidValue + "바이트 이상으로 입력해야 합니다.";
			break;
		default :
			msg = scopeCom.attachPostposition(columnName) + "유효하지 않은 값이 입력 되었습니다.";
			break;
	}

	if (msg !== "") {
		gcm.valStatus.isValid = false;
	}
	
	gcm.valStatus.objectType = "group";
	gcm.valStatus.objectName = callerObj.getID();
	
	//scopeCom.alert(msg, "gcm._groupValidationCallback");
	com.showMessage("CFW0010", msg);		//가변 조합된 메시지 처리
	return msg;
};
/**validate 관련 Function Finish*/
;