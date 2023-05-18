package com.mushucruna.sig.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mushucruna.sig.domain.enumeration.Acceso;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Documento.
 */
@Entity
@Table(name = "documento")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Documento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "version")
    private Integer version;

    @Column(name = "fecha_elaboracion")
    private Instant fechaElaboracion;

    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "acceso")
    private Acceso acceso;

    @Lob
    @Column(name = "archivo")
    private byte[] archivo;

    @Column(name = "archivo_content_type")
    private String archivoContentType;

    @Column(name = "enviar_notificacion")
    private String enviarNotificacion;

    @Column(name = "observaciones")
    private String observaciones;

    @ManyToOne
    @JsonIgnoreProperties(value = { "documentos", "proceso", "tipoDocumento" }, allowSetters = true)
    private Transaccion transaccion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Documento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getVersion() {
        return this.version;
    }

    public Documento version(Integer version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Instant getFechaElaboracion() {
        return this.fechaElaboracion;
    }

    public Documento fechaElaboracion(Instant fechaElaboracion) {
        this.setFechaElaboracion(fechaElaboracion);
        return this;
    }

    public void setFechaElaboracion(Instant fechaElaboracion) {
        this.fechaElaboracion = fechaElaboracion;
    }

    public Instant getFechaActualizacion() {
        return this.fechaActualizacion;
    }

    public Documento fechaActualizacion(Instant fechaActualizacion) {
        this.setFechaActualizacion(fechaActualizacion);
        return this;
    }

    public void setFechaActualizacion(Instant fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public Acceso getAcceso() {
        return this.acceso;
    }

    public Documento acceso(Acceso acceso) {
        this.setAcceso(acceso);
        return this;
    }

    public void setAcceso(Acceso acceso) {
        this.acceso = acceso;
    }

    public byte[] getArchivo() {
        return this.archivo;
    }

    public Documento archivo(byte[] archivo) {
        this.setArchivo(archivo);
        return this;
    }

    public void setArchivo(byte[] archivo) {
        this.archivo = archivo;
    }

    public String getArchivoContentType() {
        return this.archivoContentType;
    }

    public Documento archivoContentType(String archivoContentType) {
        this.archivoContentType = archivoContentType;
        return this;
    }

    public void setArchivoContentType(String archivoContentType) {
        this.archivoContentType = archivoContentType;
    }

    public String getEnviarNotificacion() {
        return this.enviarNotificacion;
    }

    public Documento enviarNotificacion(String enviarNotificacion) {
        this.setEnviarNotificacion(enviarNotificacion);
        return this;
    }

    public void setEnviarNotificacion(String enviarNotificacion) {
        this.enviarNotificacion = enviarNotificacion;
    }

    public String getObservaciones() {
        return this.observaciones;
    }

    public Documento observaciones(String observaciones) {
        this.setObservaciones(observaciones);
        return this;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Transaccion getTransaccion() {
        return this.transaccion;
    }

    public void setTransaccion(Transaccion transaccion) {
        this.transaccion = transaccion;
    }

    public Documento transaccion(Transaccion transaccion) {
        this.setTransaccion(transaccion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Documento)) {
            return false;
        }
        return id != null && id.equals(((Documento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Documento{" +
            "id=" + getId() +
            ", version=" + getVersion() +
            ", fechaElaboracion='" + getFechaElaboracion() + "'" +
            ", fechaActualizacion='" + getFechaActualizacion() + "'" +
            ", acceso='" + getAcceso() + "'" +
            ", archivo='" + getArchivo() + "'" +
            ", archivoContentType='" + getArchivoContentType() + "'" +
            ", enviarNotificacion='" + getEnviarNotificacion() + "'" +
            ", observaciones='" + getObservaciones() + "'" +
            "}";
    }
}
