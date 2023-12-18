package kbiz.labor.prunus.framework.authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author 조용상
 */
@Component
public class LogoutHandler implements LogoutSuccessHandler {
    /**
     * 로그아웃 시 로깅, 이동할 페이지 등 커스터마이즈 하세요.
     * @param request http request
     * @param response http response
     * @param authentication 인증객체
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        response.sendRedirect("/");
    }
}
