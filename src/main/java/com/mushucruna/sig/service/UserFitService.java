package com.mushucruna.sig.service;

import com.mushucruna.sig.security.ResponseUserFit;
import com.mushucruna.sig.security.UserFit;


import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import org.springframework.http.MediaType;

import org.springframework.stereotype.Service;

import org.springframework.web.reactive.function.client.WebClient;

@Service
@Transactional
public class UserFitService {
    
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
        //String requestBody = "{\"usuario\":\"++\",\"password\":\"your-password\"}";

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

}
