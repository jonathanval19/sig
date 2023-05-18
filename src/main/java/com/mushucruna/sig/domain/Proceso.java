package com.mushucruna.sig.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mushucruna.sig.domain.enumeration.TipoProceso;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Proceso.
 */
@Entity
@Table(name = "proceso")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Proceso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoproceso")
    private TipoProceso tipoproceso;

    @Column(name = "codigo")
    private String codigo;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "proceso")
    @JsonIgnoreProperties(value = { "documentos", "proceso", "tipoDocumento" }, allowSetters = true)
    private Set<Transaccion> transaccions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Proceso id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoProceso getTipoproceso() {
        return this.tipoproceso;
    }

    public Proceso tipoproceso(TipoProceso tipoproceso) {
        this.setTipoproceso(tipoproceso);
        return this;
    }

    public void setTipoproceso(TipoProceso tipoproceso) {
        this.tipoproceso = tipoproceso;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public Proceso codigo(String codigo) {
        this.setCodigo(codigo);
        return this;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Proceso descripcion(String descripcion) {
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
            this.transaccions.forEach(i -> i.setProceso(null));
        }
        if (transaccions != null) {
            transaccions.forEach(i -> i.setProceso(this));
        }
        this.transaccions = transaccions;
    }

    public Proceso transaccions(Set<Transaccion> transaccions) {
        this.setTransaccions(transaccions);
        return this;
    }

    public Proceso addTransaccion(Transaccion transaccion) {
        this.transaccions.add(transaccion);
        transaccion.setProceso(this);
        return this;
    }

    public Proceso removeTransaccion(Transaccion transaccion) {
        this.transaccions.remove(transaccion);
        transaccion.setProceso(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Proceso)) {
            return false;
        }
        return id != null && id.equals(((Proceso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Proceso{" +
            "id=" + getId() +
            ", tipoproceso='" + getTipoproceso() + "'" +
            ", codigo='" + getCodigo() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
