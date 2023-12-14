/**
 * @target 메시지 처리 관련 공통함수
 */

/**
 * 메시지 처리 관련 공통함수를 제공하는 개체입니다.
 * 
 * @type {object}
 * @class msgLib
 * @namespace msgLib
 */
var msgLib = {};

/**
 * 메시지 리파지터리.<br>
 * 최초 1회에 SessionStorage에 저장해서 시스템 전체에서 공유하는 방식으로 사용됩니다.
 * 
 * @author SONG WONSEOK
 * @date 2017. 06. 29.
 * @memberOf msgLib
 */
msgLib.properties = [ 
	// 시스템 오류 관련 메시지
    { key : "sysm.0001", koMsg : "서버에서 알 수 없는 오류가 발생했습니다.", enMsg : "" },
    { key : "sysm.0002", koMsg : "접근할 수 있는 메뉴가 존재하지 않습니다.", enMsg : "" },
    { key : "sysm.0003", koMsg : "접근할 수 없는 시스템 모듈입니다. ({0})", enMsg : "" },
    { key : "sysm.0004", koMsg : "사용자 정보가 유효하지 않습니다.\n\nUser ID or Password in invalid.", enMsg : "" },
    { key : "sysm.0005", koMsg : "동일한 사용자 정보가 여러 건 존재합니다. 시스템 관리자에게 문의하시기 바랍니다.", enMsg : "" },
    { key : "sysm.0006", koMsg : "사용자 세션이 만료되었거나 접근 경로가 올바르지 않습니다.\n\n다시 로그인해주십시오.", enMsg : "" },
    { key : "sysm.0007", koMsg : "권한이 없거나 접근경로가 올바르지 않습니다.", enMsg : "You don't have authority or access route is not correct." },
    { key : "sysm.0008", koMsg : "훈련관리 모듈을 사용할 수 있는 권한이 없습니다.", enMsg : "" },
    { key : "sysm.0009", koMsg : "전자기록 모듈을 사용할 수 있는 권한이 없습니다.", enMsg : "" },
    { key : "sysm.0010", koMsg : "지식심사 모듈을 사용할 수 있는 권한이 없습니다.", enMsg : "" },
    { key : "sysm.0011", koMsg : "SIM로그 모듈을 사용할 수 있는 권한이 없습니다.", enMsg : "" },
    { key : "sysm.0012", koMsg : "시스템을 사용할 수 있는 권한이 존재하지 않습니다. 시스템 관리자에게 문의하시기 바랍니다.", enMsg : "" },
    { key : "sysm.0013", koMsg : "비밀번호 3회 이상 오류로 로그인이 제한됩니다. 시스템 관리자에게 문의하시기 바랍니다.\n\nLog-in is restricted by failed log-in attempt (3 times). Please contact system manager.", enMsg : "" },
	
	// 유효성 검사 관련 메시지
    { key : "valid.0001", koMsg : "서버 측 유효성 검사에 실패했습니다", enMsg : "" },   
    { key : "valid.0002", koMsg : "중복된 데이터가 이미 존재합니다.", enMsg : "" },
    { key : "valid.0003", koMsg : "한글을 입력할 수 없는 항목입니다. ({0})", enMsg : "" },
    { key : "valid.0004", koMsg : "이메일 주소의 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0005", koMsg : "도메인 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0006", koMsg : "정수 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0007", koMsg : "실수 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0008", koMsg : "입력값이 허용 범위를 벗어났습니다. ({0})", enMsg : "" },
    { key : "valid.0009", koMsg : "날짜의 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0010", koMsg : "주민등록번호 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0011", koMsg : "법인등록번호 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0012", koMsg : "사업자등록번호 형식이 올바르지 않습니다. ({0})", enMsg : "" },
    { key : "valid.0013", koMsg : "영문자로 시작되어야 하고 영문이나 숫자만 입력할 수 있는 항목입니다. ({0})", enMsg : "" },
    { key : "valid.0014", koMsg : "필수입력 항목입니다. ({0})", enMsg : "({0}) is a required entry" },
    { key : "valid.0015", koMsg : "최소 {1}자 이상 입력해야 합니다. ({0})", enMsg : "" },
    { key : "valid.0016", koMsg : "최소 {1}바이트 이상 입력해야 합니다. ({0})", enMsg : "" },
    { key : "valid.0017", koMsg : "최대 {1}자까지만 입력할 수 있습니다. ({0})", enMsg : "" },
    { key : "valid.0018", koMsg : "최대 {1}바이트까지만 입력할 수 있습니다. ({0})", enMsg : "" },
    { key : "valid.0019", koMsg : "필수입력 항목입니다.", enMsg : "Fill out the mandatory items" },
    { key : "valid.0020", koMsg : "최소 {0}자 이상 입력해야하는 항목입니다.", enMsg : "" },
    { key : "valid.0021", koMsg : "최대 {0}자까지만 입력할 수 있습니다.", enMsg : "" },
    { key : "valid.0022", koMsg : "최대 {0}바이트까지만 입력할 수 있습니다.", enMsg : "" },
    { key : "valid.0023", koMsg : "한글을 입력할 수 없는 항목입니다.", enMsg : "" },
    { key : "valid.0024", koMsg : "이메일 주소의 형식이 올바르지 않습니다.", enMsg : "" },    
    { key : "valid.0025", koMsg : "날짜의 형식이 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0026", koMsg : "정수 형식이 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0027", koMsg : "실수 형식이 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0028", koMsg : "시작일자와 종료일자가 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0029", koMsg : "변경된 데이터가 존재하지 않습니다.", enMsg : "There is no changed data." },
    { key : "valid.0030", koMsg : "데이터 삭제 하시겠습니까?", enMsg : "" },
    { key : "valid.0031", koMsg : "삭제할 데이터를 선택해주십시오.", enMsg : "" },
    { key : "valid.0032", koMsg : "시간 형식이 올바르지 않습니다.", enMsg : "" },   
    { key : "valid.0033", koMsg : "", enMsg : "" },
    { key : "valid.0034", koMsg : "", enMsg : "" },
    { key : "valid.0035", koMsg : "", enMsg : "" },
    { key : "valid.0036", koMsg : "", enMsg : "" },
    { key : "valid.0037", koMsg : "", enMsg : "" },
    { key : "valid.0037", koMsg : "", enMsg : "" },
    { key : "valid.0039", koMsg : "", enMsg : "" },
    { key : "valid.0040", koMsg : "", enMsg : "" },
    { key : "valid.0041", koMsg : "", enMsg : "" },
    { key : "valid.0042", koMsg : "사용자 정보 체크 후 선택해주십시오.", enMsg : "" },
    { key : "valid.0043", koMsg : "권한사용자 정보 체크 후 선택해주십시오.", enMsg : "" },
    { key : "valid.0044", koMsg : "사용자에 추가할 직원을 선택해주십시오.", enMsg : "" },
    { key : "valid.0045", koMsg : "이미 시스템에 등록된 사용자입니다: {0}", enMsg : "" },
    { key : "valid.0046", koMsg : "훈련기종은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0047", koMsg : "과정코드는  필수 항목입니다.", enMsg : "" },
    { key : "valid.0048", koMsg : "지상학훈련타입 은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0049", koMsg : "이미 추가된 수신자입니다. 체크 후 추가해주십시오.", enMsg : "" },
    { key : "valid.0050", koMsg : "시작일은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0051", koMsg : "종료일은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0052", koMsg : "시작일은 종료일 이후 일수 없습니다.", enMsg : "The start date can not be after the end date." },
    { key : "valid.0053", koMsg : "과목명은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0054", koMsg : "요구량은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0055", koMsg : "요구량은 4자리 이상 5자리 이하로만 입력할 수 있습니다.", enMsg : "" },
    { key : "valid.0056", koMsg : "요구량 분은 60분을 넘어갈 수 없습니다(마지막2자리).", enMsg : "" },
    { key : "valid.0057", koMsg : "적용기간 데이터 저장후 추가해주십시오.", enMsg : "" },
    { key : "valid.0058", koMsg : "문항순서는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0059", koMsg : "문항(한글)은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0060", koMsg : "문항(영문)은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0061", koMsg : "답변(한글)은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0062", koMsg : "답변(영문)은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0063", koMsg : "순서는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0064", koMsg : "먼저 교관을 선택해주십시오.", enMsg : "" },
    { key : "valid.0065", koMsg : "년도는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0066", koMsg : "차수는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0067", koMsg : "먼저 운항승무원을 선택해주십시오.", enMsg : "" },
    { key : "valid.0068", koMsg : "먼저 조회를 수행해주십시오.", enMsg : "" },
    { key : "valid.0069", koMsg : "선택할 수 있는 항목이 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0070", koMsg : "먼저 항목을 선택해주십시오.", enMsg : "" },
    { key : "valid.0071", koMsg : "저장 후 보내기하세요.", enMsg : "" }, 
    { key : "valid.0072", koMsg : "훈련구분이 OE가 아니면 요구량(시간)은 필수입력입니다.", enMsg : "" },
    { key : "valid.0073", koMsg : "조회 후 보내기하세요.", enMsg : "" },
    { key : "valid.0074", koMsg : "먼저 훈련과정 목록을 저장해주십시오.", enMsg : "" },
    { key : "valid.0075", koMsg : "먼저 훈련과정을 선택해주십시오.", enMsg : "" },
    { key : "valid.0076", koMsg : "작성 중인 훈련구분에는 훈련생을 추가하거나 수정할 수 없습니다.", enMsg : "" },
    { key : "valid.0077", koMsg : "심사월을 지정, 저장 후 보내기를 실행하세요.", enMsg : "" },
    { key : "valid.0078", koMsg : "등록 및 삭제 중인 훈련생은 정보를 변경할 수 없습니다.", enMsg : "" },
    { key : "valid.0079", koMsg : "이미 포함되어 있는 적용기간 입니다.", enMsg : "" },
    { key : "valid.0080", koMsg : "OE 요구량을 입력해주십시오.", enMsg : "" },
    { key : "valid.0081", koMsg : "먼저 훈련생을 선택해주십시오.", enMsg : "" },
    { key : "valid.0082", koMsg : "기간시작일자가 유효하지 않습니다.", enMsg : "" },
    { key : "valid.0083", koMsg : "기간종료일자가 유효하지 않습니다.", enMsg : "" },
    { key : "valid.0084", koMsg : "등록 및 삭제 중인 항목은 드래그 & 드랍할 수 없습니다.", enMsg : "" },
    { key : "valid.0085", koMsg : "지정한 과정에 해당하는 등록된 요구량이 존재하지 않습니다. 본 화면에서는 추가 과목만 등록할 수 있습니다.", enMsg : "" },
    { key : "valid.0086", koMsg : "요구량 목록에는 과목을 드래그 & 드랍할 수 없습니다.", enMsg : "" },
    { key : "valid.0087", koMsg : "임시 지상학스케줄 목록에는 요구량을 직접 드래그 & 드랍할 수 없습니다.", enMsg : "" },
    { key : "valid.0088", koMsg : "개설되지 않은 훈련과정입니다.", enMsg : "" },
    { key : "valid.0089", koMsg : "12:00~13:00 사이에 시작되는 과목은 '점심제외'를 선택할 수 없습니다.", enMsg : "" },
    { key : "valid.0090", koMsg : "현재 사용 중이므로 삭제할 수 없습니다.", enMsg : "" },
    { key : "valid.0091", koMsg : "먼저 학과장을 지정할 과목을 선택해주십시오.", enMsg : "" },
    { key : "valid.0092", koMsg : "등록된 과목이 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0093", koMsg : "시작날짜가 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0094", koMsg : "등록된 과목이 없는 경우에만 과정불러오기 작업을 수행할 수 있습니다.", enMsg : "" },
    { key : "valid.0095", koMsg : "한 번에 한 명의 훈련생만 지상학스케줄을 변경할 수 있습니다.", enMsg : "" },
    { key : "valid.0096", koMsg : "체크 후 선택해주십시오.", enMsg : "" },
    { key : "valid.0097", koMsg : "훈련량은 하루에 8시간을 초과할 수 없습니다.", enMsg : "" },
    { key : "valid.0098", koMsg : "등록된 날짜별 과목이 존재하지 않는 경우에만 요구량을 조회할 수 있습니다.", enMsg : "" },
    { key : "valid.0099", koMsg : "삭제할 데이터가 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0100", koMsg : "Category는 필수 입력입니다.", enMsg : "" },
    { key : "valid.0101", koMsg : "ItemAlias는 필수 입력입니다.", enMsg : "" },
    { key : "valid.0102", koMsg : "중복해서 문항을 입력할 수 없습니다.", enMsg : "" },
    { key : "valid.0103", koMsg : "자식트리가 있는 트리항목은 삭제할 수 없습니다.", enMsg : "" },
    { key : "valid.0104", koMsg : "필수과목이 배정되지 않았습니다.", enMsg : "" },
    { key : "valid.0105", koMsg : "필수과목의 요구량이 부족합니다.", enMsg : "" },
    { key : "valid.0106", koMsg : "필수과목은 삭제할 수 없습니다.", enMsg : "" },
    { key : "valid.0107", koMsg : "등록 중인 항목은 표준요구량을 등록할 수 없습니다.", enMsg : "" },
    { key : "valid.0108", koMsg : "ITEM을 그리드에서 선택한 후 추가하세요", enMsg : "" },
    { key : "valid.0109", koMsg : "객관식일 경우 보기 항목은 필수 입니다.", enMsg : "" },
    { key : "valid.0110", koMsg : "Question는 필수 입력입니다.", enMsg : "" },
    { key : "valid.0111", koMsg : "Answer는 필수 입력입니다.", enMsg : "" },
    { key : "valid.0112", koMsg : "최소 답변문항은 두개입니다. 하나 이상 더 입력해주세요.", enMsg : "" },
    { key : "valid.0113", koMsg : "Answer 선택은 필수입니다.", enMsg : "" },
    { key : "valid.0114", koMsg : "Option은 필수입력입니다.", enMsg : "" },    
    { key : "valid.0115", koMsg : "SIM 훈련생을 지정해주십시오.", enMsg : "" },
    { key : "valid.0116", koMsg : "SIM 훈련생의 과정정보가 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0117", koMsg : "먼저 개설된 훈련과정을 선택해주십시오.", enMsg : "" },
    { key : "valid.0118", koMsg : "이미 배정된 {0}입니다.", enMsg : "{0} is already assigned." },
    { key : "valid.0119", koMsg : "미배정승무원의 훈련일과 SIM 스케줄의 훈련일이 일치하지 않습니다.", enMsg : "" },
    { key : "valid.0120", koMsg : "훈련과정에 포함되지 않은 훈련생입니다.", enMsg : "" },
    { key : "valid.0121", koMsg : "휴대폰번호가 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0122", koMsg : "교육시간은 오전 8시에서 오후 5시까지만 배정할 수 있습니다.", enMsg : "" },
    { key : "valid.0123", koMsg : "학과장은 한 번에 30일까지만 임시배정할 수 있습니다.", enMsg : "" },
    { key : "valid.0124", koMsg : "이미 다른 과정에 배정된 학과장입니다.", enMsg : "" },    
    { key : "valid.0125", koMsg : "임시저장/최종제출 할 정보를 저장해주세요.", enMsg : "" },    
    { key : "valid.0126", koMsg : "이미 최종제출 한 정보 입니다.", enMsg : "" },    
    { key : "valid.0127", koMsg : "훈련기종은 필수입력입니다.", enMsg : "" },
    { key : "valid.0128", koMsg : "교관/심사관 자격이 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0129", koMsg : "저장할 데이터가 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0130", koMsg : "Demographics 저장 후 진행 가능합니다.", enMsg : "" },
    { key : "valid.0131", koMsg : "심사를 전부 끝마치고 submit하세요.", enMsg : "" },
    { key : "valid.0132", koMsg : "이미 심사가 종료되었습니다. 심사를 진행할 수 없습니다.", enMsg : "" },
    { key : "valid.0133", koMsg : "해당 SHEET 는 사용 중이므로 수정이 제한됩니다.", enMsg : "" },
    { key : "valid.0134", koMsg : "업로드할 파일을 선택해주십시오.", enMsg : "Please choose the file you want to upload." },
    { key : "valid.0135", koMsg : "파일 업로드 중 오류가 발생했습니다.", enMsg : "An error occurred during uploading files." },
    { key : "valid.0136", koMsg : "등록된 이미지가 없습니다.", enMsg : "There is no registered image." },
    { key : "valid.0137", koMsg : "문제수(상)보다 출제문제수(상)가 많을 수 없습니다. 수정 후 저장해 주세요.", enMsg : "" },
    { key : "valid.0138", koMsg : "문제수(중)보다 출제문제수(중)가 많을 수 없습니다. 수정 후 저장해 주세요.", enMsg : "" },
    { key : "valid.0139", koMsg : "문제수(하)보다 출제문제수(하)가 많을 수 없습니다. 수정 후 저장해 주세요.", enMsg : "" },
    { key : "valid.0140", koMsg : "시험시간을 입력해 주세요.", enMsg : "" },
    { key : "valid.0141", koMsg : "이미 {0}님이 행사/회의에 배정한 학과장입니다.", enMsg : "" },
    { key : "valid.0142", koMsg : "리포트로 출력할 데이터가 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0143", koMsg : "훈련일자가 올바르지 않습니다.", enMsg : "" },    
    { key : "valid.0144", koMsg : "이미 작성된 기록부가 존재합니다.", enMsg : "" },
    { key : "valid.0145", koMsg : "지정한 날짜에는 훈련이나 행사/회의가 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0146", koMsg : "담당교관을 지정할 훈련생이 없습니다. 훈련생 조회 후 추가해주세요.", enMsg : "" },
    { key : "valid.0147", koMsg : "트리에 해당 카테고리 1레벨이 없습니다. 확인하시고 추가하세요.", enMsg : "" },
    { key : "valid.0148", koMsg : "PASS SCORE를 입력해주세요.", enMsg : "" },
    { key : "valid.0149", koMsg : "훈련기종을 선택해주세요.", enMsg : "" },
    { key : "valid.0150", koMsg : "훈련기종은 상위 훈련기종과 틀릴 수 없습니다. 확인하시고 입력하세요.", enMsg : "" },
    { key : "valid.0151", koMsg : "평가종류는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0152", koMsg : "평가 수행한 훈련생이 있어 삭제할수 없습니다.", enMsg : "" },
    { key : "valid.0153", koMsg : "조건을 만족하는 입과 중인 OE 훈련이 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0154", koMsg : "시간이 중복된 과목이 존재합니다.", enMsg : "" },
    { key : "valid.0155", koMsg : "훈련요구량은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0156", koMsg : "먼저 표준요구량 목록을 저장해주십시오.", enMsg : "" },
    { key : "valid.0157", koMsg : "불러올 지상학 요구량을 지정해주십시오.", enMsg : "" },
    { key : "valid.0158", koMsg : "먼저 편집 중이던 항목을 저장하거나 삭제해주십시오.", enMsg : "" },
    { key : "valid.0159", koMsg : "출석부 출력 인원은 최소 10명입니다.", enMsg : "" },
    { key : "valid.0160", koMsg : "출석부 출력 인원을 짝수로 지정해주십시오.", enMsg : "" },
    { key : "valid.0161", koMsg : "요구량(시간)은 필수입력입니다.", enMsg : "" },
    { key : "valid.0162", koMsg : "객관식(문항 CateGory) 필수입력입니다.", enMsg : "" },    
    { key : "valid.0163", koMsg : "카테고리 먼저 추가해주세요.", enMsg : "" },
    { key : "valid.0164", koMsg : "먼저 훈련생 선택 목록에 추가하고자 하는 훈련생을 선택해주십시오.", enMsg : "" },
    { key : "valid.0165", koMsg : "먼저 훈련생 선택 목록에서 제거하고자 하는 훈련생을 선택해주십시오.", enMsg : "" },
    { key : "valid.0166", koMsg : "먼저 훈련과정에 추가할 훈련생을 선택해주십시오.", enMsg : "" },
    { key : "valid.0167", koMsg : "비밀번호와 비밀번호 확인이 일치하지 않습니다.", enMsg : "" },
    { key : "valid.0168", koMsg : "영문자와 숫자를 각각 최소 1글자 이상씩 조합하여 사용해주십시오.", enMsg : "" },
    { key : "valid.0169", koMsg : "허용되지 않는 특수문자가 존재합니다. (%, @, -, ;, (\\ or ＼))", enMsg : "" },
    { key : "valid.0170", koMsg : "특수문자를 2자리 이상 사용해주십시오.", enMsg : "" },
    { key : "valid.0171", koMsg : "비밀번호의 첫 문자에는 특수문자를 지정할 수 없습니다.", enMsg : "" },
    { key : "valid.0172", koMsg : "목표값은 필수 입니다.", enMsg : "" },
    { key : "valid.0173", koMsg : "목표값은 10.00 보다 작아야합니다.", enMsg : "" },
    { key : "valid.0174", koMsg : "프로파일 설명 필수입력 항목입니다.", enMsg : "" },
    { key : "valid.0175", koMsg : "훈련/심사 필수 항목입니다.", enMsg : "" },
    { key : "valid.0176", koMsg : "기록부 관리 사용 중입니다\n삭제할수 없습니다.", enMsg : "" },
    { key : "valid.0177", koMsg : "기간이 중복됩니다. 확인 후 기간을 조정해주세요.", enMsg : "" },
    { key : "valid.0178", koMsg : "Check airman Name을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0179", koMsg : "Check airman EMP NO를 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0180", koMsg : "Check airman A/C type을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0181", koMsg : "Check airman Rank를  입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0182", koMsg : "Supervisor Name을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0183", koMsg : "Supervisor EMP NO를 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0184", koMsg : "Supervisor A/C type을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0185", koMsg : "Supervisor Rank를 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0186", koMsg : "Type of check를 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0187", koMsg : "DEP station(1)을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0188", koMsg : "ARR Station(1)을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0189", koMsg : "Date(1)를 입력 후 저장하세요", enMsg : "" },
    { key : "valid.0190", koMsg : "DEP station(2)을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0191", koMsg : "ARR Station(2)을 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0192", koMsg : "Date(2)를 입력 후 저장하세요", enMsg : "" },
    { key : "valid.0193", koMsg : "모든  항목에 grade를 선택하고 저장하세요.", enMsg : "" },
    { key : "valid.0194", koMsg : "General Comments를 입력 후 저장하세요.", enMsg : "" },
    { key : "valid.0195", koMsg : "심사관과 감독관은 같을 수 없습니다. 수정 후 저장하세요.", enMsg : "" },
    { key : "valid.0196", koMsg : "다운로드 할 SIM 스케줄이 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0197", koMsg : "시간이 중복된 SIM 스케줄이 존재합니다.", enMsg : "" },
    { key : "valid.0198", koMsg : "날짜 그룹을 선택한 경우, 과목을 다른 날짜 중간에 드래그 & 드랍할 수 없습니다.", enMsg : "" },
    { key : "valid.0199", koMsg : "저장이 완료되었습니다.", enMsg : "" },
    { key : "valid.0200", koMsg : "사번은 필수 입력 입니다.", enMsg : "" },
    { key : "valid.0201", koMsg : "마지막 Option만 삭제가 가능합니다.", enMsg : "" },
    { key : "valid.0202", koMsg : "Option은 최소 두개이상입니다. 확인하시고 삭제해 주세요.", enMsg : "" },
    { key : "valid.0203", koMsg : "이미 출제된 문제는 삭제할 수 없습니다. 확인 후 삭제하세요.", enMsg : "" },  
    { key : "valid.0204", koMsg : "삭제가 완료되었습니다.", enMsg : "" },  
    { key : "valid.0205", koMsg : "SIM 가동시간이 올바르지 않습니다.", enMsg : "" },    
    { key : "valid.0206", koMsg : "해당 Item에 하위 아이템이 존재하면 삭제할 수 없습니다.", enMsg : "" },
    { key : "valid.0207", koMsg : "해당 아이템 리스트는 사용 중입니다. 삭제가 제한됩니다.", enMsg : "" },
    { key : "valid.0208", koMsg : "같은 Category는 추가할 수 없습니다.", enMsg : "" },
    { key : "valid.0209", koMsg : "같은 Category에서는 같은 item을 추가할 수 없습니다.", enMsg : "" },
    { key : "valid.0210", koMsg : "하위아이템이 있는 아이템은 3레벨로 이동할 수 없습니다.", enMsg : "" },
    { key : "valid.0211", koMsg : "해당 아이템 리스트는 사용 중입니다. 추가 및 삭제가 제한됩니다.", enMsg : "" },
    { key : "valid.0212", koMsg : "한 번에 한 명의 훈련생만 훈련생별 요구량을 설정할 수 있습니다.", enMsg : "" },
    { key : "valid.0213", koMsg : "조건 일수는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0214", koMsg : "SIM 스케줄 정보가 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0215", koMsg : "문항의 코멘트를 입력해주세요.", enMsg : "" },
    { key : "valid.0216", koMsg : "You cannot proceed to oral test before examinee completes written test.", enMsg : "" },
    { key : "valid.0217", koMsg : "선택한 ROW가 없습니다. 선택 후 삭제하세요.", enMsg : "" },
    { key : "valid.0218", koMsg : "문제가 이미 출제되어 삭제할 수 없습니다.", enMsg : "" },
    { key : "valid.0219", koMsg : "제출할 수 없습니다. 모든문제를 답변하시고 제출하세요.", enMsg : "" },
    { key : "valid.0220", koMsg : "문제형식 은 필수 항목 입니다.", enMsg : "" },
    { key : "valid.0221", koMsg : "테스트 횟수가 초과하여 테스트를 진행할 수 없습니다.", enMsg : "" },
    { key : "valid.0222", koMsg : "테스트 횟수가 초과되어 제출할 수 없습니다. 확인하시고 다시 테스트 해주세요.", enMsg : "" },
    { key : "valid.0223", koMsg : "모든 평가에 답변을 하시고 제출하세요.", enMsg : "" },
    { key : "valid.0224", koMsg : "삭제하려는", enMsg : "" },
    { key : "valid.0225", koMsg : "은 사용 중입니다. 삭제가 제한됩니다", enMsg : "" },
    { key : "valid.0226", koMsg : "이미 테스트가 종료되었으로 테스트를 진행 할수 없습니다. 지식심사결과에서 확인하세요", enMsg : "" },
    { key : "valid.0227", koMsg : "Course 필수 항목입니다", enMsg : "" },
    { key : "valid.0228", koMsg : "Date 필수 항목입니다", enMsg : "" },
    { key : "valid.0229", koMsg : "DEP 필수 항목입니다", enMsg : "" },
    { key : "valid.0230", koMsg : "ARR 필수 항목입니다", enMsg : "" },
    { key : "valid.0231", koMsg : "Flight no 필수 항목입니다", enMsg : "" },
    { key : "valid.0232", koMsg : "A/C 필수 항목입니다", enMsg : "" },
    { key : "valid.0233", koMsg : "Auditee Emp no1 필수 항목입니다", enMsg : "" },
    { key : "valid.0234", koMsg : "Auditor Emp no1 필수 항목입니다", enMsg : "" },
    { key : "valid.0235", koMsg : "임시저장/최종제출된 기록부가 있습니다. 삭제가 제한됩니다.", enMsg : "" },
    { key : "valid.0236", koMsg : "General Comment를 입력해주세요", enMsg : "" },
    { key : "valid.0237", koMsg : "과목별 요구량이 존재합니다.", enMsg : "" },
    { key : "valid.0238", koMsg : "수정할 row를 선택하십시오.", enMsg : "" },
    { key : "valid.0239", koMsg : "최종 제출된 심사스케줄은 수정할 수 없습니다.", enMsg : "" },
    { key : "valid.0240", koMsg : "최종 제출된 심사스케줄은 저장할 수 없습니다.", enMsg : "" },
    { key : "valid.0241", koMsg : "General Comment를 입력해주세요", enMsg : "" },
    { key : "valid.0242", koMsg : "row를 선택하시고 임시저장하세요.", enMsg : "" },
    { key : "valid.0243", koMsg : "row를 선택하시고 최종제출하세요.", enMsg : "" },
    { key : "valid.0244", koMsg : "이미 기록부가 제출되어서 최종제출할 수 없습니다.", enMsg : "" },
    { key : "valid.0245", koMsg : "최종제출된 항목은 삭제할 수 없습니다. 체크해제 합니다.", enMsg : "" },    
    { key : "valid.0246", koMsg : "제출된 지식심사/기록부가 있으면 심사스케줄을 저장/삭제할 수 없습니다.", enMsg : "" },
    { key : "valid.0247", koMsg : "프린트할 수 없습니다.", enMsg : "" },
    { key : "valid.0248", koMsg : "붙여넣기를 할 수 없습니다.", enMsg : "" },
    { key : "valid.0249", koMsg : "복사할 수 없습니다.", enMsg : "" },
    { key : "valid.0250", koMsg : "새창을 생성할 수 없습니다.", enMsg : "" },
    { key : "valid.0251", koMsg : "기량심사일이 해당심사월과 다릅니다.", enMsg : "" },
    { key : "valid.0252", koMsg : "선택된 row가 없거나 confirm할 수 없는 row입니다.\n확인하시고 confirm하세요.", enMsg : "" },
    { key : "valid.0253", koMsg : "지식심사Type이 K0나 K1이면 Written(Oral) test기간은 필수 입력입니다.", enMsg : "" },
    { key : "valid.0254", koMsg : "조회내역이 없습니다. 확인 후 엑셀다운로드해주세요.", enMsg : "" },
    { key : "valid.0255", koMsg : "전체선택할 수 없습니다.", enMsg : "" },
    { key : "valid.0256", koMsg : "ctrlKey를 사용할수 없습니다.", enMsg : "" },
    { key : "valid.0257", koMsg : "shiftKey를 사용할수 없습니다.", enMsg : "" },
    { key : "valid.0258", koMsg : "선택한 row가 없습니다. 선택 후 락해제해주세요.", enMsg : "" },
    { key : "valid.0259", koMsg : "선택한 row중에 락된 사용자가 없습니다.", enMsg : "" },    
    { key : "valid.0260", koMsg : "시험시간이 종료되어 자동으로 제출됩니다.", enMsg : "" }, 
    { key : "valid.0261", koMsg : "{0} : 선택/입력해주세요’.", enMsg : "{0} : Please select/write" },
    { key : "valid.0262", koMsg : "{0} : Reason을 선택/입력하세요.", enMsg : "{0} : Please select/write reason." },
    { key : "valid.0263", koMsg : "{0} : 3점 이하를 선택하세요. (최저 점수는 {1})", enMsg : "{0} : Please select below 3 (The lowest grade is {1})" },
    { key : "valid.0264", koMsg : "{0} : Repeated attempt 체크 시 1점 혹은 2 점을 선택하세요.", enMsg : "{0} : If you check repeated attempt, Please select 1 or 2." },
    { key : "valid.0265", koMsg : "{0} : Weak competency를 선택하세요.", enMsg : "{0} : Please select weak competency." },
    { key : "valid.0266", koMsg : "조회모드 입니다\n자료를 수정할수 없습니다.", enMsg : "" },
    { key : "valid.0267", koMsg : "제출된 문제가 없습니다. 관리자에게 확인하시고 테스트 하십시요.", enMsg : "" }, 
    { key : "valid.0268", koMsg : "지식심사 문제가 설정되지 않았습니다. 관리자에게 문의 후 테스트하세요.", enMsg : "" }, 
    { key : "valid.0269", koMsg : "제출된 기록부가 없습니다.", enMsg : "" }, 
    { key : "valid.0270", koMsg : "{0} : TOTAL은 GND~LD Grade의 최저점과 최고점 사이에서 선택해주세요.", enMsg : "{0} : Please select total grade between lowest and highest grade of GND~LD.", enMsg : "" },
    
    { key : "valid.0271", koMsg : "운항경험 비행 중간점검은 아래의 경우, 담당교관만 실시하실 수 있습니다. 해당 내용을 확인하셨습니까? \n1. 재자격 실시 해기종 부기장 : 1회, 29 - 30 LEG \n2. 재자격 미실시 해기종 부기장 : 1회, 19 - 20 LEG \n3. 타기종 부기장 With Rating : 2회, 19 - 20 LEG, 39 - 40 LEG\n4. 타기종 부기장 Without Rating : 2회, 23 - 24 LEG, 47 -48 LEG\n※ 중간점검 실시 담당교관은 필요 시 보강훈련(2 LEG) 부여 (Unsatisfactory 체크 후)\n", enMsg : "" },
    
    { key : "valid.0272", koMsg : "심사추천(or 중간점검) 요구량이 충족되어 해당 내용 입력이 불가능합니다. 이상이 있는 경우 담당자에게 연락 부탁드립니다.", enMsg : "Required number of Recommendation(or Progress Check) is already submitted. Please contact training manager in case of inquiry." },
    { key : "valid.0273", koMsg : "편집 중인 훈련생이 존재합니다. 먼저 작업 내용을 저장해 주십시오.", enMsg : "" },
    { key : "valid.0274", koMsg : "복사할 수 있는 훈련과정이 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0275", koMsg : "기종외 필수 항목입니다.", enMsg : "" },
    { key : "valid.0276", koMsg : "시험 계획 날짜가 없습니다.", enMsg : "" },
    { key : "valid.0277", koMsg : "한정자격시험 인원을 선택해 주세요.", enMsg : "" },
    { key : "valid.0278", koMsg : "과정정보/사용자정보 중 하나는 필수항목입니다.", enMsg : "" },
    { key : "valid.0279", koMsg : "훈련타입은 필수 항목입니다.", enMsg : "" },
    { key : "valid.0280", koMsg : "선택한 계획월은 이미 추가 되어 있습니다.", enMsg : "" },
    { key : "valid.0281", koMsg : "Date를 입력하시고 출력하십시요.", enMsg : "" },
    { key : "valid.0289", koMsg : "장비코드 는 필수 항목입니다.", enMsg : "" },
    { key : "valid.0290", koMsg : "조회 후 저장하세요.", enMsg : "" },
    { key : "valid.0291", koMsg : "조회 후 추가하세요.", enMsg : "" },
    { key : "valid.0292", koMsg : "선택하신 후 삭제하세요.", enMsg : "" },
    { key : "valid.0293", koMsg : "같은 적용기준일을 추가할 수 없습니다. 확인 후 추가해주세요.", enMsg : "" },  
    { key : "valid.0294", koMsg : "문항수 조회 후 저장하세요.", enMsg : "" },
    { key : "valid.0295", koMsg : "Please press Refresh button.", enMsg : "" },
    { key : "valid.0296", koMsg : "이미 Written 테스트가 종료되었으로 테스트를 진행 할수 없습니다. 지식심사결과에서 확인하세요.", enMsg : "" },
    { key : "valid.0297", koMsg : "이미 선택된 훈련과정입니다.", enMsg : "" },
    { key : "valid.0298", koMsg : "Oral test is not available because the examinee's written test result is not successful at this moment.", enMsg : "" },
    { key : "valid.0299", koMsg : "You cannot take any more test because you have passed the written test.", enMsg : "" },
    { key : "valid.0300", koMsg : "You have used all of your opportunities to take tests and this will be finalized as check failure.", enMsg : "" },
    { key : "valid.0301", koMsg : "The result of knowledge test has already been submitted.", enMsg : "" },
    { key : "valid.0302", koMsg : "You have used all of your opportunities to take tests.", enMsg : "" },
    { key : "valid.0303", koMsg : "기간 은 필수항목입니다.", enMsg : "" },
    { key : "valid.0304", koMsg : "지정하신 날짜는 전송월에 해당하지 않습니다.", enMsg : "" },
    { key : "valid.0305", koMsg : "훈련과정 정보가 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0306", koMsg : "삭제할 파일을 선택해주십시오.", enMsg : "" },
    { key : "valid.0307", koMsg : "임대사를 선택하십시오.", enMsg : "Choose the company." },
    { key : "valid.0308", koMsg : "배정시간이 중복된 학과장 배정 SKD가 존재합니다.", enMsg : "" },
    { key : "valid.0309", koMsg : "Period를 전부 입력하고 조회하세요.", enMsg : "" },
    { key : "valid.0310", koMsg : "조회할 권한이 없습니다. 확인하시고 조회하세요.", enMsg : "" },
    { key : "valid.0311", koMsg : "시작월이 종료월 이후 일수 없습니다.", enMsg : "" },
    { key : "valid.0312", koMsg : "Please, Estimated completion date is required.", enMsg : "Please, Estimated completion date is required." },
    { key : "valid.0313", koMsg : "Please, Assignee is required.", enMsg : "Please, Assignee is required." },
    { key : "valid.0314", koMsg : "기간종료일자를 입력 후 조회해주십시요.", enMsg : "" },
    { key : "valid.0315", koMsg : "기간시작일자를 입력 후 조회해주십시요.", enMsg : "" },
    { key : "valid.0316", koMsg : "해당월이나 기간중 하나를 입력 후 조회해주십시요.", enMsg : "" },
    { key : "valid.0317", koMsg : "승무원은 필수 항목 입니다.", enMsg : "" },
    { key : "valid.0318", koMsg : "Please, Select ‘Corrective Action’", enMsg : "Please, Select ‘Corrective Action’" },
    { key : "valid.0319", koMsg : "Please, Select the question you want to answer.", enMsg : "Please, Select the question you want to answer." },
    { key : "valid.0320", koMsg : "구분은 필수 항목 입니다.", enMsg : "" },
    { key : "valid.0321", koMsg : "임대 훈련생이 올바르지 않습니다.", enMsg : "" },
    { key : "valid.0322", koMsg : "분기는 4분기 까지입니다.", enMsg : "" },
    { key : "valid.0323", koMsg : "분기는 필수항목 입니다.", enMsg : "" },
    { key : "valid.0324", koMsg : "설문조사 시행 과정명 체크 후 선택해주십시오.", enMsg : "" },
    { key : "valid.0325", koMsg : "선택 과정명 체크 후 선택해주십시오.", enMsg : "" },
    { key : "valid.0326", koMsg : "복사할 대상이 하나 이상입니다.", enMsg : "" },
    { key : "valid.0327", koMsg : "대상을 선택하십시오.", enMsg : "" },
    { key : "valid.0328", koMsg : "한정자격(필기)SKD 등록되어 있는 날짜입니다.", enMsg : "" },
    { key : "valid.0329", koMsg : "기종을 선택 후 Copy하세요.", enMsg : "" },
    { key : "valid.0330", koMsg : "ALLAC 기종문제는 복사할 수 없습니다.", enMsg : "" },
    { key : "valid.0331", koMsg : "Examinee Emp no 필수 항목입니다.", enMsg : "" },
    { key : "valid.0332", koMsg : "포함할 데이터를 선택해 주세요.", enMsg : "" },
    { key : "valid.0333", koMsg : "(사번/성명) / (등급/D-DAY) 조건은 필수입니다.", enMsg : "" },
    { key : "valid.0334", koMsg : "한건씩 추가 할수 있습니다.", enMsg : "" },
    { key : "valid.0335", koMsg : "신규 등록건 만 삭제 가능합니다.", enMsg : "" },
    { key : "valid.0336", koMsg : "해기종비행시간\n(시작시간/종료시간) 필수입니다 .", enMsg : "" },
    { key : "valid.0337", koMsg : "해기종해직책비행시간\n(시작시간/종료시간) 필수입니다 .", enMsg : "" },
    { key : "valid.0338", koMsg : "나이\n(시작나이/종료나이) 필수입니다 .", enMsg : "" },
    { key : "valid.0339", koMsg : "해직책년한\n(시작/종료) 필수입니다 .", enMsg : "" },
    { key : "valid.0340", koMsg : "훈련생의 정기SIM 적격월을 확인해 주십시오.", enMsg : "" },
    { key : "valid.0341", koMsg : "조건을 만족하는 훈련이 존재하지 않습니다.", enMsg : "" },
    { key : "valid.0342", koMsg : "해당 년도 데이터는 (구)ATEQS 기록입니다.", enMsg : "" },
    { key : "valid.0343", koMsg : "SIM교관정기 적격월을 확인해 주십시오.", enMsg : "" },
    { key : "valid.0344", koMsg : "비행교관정기 적격월을 확인해 주십시오.", enMsg : "" },
    { key : "valid.0345", koMsg : "항로기장정기 적격월을 확인해 주십시오.", enMsg : "" },
    { key : "valid.0346", koMsg : "{0} : Reason을 입력하세요’.", enMsg : "{0} : Please select/write" },
    { key : "valid.0347", koMsg : "Please, Fixed is required.", enMsg : "Please, Fixed is required." },
    { key : "valid.0348", koMsg : "시작시간은 Preflight 시간 이후여야 합니다.", enMsg : "The start date can not be before the pre flight check date." },
    
    // CUD 관련 메시지
    { key : "crud.0001", koMsg : "공통코드 그룹 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0002", koMsg : "공통코드 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0003", koMsg : "사용자 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0004", koMsg : "권한그룹 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0005", koMsg : "SIM장비관리 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0006", koMsg : "학과장 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0007", koMsg : "OE담당교관 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0008", koMsg : "비행교관자격 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0009", koMsg : "보내기를 실행하시겠습니까?", enMsg : "" },
    { key : "crud.0010", koMsg : "심사관자격 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0011", koMsg : "훈련과정을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0012", koMsg : "지상학스케줄을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0013", koMsg : "ITEMLIST를 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0014", koMsg : "ITEMLIST를 저장하시겠습니까?", enMsg : "" }, 
    { key : "crud.0015", koMsg : "ITEMLIST를 신규하시겠습니까?", enMsg : "" },
    { key : "crud.0016", koMsg : "정기지상학 과목을 모두 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0017", koMsg : "TREE목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0018", koMsg : "TREE목록을 추가하시겠습니까?", enMsg : "" },
    { key : "crud.0019", koMsg : "정기지상학 전체를 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0020", koMsg : "SIM 스케줄을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0021", koMsg : "SHEET 전체 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0022", koMsg : "선택한 데이터 삭제 하시겠습니까?", enMsg : "" },
    { key : "crud.0023", koMsg : "Link Ero, Link Uas 데이터도 일괄 삭제 하시겠습니까?", enMsg : "" },
    { key : "crud.0024", koMsg : "Link Ero 데이터도 일괄 삭제 하시겠습니까?", enMsg : "" },
    { key : "crud.0025", koMsg : "Link Uas 데이터 삭제 하시겠습니까?", enMsg : "" },
    { key : "crud.0026", koMsg : "저장하시겠습니까?", enMsg : "" },
    { key : "crud.0027", koMsg : "미배정승무원을 선택한 훈련에 배정하시겠습니까?", enMsg : "" },
    { key : "crud.0028", koMsg : "훈련생을 미배정승무원 명단에서 제외하시겠습니까?", enMsg : "" },
    { key : "crud.0029", koMsg : "학과장임시배정을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0030", koMsg : "해당 학과장은 {0}님이 임시배정한 학과장입니다. 그래도 배정하시겠습니까?", enMsg : "" },
    { key : "crud.0031", koMsg : "품질 기록부 스케줄을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0032", koMsg : "임시저장/최종제출 하시겠습니까?", enMsg : "" },
    { key : "crud.0033", koMsg : "테스트를 제출 하시겠습니까?", enMsg : "" },
    { key : "crud.0034", koMsg : "다시 테스트 하시겠습니까?", enMsg : "" },
    { key : "crud.0035", koMsg : "훈련상환비 기준값을 저장겠습니까?", enMsg : "" },
    { key : "crud.0036", koMsg : "시험시간이 종료되었습니다. 이대로 제출하시겠습니까?", enMsg : "" },
    { key : "crud.0037", koMsg : "휴일에 배정된 과목이 존재합니다. 그래도 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0038", koMsg : "삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0039", koMsg : "지상학스케줄 배정 정보를 전송하시겠습니까?", enMsg : "" },
    { key : "crud.0040", koMsg : "SIM스케줄 배정 정보를 전송하시겠습니까?", enMsg : "" },
    { key : "crud.0041", koMsg : "선택하신 날짜는 휴일입니다. 날짜 배정을 진행하시겠습니까?", enMsg : "" },
    { key : "crud.0042", koMsg : "훈련생별로 설정된 개인 요구량을 초기화 하시겠습니까?", enMsg : "" },
    { key : "crud.0043", koMsg : "기존 데이터 삭제 할수 없습니다\n(추가시 삭제가능)", enMsg : "Existing data can not be deleted." },
    { key : "crud.0044", koMsg : "Confirm 하시겠습니까?", enMsg : "" },
    { key : "crud.0045", koMsg : "최종제출 상태로 변경하시겠습니까?", enMsg : "" },
    { key : "crud.0046", koMsg : "임시저장 상태로 변경하시겠습니까?", enMsg : "" },
    { key : "crud.0047", koMsg : "항로기장 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0048", koMsg : "{0} 모듈의 개인권한을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0049", koMsg : "품질 기록부 스케줄을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0050", koMsg : "임시저장 하시겠습니까?", enMsg : "Do you want to save?" },
    { key : "crud.0051", koMsg : "최종제출 하시겠습니까?", enMsg : "Do you want to submit?" }, 
    { key : "crud.0052", koMsg : "성공적으로 임시저장하였습니다", enMsg : "Successfully saved" },
    { key : "crud.0053", koMsg : "성공적으로 제출하였습니다", enMsg : "Successfully submitted" },
    { key : "crud.0054", koMsg : "Confirm하시겠습니까?", enMsg : "Successfully submitted" },
    { key : "crud.0055", koMsg : "{0} 훈련생이 전체구분에 추가됩니다. 계속하시겠습니까?", enMsg : "" },
    { key : "crud.0056", koMsg : "선택한 {0} 훈련구분의 훈련생을 {1} 훈련구분에 추가하시겠습니까?", enMsg : "" },
    { key : "crud.0067", koMsg : "스케줄 배정 정보를 전송하시겠습니까?", enMsg : "" },
    { key : "crud.0068", koMsg : "{0} 훈련과정의 스케줄 전송 정보를 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0069", koMsg : "Would you like to submit?", enMsg : "" },
    { key : "crud.0070", koMsg : "Would you like to re-test?", enMsg : "" },
    { key : "crud.0071", koMsg : "현재 과정의 종료를 취소하시겠습니까?", enMsg : "" },
    { key : "crud.0072", koMsg : "선택한 파일을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0073", koMsg : "Confirm 하였습니다.", enMsg : "Successfully submitted" },
    { key : "crud.0074", koMsg : "식수지정 정보를 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0075", koMsg : "{0} 훈련과정의 식수지정을 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0076", koMsg : "FOQA 목록을 저장하시겠습니까?", enMsg : "" },
    { key : "crud.0077", koMsg : "삭제하면 해당 row의 모든 Comment가 삭제됩니다. 삭제하시겠습니까?", enMsg : "" },
    { key : "crud.0078", koMsg : "임시저장 상태로 바꾸시겠습니까?", enMsg : "" },
    { key : "crud.0079", koMsg : "최종제출 상태로 바꾸시겠습니까?", enMsg : "" },
    { key : "crud.0080", koMsg : "Copy하시겠습니까?", enMsg : "" },
    { key : "crud.0081", koMsg : "The SIM LOG has been successfully submitted.", enMsg : "The SIM LOG has been successfully submitted." },
    { key : "crud.0082", koMsg : "The SIM LOG has been temporarily saved.", enMsg : "'The SIM LOG has been temporarily saved." },
    
    // 기타 정보 관련 메시지
    { key : "info.0001", koMsg : "먼저 공통코드를 등록할 공통코드 그룹을 선택해주십시오.", enMsg : "" },
    { key : "info.0002", koMsg : "시스템에서 로그아웃 하시겠습니까?", enMsg : "Will you log out from the system?" },
    { key : "info.0003", koMsg : "스케줄의 일정이 변경되었습니다.", enMsg : "" },
    { key : "info.0004", koMsg : "스케줄이 등록되었습니다.", enMsg : "" },
    { key : "info.0005", koMsg : "마우스 오른쪽 버튼을 이용해서 복사할 SIM 스케줄을 선택해주십시오.", enMsg : "" },
    { key : "info.0006", koMsg : "스케줄에 미배정승무원이 배정되었습니다.", enMsg : "" },
    { key : "info.0007", koMsg : "현재 사용되지 않고 있는 학과장입니다.", enMsg : "" },
    { key : "info.0008", koMsg : "PDF 파일만 업로드하실 수 있습니다.", enMsg : "" },
    { key : "info.0009", koMsg : "모든 메뉴 탭을 닫으시겠습니까? 탭을 닫으면 아직 저장하지 않은 모든 정보를 잃어버리게 됩니다.", enMsg : "" },
    { key : "info.0010", koMsg : "다른 훈련과정에서 ATCO나 T/R로 훈련과정을 변경하거나 ATCO나 T/R에서 다른 훈련과정으로 변경할 경우 '국토부심사관' 배정이 초기화됩니다.", enMsg : "" },
    { key : "info.0011", koMsg : "기록부 미입력 상태입니다. 조회가 제한됩니다.", enMsg : "" },
    { key : "info.0012", koMsg : "CreWorld → Schedule → Monthly SKD의 해당 비행을 클릭해서 기록부를 작성해주십시오 (이전 ATEQS 사용방법과 동일).\n\nPlease move to the 'CreWorld → Schedule → Monthly SKD' and fill out the training sheet for this training (Same as previous ATEQS).", enMsg : "Please move to the 'CreWorld → Schedule → Monthly SKD' and fill out the training sheet for this training (Same as previous ATEQS)." },
    { key : "info.0013", koMsg : "CreWorld → Schedule → Training SKD (OLD)의 해당 비행을 클릭해서 기록부를 작성해주십시오 (이전 ATEQS 사용방법과 동일).\n\nPlease move to the 'CreWorld → Schedule → Training SKD (OLD)' and fill out the training sheet for this training (Same as previous ATEQS).", enMsg : "Please move to the 'CreWorld → Schedule → Training SKD (OLD)' and fill out the training sheet for this training (Same as previous ATEQS)." },
    { key : "info.0014", koMsg : "Preflight Check 기록이 없습니다.", enMsg : "There is no record for preflight check."  }
];