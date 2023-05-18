package com.mushucruna.sig.web.rest;

import com.mushucruna.sig.domain.Proceso;
import com.mushucruna.sig.repository.ProcesoRepository;
import com.mushucruna.sig.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mushucruna.sig.domain.Proceso}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProcesoResource {

    private final Logger log = LoggerFactory.getLogger(ProcesoResource.class);

    private static final String ENTITY_NAME = "proceso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProcesoRepository procesoRepository;

    public ProcesoResource(ProcesoRepository procesoRepository) {
        this.procesoRepository = procesoRepository;
    }

    /**
     * {@code POST  /procesos} : Create a new proceso.
     *
     * @param proceso the proceso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new proceso, or with status {@code 400 (Bad Request)} if the proceso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/procesos")
    public ResponseEntity<Proceso> createProceso(@RequestBody Proceso proceso) throws URISyntaxException {
        log.debug("REST request to save Proceso : {}", proceso);
        if (proceso.getId() != null) {
            throw new BadRequestAlertException("A new proceso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Proceso result = procesoRepository.save(proceso);
        return ResponseEntity
            .created(new URI("/api/procesos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /procesos/:id} : Updates an existing proceso.
     *
     * @param id the id of the proceso to save.
     * @param proceso the proceso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proceso,
     * or with status {@code 400 (Bad Request)} if the proceso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the proceso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/procesos/{id}")
    public ResponseEntity<Proceso> updateProceso(@PathVariable(value = "id", required = false) final Long id, @RequestBody Proceso proceso)
        throws URISyntaxException {
        log.debug("REST request to update Proceso : {}, {}", id, proceso);
        if (proceso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proceso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!procesoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Proceso result = procesoRepository.save(proceso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, proceso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /procesos/:id} : Partial updates given fields of an existing proceso, field will ignore if it is null
     *
     * @param id the id of the proceso to save.
     * @param proceso the proceso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proceso,
     * or with status {@code 400 (Bad Request)} if the proceso is not valid,
     * or with status {@code 404 (Not Found)} if the proceso is not found,
     * or with status {@code 500 (Internal Server Error)} if the proceso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/procesos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Proceso> partialUpdateProceso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Proceso proceso
    ) throws URISyntaxException {
        log.debug("REST request to partial update Proceso partially : {}, {}", id, proceso);
        if (proceso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proceso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!procesoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Proceso> result = procesoRepository
            .findById(proceso.getId())
            .map(existingProceso -> {
                if (proceso.getTipoproceso() != null) {
                    existingProceso.setTipoproceso(proceso.getTipoproceso());
                }
                if (proceso.getCodigo() != null) {
                    existingProceso.setCodigo(proceso.getCodigo());
                }
                if (proceso.getDescripcion() != null) {
                    existingProceso.setDescripcion(proceso.getDescripcion());
                }

                return existingProceso;
            })
            .map(procesoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, proceso.getId().toString())
        );
    }

    /**
     * {@code GET  /procesos} : get all the procesos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of procesos in body.
     */
    @GetMapping("/procesos")
    public List<Proceso> getAllProcesos() {
        log.debug("REST request to get all Procesos");
        return procesoRepository.findAll();
    }

    /**
     * {@code GET  /procesos/:id} : get the "id" proceso.
     *
     * @param id the id of the proceso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the proceso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/procesos/{id}")
    public ResponseEntity<Proceso> getProceso(@PathVariable Long id) {
        log.debug("REST request to get Proceso : {}", id);
        Optional<Proceso> proceso = procesoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(proceso);
    }

    /**
     * {@code DELETE  /procesos/:id} : delete the "id" proceso.
     *
     * @param id the id of the proceso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/procesos/{id}")
    public ResponseEntity<Void> deleteProceso(@PathVariable Long id) {
        log.debug("REST request to delete Proceso : {}", id);
        procesoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
