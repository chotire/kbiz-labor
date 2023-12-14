requires("/resources/js/em/util/emStringUtil.js?version=1");

/**
 * 파일명 : emDateUtil js
 * 설  명 : EM에서 DATE 관련 Util JavaScript
 * 
 *    수정일      		수정자      	수정내용
 * ------------  ---------   -------------
 * << 개정이력(Modification Information) >>
 *    수정일         |       수정자            |          수정내용                   
 *  ------------|-------------------|------------------------------------------------
 *  2020.02.20  |   tpohhj1             | 최초 생성  
 */

/**
 * 	startObj 시작날짜
 * 		{year, month, day, hours, minutes, seconds}
 *  endObj 종료날짜
 * 		{year, month, day, hours, minutes, seconds}
 * 	division
 * 		day hour min sec
 * 
 * 	날짜 차를 리턴해준다
 * 			{ 
 * 				successCheck	: 성공여부
 * 				rsDiff			: 날짜 차이값
 * 			}
 */
function dateCalculationX100010(startObj, endObj, division) {
	
	var rs = {};
	rs.rsDiff = 0;
	
	var year = emNvl(startObj.year, '');
	var month = emNvl(startObj.month, '01');
	var day = emNvl(startObj.day, '01');
	var hours = emNvl(startObj.hours, '00');
	var minutes = emNvl(startObj.minutes, '00');
	var seconds = emNvl(startObj.seconds, '00');
	var checkValue = year + month + day + hours + minutes + seconds;
	
	if ( !dateFormatCheckX100010(checkValue, "") ) {
		rs.successCheck = false;
		return rs;
	}	
	var startDate = new Date(year, month-1, day, hours, minutes, seconds);
	
	year = emNvl(endObj.year, '');
	month = emNvl(endObj.month, '01');
	day = emNvl(endObj.day, '01');
	hours = emNvl(endObj.hours, '00');
	minutes = emNvl(endObj.minutes, '00');
	seconds = emNvl(endObj.seconds, '00');
	checkValue = year + month + day + hours + minutes + seconds;
	if ( !dateFormatCheckX100010(checkValue, "") ) {
		rs.successCheck = false;
		return rs;
	}
	var endDate = new Date(year, month-1, day, hours, minutes, seconds);
	
	var rsDiff = 0;
	var diff = endDate.getTime() - startDate.getTime();
	if ( division == "day" ) {
		rsDiff = diff / (24 * 60 * 60 * 1000);
	} else if ( division == "hour" ) {
		rsDiff = diff / (60 * 60 * 1000);
	} else if ( division == "min" ) {
		rsDiff = diff / (60 * 1000);
	} else if ( division == "sec" ) {
		rsDiff = diff / 1000;
	}
	
	rs.rsDiff = rsDiff;
	rs.successCheck = true;
	return rs;
}

/**
 * 	checkValue : 검사받을 값
 * 	format : 
 * 				yyyy
 * 				yyyyMM
 * 				yyyyMMdd
 * 				yyyyMMddHH
 * 				yyyyMMddHHmm
 * 				default : yyyyMMddHHmmss
 * 	날짜 포맷 체크
 */
function dateFormatCheckX100010(checkValue, format) {
	var pattern; 
	
	if ( "yyyy" == format ) { // yyyy
		pattern = /^[1-2]{1}[0-9]{3}$/;
	} else if ( "yyyyMM" == format ) { // yyyyMM
		pattern = /^[1-2]{1}[0-9]{3}(0[1-9]|1[0-2])$/;
	} else if ( "yyyyMMdd" == format ) { // yyyyMMdd
		pattern = /^[1-2]{1}[0-9]{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
	} else if ( "yyyyMMddHH" == format ) { // yyyyMMddHH
		pattern = /^[1-2]{1}[0-9]{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[0-1][0-9])$/;
	} else if ( "yyyyMMddHHmm" == format ) { // yyyyMMddHHmm
		pattern = /^[1-2]{1}[0-9]{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[0-1][0-9])([0-5][0-9])$/;
	} else { // default yyyyMMddHHmmss
		pattern = /^[1-2]{1}[0-9]{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[0-1][0-9])([0-5][0-9])([0-5][0-9])$/;
	}
	
	return pattern.test(checkValue);
}

/**
*  dateObj 계산 기준이 될 날짜
* 		{year, month, day, hours, minutes, seconds}
*  addValue 계산할 값 (음수 or 양수)
*  division 계산을 원하는 구분
*			ex : 	year
*					month
*					day
*					hour
*					min
*					sec 
*  계산한 날짜를 리턴해준다.
* 			{ 
* 				successCheck	: 성공여부
* 				year, 
*				month, 
*				day, 
*				hours, 
*				minutes, 
*				seconds
* 			}
*/
function emDateAdd(dateObj, addValue, division) {
	var rs = {};
	
	var year = emNvl(dateObj.year, '');
	var month = emNvl(dateObj.month, '01');
	var day = emNvl(dateObj.day, '01');
	var hours = emNvl(dateObj.hours, '00');
	var minutes = emNvl(dateObj.minutes, '00');
	var seconds = emNvl(dateObj.seconds, '00');
	var checkValue = year + month + day + hours + minutes + seconds;

	if ( !dateFormatCheckX100010(checkValue, "") ) {
		rs.successCheck = false;
		return rs;
	}	

	var dateValue = new Date(year, month-1, day, hours, minutes, seconds);
	
	if ( "year" == division ) {
		dateValue.setFullYear(dateValue.getFullYear() + addValue);
	} else if ( "month" == division ) {
		dateValue.setMonth(dateValue.getMonth() + addValue);
	} else if ( "day" == division ) {
		dateValue.setDate(dateValue.getDate() + addValue);
	} else if ( "hour" == division ) {
		dateValue.setHours(dateValue.getHours() + addValue);
	} else if ( "min" == division ) {
		dateValue.setMinutes(dateValue.getMinutes() + addValue);
	} else if ( "sec" == division ) {
		dateValue.setSeconds(dateValue.getSeconds() + addValue);
	} 
	
	rs.year	=	dateValue.getFullYear();
	rs.month = (dateValue.getMonth()+1);
	rs.day = dateValue.getDate();
	rs.hours = dateValue.getHours();
	rs.minutes = dateValue.getMinutes();
	rs.seconds = dateValue.getSeconds();
	rs.successCheck = true;
	
	return rs;
}