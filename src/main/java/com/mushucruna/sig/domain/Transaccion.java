package com.mushucruna.sig.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mushucruna.sig.domain.enumeration.Disposicion;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Transaccion.
 */
@Entity
@Table(name = "transaccion")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Transaccion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "propietario")
    private String propietario;

    @Column(name = "titulo")
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(name = "disposicion")
    private Disposicion disposicion;

    @Column(name = "codigo_documento")
    private String codigoDocumento;

    @Column(name = "numeracion_documento")
    private String numeracionDocumento;

    @OneToMany(mappedBy = "transaccion")
    @JsonIgnoreProperties(value = { "transaccion" }, allowSetters = true)
    private Set<Documento> documentos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "transaccions" }, allowSetters = true)
    private Proceso proceso;

    @ManyToOne
    @JsonIgnoreProperties(value = { "transaccions" }, allowSetters = true)
    private TipoDocumento tipoDocumento;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Transaccion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPropietario() {
        return this.propietario;
    }

    public Transaccion propietario(String propietario) {
        this.setPropietario(propietario);
        return this;
    }

    public void setPropietario(String propietario) {
        this.propietario = propietario;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Transaccion titulo(String titulo) {
        this.setTitulo(titulo);
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Disposicion getDisposicion() {
        return this.disposicion;
    }

    public Transaccion disposicion(Disposicion disposicion) {
        this.setDisposicion(disposicion);
        return this;
    }

    public void setDisposicion(Disposicion disposicion) {
        this.disposicion = disposicion;
    }

    public String getCodigoDocumento() {
        return this.codigoDocumento;
    }

    public Transaccion codigoDocumento(String codigoDocumento) {
        this.setCodigoDocumento(codigoDocumento);
        return this;
    }

    public void setCodigoDocumento(String codigoDocumento) {
        this.codigoDocumento = codigoDocumento;
    }

    public String getNumeracionDocumento() {
        return this.numeracionDocumento;
    }

    public Transaccion numeracionDocumento(String numeracionDocumento) {
        this.setNumeracionDocumento(numeracionDocumento);
        return this;
    }

    public void setNumeracionDocumento(String numeracionDocumento) {
        this.numeracionDocumento = numeracionDocumento;
    }

    public Set<Documento> getDocumentos() {
        return this.documentos;
    }

    public void setDocumentos(Set<Documento> documentos) {
        if (this.documentos != null) {
            this.documentos.forEach(i -> i.setTransaccion(null));
        }
        if (documentos != null) {
            documentos.forEach(i -> i.setTransaccion(this));
        }
        this.documentos = documentos;
    }

    public Transaccion documentos(Set<Documento> documentos) {
        this.setDocumentos(documentos);
        return this;
    }

    public Transaccion addDocumento(Documento documento) {
        this.documentos.add(documento);
        documento.setTransaccion(this);
        return this;
    }

    public Transaccion removeDocumento(Documento documento) {
        this.documentos.remove(documento);
        documento.setTransaccion(null);
        return this;
    }

    public Proceso getProceso() {
        return this.proceso;
    }

    public void setProceso(Proceso proceso) {
        this.proceso = proceso;
    }

    public Transaccion proceso(Proceso proceso) {
        this.setProceso(proceso);
        return this;
    }

    public TipoDocumento getTipoDocumento() {
        return this.tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public Transaccion tipoDocumento(TipoDocumento tipoDocumento) {
        this.setTipoDocumento(tipoDocumento);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaccion)) {
            return false;
        }
        return id != null && id.equals(((Transaccion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transaccion{" +
            "id=" + getId() +
            ", propietario='" + getPropietario() + "'" +
            ", titulo='" + getTitulo() + "'" +
            ", disposicion='" + getDisposicion() + "'" +
            ", codigoDocumento='" + getCodigoDocumento() + "'" +
            ", numeracionDocumento='" + getNumeracionDocumento() + "'" +
            "}";
    }
}
