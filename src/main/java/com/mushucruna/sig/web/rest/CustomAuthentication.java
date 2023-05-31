package com.mushucruna.sig.web.rest;

import java.util.ArrayList;
import java.util.Collection;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import com.mushucruna.sig.security.ResponseUserFit;

public class CustomAuthentication implements Authentication {

    private ResponseUserFit userFit;
    private boolean isAuthenticated = false;

    public CustomAuthentication(ResponseUserFit userFit) {
        this.userFit = userFit;
    }

    @Override
    public String getName() {
        return this.userFit.getNombreCliente();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        this.isAuthenticated = this.userFit.getCodigoResultado().equals("000") ? true : false;

        User uf = new User(
                this.userFit.getUsuario(),
                this.userFit.getNombreRol(),
                this.isAuthenticated, this.isAuthenticated, this.isAuthenticated, this.isAuthenticated,
                this.getAuthorities());
        return uf;
    }

    @Override
    public boolean isAuthenticated() {
        this.isAuthenticated = this.userFit.getCodigoResultado().equals("000") ? true : false;
        return this.isAuthenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.isAuthenticated = isAuthenticated;
    }

}
