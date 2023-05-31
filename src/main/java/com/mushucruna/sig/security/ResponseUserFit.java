package com.mushucruna.sig.security;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResponseUserFit {
    @JsonProperty("Usuario")
    private String usuario;
    @JsonProperty("CRol")
    private String cRol;
    @JsonProperty("CSucursal")
    private String cSucursal;
    @JsonProperty("COficina")
    private String cOficina;
    @JsonProperty("CArea")
    private String cArea;
    @JsonProperty("NombreAgencia")
    private String nombreAgencia;
    @JsonProperty("NombreOficina")
    private String nombreOficina;
    @JsonProperty("NombreCliente")
    private String nombreCliente;
    @JsonProperty("NombreRol")
    private String nombreRol;
    @JsonProperty("NombreArea")
    private String nombreArea;
    @JsonProperty("CodigoResultado")
    private String codigoResultado;
    @JsonProperty("Mensaje")
    private String mensaje;

    public String getUsuario() { return usuario; }
    public void setUsuario(String value) { this.usuario = value; }

    public String getCRol() { return cRol; }
    public void setCRol(String value) { this.cRol = value; }

    public String getCSucursal() { return cSucursal; }
    public void setCSucursal(String value) { this.cSucursal = value; }

    public String getCOficina() { return cOficina; }
    public void setCOficina(String value) { this.cOficina = value; }

    public String getCArea() { return cArea; }
    public void setCArea(String value) { this.cArea = value; }

    public String getNombreAgencia() { return nombreAgencia; }
    public void setNombreAgencia(String value) { this.nombreAgencia = value; }

    public String getNombreOficina() { return nombreOficina; }
    public void setNombreOficina(String value) { this.nombreOficina = value; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String value) { this.nombreCliente = value; }

    public String getNombreRol() { return nombreRol; }
    public void setNombreRol(String value) { this.nombreRol = value; }

    public String getNombreArea() { return nombreArea; }
    public void setNombreArea(String value) { this.nombreArea = value; }

    public String getCodigoResultado() { return codigoResultado; }
    public void setCodigoResultado(String value) { this.codigoResultado = value; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String value) { this.mensaje = value; }
}
