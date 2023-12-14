/**
 * @target 기본, 구성정보, 파일 관련 공통함수
 */

/**
 * 1. 페이지에서 편집 중 백스페이스 키를 눌러서 의도치 않게 이전 페이지로 이동하는 경우를 막기 위한 onkeydown 이벤트 핸들러 등록<br>
 * 2. 마우스 오른쪽 버튼 금지 (디버그 모드가 아닐 경우)
 */
(function() {
	var configXml = WebSquare.BootLoader.configurationDOM[0];
	var isDebug = (WebSquare.xml.getValue(configXml, "WebSquare/debug/@value") === "true");	
	
	// 백스페이스 키 입력 제어
	WebSquare.event.addListener(WebSquare.document, "onkeydown", function(event) {
		if (event.keyCode == 8) {
			var object = WebSquare.event.getTarget(event);
			var tagName = object.tagName.toLowerCase();
			
			var type = object.type;					
			if (!type || typeof type == "undefined") {
				type = "";
			}

			if (tagName == "textarea") {
				if (object.readOnly) {
					WebSquare.event.stopEvent(event);
				}
			} else if (tagName == "input") {
				if (type == "text" || type == "password") {
					if (object.readOnly) {
						WebSquare.event.stopEvent(event);
					}
				} else {
					WebSquare.event.stopEvent(event);
				}
			} else {
				WebSquare.event.stopEvent(event);
			}
		}
	});
	
	// 클릭 처리
	WebSquare.event.addListener(WebSquare.document, "onclick", function(event) {
		$(".err").removeClass('err');	
		
		//console.log("ibxTopSrchWrd :: " + document.activeElement.id.indexOf("ibxTopSrchWrd"));
		//console.log("grpTopSrchA :: " + document.activeElement.id.indexOf("grpTopSrchA"));
		//console.log("tbxHkeyword :: " + document.activeElement.id.indexOf("tbxHkeyword"));
		//console.log("tbxJbPos :: " + document.activeElement.id.indexOf("tbxJbPos"));
		//console.log("tbxCp :: " + document.activeElement.id.indexOf("tbxCp"));
		//console.log("tbxTeam :: " + document.activeElement.id.indexOf("tbxTeam"));
		
		if (document.activeElement.id.indexOf("ibxTopSrchWrd") <= -1) {
			//console.log("검색어를 떠나 간다");

		    try {
	            if( $(".grpTopSrchListClass").attr('style').indexOf("block") > -1 ){
	                $(".grpTopSrchListClass").attr('style',"display:none");
	            }
	            
	            if (event.toElement.id.indexOf("tbxHkeyword") <= -1 || event.toElement.id.indexOf("tbxJbPos") <= -1
	                    || event.toElement.id.indexOf("tbxCp") <= -1 || event.toElement.id.indexOf("tbxTeam") <= -1
	                    || event.toElement.id.indexOf("grpTopSrchA") <= -1) {
	                //console.log('--- 이벤트----');
	                $(".grpTopSrchListClass").attr('style',"display:none");
	            }           
            } catch (e) {
            }
		} 
	});
	
	if (!isDebug) {
		WebSquare.event.addListener(WebSquare.document, "oncontextmenu", function(event) {
			var objContextMenuLayer = document.getElementById("_contextMenuLayer");
			if (objContextMenuLayer != null)
				objContextMenuLayer.style.display = "none";
			WebSquare.event.stopEvent(event);
	    	return false;
	    });
	}
})();


/**
 * 기본적인 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class commLib
 * @namespace commLib
 */
var commLib = {};

/**
 * 구성정보 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class configLib
 * @namespace configLib
 */
var configLib = {};

/**
 * 파일 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class fileLib
 * @namespace fileLib
 */
var fileLib = {};

/**
 * commLib.setGridViewResizing(arrGridView, arrAdjust) - 지정한 그리드뷰들의 높이를 자동으로 리사이징 하는 이벤트 핸들러를 설정합니다.<br>
 * commLib.setDPPSchedulerResizing(scheduler, adjust) - 지정한 DayPilot Pro Scheduler 컴포넌트의 높이를 자동으로 리사이징 하는 이벤트 핸들러를 설정합니다.<br>
 * commLib.setAUIPivotResizing(auiPivot, adjust) - 지정한 AUIPivot 컴포넌트의 높이를 자동으로 리사이징 하는 이벤트 핸들러를 설정합니다.<br>
 * commLib.checkPageAuth() - 현재 페이지의 권한을 점검합니다.<br>
 * commLib.checkPageButton() - 현재 페이지의 권한에 따라 버튼의 출력을 제어합니다.<br>
 * commLib.setPageTitle() - 페이지의 타이틀을 메뉴와 동일하게 보정합니다.<br>
 * commLib.setEnterKeySearch() - 페이지에서 첫번째 검색 상자를 찾아서 그 하위의 InputBox 등의 컴포넌트에 Enter 키 검색 이벤트 헨들러를 설정합니다.<br>
 * commLib.getCommonCodeList(codeList, callback) - 지정한 공통코드를 모두 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getAuthGrpCodeList(callback) - 권한그룹코드를 모두 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getSimEquipList(callback) - SIM 장비 코드를 조회하여 데이터리스트를 생성합니다.<br>
 * commLib._getCmmCrseCodeList(regularFlg, jobCode, callback) - [내부용] 과정코드를 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getCmmCrseCodeListByJobCode(jobCode, callback) - JOB CODE별 과정코드를 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getCmmCrseCodeList(callback) - 훈련 과정코드를 모두 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getCmmCrseCodeListOnlyI(callback) - 비정기 훈련 과정코드를 모두 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getCmmCrseCodeListOnlyR(callback) - 정기 훈련 과정코드를 모두 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getCmmCategoryList(categoryCd, callback) - ATEQS 카테고리를 조회하여 데이터리스트를 생성합니다.<br>
 * commLib.getCmmSheetTreatNbrList(treatNbr, callback) - SHEET페이지 treatNbr 조회합니다.<br>
 * commLib.getCmmSheetTreatCdList(treatCd, callback) - treatNbr코드 선택 된 TreatCd 조회.<br>
 * commLib.getCmmSheetUasNbrList(uasNbr, callback) - SHEET USA탭 uasNbr 데이터조회. commLib.getCmmSheetUasCdList(uasCd, callback) - SHEET USA탭 uasCd 데이터조회 commLib.getCmmSheetCourseCodeList(jobCode, callback) - Sheet 관리 course 조회 job Code 값에따라 변경 데이터리스트를 생성합니다.<br>
 * commLib.getCmmSheetItemListNameCodeLis(jobCod, sheetType, acCode, courseCode, trainingType, callback) - 선택코드에 따라 변경 SHEET 관리 팝업 ItemListNameCode 데이터리스트생성.<br>
 * commLib.getCmmSheetTemplateCodeList(callback) - SHEET 관리 팝업 Template 데이터리스트를 생성합니다.<br>
 * commLib.getTrngReqSeqList(carrCd, trngAcTyp, crseCd, callback) - 항공사코드, 기종, 과정코드 조회 훈련요구량 데이터리스트를 생성합니다.<br>
 * 
 * commLib.loadMessageStorage() - 지정한 메시지 목록을 SessionStorage에 적재합니다.<br>
 * commLib.getMessage(msgCode) - 지정한 메시지 코드와 일치하는 메시지를 반환합니다.
 * 
 * commLib.getControlById(id) - 지정한 ID에 해당하는 WQ 컴포넌트 개체를 반환합니다.<br>
 * commLib.getTypeById(id) - 지정한 ID에 해당하는 WQ 컴포넌트 개체의 유형을 반환합니다.<br>
 * commLib.moveToW2xPath(url, target) - 지정한 target 프레임(미지정 시 self)의 페이지를 지정한 WebSquare URL로 이동합니다.<br>
 * commLib.moveToW2xPathByPost(url, params) - 지정한 WebSquare URL로 이동합니다. (HTTP Post)<br>
 * commLib.moveToLoginPage() - 세션 만료시 호출되는 함수로 현재 페이지의 형태를 감안하여 메인 프레임을 로그인 페이지로 강제 이동시킵니다.<br>
 * commLib.setItems(control, items, valueColumn, nameColumn) - 지정한 SelectBox, Checkbox, Radio에 지정한 JSON 배열, 2x2 배열, 문자열 배열 데이터를 설정합니다.<br>
 * commLib.setItemsSimple(control, items) - 지정한 SelectBox, CheckBox, Radio에 지정한 단순 문자열 배열 데이터를 설정합니다.<br>
 * commLib.setItemsBindding(control, dataListId, valueName, labelName) - 지정한 SelectBox, Checkbox, Radio에 지정한 DataList 정보를 설정합니다.<br>
 * commLib.setGridViewItemsBindding(gridView, columnId, dataListId, valueName, labelName) - 지정한 GridView의 SelectBox컬럼에 지정한 DataList 정보를 설정합니다.<br>
 * commLib.enableAll(control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들을 활성화시킵니다.<br>
 * commLib.disableAll(control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들을 비활성화시킵니다.<br>
 * commLib.readOnlyAll(control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들을 읽기전용 속성을 활성화시킵니다.<br>
 * commLib.writableAll(control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들을 읽기전용 속성을 비활성화시킵니다.<br>
 * commLib.getValuesByJSON(control, excludeList) -지정한 그룹 하위의 모든 컴포넌트들의 값을 JSON 형식으로 반환합니다.<br>
 * commLib.saveSnapshot = function(snapshotName, control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들의 현재 스냅샷 값을 내부적으로 저장합니다.<br>
 * commLib.reloadSnapshot(snapshotName, control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들의 스냅샷 값을 복원합니다.<br>
 * commLib.isSnapshotModified(snapshotName, control, excludeList) - 지정한 그룹 하위의 모든 컴포넌트들의 스냅샷 값이 변경되었는지 여부를 반환합니다.<br>
 * commLib._setDisabled(control, disable, excludeList) - [내부용] 지정한 그룹 하위의 모든 컴포넌트들을 활성화/비활성화시킵니다.<br>
 * commLib._setReadOnly(control, disable, excludeList) - [내부용] 지정한 그룹 하위의 모든 컴포넌트들의 읽기전용 속성을 활성화/비활성화시킵니다.<br>
 * commLib.setWframe(wframe, url, reload) - 지정한 wframe에 지정한 wframe 페이지를 동적으로 로드합니다.<br>
 * commLib.downloadExcel(gridView, filename, options) - 지정한 그리드뷰의 데이터를 EXCEL 파일로 다운로드 합니다.<br>
 * commLib.downloadExcelMulti(filename, sheetInfos) - 지정한 그리드뷰들의 데이터를 여러 개의 시트를 가진 EXCEL 파일로 다운로드 합니다.<br>
 * commLib.uploadExcel(gridView, options) - 지정한 그리드뷰에 EXCEL 파일을 업로드 합니다.<br>
 * commLib.hiddenColumnsIndex(gridView) - 지정한 그리드뷰에서 숨겨진 컬럼들의 Index 배열을 반환합니다.<br>
 * commLib.getColumnIndexs(gridView, columns) - 지정한 복수의 컬럼들의 Index 배열을 반환합니다.<br>
 * commLib.getGridViewDataList(gridView) - 그리드뷰에 바인딩된 DataList 개체를 반환합니다.<br>
 * commLib.dataExist(dataCollectionID) - 지정한 DataCollection이 존재하는지 여부를 반환합니다.<br>
 * commLib.dataCreate(dataCollectionID, type, infoArr, options, data) - 지정한 DataCollection을 동적으로 생성합니다.<br>
 * commLib.dataRemove(dataCollectionID) - 지정한 DataCollection을 제거합니다.<br>
 * commLib.getDataType(dataCollectionID) - 지정한 DataCollection의 유형을 반환합니다.<br>
 * commLib.dataReset(dataCollectionID) - 지정한 DataCollection의 데이터를 빈 값으로 초기화시킵니다.<br>
 * commLib.mergeDataMapSchema(mergedDataMapID, dataMapList, overwrite) - 지정한 DataMap 개체들의 스키마를 병합한 새로운 DataMap을 생성합니다.<br>
 * commLib.mergeDataMapData(mergedDataMapID, dataMapList, overwrite) - 지정한 DataMap 개체들의 스키마를 병합한 새로운 DataMap을 생성하고 데이터를 적재합니다.<br>
 * commLib.getDataChangeInfo(dataCollectionID, keyList) - 지정한 DataMap 개체들의 스키마를 병합한 새로운 DataMap을 생성하고 데이터를 적재합니다.<br>
 * commLib.log(message, ignoreAlert) - WebSquare가 제공하는 웹 브라우저 콘솔 및 자체 디버깅 로그를 출력합니다.
 * 
 * configLib.isDebugMode() - WebSquare가 디버그 모드에서 실행되고 있는지 여부를 반환합니다.<br>
 * configLib.debugInfo() - WebSquare의 디버그 관련 정보를 반환합니다.<br>
 * configLib.scriptModuleList() - WebSquare의 공통 JavaScript 목록을 반환합니다.<br>
 * configLib.language() - WebSquare의 언어 설정을 반환합니다.<br>
 * configLib.processMsgInfo() - WebSquare의 "처리 중" 메시지 팝업 정보를 반환합니다.<br>
 * configLib.sylesInfo() - WebSquare의 StyleSheet 관련 정보를 반환합니다.<br>
 * configLib.environmentInfo() - WebSquare의 개발환경 관련 정보를 반환합니다.<br>
 * configLib.EducInfo(key) - WebSquare 관련 EDUC 사용자 지정 구성 정보를 반환합니다.
 * 
 * fileLib.checkExt(control, allowList) - 선택한 파일의 확장자가 업로드 허용된 파일인지 여부를 반환합니다.<br>
 * fileLib.retXmlToJSON(retXml) - 파일 업로드 결과 XML 개체를 JSON 개체로 변환하여 반환합니다.
 */

/**
 * 페이지 권한 정보
 * 
 * @date 2017. 07. 14.
 * @private
 * @memberOf valLib
 */
commLib.pageAuth = null;

/**
 * 그리드뷰 자동 리사이즈 정보
 * 
 * @date 2017. 06. 26.
 * @private
 * @memberOf valLib
 */
commLib.resize = {
	eventExist: false,
	topList: {},
	adjustList: []
};

/**
 * DayPilot Pro Scheduler 자동 리사이즈 정보
 * 
 * @date 2017. 07. 10.
 * @private
 * @memberOf valLib
 */
commLib.resizeDPPS = {
	eventExist: false,
	topList: {}
};

/**
 * AUIPivot 자동 리사이즈 정보
 * 
 * @date 2017. 07. 10.
 * @private
 * @memberOf valLib
 */
commLib.resizeAUIP = {
	eventExist: false,
	topList: {}
};

/**
 * Window Resize 이벤트를 발생시킨다.
 * 
 * @author SONG WONSEOK
 * @date 2018. 04. 24.
 * @memberOf commLib
 */
commLib.resizeWindow = function() {
	$(window).trigger("resize");
};

/**
 * 지정한 그리드뷰들의 높이를 자동으로 리사이징 하는 이벤트 핸들러를 설정합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 26.
 * @memberOf commLib
 * @param {string[]} arrGridView - 크기를 조정할 그리드뷰 ID들의 배열
 * @param {number[]} arrAdjust - 보정값들의 배열
 */
commLib.setGridViewResizing = function(arrGridView, arrAdjust) {
	try {
		if (!$.isArray(arrGridView)) {
			arrGridView = [ arrGridView ];
		}
		
		if (!arrAdjust) {
			commLib.resize.adjustList = [];
			for (var i = 0; i < arrGridView.length; i++) {
				commLib.resize.adjustList.push(0);
			}
		} else if (arrAdjust) {
			if (!$.isArray(arrAdjust)) {
				commLib.resize.adjustList = [ arrAdjust ];
			} else {
				commLib.resize.adjustList = arrAdjust;
			}
		}
		
		if (arrGridView.length != commLib.resize.adjustList.length) {
			// 개발자 메시지: 영문지원 안 함
			throw "지정한 그리드뷰의 개수와 보정값의 개수가 일치하지 않습니다.";
		}
		
		// 이벤트 핸들러가 중복 설정되는 상황을 피하기 위한 설정
		if (commLib.resize.eventExist === true) {
			return;
		}
		
		// 이벤트 헨들러 설정
		$(window).resize(function() {
			var bodyHeight = $("body").height();
			for (var i = 0; i < arrGridView.length; i++) {
				try {
					var gridViewID = arrGridView[i];
					var target = $("#" + gridViewID);
					if (target.length > 0) {
						var top = getTopPosition($("#" + gridViewID));
						
						$w.comp[gridViewID].setGridHeight(bodyHeight - top - 25 - commLib.resize.adjustList[i]);
					}
				} catch (e) {
					// Do Nothing
				}
			}
		});
		commLib.resize.eventExist = true;
		
		// 최초 1회 사이즈 조정
		setTimeout(function() {
			$(window).trigger("resize");	
		}, 100);
				
		// Top Position을 구하는 내부 함수입니다.
		function getTopPosition(element) {
			var tagName = element[0].tagName.toLowerCase();
			var orgID = $(element[0]).prop("id");
			
			var top = commLib.resize.topList[orgID];
			if (top) {
				return top;	
			} else {
				top = 0;
			}
			
			while (tagName != "body") {
				top += element.position().top
				element = element.parent();
				tagName = element[0].tagName.toLowerCase();
			}
			
			commLib.resize.topList[orgID] = Math.round(top);
			return Math.round(top);
		}
	} catch (e) {
		$W.exception.printStackTrace(e);
		commLib.log("commLib.setGridViewResizing: " + e);
	}
};

/**
 * WebSquare가 제공하는 웹 브라우저 콘솔 및 자체 디버깅 로그를 출력합니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 02.
 * @memberOf commLib
 * @param {string} message - 콜솔에 출력할 메시지
 * @param {boolean} [ignoreAlert] - Alert 출력 여부
 */
commLib.log = function(message, ignoreAlert) {
    try {
        if (ignoreAlert == null) {
            ignoreAlert = false;
        }

        $w.log(message);
        /*if (!ignoreAlert) {
            var position = message.indexOf(":");
            alert(message.substr(0, position) + "\n\n" + message.substr(position + 1).trim());
        }*/

    } catch (e) {
        $W.exception.printStackTrace(e);
    }
};
