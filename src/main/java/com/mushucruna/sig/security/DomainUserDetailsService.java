package com.mushucruna.sig.security;

import com.mushucruna.sig.domain.Authority;
import com.mushucruna.sig.domain.User;
import com.mushucruna.sig.repository.UserRepository;
import java.util.*;
import java.util.stream.Collectors;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);
    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void consumeAPI(String usuario, String clave) {
        // Crear el cliente WebClient
        WebClient webClient = WebClient.builder().baseUrl("http://172.16.1.190:8080").build();

        UserFit usuarioFit = new UserFit();
        usuarioFit.usuario = usuario;
        usuarioFit.clave = clave;

        // Configurar los encabezados de la solicitud
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<MediaType> mediaTypes = new ArrayList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON);

        headers.setAccept(mediaTypes);

        // Configurar el cuerpo de la solicitud

        // Enviar la solicitud POST
        ResponseUserFit responseBody = webClient
                .method(HttpMethod.POST)
                .uri("/api/loging/authenticate")
                .headers(h -> h.addAll(headers))
                .bodyValue(usuarioFit)
                .retrieve()
                .bodyToMono(ResponseUserFit.class)
                .block();

        // Procesar la respuesta

        // Realiza la lógica de procesamiento de la respuesta aquí
    }


    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String login) {

        if (new EmailValidator().isValid(login, null)) {
            return userRepository
                .findOneWithAuthoritiesByEmailIgnoreCase(login)
                .map(user -> createSpringSecurityUser(login, user))
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + login + " was not found in the database"));
            }

        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);
        return userRepository
            .findOneWithAuthoritiesByLogin(lowercaseLogin)
            .map(user -> createSpringSecurityUser(lowercaseLogin, user))
            .orElseThrow(() -> new UsernameNotFoundException("User " + lowercaseLogin + " was not found in the database"));
    }

    private org.springframework.security.core.userdetails.User createSpringSecurityUser(String lowercaseLogin, User user) {
        if (!user.isActivated()) {
            throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
        }
        List<GrantedAuthority> grantedAuthorities = user
            .getAuthorities()
            .stream()
            .map(Authority::getName)
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());

            this.consumeAPI(user.getLogin(), user.getPassword());
        return new org.springframework.security.core.userdetails.User(user.getLogin(), user.getPassword(), grantedAuthorities);
    }
}
