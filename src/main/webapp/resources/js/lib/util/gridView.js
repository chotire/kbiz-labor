;
/**GridView 관련 Function Start*/

/**
 * GridView Row 삭제를 위한 CheckBox 동작을 세팅한다.
 * GridView에 삭제용 CheckBox가 있을 경우 onPageLoad 이벤트에서 com.setGridViewDelCheckBox 함수를 호출한다.
 * 이 함수가 정상 동작하려면 GridView의 Delete 처리용 CheckBox의 ColumnId와 Header Id를 "chk"로 설정해야 한다.
 *
 * @date 2018.11.26
 * @memberOf com
 * @author InswaveSystems
 * @param {Array} gridViewObj GridView 객체 배열
 * @example
 * com.setGridViewDelCheckBox(grd_OrganizationBasic);
 * com.setGridViewDelCheckBox([grd_Menu, grd_MenuAccess]);
 */
com.setGridViewDelCheckBox = function(gridViewObjArr) {
    try {
        if (com.getObjectType(gridViewObjArr) === "array") {
            for (idx in gridViewObjArr) {
                setGridViewDelCheckBox(gridViewObjArr[idx]);
            }
        } else {
            setGridViewDelCheckBox(gridViewObjArr);
        }

        function setGridViewDelCheckBox(gridViewObj) {
            gridViewObj.bind("oncellclick",
                function(row, col) {
                    if (col == 0) {
                        var dltObj = com.getGridViewDataList(this);
                        var realRowIndex = this.getRealRowIndex(row);
                        var newValue = dltObj.getCellData(realRowIndex, col);

                        dltObj.setBroadcast(false);
                        com._setGridViewRowCheckBox(this, realRowIndex, newValue === "1" ? true : false);
                        dltObj.setBroadcast(true, true);
                    }
                }
            );
            gridViewObj.bind("onheaderclick",
                function(headerId) {
                    if (headerId == "chk") {
                        var newValue = this.getHeaderValue(headerId);
                        var dltObj = com.getGridViewDataList(this);
                        var rowCount = dltObj.getRowCount();

                        dltObj.setBroadcast(false);
                        for (var rowIdx = 0; rowIdx < rowCount; rowIdx++) {
                            com._deleteGridViewRow(this, rowIdx, newValue);
                        }
                        dltObj.setBroadcast(true, true);
                    }
                }
            );
        }
    } catch(e) {
        $p.log("[com.setGridViewDelCheckBox] Exception :: " + e.message);
    }
};

com._setGridViewRowCheckBox = function(gridViewObj, rowIndex, newValue) {
    var rowIndexArr = gridViewObj.getChildrenRowIndexArray(rowIndex);
    var dltObj = com.getGridViewDataList(gridViewObj);

    for (var idx in rowIndexArr) {
        var childRowIndexArr = gridViewObj.getChildrenRowIndexArray(rowIndexArr[idx]);

        if (childRowIndexArr.length > 0) {
            com._setGridViewRowCheckBox(gridViewObj, rowIndexArr[idx], newValue);
        } else {
            com._deleteGridViewRow(gridViewObj, rowIndexArr[idx], newValue);
        }
    }

    com._deleteGridViewRow(gridViewObj, rowIndex, newValue);
};

com._deleteGridViewRow = function(gridViewObj, rowIndex, newValue) {
    gridViewObj.setCellChecked(rowIndex, "chk", newValue);
    var dltObj = com.getGridViewDataList(gridViewObj);

    if (newValue) {
        var rowStatus = dltObj.getRowStatus(rowIndex);
        if (rowStatus == "C") {
            dltObj.removeRow(rowIndex);
        } else {
            dltObj.deleteRow(rowIndex);
        }
    } else {
        dltObj.undoRow(rowIndex);
    }
};

/**
 * GridView와 바인딩된 DataList 객체를 반환한다.
 *
 * @date 2018.01.11
 * @param {Object} gridViewObj 바인딩 된 DataList가 존재하는지 검증할 GridView 객체
 * @memberOf com
 * @author InswaveSystems
 * @return {Object} 바인딩 된 DataList 객체 반환 (바인된 객체가 없을 경우 null 반환)
 * @example
 * // 바인딩 되어있는 경우
 * com.getGridViewDataList(grd_First);
 * // return 예시) "dlt_first"
 *
 * // 바인딩 되어있지 않은 경우
 * com.getGridViewDataList(grd_First);
 * // return 예시) undefined
 */
com.getGridViewDataList = function(gridViewObj) {
    var dataListId = gridViewObj.getDataList();

    if (dataListId !== "") {
        var dataList = $p.getComponentById(dataListId);
        if ((typeof dataList === "undefined") || (dataList === null)) {
            $p.log("DataList(" + dataListId + ")를 찾을 수 없습니다.");
            return null;
        } else {
            return dataList;
        }
    } else {
        $p.log(gridViewObj.getID() + "는 DataList가 세팅되어 있지 않습니다.");
        return null;
    }
};

/**
 * 특정 컴포넌트에 바인된 DataList나 DataMap의 컬럼 이름을 반환한다.
 *
 * @date 2018.01.15
 * @memberOf com
 * @param {Object} comObj 컴포넌트 객체
 * @return {String} 컬럼명
 */
com.getColumnName = function(comObj) {
    try {
        if ((typeof comObj.getRef) === "function") {
            var ref = comObj.getRef();
            var refArray = ref.substring(5).split(".");
            var dataCollectionName = refArray[0];
            var columnId = refArray[1];

            if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
                var dataCollection = comObj.getScopeWindow().$p.getComponentById(dataCollectionName);
                var dataType = dataCollection.getObjectType().toLowerCase();
                if (dataType === "datamap") {
                    return dataCollection.getName(columnId);
                } else if (dataType === 'datalist') {
                    return dataCollection.getColumnName(columnId);
                }
            } else {
                return "";
            }
        }
    } catch(e) {
        $p.log("[com.getColumnName] Exception :: " + e.message);
    } finally {
        dataCollection = null;
    }
};

/**
 * 엑셀 다운로드 옵션을 설정하고 확장자 별로 다른 함수(downLoadCSV || downLoadExcel)를 호출한다.
 *
 * @date 2016.11.16
 * @param {Object} grdObj GridView Object
 * @param {Array} options JSON형태로 저장된 그리드의 엑셀 다운로드 옵션
 * @param {Array} infoArr 그리드에 대한 내용을 추가로 다른 셀에 표현하는 경우 사용하는 배열
 * @memberOf com
 * @author InswaveSystems
 * @example
 * var gridId = "grd_AdvancedExcel";
 * var infoArr = {};
 * var options = {
 *	 fileName : "gridDataDownLoad.xlsx" //[defalut: excel.xlsx] 다운로드하려는 파일의 이름으로 필수 입력 값 (지원하는 타입 => xls, xlsx, csv)
 * };
 * com.gridDataDownLoad( gridId, options, infoArr);
 * //return 예시) common.js의 다른 함수(downLoadCSV, downLoadExcel)로 이동하거나 alert 발생
 */
com.gridDataDownLoad = function(grdObj, options, infoArr) {
    var title = "";
    var fileName = options.fileName;
    if (fileName.length == 0) {
        options.fileName = "excel.xlsx";
    } else {
        fileName = fileName.toLowerCase();
        if (fileName.indexOf(".csv") > -1) {
            com.downLoadCSV(grdObj, options);
        } else if (fileName.indexOf(".xlsx") > -1 || fileName.indexOf(".xls") > -1) {
            com.downLoadExcel(grdObj, options, infoArr);
        } else {
            com.alert("알수없는 파일 형식입니다");
        }
    }
};

/**
* 설정된 옵션으로 엑셀을 다운로드 한다.
*
* @date 2017.11.30
* @param {Object} grdObj GridView 객체
* @param {Object} options JSON형태로 저장된 그리드의 엑셀 다운로드 옵션
* @param {String} options.fileName					[defalut: excel.xlsx] 다운로드하려는 파일의 이름으로 필수 입력 값 <br>지원하는 타입 => xls, xlsx
* @param {String} [options.sheetName]				[defalut: sheet] excel의 sheet의 이름
* @param {String} [options.type]					[defalut: 0] type 0 => 실제 데이터 <br>1 => 눈에 보이는 데이터<br>  2 => 들어가 있는 data 그대로(filter무시 expression 타입의 셀은 나오지 않음)
* @param {String} [options.removeColumns]			[defalut: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
* @param {String} [options.removeHeaderRows]		[defalut: 없음]	다운로드시 excel에서 삭제하려는 Header의 row index(여러 개일 경우 ,로 구분)
* @param {String} [options.foldColumns]				[defalut: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
* @param {Number} [options.startRowIndex]			excel 파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
* @param {Number} [options.startColumnIndex]		excel 파일에서 그리드의 데이터가 시작되는 열의 번호(헤더 포함)
* @param {String} [options.headerColor]				excel 파일에서 그리드의 header부분의 색
* @param {String} [options.headerFontName]			[defalut: 없음] excel파일에서 그리드의 header부분의 font name
* @param {String} [options.headerFontSize]			excel 파일에서 그리드의 header부분의 font size
* @param {String} [options.headerFontColor]			excel 파일에서 그리드의 header부분의 font색
* @param {String} [options.bodyColor]				excel 파일에서 그리드의 body부분의 색
* @param {String} [options.bodyFontName]			[defalut: 없음] excel파일에서 그리드의 body부분의 font name
* @param {String} [options.bodyFontSize]			excel 파일에서 그리드의 body부분의 font size
* @param {String} [options.bodyFontColor]			excel 파일에서 그리드의 body부분의 font색
* @param {String} [options.subTotalColor]			[defalut: #CCFFCC] excel파일에서 그리드의 subtotal부분의 색
* @param {String} [options.subTotalFontName]		[defalut: 없음] excel파일에서 그리드의 subtotal부분의 font name
* @param {String} [options.subTotalFontSize]		[defalut: 10] excel파일에서 그리드의 subtotal부분의 font size
* @param {String} [options.subTotalFontColor]		[defalut: 없음] excel파일에서 그리드의 subtotal부분의 font색
* @param {String} [options.footerColor]				[defalut: #008000] excel파일에서 그리드의 footer부분의 색
* @param {String} [options.footerFontName]			[defalut: 없음] excel파일에서 그리드의 footer부분의 font name
* @param {String} [options.footerFontSize]			[defalut: 10] excel파일에서 그리드의 footer부분의 font size
* @param {String} [options.footerFontColor]			[defalut: 없음] excel파일에서 그리드의 footer부분의 font색
* @param {String} [options.oddRowBackgroundColor]	excel 파일에서 그리드 body의 홀수줄의 배경색
* @param {String} [options.evenRowBackgroundColor]	[defalut: 없음] excel파일에서 그리드 body의 짝수줄의 배경색
* @param {String} [options.rowNumHeaderColor]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 배경색
* @param {String} [options.rowNumHeaderFontName]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트이름
* @param {String} [options.rowNumHeaderFontSize]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트크기
* @param {String} [options.rowNumHeaderFontColor]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트색상
* @param {String} [options.rowNumBodyColor]			[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 배경색
* @param {String} [options.rowNumBodyFontName]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트이름
* @param {String} [options.rowNumBodyFontSize]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트크기
* @param {String} [options.rowNumBodyFontColor]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트색상
* @param {String} [options.rowNumFooterColor]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 배경색
* @param {String} [options.rowNumFooterFontName]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트이름
* @param {String} [options.rowNumFooterFontSize]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트크기
* @param {String} [options.rowNumFooterFontColor]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트색상
* @param {String} [options.rowNumSubTotalColor]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 배경색
* @param {String} [options.rowNumSubTotalFontName]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트이름
* @param {String} [options.rowNumSubTotalFontSize]	[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트크기
* @param {String} [options.rowNumSubTotalFontColo]	 [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트색상
* @param {String} [options.rowNumHeaderValue]		[defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Header 영역의 출력값
* @param {String} [options.rowNumVisible]			[defalut: false] 순서출력 유무
* @param {String} [options.showProcess]				[defalut: true] 다운로드 시 프로세스 창을 보여줄지 여부
* @param {String} [options.massStorage]				[defalut: true] 대용량 다운로드 여부 <br>(default는 true 이 옵션을 true로 하고 showConfirm을 false로 한 경우에 IE에서 신뢰할만한 사이트를 체크하는 옵션이 뜬다.)
* @param {String} [options.showConfirm]				[defalut: false] 다운로드 확인창을 띄울지 여부 <br>(옵션을 킨 경우 advancedExcelDownload를 호출후 사용자가 window의 버튼을 한번더 클릭해야 한다. massStorage는 자동으로 true가 된다)
* @param {String} [options.dataProvider]			[defalut: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Provider Package
* @param {String} [options.providerRequestXml]		[defalut: 없음] Provider 내부에서 사용할 XML 문자열
* @param {String} [options.userDataXml]				[defalut: 없음] 사용자가 서버모듈 개발 시 필요한 데이터를 전송 할 수 있는 변수
* @param {String} [options.bodyWordwrap]			[defalut: false] 다운로드시 바디의 줄 바꿈 기능
* @param {String} [options.useEuroLocal]			[defalut: false] 다운로드시 유로화 처리 기능(,와 .이 반대인 경우처리)
* @param {String} [options.useHeader]				[defalut: true] 다운로드시 Header를 출력 할지 여부<br>  "true" => 출력 <br> "false" => 미출력
* @param {String} [options.useSubTotal]				[defalut: false] 다운로드시 SubTotal을 출력 할지 여부<br>  "true" => 출력 <br> "false" => 미출력<br> expression을 지정한 경우 avg,sum,min,max,targetColValue,숫자를 지원 함.
* @param {String} [options.useFooter]				[defalut: true] 다운로드시 Footer를 출력 할지 여부<br>  "true" => 출력<br> "false" => 미출력
* @param {String} [options.separator]				[defalut: ,] 다운로드시 서버로 데이터 전송할때, 데이터를 구분짓는 구분자, default는 comma(,)
* @param {Number} [options.subTotalScale]			[defalut: -1] 다운로드시 subTotal 평균계산시 소수점 자리수를 지정
* @param {String} [options.subTotalRoundingMode]	[defalut: 없음] 다운로드시 subTotal 평균계산시 Round를 지정 한다. <br> "CEILING" => 소수점 올림 <br> "FLOOR" => 소수점 버림 <br>"HALF_UP" => 소수점 반올림
* @param {String} [options.useStyle]				[defalut: false] 다운로드시 css를 제외한, style을 excel에도 적용할 지 여부 (배경색,폰트)
* @param {String} [options.freezePane]				[defalut: ""] 틀고정을 위한 좌표값 및 좌표값의 오픈셋 <br>  freezePane="3,4" => X축 3, Y축 4에서 틀고정<br> freezePane="0,1,0,5" => X축 0, Y축 1에서 X축으로 0, Y축으로 5로 틀고정
* @param {String} [options.autoSizeColumn]			[defalut: false] 너비자동맞춤 설정 유무 - 2016.08.18 옵션 설정을 true로 변경
* @param {String} [options.displayGridlines]		[defalut: false] 엑셀 전체 셀의 눈금선 제거 유무
* @param {String} [options.colMerge]				[defalut: false] colMerge된 컬럼을 Merge해서 출력 할 지 여부
* @param {String} [options.useDataFormat]			[defalut: 없음] 그리드 dataType이 text인 경우, 엑셀의 표시형식 '텍스트' 출력 유무<br> "true" => 표시형식 텍스트<br> "false" => 표시형식 일반 출력)
* @param {String} [options.indent]					[defalut: 0] 그리드 dataType이 drilldown인 경우, indent 표시를 위한 공백 삽입 개수
* @param {String} [options.columnMove]				[defalut: false] 그리드 컬럼이동시 이동된 상태로 다운로드 유무 <br> "true" => 컬럼이동 순서대로 출력
* @param {String} [options.columnOrder]				[defalut: 없음] 엑셀 다운로드시 다운로드되는 컬럼 순서를 지정 할 수 있는 속성 ( "0,3,2,1"로 지정시 지정한 순서로 다운로드된다 )
* @param {String} [options.fitToPage]				[defalut: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
* @param {String} [options.landScape]				[defalut: false] 엑셀 프린터 출력시 가로 방향 출력 유무
* @param {String} [options.fitWidth]				[defalut: 1] 엑셀 프린터 출력시 용지너비
* @param {String} [options.fitHeight]				[defalut: 1] 엑셀 프린터 출력시 용지높이
* @param {String} [options.scale]					[defalut: 100] 엑셀 프린터 출력시 확대/축소 배율<br> scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
* @param {String} [options.pageSize]				[defalut: A4] 엑셀 프린터 출력시 인쇄용지 설정 <br>  "A3", "A4", "A5", "B4"
* @param {Object[]} [infoArr]						subTotalFontName 그리드에 대한 내용을 추가로 다른 셀에 표현하는 경우 사용하는 배열
* @param {Number} [infoArr.rowIndex]				[defalut: ""] 내용을 표시할 행번호
* @param {Number} [infoArr.colIndex]				[defalut: ""] 내용을 표시할 열번호
* @param {Number} [infoArr.rowSpan]					[defalut: ""] 병합할 행의 수
* @param {Number} [infoArr.colSpan]					[defalut: ""] 병합할 열의 수
* @param {String} [infoArr.text]					[defalut: ""] 표시할 내용
* @param {String} [infoArr.textAlign]				[defalut: "right"] 표시할 내용의 정렬 방법 <br> left => 좌측 정렬 <br> center => 가운데 정렬 <br> right => 우측 정렬
* @param {String} [infoArr.fontSize]				[defalut: "10px"] font size 설정 20px, 10px, 5px
* @param {String} [infoArr.fontName]				[defalut: ""] font name 설정
* @param {String} [infoArr.color]					[defalut: ""] font color 설정 red, blue, green
* @param {String} [infoArr.fontWeight]				[defalut: ""] font weight 설정 bold
* @param {String} [infoArr.drawBorder]				[defalut: "true"] cell의 border지정 true, false
* @param {String} [infoArr.wordWrap]				[defalut: ""] cell의 줄 바꿈 기능 true, false
* @param {String} [infoArr.bgColor]					[defalut: ""] cell의 배경 color 설정 red, blue, green
* @memberOf com
* @return {file} <b>Excel file</b>
* @author InswaveSystems
* @example
* var gridId = "grd_AdvancedExcel";
* var infoArr = {};
* var options = {
*	 fileName : "downLoadExcel.xlsx" //[default : excel.xlsx] options.fileName 값이 없을 경우 default값 세팅
* };
* com.downLoadExcel(grdObj, options, infoArr );
*/
com.downLoadExcel = function(grdObj, options, infoArr) {

    if (typeof options === "undefined") {
        options = {
            hiddenVisible : false,
            fileName : "excel.xlsx"
        }
    }

    if (typeof infoArr === "undefined") {
        infoArr = {};
    }

    // excel 다운로드시 기본 설정으로 화면내의 hidden컬럼을 removeColumns에 포함시킨다.
    // 이를 원치 않을 경우 options.hiddenVisible = 'true' 로 설정한다.
    if (!options.hiddenVisible) {
        var grdCnt = grdObj.getTotalCol();

        var hiddenColIndex = [];
        for (var idx = 0; idx < grdCnt; idx++) {
            if (!grdObj.getColumnVisible(idx)) {
                hiddenColIndex.push(idx);
            }
        }
        // hidden 컬럼이 있는 경우만 추가할 수 있도록 (2016.10.28 추가)
        if (hiddenColIndex.length > 0) {
            if (options.removeColumns && options.removeColumns.length > 0) {
                options.removeColumns = options.removeColumns + "," + hiddenColIndex.join(',');
            } else {
                options.removeColumns = hiddenColIndex.join(',');
            }

            // 중복 요소 제거
            var _removeColumnArr = options.removeColumns.split(",");
            options.removeColumns = _removeColumnArr.reduce(function(a, b) {
                if (a.indexOf(b) < 0) {
                    a.push(b);
                }
                return a;
            }, []).join(',');
        }
    }

    var _fontName = "맑은 고딕";

    var options = {
        fileName : options.fileName || "excel.xlsx", //String, [defalut: excel.xlsx] 다운로드하려는 파일의 이름으로 필수 입력 값이다.
        sheetName : options.sheetName || "sheet", //String, [defalut: sheet] excel의 sheet의 이름
        type : options.type || "0", //String, [defalut: 0] type이 0인 경우 실제 데이터 1인 경우 눈에 보이는 데이터를  2이면 들어가 있는 data 그대로(filter무시 expression 타입의 셀은 나오지 않음)
        removeColumns : options.removeColumns || "", //String, [defalut: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
        removeHeaderRows : options.removeHeaderRows || "", //String, [defalut: 없음]	다운로드시 excel에서 삭제하려는 Header의 row index(여러 개일 경우 ,로 구분)
        foldColumns : options.foldColumns || "", //String, [defalut: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
        startRowIndex : options.startRowIndex || 0, //Number, excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
        startColumnIndex : options.startColumnIndex || 0, //Number, excel파일에서 그리드의 데이터가 시작되는 열의 번호(헤더 포함)
        headerColor : options.headerColor || "", //String, excel파일에서 그리드의 header부분의 색
        headerFontName : options.headerFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 header부분의 font name
        headerFontSize : options.headerFontSize || "10", //String, excel파일에서 그리드의 header부분의 font size
        headerFontColor : options.headerFontColor || "", //String, excel파일에서 그리드의 header부분의 font색
        bodyColor : options.bodyColor || "#FFFFFF", //String, excel파일에서 그리드의 body부분의 색
        bodyFontName : options.bodyFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 body부분의 font name
        bodyFontSize : options.bodyFontSize || "10", //String, excel파일에서 그리드의 body부분의 font size
        bodyFontColor : options.bodyFontColor || "", //String, excel파일에서 그리드의 body부분의 font색
        subTotalColor : options.subTotalColor || "#CCFFCC", //String, [defalut: #CCFFCC] excel파일에서 그리드의 subtotal부분의 색
        subTotalFontName : options.subTotalFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font name
        subTotalFontSize: options.subTotalFontSize || "10", //String, [defalut: 10] excel파일에서 그리드의 subtotal부분의 font size
        subTotalFontColor : options.subTotalFontColor || "", //String, [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font색
        footerColor : options.footerColor || "#008000", //String, [defalut: #008000] excel파일에서 그리드의 footer부분의 색
        footerFontName : options.footerFontName || _fontName, //String, [defalut: 없음] excel파일에서 그리드의 footer부분의 font name
        footerFontSize : options.footerFontSize || "10", //String, [defalut: 10] excel파일에서 그리드의 footer부분의 font size
        footerFontColor : options.footerFontColor || "", //String, [defalut: 없음] excel파일에서 그리드의 footer부분의 font색
        oddRowBackgroundColor : options.oddRowBackgroundColor || "", //String, excel파일에서 그리드 body의 홀수줄의 배경색
        evenRowBackgroundColor : options.evenRowBackgroundColor || "", //String, [defalut: 없음] excel파일에서 그리드 body의 짝수줄의 배경색
        rowNumHeaderColor : options.rowNumHeaderColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 배경색
        rowNumHeaderFontName : options.rowNumHeaderFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트이름
        rowNumHeaderFontSize : options.rowNumHeaderFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트크기
        rowNumHeaderFontColor : options.rowNumHeaderFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트색상
        rowNumBodyColor : options.rowNumBodyColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 배경색
        rowNumBodyFontName : options.rowNumBodyFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트이름
        rowNumBodyFontSize : options.rowNumBodyFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트크기
        rowNumBodyFontColor : options.rowNumBodyFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트색상
        rowNumFooterColor : options.rowNumFooterColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 배경색
        rowNumFooterFontName : options.rowNumFooterFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트이름
        rowNumFooterFontSize : options.rowNumFooterFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트크기
        rowNumFooterFontColor : options.rowNumFooterFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트색상
        rowNumSubTotalColor : options.rowNumSubTotalColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 배경색
        rowNumSubTotalFontName : options.rowNumSubTotalFontName || _fontName, //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트이름
        rowNumSubTotalFontSize : options.rowNumSubTotalFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트크기
        rowNumSubTotalFontColor : options.rowNumSubTotalFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트색상
        rowNumHeaderValue : options.rowNumHeaderValue || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Header 영역의 출력값
        rowNumVisible : options.rowNumVisible || "false", //String, [defalut: false] 순서출력 유무
        showProcess : WebSquare.util.getBoolean(options.showProcess) || true, //Boolean, [defalut: true] 다운로드 시 프로세스 창을 보여줄지 여부
        massStorage : WebSquare.util.getBoolean(options.massStorage) || true, //Boolean, [defalut: true] 대용량 다운로드 여부 (default는 true 이 옵션을 true로 하고 showConfirm을 false로 한 경우에 IE에서 신뢰할만한 사이트를 체크하는 옵션이 뜬다.)
        showConfirm : WebSquare.util.getBoolean(options.showConfirm) || false, //Boolean, [defalut: false] 다운로드 확인창을 띄울지 여부(옵션을 킨 경우 advancedExcelDownload를 호출후 사용자가 window의 버튼을 한번더 클릭해야 한다. massStorage는 자동으로 true가 된다)
        dataProvider : options.dataProvider || "", //String, [defalut: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Provider Package
        providerRequestXml : options.providerRequestXml || "", //String, [defalut: 없음] Provider 내부에서 사용할 XML 문자열
        userDataXml : options.userDataXml || "", //String, [defalut: 없음] 사용자가 서버모듈 개발 시 필요한 데이터를 전송 할 수 있는 변수
        bodyWordwrap : WebSquare.util.getBoolean(options.bodyWordwrap) || false, //Boolean, [defalut: false] 다운로드시 바디의 줄 바꿈 기능
        useEuroLocale : options.useEuroLocale || "false", //String, [defalut: false] 다운로드시 유로화 처리 기능(,와 .이 반대인 경우처리)
        useHeader : options.useHeader || "true", //String, [defalut: true] 다운로드시 Header를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
        useSubTotal : options.useSubTotal || "false", //String, [defalut: false] 다운로드시 SubTotal을 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력), expression을 지정한 경우 avg,sum,min,max,targetColValue,숫자를 지원 함.
        useSubTotalData: options.useSubTotalData || "false",
        useFooter : options.useFooter || "true", //String, [defalut: true] 다운로드시 Footer를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
        useFooterData : options.useFooterData|| "false",
        separator : options.separator || ",", //String, [defalut: ,] 다운로드시 서버로 데이터 전송할때, 데이터를 구분짓는 구분자, default는 comma(,)
        subTotalScale : options.subTotalScale || -1, //Number, [defalut: -1] 다운로드시 subTotal 평균계산시 소수점 자리수를 지정
        subTotalRoundingMode : options.subTotalRoundingMode || "", //String, [defalut: 없음] 다운로드시 subTotal 평균계산시 Round를 지정 한다. ("CEILING","FLOOR","HALF_UP")
        useStyle : options.useStyle || "", //String, [defalut: false] 다운로드시 css를 제외한, style을 excel에도 적용할 지 여부 (배경색,폰트)
        freezePane : options.freezePane || "", //String, [defalut: ""] 틀고정을 위한 좌표값 및 좌표값의 오픈셋 ( ex) freezePane="3,4" X축 3, Y축 4에서 틀고정, freezePane="0,1,0,5" X축 0, Y축 1에서 X축으로 0, Y축으로 5로 틀공정  )
        autoSizeColumn : options.autoSizeColumn || "true", //String, [defalut: false] 너비자동맞춤 설정 유무 - 2016.08.18 옵션 설정을 true로 변경
        displayGridlines : options.displayGridlines || "", //String, [defalut: false] 엑셀 전체 셀의 눈금선 제거 유무
        colMerge : options.colMerge || "", //String, [defalut: false] colMerge된 컬럼을 Merge해서 출력 할 지 여부
        useDataFormat : options.useDataFormat || "", //String, [defalut: 없음] 그리드 dataType이 text인 경우, 엑셀의 표시형식 '텍스트' 출력 유무( "true"인 경우 표시형식 텍스트, "false"인 경우 표시형식 일반 출력)
        indent : options.indent || "", //String, [defalut: 없음] 그리드 dataType이 drilldown인 경우, indent 표시를 위한 공백 삽입 개수, default값은 0
        columnMove : options.columnMove || "", //String, [defalut: false] 그리드 컬럼이동시 이동된 상태로 다운로드 유무 ( "true"인경우 컬럼이동 순서대로 출력 )
        columnOrder : options.columnOrder || "", //String, [defalut: 없음] 엑셀 다운로드시 다운로드되는 컬럼 순서를 지정 할 수 있는 속성 ( ex) "0,3,2,1"로 지정시 지정한 순서로 다운로드된다 )
        fitToPage : options.fitToPage || "false", //String, [defalut: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
        landScape : options.landScape || "false", //String, [defalut: false] 엑셀 프린터 출력시 가로 방향 출력 유무
        fitWidth : options.fitWidth || "1", //String, [defalut: 1] 엑셀 프린터 출력시 용지너비
        fitHeight : options.fitHeight || "1", //String, [defalut: 1] 엑셀 프린터 출력시 용지높이
        scale : options.scale || "100", //String, [defalut: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
        pageSize : options.pageSize || "A4" //String, [defalut: A4] 엑셀 프린터 출력시 인쇄용지 설정 ( ex) "A3", "A4", "A5", "B4" )
    };
//debugger;
    var infoArr = {
        rowIndex : infoArr.rowIndex || 0, //Number, 내용을 표시할 행번호
        colIndex : infoArr.colIndex || 0, //Number, 내용을 표시할 열번호
        rowSpan : infoArr.rowSpan || 0, //Number, 병합할 행의 수
        colSpan : infoArr.colSpan || 0, //Number, 병합할 열의 수
        text : infoArr.text || "", //String, 표시할 내용
        textAlign : infoArr.textAlign || "right", //String, 표시할 내용의 정렬 방법 left, center, right
        fontSize : infoArr.fontSize || "10px", //String, font size 설정 20px, 10px, 5px
        fontName : infoArr.fontName || "", //String, font name 설정
        color : infoArr.color || "", //String, font color 설정 red, blue, green
        fontWeight : infoArr.fontWeight || "", //String, font weight 설정 bold
        drawBorder : infoArr.drawBorder || "true", //String, cell의 border지정 true, false
        wordWrap : infoArr.wordWrap || "", //String, cell의 줄 바꿈 기능 true, false
        bgColor : infoArr.bgColor || "" //String, cell의 배경 color 설정 red, blue, green
    };
// 정보 표시
/*
var ia = [];
for (var ar = 0 ;ar < infoArr.length; ar++){
    var arrObj = infoArr[ar];
    var _info = {
            rowIndex : arrObj.rowIndex || 0, // Number, 내용을 표시할 행번호
            colIndex : arrObj.colIndex || 0, // Number, 내용을 표시할 열번호
            rowSpan : arrObj.rowSpan || 0, // Number, 병합할 행의 수
            colSpan : arrObj.colSpan || 0, // Number, 병합할 열의 수
            text : arrObj.text || " ", // String, 표시할 내용
            textAlign : arrObj.textAlign || "right", // String, 표시할 내용의 정렬 방법
                                                        // left, center, right
            fontSize : arrObj.fontSize || "10px", // String, font size 설정 20px,
                                                    // 10px, 5px
            fontName : arrObj.fontName || defaultFontName, // String, font name 설정
            color : arrObj.color || "", // String, font color 설정 red, blue,
                                            // green
            fontWeight : arrObj.fontWeight || "", // String, font weight 설정 bold
            drawBorder : arrObj.drawBorder || "true", // String, cell의 border지정
                                                        // true, false
            wordWrap : arrObj.wordWrap || "", // String, cell의 줄 바꿈 기능 true, false
            bgColor : arrObj.bgColor || "" // String, cell의 배경 color 설정 red, blue,                                              // green
        };
    ia.push(_info);
}
*/
    grdObj.advancedExcelDownload(options, infoArr);
};

/**
* 설정된 옵션으로 CSV파일을 다운로드 한다.
*
* @date 2017.11.30
* @param {Object} grdObj GridView Object
* @param {Object[]} options JSON형태로 저장된 그리드의 엑셀 다운로드 옵션
* @param {String} options.fileName [default: excel.csv] 저장 될 파일 이름
* @param {String} [options.type] [default: 1] Grid 저장 형태 (0이면 데이터 형태,1이면 표시 방식)
* @param {String} [options.delim] [default: ,] CSV 파일에서 데이터를 구분할 구분자
* @param {String} [options.removeColumns] [default: 없음] 저장 하지 않을 columns index, 여러컬럼인 경우 콤마(,)로 구분해서 정의 한다.
* @param {String} [options.header] [default: 1] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
* @param {String} [options.hidden] [defalut: 0] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
* @param {String} [options.checkButton] [default: 1] Grid의 Control(Check, Radio, Button) Column에 대해 히든 여부 (0이면 control Column히든,1이면 보여줌)
* @param {String} [options.saveList] [default: 없음] hidden에 관계없이 저장할 column id들의 array
* @memberOf com
* @return {file} CSV file
* @author InswaveSystems
* @example
* var gridId = "grd_AdvancedExcel";
* var options = {
*	 fileName : "downLoadCSV.csv" //[default : excel.csv] options.fileName 값이 없을 경우 default값 세팅
* };
* com.downLoadCSV(grdObj, options);
* //return 예시) 엑셀 파일 다운로드
*/
com.downLoadCSV = function(grdObj, options) {
    var options = {
        fileName : options.fileName || "excel.csv", //[default: excel.csv] 저장 될 파일 이름
        type : options.type || "1", //[default: 1] Grid 저장 형태 (0이면 데이터 형태,1이면 표시 방식)
        delim : options.delim || ",", //[default: ,] CSV 파일에서 데이터를 구분할 구분자
        removeColumns : options.removeColumns || "", //[default: 없음] 저장 하지 않을 columns index, 여러컬럼인 경우 콤마(,)로 구분해서 정의 한다.
        header : options.header || "1", //[default: 1] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
        hidden : options.hidden || 0, //[defalut: 0] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
        checkButton : options.checkButton || "1", //[default: 1] Grid의 Control(Check, Radio, Button) Column에 대해 히든 여부 (0이면 control Column히든,1이면 보여줌)
        saveList : options.saveList || "" //[default: 없음] hidden에 관계없이 저장할 column id들의 array
    }
    grdObj.saveCSV(options);
};

/**
* 엑셀 업로드 옵션을 설정하고 확장자 별로 다른 함수(uploadCSV || uploadExcel)를 호출한다.
*
* @date 2017.11.30
* @param {Object} grdObj 그리드뷰 아이디
* @param {Array} options JSON형태로 저장된 그리드의 엑셀 업로드 옵션
* @param {String} type 타입(xls, xlsx, csv)을 구분 후, 적합한 API를 사용하여 업로드 한다.
* @memberOf com
* @author InswaveSystems
* @example
* var gridId = "grd_AdvancedExcel";
* var type = "xlsx";
* var options = {
*	 fileName : "gridDataUpload.xlsx" // default값이 존재하지 않으므로 꼭 fileName 값을 넣어야 한다.
* };
* com.gridDataUpload(grdObj, type, options);
* //return 예시) com.js의 다른 함수(uploadCSV, uploadExcel)로 이동하거나 alert 발생
*/
com.gridDataUpload = function(grdObj, type, options) {
    type = type.toLowerCase();

    if (type == "csv"){
        com.uploadCSV(grdObj, options);
    }else if ( type == "xls" || type == "xlsx"){
        com.uploadExcel(grdObj, options);
    } else {
        com.alert("지원하지 않는 파일 형식입니다.");
    }
};

/**
* 엑셀 xls, xlsx 업로드
*
* @date 2017.11.30
* @param {Object} grdObj GridView Object
* @param {Object} options JSON형태로 저장된 그리드의 엑셀 업로드 옵션
*
* @param {String} [options.type]				1 => 엑셀 파일이 그리드의 보이는 결과로 만들어져있을때 <br> 0 => 엑셀 파일이 그리드의 실제 데이터로 구성되어있을때
* @param {Number} [options.sheetNo]				excel파일에서 그리드의 데이터가 있는 sheet번호
* @param {Number} [options.startRowIndex]		[defalut:0] excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
* @param {Number} [options.startColumnIndex]	[defalut:0] excel파일에서 그리드의 데이터가 시작되는 열의 번호
* @param {Number} [options.endColumnIndex]		[defalut: 0] excel파일에서 그리드의 데이터가 끝나는 열의 index<br>
*												(엑셀컬럼수가 그리드컬럼수 보다 작은 경우 그리드 컬러수를 설정)
* @param {String} [options.headerExist]			[defalut:0] excel파일에서 그리드의 데이터에 header가 있는지 여부<br>
*												1 => header 존재 <br> 0 => 없음)
* @param {String} [options.footerExis]			[defalut: 1] excel파일에서 그리드의 데이터에 footer가 있는지 여부 <br>
*												1 => footer 존재 <br> 0 => 없음 <br> (그리드에 footer가 없으면 적용되지 않음)
* @param {String} [options.append]				[defalut: 0] excel파일에서 가져온 데이터를 그리드에 append시킬지 여부 <br>
*												1 => 현재 그리드에 데이터를 추가로 넣어줌 <br> 0 => 현재 그리드의 데이터를 삭제하고 넣음)
* @param {String} [options.hidden]				[defalut: 0] 읽어들이려는 엑셀파일에 hidden column이 저장되어 있는지 여부를 설정하는 int형 숫자<br>
*												0 => 엑셀파일에 hidden 데이터가 없으므로 그리드 hidden column에 빈 데이터를 삽입 <br>
*												 1 => 엑셀파일에 hidden 데이터가 있으므로 엑셀 파일로부터 hidden 데이터를 삽입
* @param {String} [options.fillHidden]			[defalut: 0] Grid에 hiddenColumn에 빈 값을 넣을지를 결정하기 위한 int형 숫자<br>
*												1 => hidden Column에 빈 값을 저장하지 않음 <br> 0 => hiddcolumn이 저장되어있지 않은 Excel  File이라 간주하고
*												hidden Column에 값을 넣어줌 <br>(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
* @param {String} [options.skipSpace]			[defalut: 0] 공백무시 여부 <br> 1 => 무시 <br> 0 => 포함
* @param {String} [options.insertColumns]		radio, checkbox와 같은 컬럼을 엑셀에서 받아 오지 않고 <br> 사용자 컬럼 설정 으로 업로드 ( 데이터 구조 : [ { columnIndex:1, columnValue:"1" } ] )
* @param {String} [options.popupUrl]			업로드시에 호출할 popup의 url
* @param {String} [options.status]				[defalut: R]업로드된 데이터의 초기 상태값, 설정하지 않으면 "R"로 설정되며 "C"값을 설정 할 수 있다.
* @param {String} [options.pwd]				 엑셀파일에 암호가 걸려 있는 경우, 비밀번호
* @memberOf com
* @author InswaveSystems
* @example
* var options = {
*	 type : "0"
*	 ,sheetNo : 0
* };
* com.uploadExcel(grd_basicInfo,  options);
*/
com.uploadExcel = function(grdObj, options) {
    var options = {
        type : options.type || "0", //String, 1이면 엑셀 파일이 그리드의 보이는 결과로 만들어져있을때  0이면 엑셀 파일이 그리드의 실제 데이터로 구성되어있을때
        sheetNo : options.sheetNo || 0, //Number, excel파일에서 그리드의 데이터가 있는 sheet번호
        startRowIndex : options.startRowIndex || 1, //Number, [defalut:0] excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
        startColumnIndex : options.startColumnIndex || 0, //Number, [defalut:0] excel파일에서 그리드의 데이터가 시작되는 열의 번호
        endColumnIndex : options.endColumnIndex || 0, //Number, [defalut: 0] excel파일에서 그리드의 데이터가 끝나는 열의 index
                                                        //( 엑셀컬럼수가 그리드컬럼수 보다 작은 경우 그리드 컬러수를 설정)
        headerExist : options.headerExist || "0", //String, [defalut:0] excel파일에서 그리드의 데이터에 header가 있는지 여부
                                                  //(1이면 header 존재 0이면 없음)
        footerExist : options.footerExist || "1", //String, [defalut: 1] excel파일에서 그리드의 데이터에 footer가 있는지 여부
                                                    //(1이면 footer 존재 0이면 없음 기본값은 1 그리드에 footer가 없으면 적용되지 않음)
        append : options.append || "0", //String, [defalut: 0] excel파일에서 가져온 데이터를 그리드에 append시킬지 여부
                                        // (1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
        hidden : options.hidden || "0", //String, [defalut: 0] 읽어들이려는 엑셀파일에 hidden column이 저장되어 있는지 여부를 설정하는 int형 숫자(0이면
                                        // 엑셀파일에 hidden 데이터가 없으므로 그리드 hidden column에 빈 데이터를 삽입
                                        // 1 : 엑셀파일에 hidden 데이터가 있으므로 엑셀 파일로부터 hidden 데이터를 삽입 )
        fillHidden : options.fillHidden || "0", //String, [defalut: 0] Grid에 hiddenColumn에 빈 값을 넣을지를 결정하기
                                                // 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden
                                                // column이 저장되어있지 않은 Excel  File이라 간주하고 hidden Column에 빈
                                                // 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
        skipSpace : options.skipSpace || "0", //String, [defalut: 0] 공백무시 여부(1이면 무시 0이면 포함)
        insertColumns : options.insertColumns || "" ,//Array, radio, checkbox와 같은 컬럼을 엑셀에서 받아 오지 않고
                                                     //사용자 컬럼 설정 으로 업로드 ( 데이터 구조 : [ { columnIndex:1, columnValue:"1" } ] )
        popupUrl : options.popupUrl || "", //String, 업로드시에 호출할 popup의 url
        status : options.status || "R", //String, [defalut: R]업로드된 데이터의 초기 상태값, 설정하지 않으면 "R"로 설정되며 "C"값을 설정 할 수 있다.
        pwd : options.pwd || "" //String, 엑셀파일에 암호가 걸려 있는 경우, 비밀번호
        , advancedHidden :"1"
    };

    grdObj.advancedExcelUpload(options);

};

/**
*  엑셀 CSV 업로드
*
* @date 2017.11.30
* @param {Object} grdObj GridView Object
* @param {Object} options JSON형태로 저장된 그리드의 엑셀 업로드 옵션
* @param {String} [options.type] [default: 1, 0] 데이터 형태 (0이면 실 데이터 형태,1이면 display 표시 방식)
* @param {String} [options.header] [default: 1, 0] Grid header 존재 유무 (0이면 header row수를 무시하고 전부 업로드하고 1이면 header row수 만큼 skip한다.)
* @param {String} [options.delim] [default: ','] CSV 파일에서 데이터를 구분할 구분자
* @param {String} [options.escapeChar] CSV 데이터에서 제거해야 되는 문자셋 ( ex) '\'' )
* @param {Number} [options.startRowIndex] [defalut: 0] csv파일에서 그리드의 데이터가 시작되는 행의 번호, startRowIndex가 설정되면, header 설정은 무시된다.
* @param {String} [options.append] [defalut: 0, 1] csv파일에서 가져온 데이터를 그리드에 append시킬지 여부(1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
* @param {Number} [options.hidden] [defalut: 0, 1] hidden Column에 대한 저장 여부(0이면 저장하지않음,1이면 저장)
* @param {String} [options.fillHidden] [defalut: 0, 1] hidden Column에 빈 값을 넣을지를 결정하기 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden column이 저장되어있지 않은 csv File이라 간주하고 hidden Column에 빈 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
* @param {String} [options.skipSpace] [defalut: 0, 1] 공백무시 여부(1이면 무시 0이면 포함)
* @param {String} [options.expression] [defalut: 1, 0] expression 컬럼 데이터를 포함하고 있는지 여부, 기본값은 미포함(1이면 미포함, 0이면 포함)
* @param {String} [options.popupUrl] 업로드시에 호출할 popup의 url
* @memberOf com
* @author InswaveSystems
* @example
* var gridId = "grd_AdvancedExcel";
* var options = {};
* com.uploadCSV( gridId,  options);
* //return 예시) 엑셀 파일(.CSV) 업로드
*/
com.uploadCSV = function (grdObj, options) {
    var options = {
        type : options.type || "0", //String, [default: 1, 0]데이터 형태 (0이면 실 데이터 형태,1이면 display 표시 방식)
        header : options.header || "0", //String, [default: 1, 0]Grid header 존재 유무 (0이면 header row수를 무시하고 전부 업로드하고 1이면 header row수 만큼 skip한다.)
        delim : options.delim || ",", //String, [default: ',']CSV 파일에서 데이터를 구분할 구분자
        escapeChar : options.escapeChar || "", //String, CSV 데이터에서 제거해야 되는 문자셋 ( ex) '\'' )
        startRowIndex : options.startRowIndex || 0, //Number, [defalut: 0] csv파일에서 그리드의 데이터가 시작되는 행의 번호, startRowIndex가 설정되면, header 설정은 무시된다.
        append : options.append || "0", //String, [defalut: 0, 1]csv파일에서 가져온 데이터를 그리드에 append시킬지 여부(1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
        hidden : options.hidden || 1, //Number, [defalut: 0, 1]hidden Column에 대한 저장 여부(0이면 저장하지않음,1이면 저장)
        fillHidden : options.fillHidden || "0", //String, [defalut: 0, 1]hidden Column에 빈 값을 넣을지를 결정하기 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden column이 저장되어있지 않은 csv File이라 간주하고 hidden Column에 빈 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
        skipSpace : options.skipSpace || "0", //String, [defalut: 0, 1]공백무시 여부(1이면 무시 0이면 포함)
        expression : options.expression || "1", //String, [defalut: 1, 0]expression 컬럼 데이터를 포함하고 있는지 여부, 기본값은 미포함(1이면 미포함, 0이면 포함)
        popupUrl : options.popupUrl || "" //String, 업로드시에 호출할 popup의 url
        , advancedHidden :"1"
    }
    grdObj.readCSV(options);
};


/* gridView 동적 적용 start */
/**
 * 동적 그리드 생성/스타일 변경
 * 기본적인 정보를 통해 그리드를 동적으로 생성하거나 스타일을 변경합니다.
 *
 * @date 2019. 02. 15.
 * @param {Array} gridOptionsArr JSONArray  형태로 데이터 동적 그리드생성및 스타일변경할 데이터 구조체
 * @param {String=} gridOptionsArr.id 그리드ID
 * @param {String=} gridOptionsArr.ref 참조할 데이터셋
 * @param {String=} gridOptionsArr.colNmType 그리드의 헤더를 생성할때 id로 할것인지 name으로 할것인지 정의
 * @param {String=} gridOptionsArr.colTpJsn 그리드의 바디 컬럼의 inputType="text"를 제외한 정보를 지정합니다.
 * @param {String=} gridOptionsArr.type 플래그 "C":새로생성,"R":기존 그리드의 스타일변경
 * @param {String=} gridOptionsArr.parentObj type="C"인경우 생성될 그리드의 부모,"R"인경우 없어도무관
 * @param {String=} gridOptionsArr.style 그리드에 적용할 스타일
 *
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var gridViewInfo = [{ //gridview동적생성
 *       id:"grd_Create"
 *       ,ref:"dlt_Create"
 *       ,colNmType:"id" 또는 "name"// header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
 *       ,colTpJsn: {colid:inputType,colid2:inputType2,...}//default column의 inputType은 'text' 입니다. 기타 inputType에 대해 기술합니다.
 *                   // ex) {bttonId:'select',bttonchk:'check',...}
 *       ,colExp:["progrmId",...] // 그리드 생성시 제외할 컬럼
 *       ,style:"width: 500px;height: 150px;" //
 *       ,type:"R"
 *  },...]
 * com.createGridView(gridViewInfo);
 *
 */
com.createGridView = function(gridOptionsArr,grd_Obj){
        if(com.isEmpty(gridOptionsArr) || gridOptionsArr.length == 0){
            //m_                console.log(com.getPrintTime()+"[common.js][com.createGridView] 생성할 그리드 정보가 없습니다.");
                return;
        }
        for(var key in gridOptionsArr){
                if(!gridOptionsArr.hasOwnProperty(key)) continue;
                var gridObj = gridOptionsArr[key];
                var dl_info = {
                        id :gridObj.ref
                        ,type : gridObj.colNmType || "name"  // header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
                };
                var _colTpJsn = gridObj.colTpJsn;
                var _colExp = gridObj.colExp;

                var grdStrObj  = this.grdHeaderBodyStr(dl_info,_colTpJsn,_colExp);
                var subgridObj = {
                        id : gridObj.id
                        ,ref:gridObj.ref
                        ,style:gridObj.style
                        ,headerStr :grdStrObj.strH
                        ,bodyStr:grdStrObj.strB
                        ,apt:gridObj.apt || false
                }
                var gridStr = com.getGridViewSrc(subgridObj);
                gridObj.type = gridObj.type || "R";
                if(gridObj.type == "R"){
                    grd_Obj.setGridStyle(WebSquare.xml.parse( gridStr , true ));
                }else{
                    //m_                        console.log(com.getPrintTime()+"[common.js][com.createGridView] 타입이 지정되어있지않습니다.");
                }
        }
};

/**
 * 데이터리스트로부터 그리드에 적용할 header/body string정보 얻어오기
 *
 * @private
 * @param {JSON} dl_info 데이터 정보
 * @param {String=} dl_info.id 데이터리스트 아이디
 * @param {String=} dl_info.type 그리드의 헤더셀의 값을 결정한다. default:"name" "id"
  * @date 2018. 08. 30.
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var dl_info = {
 *                 id :"dlt_datalistid"
 *                 ,type : "name||id"  // header의 name을 datalist의 컬럼정보중 id로 할것인지 name으로 할것인지 default:"name"
 *                }
 * var colTpJsn = {colid1:'select',colid2:'radio',...}//input type 결정
 * var colExp = ['colid1','colid2',...]               // 제외할 컬럼 결정
 * com.grdHeaderBodyStr(dl_id,colTpJsn);
 */
com.grdHeaderBodyStr = function(dl_info,colTpJsn,colExp){
    var rtnObj = {strH:"",strB:""};
    if(com.isEmpty(dl_info.id)){
        //m_        console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스트 아이디가 없습니다.");
        return;
    }
    var dlObj = $w.data[dl_info.id] || {};
    if(com.isEmpty(dlObj)){
        //m_        console.log(com.getPrintTime()+"[common.js][com.grdHeaderBodyStr] 데이터리스가 없습니다.");
        return;
    }
    var _type = dl_info.type || "name";
    var _colTpJsn = colTpJsn || {};
    var _colExp = colExp || [];
    var _colExpJsn = {};
    if(_colExp.length>0){
        for(var key in _colExp){
            if(!_colExp.hasOwnProperty(key)) continue;
            _colExpJsn[_colExp[key]] = "Y";
        }
    }

    var colIdArr = dlObj.cellIdList;

    var gridHeader = '';
    var gridBody = '';
    ////데이터리스트 기준으로 컬럼을 만든다.
    for (var k in colIdArr){
            if(!colIdArr.hasOwnProperty(k)) continue;
            var colid = colIdArr[k];
            if(_colExpJsn[colid] == "Y") continue;
            var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
            var _hinputType = "text";
            switch(colid){
            case "chk": _hinputType = "checkbox"
                break;
            case "radio": _hinputType = "radio"
                break;
            }
            gridHeader +='<w2:column blockSelect="false" id="'+'h'+colid+'" style="height:20px" inputType="'+_hinputType+'" width="70" value="'+colNm+'"></w2:column>';
            var inputType = _colTpJsn[colid] || "text";
            gridBody += '<w2:column blockSelect="false" id="'+colid+'" style="height:20px" inputType="'+inputType+'" width="70"></w2:column>';
    }
    rtnObj.strH = gridHeader;
    rtnObj.strB = gridBody;
    return rtnObj;
};

/**
 * 생성할 그리드의 기본 문자열
 * @private
 * @date 2018. 08. 30.
 * @memberOf com
 * @author InswaveSystems
 * @example
 *
 * var obj = [{ //gridview동적생성
 *       id:"grd_Create"  //  생성할 그리드의 id
 *       ,ref:"dlt_Create" // 참조할 데이터리스트의 id
 *       ,style:"width: 500px;height: 150px;" //
 *       ,headerStr :"헤더에 적용할 스트링" || "";
         ,bodyStr :"바디에 적용할 스트링"|| "";
 *  },...]
 * com.getGridViewSrc(obj);
 */
com.getGridViewSrc = function(obj){
        var _id = obj.id ;
        var _datalist = obj.ref ;

        var gridHeader = obj.headerStr || "";
        var gridBody = obj.bodyStr || "";

        //var _aptType = obj.apt == true ? '" visibleRowNum="29" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptType = obj.apt == true ? '" visibleRowNum="all" autoFit="none" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptStyle = obj.apt == true ? " width:"+$w.data[_datalist].cellIdList.length*80+"px; height: 640px;":"";
        var _style = obj.apt == true ? _aptStyle : obj.style || "width: 100%;height: 100%;";



             var gridStr = '<w2:gridView xmlns:w2="http://www.inswave.com/websquare" xmlns:ev="http://www.w3.org/2001/xml-events" dataList="data:'
                + _datalist
                + '" scrollByColumn="false" id="'
                + _id
                + '" style="'
                + _style
                //+ '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">'
                + _aptType
                + '<w2:header id="header1" style="">'
                + '<w2:row id="row1" style="">'
                + gridHeader
                + '</w2:row>'
                +'</w2:header>'
                +'<w2:gBody id="gBody1" style="">'
                +'<w2:row id="row2" style="">'
                + gridBody
                +'</w2:row>'
                +'</w2:gBody>'
                +'</w2:gridView>' ;
        return gridStr ;
};
/* gridView 동적 생성 finish */
/**
 * 그리드의 배경색을 바꾼다.
 *
 * ex)
 * var _colorInfo = {
 * 	color:[row1,row2,...] //idxArr
 * };
 * com.setGrdRowColor(grdObj,_colorInfo);
 */

com.setGrdRowColor = function( _grdObj, _colInfo){

    $.each(_colInfo,function(_color,_idxArr){
        $.each(_idxArr,function(_color,_idx){
            _grdObj.setRowStyle(_idx,"background-Color",_color);
        });
    });
};
/**GridView 관련 Function Finish*/
;