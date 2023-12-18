package kbiz.labor.prunus.framework.authentication;

import org.springframework.stereotype.Component;
import prunus.security.authentication.DetailsProvider;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @author 조용상
 */
@Component
public class DetailProviderImpl implements DetailsProvider {
    /**
     * prunus-security 는 로그인 처리 후 로그인 사용자를 식별할 수 있는 데이터를 DetailsProvider 인터페이스를 통해 저장합니다.
     * 프로젝트에서 필요한 세션 또는 토큰에 저장할 데이터를 리턴하세요.
     *
     * @param request http request
     * @param tenant tenant 코드
     * @param username 사용자 로그인 아이디
     * @return 세션 또는 토큰에 저장할 데이터
     */
    @Override
    public Map<String, Object> getDetails(HttpServletRequest request, String tenant, String username) {
        return Map.of("empNo", "e2004323");
    }
}
