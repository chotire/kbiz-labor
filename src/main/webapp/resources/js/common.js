    /********************************************************************************************
     * AJAX 공통 함수
     ********************************************************************************************/
    function fnAjax(paramMethod, paramUrl, paramJsonData, paramCallbackFunction, option){
        
        var queryStringJsonData = {};

    	var ajaxParam = {
			"dataType": 'json', 
			"type": paramMethod,
			"contentType": "application/json",
			"async": true,
			"url": paramUrl, 
			"beforeSend": function(){
			},
			"headers": {
		    },
			"complete": function(){
			},
			"success": function(result){
				/*
				if(result != null && result.accessToken != null){
		        	sessionStorage.setItem("accessToken", result.accessToken);
				}
				*/
				paramCallbackFunction(result);
			},
			"error":function(request,status,error){
				if(request.responseJSON === undefined){
					if ((request.readyState == 4 || request.readyState == 0) && request.status == 0) {
				      alert("ERR_CONNECTION_REFUSED");
				    }
					else{
						alert("INTERNAL_SERVER_ERROR");
					}
				}
				else{
					var exception = request.responseJSON.data;
					
					//인증 실패 
					if(exception.code == "401.fail"){
						alert(exception.message);
					}
					//요청에 대한 인가 실패
					else if(exception.code == "403.authorization"){
						alert(exception.message);
					}
					//세션 만료
					else if(exception.code == "403.expiration"){
						alert(exception.message);
						fnMovePage(gServerContextPath+"/logout");
					}
					//중복 로그인
					else if(exception.code == "403.duplicationLogin"){
						alert(exception.message);
						fnMovePage(gServerContextPath+"/logout");
					}
	                //서버 유효성 검증 실패 시 실패한 필드 전달
					else if(exception.code == "400" && exception.field != null){
						alert(exception.message + "\n( 유효성 검증 오류 필드 : "+exception.field+" = ["+exception.rejectedValue+"] )");
					}
					else{
						alert(exception.message);
					}
				}
			}
    	};
    	
    	// 진행바
    	if(option != null){
    		if(option.progress_bar){
    			ajaxParam.beforeSend = function(){
    				$("<div class='progress-backdrop'>").appendTo("body");
    				$(".popup-progress").css("display","");
    				$(".popup-progress").css("top", ( $(window).height() - $(".popup-progress").height() ) / 3 + $(window).scrollTop() + "px");
    				$(".popup-progress").css("left", ( $(window).width() - $(".popup-progress").width() ) / 2 + $(window).scrollLeft() + "px");
    				$(".progress-title").text(option.progress_title);
    				
    			};
    			ajaxParam.complete = function(){
    				$(".progress-backdrop").remove();
    				$(".popup-progress").css("display","none");
    				$(".progress-title").text("");
    			}
    		}
    	}
        
        // HTTP 메서드가 GET인 경우 : json data ==> query string
        // HTTP 메서드가 GET이 아닌 경우 : json data ==> request body
    	if(paramJsonData != null){
            if(paramMethod == "GET"){
            	queryStringJsonData = paramJsonData;
            }
            else{
            	ajaxParam.data = JSON.stringify(paramJsonData);
            }
    	}


        // CSRF token 추가
    	queryStringJsonData["csrfToken"] = $("#form-navigation input[name='csrfToken']").val();
        
        // access token 추가
        /*
    	if(sessionStorage.getItem("accessToken")){
        	queryStringJsonData["accessToken"] = sessionStorage.getItem("accessToken");
        }
    	*/

        // URL에 query string 추가
        if(!$.isEmptyObject(queryStringJsonData)){
        	ajaxParam.url = ajaxParam.url + "?" + $.param(queryStringJsonData);
        }
    	
        //ajax 비동기 통신 요청
        $.ajax(ajaxParam);
    }
	
    /********************************************************************************************
     * 화면 이동 함수
     ********************************************************************************************/
    function fnMovePage(paramPage){
        $("#form-navigation").attr("action",paramPage);
    	/*
        if(sessionStorage.getItem("accessToken")){
            $("#form-navigation").append("<input type='hidden' name='accessToken' />");
        	$("#form-navigation input[name='accessToken']").val(sessionStorage.getItem("accessToken"));
    	}
        */
        $("#form-navigation").submit();
    }

    /********************************************************************************************
     * UNDERSCORE TO CAMELCASE 변환 공통 함수
     ********************************************************************************************/
    function fnToCamelCase(string) {
        return string.toLowerCase().replace(/(\_[a-zA-Z])/g, function($1) {
            return $1.toUpperCase().replace('_','');
        })
    }
    
    /********************************************************************************************
     * 페이징 처리
     ********************************************************************************************/
    function fnSetPagenation(paramObjPagination, paramTotalCount, paramPageLimit, paramFunctionSearch){
        
        $(paramObjPagination).find(".page-item").remove();
        
        var pageOffset = $(paramObjPagination).data("page-offset");
        
        var currentPage = parseInt(pageOffset/paramPageLimit)+1;
        
        var firstPage = 1;
        var lastPage = Math.ceil(paramTotalCount/paramPageLimit);
        
        var startPage = parseInt(pageOffset/(paramPageLimit*10))*10+1;
        var endPage = (startPage+9 < lastPage)?startPage+9:lastPage;
        
        var previousPage = (startPage-10>firstPage)?startPage-10:firstPage;
        var nextPage = (endPage < lastPage)?startPage+10:lastPage;
        
        $('<li class="page-item first">First</li>').data("PAGE",1).appendTo(paramObjPagination);
        $('<li class="page-item prev">Previous</li>').data("PAGE",previousPage).appendTo(paramObjPagination);
        for(i = startPage ;i < startPage + 10 && i <= lastPage ; i++){
            var $pageItem = $('<li class="page-item">'+i+'</li>').data("PAGE",i).appendTo(paramObjPagination);
            if(i == currentPage){
                $($pageItem).addClass("active");
            }
        }
        $('<li class="page-item next">Next</li>').data("PAGE",nextPage).appendTo(paramObjPagination);
        $('<li class="page-item last">Last</li>').data("PAGE",lastPage).appendTo(paramObjPagination);
        
        $(".page-item").css({"display": "inline","padding": "5px","cursor":"pointer"});
        
        //페이지 클릭 시
        $(paramObjPagination).find(".page-item").click(function(){
            pageOffset = ($(this).data("PAGE")-1)*paramPageLimit;
            $(paramObjPagination).data("page-offset", pageOffset);
            paramFunctionSearch();
        });
    }
    
    /********************************************************************************************
     * 팝업창 오픈 처리
     ********************************************************************************************/
	function fnOpenPopup(modal){
    	$(modal).find("input").val(null);
    	$(modal).css("display","").draggable();
    	$(modal).css("top", ( $(window).height() - $(modal).height() ) / 3 + $(window).scrollTop() + "px");
    	$(modal).css("left", ( $(window).width() - $(modal).width() ) / 2 + $(window).scrollLeft() + "px");
    	$("<div class='popup-backdrop'>").appendTo("body");
    }
	
    /********************************************************************************************
     * 팝업창 닫기 처리
     ********************************************************************************************/
    function fnClosePopupAll(){
    	$(".popup").css("display","none");
    	$(".popup-backdrop").remove();
    }