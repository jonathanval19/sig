package com.mushucruna.sig.web.rest;

import com.mushucruna.sig.domain.Documento;
import com.mushucruna.sig.repository.DocumentoRepository;
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
 * REST controller for managing {@link com.mushucruna.sig.domain.Documento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DocumentoResource {

    private final Logger log = LoggerFactory.getLogger(DocumentoResource.class);

    private static final String ENTITY_NAME = "documento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentoRepository documentoRepository;

    public DocumentoResource(DocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    /**
     * {@code POST  /documentos} : Create a new documento.
     *
     * @param documento the documento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documento, or with status {@code 400 (Bad Request)} if the documento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/documentos")
    public ResponseEntity<Documento> createDocumento(@RequestBody Documento documento) throws URISyntaxException {
        log.debug("REST request to save Documento : {}", documento);
        if (documento.getId() != null) {
            throw new BadRequestAlertException("A new documento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Documento result = documentoRepository.save(documento);
        return ResponseEntity
            .created(new URI("/api/documentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /documentos/:id} : Updates an existing documento.
     *
     * @param id the id of the documento to save.
     * @param documento the documento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documento,
     * or with status {@code 400 (Bad Request)} if the documento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/documentos/{id}")
    public ResponseEntity<Documento> updateDocumento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Documento documento
    ) throws URISyntaxException {
        log.debug("REST request to update Documento : {}, {}", id, documento);
        if (documento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Documento result = documentoRepository.save(documento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, documento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /documentos/:id} : Partial updates given fields of an existing documento, field will ignore if it is null
     *
     * @param id the id of the documento to save.
     * @param documento the documento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documento,
     * or with status {@code 400 (Bad Request)} if the documento is not valid,
     * or with status {@code 404 (Not Found)} if the documento is not found,
     * or with status {@code 500 (Internal Server Error)} if the documento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/documentos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Documento> partialUpdateDocumento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Documento documento
    ) throws URISyntaxException {
        log.debug("REST request to partial update Documento partially : {}, {}", id, documento);
        if (documento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Documento> result = documentoRepository
            .findById(documento.getId())
            .map(existingDocumento -> {
                if (documento.getVersion() != null) {
                    existingDocumento.setVersion(documento.getVersion());
                }
                if (documento.getFechaElaboracion() != null) {
                    existingDocumento.setFechaElaboracion(documento.getFechaElaboracion());
                }
                if (documento.getFechaActualizacion() != null) {
                    existingDocumento.setFechaActualizacion(documento.getFechaActualizacion());
                }
                if (documento.getAcceso() != null) {
                    existingDocumento.setAcceso(documento.getAcceso());
                }
                if (documento.getArchivo() != null) {
                    existingDocumento.setArchivo(documento.getArchivo());
                }
                if (documento.getArchivoContentType() != null) {
                    existingDocumento.setArchivoContentType(documento.getArchivoContentType());
                }
                if (documento.getEnviarNotificacion() != null) {
                    existingDocumento.setEnviarNotificacion(documento.getEnviarNotificacion());
                }
                if (documento.getObservaciones() != null) {
                    existingDocumento.setObservaciones(documento.getObservaciones());
                }

                return existingDocumento;
            })
            .map(documentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, documento.getId().toString())
        );
    }

    /**
     * {@code GET  /documentos} : get all the documentos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentos in body.
     */
    @GetMapping("/documentos")
    public List<Documento> getAllDocumentos() {
        log.debug("REST request to get all Documentos");
        return documentoRepository.findAll();
    }

    /**
     * {@code GET  /documentos/:id} : get the "id" documento.
     *
     * @param id the id of the documento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/documentos/{id}")
    public ResponseEntity<Documento> getDocumento(@PathVariable Long id) {
        log.debug("REST request to get Documento : {}", id);
        Optional<Documento> documento = documentoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(documento);
    }

    /**
     * {@code DELETE  /documentos/:id} : delete the "id" documento.
     *
     * @param id the id of the documento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/documentos/{id}")
    public ResponseEntity<Void> deleteDocumento(@PathVariable Long id) {
        log.debug("REST request to delete Documento : {}", id);
        documentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
