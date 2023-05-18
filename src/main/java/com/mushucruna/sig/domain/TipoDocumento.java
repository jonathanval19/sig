package com.mushucruna.sig.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A TipoDocumento.
 */
@Entity
@Table(name = "tipo_documento")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TipoDocumento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "codigo")
    private String codigo;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "tipoDocumento")
    @JsonIgnoreProperties(value = { "documentos", "proceso", "tipoDocumento" }, allowSetters = true)
    private Set<Transaccion> transaccions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TipoDocumento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public TipoDocumento codigo(String codigo) {
        this.setCodigo(codigo);
        return this;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public TipoDocumento descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Transaccion> getTransaccions() {
        return this.transaccions;
    }

    public void setTransaccions(Set<Transaccion> transaccions) {
        if (this.transaccions != null) {
            this.transaccions.forEach(i -> i.setTipoDocumento(null));
        }
        if (transaccions != null) {
            transaccions.forEach(i -> i.setTipoDocumento(this));
        }
        this.transaccions = transaccions;
    }

    public TipoDocumento transaccions(Set<Transaccion> transaccions) {
        this.setTransaccions(transaccions);
        return this;
    }

    public TipoDocumento addTransaccion(Transaccion transaccion) {
        this.transaccions.add(transaccion);
        transaccion.setTipoDocumento(this);
        return this;
    }

    public TipoDocumento removeTransaccion(Transaccion transaccion) {
        this.transaccions.remove(transaccion);
        transaccion.setTipoDocumento(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TipoDocumento)) {
            return false;
        }
        return id != null && id.equals(((TipoDocumento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TipoDocumento{" +
            "id=" + getId() +
            ", codigo='" + getCodigo() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
