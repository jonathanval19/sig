package com.mushucruna.sig.security;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserFit {
    @JsonProperty("usuario")
    String usuario;
    @JsonProperty("clave")
    String clave;
    public String getUsuario() {
        return usuario;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public String getClave() {
        return clave;
    }
    public void setClave(String clave) {
        this.clave = clave;
    }

}
