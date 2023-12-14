/**
 * 1. mgCom 은 업무별로 정의하시면 되겠습니다.
 * 2. 이하 구현하신 함수를 cmn.js의 함수명과 동일한경우 overriding합니다.

 * 하자 Scope에서 공유되는 전역 변수, 상수, 공통 함수를 정의한다.
 *
 * @version 1.0
 * @author CSH (tpchoish1)
 * @type mgCom
 * @class mgCom
 * @namespace gcmmgCom
 */
var mgCom = com;//mgCom 은 업무별로 정의하시면 되겠습니다.

var callBackInfo = {};	//콜백정보



mgCom.initFunction = function(){
	console.log("over riding ");
};

/**
 * 재무 사업구분코드 리스트 세팅함수
 * @date 2019.09.18
 * @author tplcs)
 * @example
 * mgCom.selBzpjGbCdList("sbxBzdpGb")
 */

mgCom.selBzpjGbCdList =  function ($p, bzpjGbCd, opt, mngctYnCd) {
	console.log( ">>>>>>>>>>>>  재무 사업구분코드리스트 :::: 시작 ");

    //$p = p;
	//debugger;
 	var deptCd     = mgCom.getMgDeptCd(sessionStorage.getItem("deptCd"));
 	var mngctYn	   = null;
 	if(typeof mngctYnCd != "undefined" && mngctYnCd != null && mngctYnCd != ""){
 		mngctYn = mngctYnCd;
 	}

	if( gcm.WHOLE_ATTR_CD != ""){ // 전사권한인 경우
		//com.selDtlCdList(bzpjGbCd, "CF074", "Y");
		ajaxLib.ajax("/mg/mgcomm/selectCommBzpjGbCdList", {
        	mode : "synchronous",
            requestData : {
		    				wholeAttrCd : gcm.WHOLE_ATTR_CD,	//전사 CRUD 권한
//		    				bzdpAttrCd  : gcm.BZDP_ATTR_CD,		//사업부 CRUDP 권한
//		    				deptAttrCd  : gcm.DEPT_ATTR_CD,		//부서단위 CRUDP 권한
		    				bzpjGbCdField : bzpjGbCd ,// 필드명
		    				mngctYn : mngctYn		//일반관리비여부 
//		    				selSctrList : sctr,		//사업구분 권한
             },
            callback :    function(result,e){
            	//debugger;
            	console.log( ">>>>>>>>>>>>  재무 사업구분코드리스트 return  :::: ");
            	var dltId = "dst_mgTemp" + parseInt(Math.random()*10000,10);
            	com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성
            	var _dataObj = $w.getComponentById(dltId);
            	var  strlist = result.data.bzpjGbCdList;
            	_dataObj.setJSON(strlist);

            	var field = result.data.bzpjGbCdField;
            	var comp = $p.getComponentById($p.getFrame().getObj(field).id);
            	comp.setNodeSet("data:" + dltId, "cdNm", "cd");

            	if(opt == true){
	            	comp.showChooseOption(true);
	            	comp.changeChooseOption("","전체");
            	}
            } ,
            errCallback : function(result, e){
            	console.log(e);
            }
        });
	} else {
		if(gcm.BZDP_ATTR_CD != ""){// 사업부 권한인경우
			//debugger;
			var sctr = mgCom.getConvSctrList(); //  사업부 권한변경
	     	var deptCd     = mgCom.getMgDeptCd(sessionStorage.getItem("deptCd"));

	     	var _idArr = bzpjGbCd.split(":");
			if(_idArr.length === 1){
				com.tempId = $p.getFrame().getObj(_idArr[0]).id;
			}else{
				com.tempId = $p.getFrame().getObj(_idArr[0]).id+":" + _idArr[1];
			}

			ajaxLib.ajax("/mg/mgcomm/selectCommBzpjGbCdList", {
	        	mode : "synchronous",
	            requestData : {
//			    				wholeAttrCd : gcm.WHOLE_ATTR_CD,	//전사 CRUD 권한
			    				bzdpAttrCd  : gcm.BZDP_ATTR_CD,		//사업부 CRUDP 권한
//			    				deptAttrCd  : gcm.DEPT_ATTR_CD,		//부서단위 CRUDP 권한
			    				bzpjGbCdField : bzpjGbCd ,// 필드명
			    				selSctrList : sctr,		//사업구분 권한
			    				mngctYn : mngctYn,		//일반관리비여부
			    				deptCd : deptCd
	            			},
	            callback :    function(result,e){
	            	var dltId = "dst_mgTemp" + parseInt(Math.random()*10000,10);
	            	com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성
	            	var _dataObj = $w.getComponentById(dltId);
	            	_dataObj.setJSON(result.data.bzpjGbCdList);
	            	var field = result.data.bzpjGbCdField;
	            	var comp = $p.getComponentById($p.getFrame().getObj(field).id);
	            	comp.removeAll();
	            	comp.setNodeSet("data:" + dltId, "cdNm", "cd");
	            	//comp.showChooseOption(true);
	            	//comp.changeChooseOption("xxx","선택");
	            } ,
	            errCallback : function(result, e){
	            	console.log(e);
	            }
	        });

		} else if(gcm.DEPT_ATTR_CD  != "" ){	//부서단위 권한일 경우 세션 현장코드를 셋팅
//	     	debugger;
			var deptCd     = mgCom.getMgDeptCd(sessionStorage.getItem("deptCd"));

			var ccrtDeptList = JSON.parse(sessionStorage.getItem("tcfCcrtDeptList"));
			var dept = [];
	        for(var i = 0; i < ccrtDeptList.length; i++){
	        	dept.push(mgCom.getMgDeptCd(ccrtDeptList[i].deptCd));
	         } // for
	        dept.push(deptCd);

			ajaxLib.ajax("/mg/mgcomm/selectCommBzpjGbCdList", {
	        	mode : "synchronous",
	            requestData : {
//			    				wholeAttrCd : gcm.WHOLE_ATTR_CD,	//전사 CRUD 권한
//			    				bzdpAttrCd  : gcm.BZDP_ATTR_CD,		//사업부 CRUDP 권한
			    				deptAttrCd  : gcm.DEPT_ATTR_CD,		//부서단위 CRUDP 권한
			    				bzpjGbCdField : bzpjGbCd, // 필드명
			    				deptList : dept, // 겸직부서코드
			    				mngctYn : mngctYn,		//일반관리비여부
			    				deptCd :  deptCd
	            			},
	            callback :function(result, e){
	    			var dltId = "dst_mgTemp" + parseInt(Math.random()*10000,10);
	    			com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성
	    			var _dataObj = $w.getComponentById(dltId);
	    			_dataObj.setJSON(result.data.bzpjGbCdList);

	    			var field = result.data.bzpjGbCdField;
	            	var comp = $p.getComponentById($p.getFrame().getObj(field).id);
	            	comp.removeAll();
	            	comp.setNodeSet("data:" + dltId, "cdNm", "cd");

//	            	comp.showChooseOption(true);
//	            	comp.changeChooseOption("xxx","선택");
	            },
	            errCallback : function(result, e){
	            	console.log(e);
	            }
	        });
		}

	}

};

/**
 * 재무조회부문권한 부서 리스트를 반환한다.
 *
 * @date 2019.09.20
 * @author  (tplcs)
 * @example
 *  mgCom.getConvSctrList();
 */

mgCom.getConvSctrList = function() {
	var sctr = [];
    for(var i = 0; i < gcm.SEL_SCTR_LIST.length; i++){  // 배열값에서 가지고 온다.
	    var srch = gcm.SEL_SCTR_LIST[i];
    	console.log( ">>>>>>>>>>>>  재무 사업구분코드리스트 :::: " + i +"::"+ srch );

	    switch(srch)
	    {
	    case "CF070K020000" :  // 토목
	    case "CF070K040000" :  // 플랜트
	    	sctr.push("CF07410"); // 토목
	    	 break;
	    case "CF070K030000" :  // 건축
	    	sctr.push("CF07420"); // 건축
	    	 break;
	    case "CF070K050000" :  // 주택
	    	sctr.push("CF07430"); // 주택
	    	 break;
	    case "CF070K060000" :  // 경영관리
	    	sctr.push("CF07400"); //  경영관리
	    	 break;
	    }
     } // for
    return sctr; //sctr.filter((item, index) => sctr.indexOf(item) === index); // 중복값 제거하는 필터
};

/**
 * 부서코드 끝에 붙는 0을 제거한다.
 *
 * @date 2019.09.20
 * @author  (tplcs)
 * @example
 *  mgCom.getConvSctrList();
 */

mgCom.getMgDeptCd = function(deptCd) {
	if(deptCd.indexOf("K") ==  0) {
		return deptCd;
	} else {
		return deptCd.substring(0,6);
	}
};

/**
 * 재무 공통코드 프로젝트 리스트를 조회한다.
 *
 * @date 2019.03.29
 * @author CSH (tpchoish1)
 * @example
 *  mgCom.selPjtCdList();
 */

mgCom.selPjtCdList = function (charValN1) {
	var json = {
			 "charValN1":charValN1
			};
	json = com.getJSON(json);

    ajaxLib.ajax("/mg/mgcomm/selectPjtCdList", {
	    mode        : "synchronous"
	  , requestData : json
	  , errCallback : "mgCom.fnErrCallBack"
	  , callback    : function (result, e) {
		  callBackInfo = result.data.pjtCdList;
	  }
    });

    return callBackInfo;
};

/**
 * 재무 공통코드 고객서비스센터 리스트를 조회한다.
 *
 * @date 2019.08.26
 * @author CSH (tpchoish1)
 * @example
 *  mgCom.selPjtCdList();
 */

mgCom.selRvtBrchCdList = function (charValN1) {
	var json = {
			 "charValN1":charValN1
			};
	json = com.getJSON(json);

    ajaxLib.ajax("/mg/mgcomm/selRvtBrchCdList", {
	    mode        : "synchronous"
	  , requestData : json
	  , errCallback : "mgCom.fnErrCallBack"
	  , callback    : function (result, e) {
		  callBackInfo = result.data.rvtBrchCdList;
	  }
    });

    return callBackInfo;
};

/**
 * 재무 공통코드 팀 리스트를 조회한다.
 *
 * @date 2019.04.13
 * @author CSH (tpchoish1)
 * @example
 *  mgCom.selTeamCdList();
 */

mgCom.selTeamCdList = function (charValN1) {
	var json = {
			 "charValN1":charValN1
			};
	json = com.getJSON(json);

    ajaxLib.ajax("/mg/mgcomm/selectTeamCdList", {
	    mode        : "synchronous"
	  , requestData : json
	  , errCallback : "mgCom.fnErrCallBack"
	  , callback    : function (result, e) {
		  callBackInfo = result.data.teamCdList;
	  }
    });

    return callBackInfo;
};

/**
 * 주관 팀구분코드를 조회한다.
 *
 * @date 2019.04.13
 * @author CSH (tpchoish1)
 * @example
 *  mgCom.selTeamCdList();
 */

mgCom.selSpvsTeamCdList = function (charValN1, charValN2) {
	var json = {
			  "charValN1": charValN1
			, "charValN2": charValN2
	};
	json = com.getJSON(json);

	ajaxLib.ajax("/mg/mgcomm/selSpvsTeamCdList", {
		mode        : "synchronous"
		, requestData : json
		, errCallback : "mgCom.fnErrCallBack"
		, callback    : function (result, e) {
			callBackInfo = result.data.spvsTeamCdList;
		}
	});

	return callBackInfo;
};


/**
 * 영업 공통코드 중 사업구분 리스트를 조회한다.
 *
 * @date 2019.07.11
 * @author JEON(tpjeonmg)
 * @example
 *  saCom.selectBzpjGbCd();
 */

mgCom.selectBzpjGbCd = function () {
    ajaxLib.ajax("/mg/mgcomm/selectBzpjGbCdList", {
	    mode        : "synchronous"
	  , requestData : {}
	  , errCallback : "mgCom.fnErrCallBack"
	  , callback    : function (result, e) {
		  callBackInfo = result.data.bzpjGbCdList;
	  }
    });

    return callBackInfo;
};

/**
 * 수주영업비 확정구분 리스트를 조회한다.
 *
 * @date 2019.07.26
 * @author JEON(tpjeonmg)
 * @example
 *  mgCom.selectBgtAproStusCd();
 */
mgCom.selectBgtAproStusCd = function () {
	ajaxLib.ajax("/mg/mgcomm/selectBgtAproStusCdList", {
		mode        : "synchronous"
      , requestData : {}
	  , errCallback : "mgCom.fnErrCallBack"
	  , callback    : function (result, e) {
		  	callBackInfo = result.data.bgtAproStusCdList;
	    }
	});

	return callBackInfo;
};

mgCom.fnErrCallBack = function(result, e) {
	console.log("error has occured!!");
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
mgCom.createGridView = function(gridOptionsArr,grd_Obj, type){
	if(com.isEmpty(gridOptionsArr) || gridOptionsArr.length == 0){
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
		var grdStrObj;

		if(type == "dtl"){
			grdStrObj  = this.grdDtlHeaderBodyFootStr(dl_info,_colTpJsn,_colExp);
		} else {
			grdStrObj  = this.grdsmryHeaderBodyFootStr(dl_info,_colTpJsn,_colExp);
		}

		var subgridObj = {
				id : gridObj.id
				,ref:gridObj.ref
				,style:gridObj.style
				,headerYearStr :grdStrObj.strYH
				,headerMonthStr :grdStrObj.strMH
				,bodyStr:grdStrObj.strB
				,footerStr:grdStrObj.strF
				,apt:gridObj.apt || false
				,colAutoFit : gridObj.colAutoFit
		}

		var gridStr = mgCom.getGridViewSrc(subgridObj);
		gridObj.type = mgCom.nvl(gridObj.type, "R");
		if(gridObj.type == "R"){
			grd_Obj.setGridStyle(WebSquare.xml.parse( gridStr , true ));
		} else {
			console.log("");
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
mgCom.grdDtlHeaderBodyFootStr = function(dl_info,colTpJsn,colExp){
    var rtnObj = {strYH:"", strMH:"" ,strB:"", strF:""};
    if(com.isEmpty(dl_info.id)){
        return;
    }
    var dlObj = $w.data[dl_info.id] || {};
    if(com.isEmpty(dlObj)){
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

    var gridYearHeader = '';
    var gridMonthHeader = '';
    var gridBody = '';
    var gridFooter = '';

    var yearNm = "";
    var yearList = [];

    var yearMonthCntArr = [];
    var colSapn = 0;
    var fristCnt = 0;
	var endCnt = 0;
    var valueCnt = 0;

	var temp = "";
    // 년도별 월 갯수
    for (var i = 0; i < colIdArr.length; i++) {
    	var colid = colIdArr[i];
    	var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
    	if(i > 2){
    		if(i==3){
    			var endYearMm = dlObj.getColumnName(colIdArr[colIdArr.length-1]).substring(0,4);
    			temp = colNm.substring(0,4);
    			if(endYearMm == colNm.substring(0,4)){
    				for (var j = 0; j < colIdArr.length; j++) {
    					if(j > 2){
    						valueCnt++;
    					}
    				}
    				fristCnt = 13-((12-valueCnt)+1);
    			} else {
    				fristCnt = 13-parseInt(colNm.substring(4,6));
    			}
    			yearMonthCntArr.push(fristCnt+1);
    		}

    		if(temp != colNm.substring(0,4)){
    			if(i == colIdArr.length -1){
    				endCnt = parseInt(colNm.substring(4,6));
    				if((parseInt(colNm.substring(0,4)) - parseInt(temp)) > 1) {
    					var j = 1;
    					while (j < (parseInt(colNm.substring(0,4)) - parseInt(temp))) {
    						yearMonthCntArr.push(13);
    						j++;
						}
    				}
    				yearMonthCntArr.push(endCnt+1);
    			}
    		}
    	}
    }

    //컬럼 소계용
    var subSumId = "";
    //컬럼 합계용
    var totSumId = "";

    // 데이터리스트 기준으로 컬럼을 만든다.
    for (var i = 0; i < colIdArr.length; i++) {

    	if(!colIdArr.hasOwnProperty(i)) continue;
    	var colid = colIdArr[i];
    	var _hinputType = "text";
    	var inputType = _colTpJsn[colid] || "text";
    	switch(colid){
    		case "chk": _hinputType = "checkbox"
    		break;
    		case "radio": _hinputType = "radio"
    		break;
    	}

    	if(_colExpJsn[colid] == "Y"){
    		if(colid == "yearArr"){
    			yearList = dlObj.getColumnName(colid).split(',');
    			yearNm = dlObj.getColumnName(colid).split(',')[0];
    		}
    		continue;
    	} else {
    		var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
    		var textAlign = "";
    		if(colid == "chk"){
    			textAlign = "center";
    		} else if(colid == "pjtNm"){
    			textAlign = "left";
    		} else {
    			textAlign = "right";
    		}

    		if(i > 2){
    			gridBody += '<w2:column blockSelect="false" id="'+colid+'" style="height:20px" inputType="'+inputType+'" width="70" displayFormat="#,###" dataType="number" value="0" textAlign="'+ textAlign +'" ></w2:column>';
    			subSumId += "'"+colid +"',";
    			if(i == 3){
    				gridYearHeader +='<w2:column blockSelect="false" id="'+'yh'+colid+'" colSpan="'+yearMonthCntArr[0]+'" style="" inputType="'+_hinputType+'" width="150" value="'+ colNm.substring(0,4)+'"></w2:column>';
    				yearNm = colNm.substring(0,4);
    			} else {
    				if(yearNm != colNm.substring(0,4)){
    					colSapn++;
    					gridYearHeader +='<w2:column blockSelect="false" id="'+'yh'+colid+'" colSpan="'+yearMonthCntArr[colSapn]+'" style="" inputType="'+_hinputType+'" width="150" value="'+ colNm.substring(0,4)+'"></w2:column>';
    					yearNm = colNm.substring(0,4);
    				}
   				}
    			gridMonthHeader +='<w2:column blockSelect="false" id="'+'mh'+colid+'" style="" inputType="'+_hinputType+'" width="150" value="'+colNm.substring(4,6)+'"></w2:column>';

    			if(colNm.substring(4, 6) == "12" || (i == colIdArr.length -1)){
    				gridMonthHeader +='<w2:column blockSelect="false" id="'+'stot'+colid+'" class="subtotal" style="" inputType="'+_hinputType+'" width="150" value="소계"></w2:column>';
    				var sumexp = "sum("+subSumId.substring(0,subSumId.length-1)+")";
    				totSumId += subSumId;
    				subSumId = "";
    				gridBody += '<w2:column blockSelect="false" id="'+'stot'+colid.substring(3,7)+'" class="subtotal" style="height:20px" inputType="expression" expression="'+sumexp+'" width="70" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
    			}
    		} else {
    			gridBody += '<w2:column blockSelect="false" id="'+colid+'" style="height:20px" inputType="'+inputType+'" width="70" textAlign="'+ textAlign +'"></w2:column>';
    			gridYearHeader +='<w2:column blockSelect="false" id="'+'yh'+colid+'" style="" rowSpan="2" inputType="'+_hinputType+'" width="150" value="'+colNm+'"></w2:column>';
    		}
    	}

		if(i == 1){
			gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="'+_hinputType+'" width="70" value="합계"></w2:column>';
		} else {
			if(colid != "chk"){
				var sumExp = "sum('" + colid + "')";
				gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="expression" expression="'+sumExp+'" width="70" value="" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
				if(colNm.substring(4, 6) == "12" || (i == colIdArr.length -1)){
					var sumExp = "sum('stot"+colNm.substring(0, 4) +"')";
					gridFooter +='<w2:column blockSelect="false" id="'+'sumStot'+colid+'" style="" inputType="expression" expression="'+sumExp+'" width="70" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
				}
			} else {
				gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="'+_hinputType+'" width="70" value="" textAlign="right"></w2:column>';
			}

			if(i == colIdArr.length-1){
				gridYearHeader +='<w2:column blockSelect="false" id="'+'sum'+colid+'" class="sum" style="" rowSpan="2" inputType="'+_hinputType+'" width="150" value="합계"></w2:column>';
				var totexp = "sum("+totSumId.substring(0,totSumId.length-1)+")";
				var sumExp = "sum('allSumBegnAmt')";
				gridBody += '<w2:column blockSelect="false" id="allSumBegnAmt" class="sum" style="height:20px" inputType="expression" expression="'+totexp+'" width="70" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
				gridFooter +='<w2:column blockSelect="false" id="'+'allSum'+colid+'" style="" inputType="expression" expression="'+sumExp+'" width="70" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
	    	}
		}
	}

    rtnObj.strYH = gridYearHeader;
    rtnObj.strMH = gridMonthHeader;
    rtnObj.strB = gridBody;
    rtnObj.strF = gridFooter;

    return rtnObj;
};

mgCom.grdsmryHeaderBodyFootStr = function(dl_info,colTpJsn,colExp){
    var rtnObj = {strYH:"", strMH:"" ,strB:"", strF:""};
    if(com.isEmpty(dl_info.id)){
        return;
    }
    var dlObj = $w.data[dl_info.id] || {};
    if(com.isEmpty(dlObj)){
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

    var gridYearHeader = '';
    var gridMonthHeader = '';
    var gridBody = '';
    var gridFooter = '';

    var sumTotAttr = [];
    var sumexp = "";
    sumexp += "sum(";
    // 년도 구하기
    for (var i = 0; i < colIdArr.length; i++) {
    	var colid = colIdArr[i];
    	var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
    	if(i > 3){
    		sumTotAttr.push(colNm);
    		if(i == (colIdArr.length-1)){
    			sumexp += "'"+ colNm + "'";
    		} else {
    			sumexp += "'"+ colNm + "',";
    		}
    	} else {
    		sumTotAttr.push("");
    	}
    }
    sumexp += ")";

    //컬럼 소계용
    var subSumId = "";
    //컬럼 합계용
    var totSumId = "";

    // 데이터리스트 기준으로 컬럼을 만든다.
    for (var i = 0; i < colIdArr.length; i++) {

    	if(!colIdArr.hasOwnProperty(i)) continue;
    	var colid = colIdArr[i];
    	var _hinputType = "text";
    	var inputType = _colTpJsn[colid] || "text";
    	switch(colid){
    		case "chk": _hinputType = "checkbox"
    		break;
    		case "radio": _hinputType = "radio"
    		break;
    	}

		var colNm = _type == "name" ? dlObj.getColumnName(colid) : colid;
		if(i == 0 ){
			gridYearHeader +='<w2:column blockSelect="false" id="'+'yh'+colid+'" colSpan="2" style="" inputType="'+_hinputType+'" width="150" value="'+ colNm+'"></w2:column>';
		} else if(i > 2){
			subSumId += "'"+colid +"',";
			if(colid == "allSumBegnAmt") {
				var sumExp = "sum('allSumBegnAmt')";
				gridYearHeader +='<w2:column blockSelect="false" id="'+'yh'+colid+'" class="sum" rowSpan="2" style="" inputType="'+_hinputType+'" width="150" value="'+ colNm+'"></w2:column>';
				gridBody += '<w2:column blockSelect="false" id="'+colid+'" class="sum" inputType="expression" expression="'+sumexp+'" readOnly="true" style="height:20px" width="70" textAlign="right"></w2:column>';
				gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="expression" expression="'+sumExp+'" width="70" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
			} else {
				gridYearHeader +='<w2:column blockSelect="false" id="'+'yh'+colid+'" rowSpan="2" style="" inputType="'+_hinputType+'" width="150" value="'+ colNm+'"></w2:column>';
				gridBody += '<w2:column blockSelect="false" id="'+colid+'" readOnly="true" style="height:20px" inputType="'+inputType+'" width="70" textAlign="right"></w2:column>';
				var sumExp = "sum('"+ sumTotAttr[i] + "')";
				gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="expression" expression="'+sumExp+'" width="70" displayFormat="#,###" dataType="number" textAlign="right"></w2:column>';
			}
		} else {
			gridMonthHeader +='<w2:column blockSelect="false" id="'+'mH'+colid+'" style="" inputType="'+_hinputType+'" width="150" value="'+ colNm+'"></w2:column>';
			gridBody += '<w2:column blockSelect="false" id="'+colid+'" readOnly="true" style="height:20px" inputType="'+inputType+'" width="70" ></w2:column>';
			if(i==1){
				gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="'+_hinputType+'" width="70" value="합계"></w2:column>';
			} else {
				gridFooter +='<w2:column blockSelect="false" id="'+'f'+colid+'" style="" inputType="'+_hinputType+'" width="70" textAlign="right" expression="" ></w2:column>';
			}
		}
	}

    rtnObj.strYH = gridYearHeader;
    rtnObj.strMH = gridMonthHeader;
    rtnObj.strB = gridBody;
    rtnObj.strF = gridFooter;

    return rtnObj;
};

mgCom.createDataObj = function(type, id, columnArr) {
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
                    + "\" dataType=\"number\" />";
        }
    }

    dataStr += "</w2:" + t[1] + "Info></w2:data" + t[0] + ">";
    $w.data.create(dataStr);
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
mgCom.getGridViewSrc = function(obj){
        var _id = obj.id ;
        var _datalist = obj.ref ;

        var gridYearHeader = obj.headerYearStr || "";
        var gridMonthHeader = obj.headerMonthStr || "";
        var gridBody = obj.bodyStr || "";
        var gridFooter = obj.footerStr || "";

        //var _aptType = obj.apt == true ? '" visibleRowNum="29" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptType = obj.apt == true ? '" visibleRowNum="all" autoFit="none" readOnly="true" fixedColumnWithHidden="true" useShiftKey="false">' : '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="allColumn">';
        var _aptStyle = obj.apt == true ? " width:"+$w.data[_datalist].cellIdList.length*80+"px; height: 640px;":"";
        var _style = obj.apt == true ? _aptStyle : obj.style || "width: 100%;";
        var autoFitOption = obj.id == "grdDtlList" ? obj.colAutoFit == "allColumn" ? "allColumn" : "lastColumn" : "allColumn";

        var gridStr = '<w2:gridView xmlns:w2="http://www.inswave.com/websquare" xmlns:ev="http://www.w3.org/2001/xml-events" class="autoHeight" sortable="true" dataList="data:'
                + _datalist
                + '" scrollByColumn="false" id="'
                + _id
                + '" style="'
                + _style
               	+ '" fixedColumnWithHidden="true" useShiftKey="false" autoFit="' + autoFitOption + '" editModeEvent="onclick" keyMoveEditMode="true" enterKeyMove="right" focusMode="row">'
                + '<w2:header id="header1" style="">'
                + '<w2:row id="row1" style="">'
                + gridYearHeader
                + '</w2:row>'
                + '<w2:row id="row2" style="">'
                + gridMonthHeader
                + '</w2:row>'
                +'</w2:header>'
                +'<w2:gBody id="gBody1" style="">'
                +'<w2:row id="row3" style="">'
                + gridBody
                +'</w2:row>'
                +'</w2:gBody>'
                +'<w2:footer id="footer1" style="">'
                +'<w2:row id="row4" style="">'
                + gridFooter
                + '</w2:row>'
                +'</w2:footer>'
                +'</w2:gridView>' ;
        return gridStr ;
};
/* gridView 동적 생성 finish */

/*mgCom.selPjtCdList = function(obj, charValN1 ) {
	var json = {
			 "charValN1":charValN1
			};
	json = com.getJSON(json);

	var _idArr = obj.split(":");
	if(_idArr.length === 1){
		com.tempId = $p.getFrame().getObj(_idArr[0]).id;
	}else{
		com.tempId = $p.getFrame().getObj(_idArr[0]).id+":" + _idArr[1];
	}

	console.log("over riding==================== ");
	ajaxLib.ajax("/mg/mgcomm/selectPjtCdList", {
	     mode        : "synchronous"
	    ,requestData : json
	    ,callback    : "mgCom.pjtCdListCallback"
	    ,errCallback : "mgCom.pjtCdListErrCallBack"
   });
};
mgCom.pjtCdListCallback = function(res){
	var strRslt = res.data.dsCdList;
	var dltId = "dst_Temp" + parseInt(Math.random()*10000,10);
	com.createDataObj("dataList", dltId, gcm.COMMON_CODE_INFO.FILED_ARR);//데이터리스트 생성
	var _dataObj = $w.getComponentById(dltId);

	_dataObj.setJSON(strRslt);
	var tmpIdArr = com.tempId.split(":");
	// 기본 컴포넌트에 대한 Node Setting 설정
	if (tmpIdArr.length === 1) {
		var comp = $p.getComponentById(tmpIdArr[0]);

		comp.setNodeSet("data:" + dltId, "cdNm", "cd");
	// gridView 컴포넌트에 대한 Node Setting 설정
	} else {
		var gridObj = $p.getComponentById(tmpIdArr[0]);

		gridObj.setColumnNodeSet(tmpIdArr[1], "data:" + dltId, "cdNm",  "cd");
	}
};
mgCom.pjtCdListErrCallBack = function(){
	console.log("error has occured!!");
};*/


mgCom.nvl = function(obj, val) {
	if (obj === null || obj === undefined || obj === "") {
		return val;
	}

	return obj;
};

mgCom.gettAttrCd = function() {
	var returnValue = "";
	if(gcm.WHOLE_ATTR_CD != ""){
		returnValue = gcm.WHOLE_ATTR_CD;
	} else if(gcm.BZDP_ATTR_CD != ""){
		returnValue = gcm.BZDP_ATTR_CD;
	} else {
		returnValue = gcm.DEPT_ATTR_CD;
	}
	return returnValue;
};

mgCom.fnCalcRt = function(salesAmt , pcostAmt, decimalPlace){
	var resultRt = 0;
	var overflowRt = 999.99;
	
	if(salesAmt == 0){
		if(pcostAmt == 0){
			resultRt = 0.00;
		} else if(pcostAmt > 0){
			resultRt = 999.99;
		} else if(pcostAmt < 0){
			resultRt = -999.99;
		}
	} else {
		if(salesAmt > pcostAmt){
			if(Math.abs((1 - Math.abs(pcostAmt - salesAmt) / salesAmt) * 100.0, 2).toFixed(decimalPlace) > overflowRt){
				resultRt = overflowRt * Math.sign(pcostAmt * salesAmt);
			} else {
				resultRt = ((1 - Math.abs(pcostAmt - salesAmt) / salesAmt) * 100.0).toFixed(decimalPlace);
			}
		} else {
			if(Math.abs((1 + Math.abs(pcostAmt - salesAmt) / salesAmt) * 100.0, 2).toFixed(decimalPlace) > overflowRt){
				resultRt = overflowRt * Math.sign(pcostAmt * salesAmt);
			} else {
				resultRt = ((1 + Math.abs(pcostAmt - salesAmt) / salesAmt) * 100.0).toFixed(decimalPlace);
			}
		}
	}
	return resultRt;
};