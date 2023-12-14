package kbiz.labor.prunus.biz;

import org.springframework.stereotype.Component;
import prunus.biz.core.user.UserContext;
import prunus.biz.core.user.UserContextProvider;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

/**
 * @author 조용상
 */
@Component
public class UserContextProviderImpl implements UserContextProvider {
    @Override
    public Optional<UserContext> getUserContext(HttpServletRequest request) {
        UserContext userContext = new UserContext("labor", "kbiz");
        return Optional.of(userContext);
    }
}
