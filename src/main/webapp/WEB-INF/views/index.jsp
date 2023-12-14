<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String flagYn = "N";
%>
<!doctype html>
<html lang="ko">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=1366, user-scalable=no">
  <title>KBIZ LABOR</title>
  <script type="text/javascript">
    var WebSquareExternal = {};
    WebSquareExternal.baseURI = "${pageContext.request.contextPath}/websquare/";
  </script>
  <script type="text/javascript" src="${pageContext.request.contextPath}/websquare/javascript.wq?q=/bootloader"></script>
  <link href="/resources/images/favicon.ico" type="image/x-icon" rel="icon" />
  <link href="/resources/css/common.css" type="text/css" rel="stylesheet">
  <link href="/resources/css/content.css" type="text/css" rel="stylesheet">
  <link href="/resources/css/layout.css" type="text/css" rel="stylesheet">
  <script type="text/javascript">
    <c:choose>
      <c:when test="${not empty accessUser}">
        var w2xPath = "/ux/index_tab.xml";
      </c:when>
      <c:otherwise>
        var w2xPath = "/ux/cf/CF00050000U.xml";
      </c:otherwise>
    </c:choose>

<%--    <c:if test="${not empty resultData}">--%>
<%--      var _resultData = ${resultData};--%>
<%--      if( _resultData != "" ) {--%>
<%--          var _myResult = {"data":{"accessToken":"","accessUser":_resultData}};--%>
<%--          com.setSessionStorage(_myResult);--%>
<%--      }--%>
<%--    </c:if>--%>
    window.onload = init;
    function init() {
      try {
        WebSquare.startApplication(w2xPath);
      } catch(e) {
        alert("e log : "+e.message);
      }
    }
  </script>
</head>
<body id="bodys"></body>
</html>