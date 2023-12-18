package kbiz.labor.prunus.framework;

import org.passay.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

/**
 * @author 조용상
 */
@Configuration
public class PasswordRuleConfiguration {
    /**
     * prunus 유저 등록 api 호출 시 password validation 이 수행됩니다.
     * 프로젝트에서 요구하는 password rule 을 관리하세요.
     * password rule 은 passay 라이브러리를 통해서 검증하며 자세한 내용은 다음 주소에서 찾을 수 있습니다.
     * https://www.baeldung.com/java-passay
     * https://www.passay.org
     *
     * @return password validation rules
     */
    @Bean
    public List<Rule> rules() {
        return Arrays.asList(
                // 최소 8자 이상 최대 20자
                // new LengthRule(8, 20),
                // 대문자 하나 이상
                // new CharacterRule(EnglishCharacterData.UpperCase, 1),
                // 소문자 하나 이상
                // new CharacterRule(EnglishCharacterData.LowerCase, 1),
                // 숫자 하나 이상
                // new CharacterRule(EnglishCharacterData.Digit, 1),
                // 특수 문자 하나 이상
                // new CharacterRule(EnglishCharacterData.Special, 1),
                // 연속된 문자 5자 이상 허용 안 함 (abcde)
                // new IllegalSequenceRule(EnglishSequenceData.Alphabetical, 5, false),
                // 연속된 숫자 5자 이상 허용 안 함 (12345)
                // new IllegalSequenceRule(EnglishSequenceData.Numerical, 5, false),
                // 키보드의 연속된 문자 5자 이상 허용 안 함 (qwert)
                // new IllegalSequenceRule(EnglishSequenceData.USQwerty, 5, false),
                // 사용자 아이디가 포함된 비밀번호 허용 안 항
                new UsernameRule(),
                // 공백문자 허용 안 함
                new WhitespaceRule());
    }
}
