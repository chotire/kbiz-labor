package kbiz.labor.prunus;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import prunus.core.error.ErrorCode;
import prunus.core.error.ErrorCodeAnalyzer;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @author 조용상
 */
@RestControllerAdvice
@Slf4j
public class RestExceptionHandler {
    private final ErrorCodeAnalyzer errorCodeAnalyzer;

    public RestExceptionHandler(ErrorCodeAnalyzer errorCodeAnalyzer) {
        this.errorCodeAnalyzer = errorCodeAnalyzer;
    }

    /**
     * 프로젝트 요구에 맞게 커스터마이즈 해서 사용하세요.
     * 다국어 처리, 응답 포멧, 상태 등 여러가지 내용을 커스터마이즈 할 수 있습니다.
     * @param e 예외 객체
     * @return 응답 메시지
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e, HttpServletRequest request) {
        ErrorCode errorCode = errorCodeAnalyzer.fromException(e);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", errorCode.getHttpStatus());
        body.put("error", HttpStatus.valueOf(errorCode.getHttpStatus()).getReasonPhrase());
        body.put("exception", e.getClass().getName());
        body.put("message", e.getMessage());
        body.put("code", errorCode.getCode());
        body.put("path", request.getRequestURI());

        String message = String.format("code=%s, status=%s, message=%s",
                body.get("code"), body.get("status"), body.get("message"));
        log.error(message, e);
        return ResponseEntity.status(errorCode.getHttpStatus()).body(body);
    }

    /**
     * 유효성 검사 실패시 응답할 포멧을 프로젝트 요구에 맞게 커스터미이즈 해서 사용하세요.
     * 다국어 처리, 응답 포멧, 상태 등 여러가지 내용을 커스터마이즈 할 수 있습니다.
     * @param e 유효성 검사 예외 객체
     * @return 응답 메시지
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        List<Map<String, Object>> errors = new ArrayList<>();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("field", fieldError.getField());
            error.put("rejectedValue", fieldError.getRejectedValue());
            error.put("constraint", fieldError.getCode());
            error.put("message", fieldError.getDefaultMessage());
            errors.add(error);
        }
        String message = String.format("Validation failed for object='%s'. Error count: %s",
                e.getObjectName(), bindingResult.getErrorCount());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        body.put("errors", errors);
        body.put("message", message);
        log.error(e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /**
     * 비인증 사용자의 해당 리소스 접근 거부 예외
     * @param e AccessDeniedException
     * @return ResponseEntity
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException e, HttpServletRequest request) {
        ErrorCode errorCode = errorCodeAnalyzer.fromException(e);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", HttpStatus.FORBIDDEN);
        body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        body.put("exception", e.getClass().getName());
        body.put("message", e.getMessage());
        body.put("code", errorCode.getCode());
        body.put("path", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    /**
     * 인증 예외
     * @param e AuthenticationException
     * @return ResponseEntity
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException e, HttpServletRequest request) {
        ErrorCode errorCode = errorCodeAnalyzer.fromException(e);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", HttpStatus.FORBIDDEN);
        body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        body.put("exception", e.getClass().getName());
        body.put("message", e.getMessage());
        body.put("code", errorCode.getCode());
        body.put("path", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    /**
     * 인증된 사용자 (anonymous user 포함) 의 해당 리소스 접근의 불충분한 권한 예외
     * @param e InsufficientAuthenticationException
     * @return ResponseEntity
     */
    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<Map<String, Object>> insufficientAuthenticationException(InsufficientAuthenticationException e, HttpServletRequest request) {
        ErrorCode errorCode = errorCodeAnalyzer.fromException(e);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", HttpStatus.FORBIDDEN);
        body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        body.put("exception", e.getClass().getName());
        body.put("message", e.getMessage());
        body.put("code", errorCode.getCode());
        body.put("path", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }
}
