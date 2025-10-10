package com.soo.common.env;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class EnvJson {

    @Getter
    @Setter
	public static class CorsConfig {
        private boolean enabled;
        private List<String> allowedMethods;
        private List<String> allowedHeaders;
        private boolean credentials;
        private List<String> origin;
	}

	private CorsConfig cors;

}
