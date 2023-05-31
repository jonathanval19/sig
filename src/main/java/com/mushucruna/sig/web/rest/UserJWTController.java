package com.mushucruna.sig.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mushucruna.sig.domain.User;
import com.mushucruna.sig.repository.UserRepository;
import com.mushucruna.sig.security.ResponseUserFit;
import com.mushucruna.sig.security.UserFit;
import com.mushucruna.sig.security.jwt.JWTFilter;
import com.mushucruna.sig.security.jwt.TokenProvider;
import com.mushucruna.sig.service.UserService;
import com.mushucruna.sig.service.dto.AdminUserDTO;
import com.mushucruna.sig.web.rest.vm.LoginVM;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserRepository userRepository;
    private final UserService userService;

    public UserJWTController(TokenProvider tokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder,
            UserRepository userRepository, UserService userService) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginVM.getUsername(),
                loginVM.getPassword());

        ResponseUserFit userFit = this.consumeAPI(loginVM.getUsername(), loginVM.getPassword());

        if (userFit.getCodigoResultado().equals("000")) {
            Optional<User> user = userRepository.findOneByLogin(userFit.getUsuario());
            if (!user.isPresent()) {
                System.out.println("Usuario no existe");

                // User user2 = user.get();

                AdminUserDTO userDTO = new AdminUserDTO();

                userDTO.setLogin(userFit.getUsuario());
                userDTO.setEmail(userFit.getUsuario() + "@mushucruna.com");

                String[] apellidosNombres = separarApellidosNombres(userFit.getNombreCliente());

                userDTO.setFirstName(apellidosNombres[2] + " " + apellidosNombres[3]);
                userDTO.setLastName(apellidosNombres[0] + " " + apellidosNombres[1]);

                // Por seguridad jhipster crea como rol user
                Set<String> authorities = new HashSet<>();
                // authorities.add("ROLE_ADMIN");
                authorities.add("ROLE_USER");
                userDTO.setAuthorities(authorities);

                User usercreado = userService.registerUser(userDTO, loginVM.getPassword());
                userService.activateRegistration(usercreado.getActivationKey());
            } else {
                userService.deleteUser(loginVM.getUsername());
                AdminUserDTO userDTO = new AdminUserDTO();

                userDTO.setLogin(userFit.getUsuario());
                userDTO.setEmail(userFit.getUsuario() + "@mushucruna.com");

                String[] apellidosNombres = separarApellidosNombres(userFit.getNombreCliente());

                userDTO.setFirstName(apellidosNombres[2] + " " + apellidosNombres[3]);
                userDTO.setLastName(apellidosNombres[0] + " " + apellidosNombres[1]);

                // Por seguridad jhipster crea como rol user
                Set<String> authorities = new HashSet<>();
                // authorities.add("ROLE_ADMIN");
                authorities.add("ROLE_USER");
                userDTO.setAuthorities(authorities);

                User usercreado = userService.registerUser(userDTO, loginVM.getPassword());
                userService.activateRegistration(usercreado.getActivationKey());
            }

        }

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    public ResponseUserFit consumeAPI(String usuario, String clave) {
        // Crear el cliente WebClient
        WebClient webClient = WebClient.builder().baseUrl("http://172.16.1.190:8080").build();

        UserFit usuarioFit = new UserFit();

        usuarioFit.setUsuario(usuario);
        usuarioFit.setClave(clave);

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

        return responseBody;
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }

    public static String[] separarApellidosNombres(String nombreCompleto) {
        String[] apellidosNombres = new String[4];

        String[] partes = nombreCompleto.split(" ");

        // Los dos primeros elementos son los apellidos
        apellidosNombres[0] = partes[0];
        apellidosNombres[1] = partes[1];

        // Los dos siguientes elementos son los nombres
        apellidosNombres[2] = partes[2];
        apellidosNombres[3] = partes[3];

        return apellidosNombres;
    }
}
