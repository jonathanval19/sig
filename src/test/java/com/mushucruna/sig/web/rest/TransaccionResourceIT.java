package com.mushucruna.sig.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mushucruna.sig.IntegrationTest;
import com.mushucruna.sig.domain.Transaccion;
import com.mushucruna.sig.domain.enumeration.Disposicion;
import com.mushucruna.sig.repository.TransaccionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TransaccionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TransaccionResourceIT {

    private static final String DEFAULT_PROPIETARIO = "AAAAAAAAAA";
    private static final String UPDATED_PROPIETARIO = "BBBBBBBBBB";

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final Disposicion DEFAULT_DISPOSICION = Disposicion.CREACION;
    private static final Disposicion UPDATED_DISPOSICION = Disposicion.ACTUALIZACION;

    private static final String DEFAULT_CODIGO_DOCUMENTO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO_DOCUMENTO = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERACION_DOCUMENTO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERACION_DOCUMENTO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/transaccions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTransaccionMockMvc;

    private Transaccion transaccion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaccion createEntity(EntityManager em) {
        Transaccion transaccion = new Transaccion()
            .propietario(DEFAULT_PROPIETARIO)
            .titulo(DEFAULT_TITULO)
            .disposicion(DEFAULT_DISPOSICION)
            .codigoDocumento(DEFAULT_CODIGO_DOCUMENTO)
            .numeracionDocumento(DEFAULT_NUMERACION_DOCUMENTO);
        return transaccion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaccion createUpdatedEntity(EntityManager em) {
        Transaccion transaccion = new Transaccion()
            .propietario(UPDATED_PROPIETARIO)
            .titulo(UPDATED_TITULO)
            .disposicion(UPDATED_DISPOSICION)
            .codigoDocumento(UPDATED_CODIGO_DOCUMENTO)
            .numeracionDocumento(UPDATED_NUMERACION_DOCUMENTO);
        return transaccion;
    }

    @BeforeEach
    public void initTest() {
        transaccion = createEntity(em);
    }

    @Test
    @Transactional
    void createTransaccion() throws Exception {
        int databaseSizeBeforeCreate = transaccionRepository.findAll().size();
        // Create the Transaccion
        restTransaccionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transaccion)))
            .andExpect(status().isCreated());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeCreate + 1);
        Transaccion testTransaccion = transaccionList.get(transaccionList.size() - 1);
        assertThat(testTransaccion.getPropietario()).isEqualTo(DEFAULT_PROPIETARIO);
        assertThat(testTransaccion.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testTransaccion.getDisposicion()).isEqualTo(DEFAULT_DISPOSICION);
        assertThat(testTransaccion.getCodigoDocumento()).isEqualTo(DEFAULT_CODIGO_DOCUMENTO);
        assertThat(testTransaccion.getNumeracionDocumento()).isEqualTo(DEFAULT_NUMERACION_DOCUMENTO);
    }

    @Test
    @Transactional
    void createTransaccionWithExistingId() throws Exception {
        // Create the Transaccion with an existing ID
        transaccion.setId(1L);

        int databaseSizeBeforeCreate = transaccionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransaccionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transaccion)))
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTransaccions() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        // Get all the transaccionList
        restTransaccionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transaccion.getId().intValue())))
            .andExpect(jsonPath("$.[*].propietario").value(hasItem(DEFAULT_PROPIETARIO)))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].disposicion").value(hasItem(DEFAULT_DISPOSICION.toString())))
            .andExpect(jsonPath("$.[*].codigoDocumento").value(hasItem(DEFAULT_CODIGO_DOCUMENTO)))
            .andExpect(jsonPath("$.[*].numeracionDocumento").value(hasItem(DEFAULT_NUMERACION_DOCUMENTO)));
    }

    @Test
    @Transactional
    void getTransaccion() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        // Get the transaccion
        restTransaccionMockMvc
            .perform(get(ENTITY_API_URL_ID, transaccion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(transaccion.getId().intValue()))
            .andExpect(jsonPath("$.propietario").value(DEFAULT_PROPIETARIO))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO))
            .andExpect(jsonPath("$.disposicion").value(DEFAULT_DISPOSICION.toString()))
            .andExpect(jsonPath("$.codigoDocumento").value(DEFAULT_CODIGO_DOCUMENTO))
            .andExpect(jsonPath("$.numeracionDocumento").value(DEFAULT_NUMERACION_DOCUMENTO));
    }

    @Test
    @Transactional
    void getNonExistingTransaccion() throws Exception {
        // Get the transaccion
        restTransaccionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTransaccion() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();

        // Update the transaccion
        Transaccion updatedTransaccion = transaccionRepository.findById(transaccion.getId()).get();
        // Disconnect from session so that the updates on updatedTransaccion are not directly saved in db
        em.detach(updatedTransaccion);
        updatedTransaccion
            .propietario(UPDATED_PROPIETARIO)
            .titulo(UPDATED_TITULO)
            .disposicion(UPDATED_DISPOSICION)
            .codigoDocumento(UPDATED_CODIGO_DOCUMENTO)
            .numeracionDocumento(UPDATED_NUMERACION_DOCUMENTO);

        restTransaccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTransaccion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTransaccion))
            )
            .andExpect(status().isOk());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
        Transaccion testTransaccion = transaccionList.get(transaccionList.size() - 1);
        assertThat(testTransaccion.getPropietario()).isEqualTo(UPDATED_PROPIETARIO);
        assertThat(testTransaccion.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testTransaccion.getDisposicion()).isEqualTo(UPDATED_DISPOSICION);
        assertThat(testTransaccion.getCodigoDocumento()).isEqualTo(UPDATED_CODIGO_DOCUMENTO);
        assertThat(testTransaccion.getNumeracionDocumento()).isEqualTo(UPDATED_NUMERACION_DOCUMENTO);
    }

    @Test
    @Transactional
    void putNonExistingTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();
        transaccion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransaccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, transaccion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transaccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();
        transaccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransaccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transaccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();
        transaccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransaccionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transaccion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTransaccionWithPatch() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();

        // Update the transaccion using partial update
        Transaccion partialUpdatedTransaccion = new Transaccion();
        partialUpdatedTransaccion.setId(transaccion.getId());

        partialUpdatedTransaccion.codigoDocumento(UPDATED_CODIGO_DOCUMENTO).numeracionDocumento(UPDATED_NUMERACION_DOCUMENTO);

        restTransaccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransaccion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransaccion))
            )
            .andExpect(status().isOk());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
        Transaccion testTransaccion = transaccionList.get(transaccionList.size() - 1);
        assertThat(testTransaccion.getPropietario()).isEqualTo(DEFAULT_PROPIETARIO);
        assertThat(testTransaccion.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testTransaccion.getDisposicion()).isEqualTo(DEFAULT_DISPOSICION);
        assertThat(testTransaccion.getCodigoDocumento()).isEqualTo(UPDATED_CODIGO_DOCUMENTO);
        assertThat(testTransaccion.getNumeracionDocumento()).isEqualTo(UPDATED_NUMERACION_DOCUMENTO);
    }

    @Test
    @Transactional
    void fullUpdateTransaccionWithPatch() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();

        // Update the transaccion using partial update
        Transaccion partialUpdatedTransaccion = new Transaccion();
        partialUpdatedTransaccion.setId(transaccion.getId());

        partialUpdatedTransaccion
            .propietario(UPDATED_PROPIETARIO)
            .titulo(UPDATED_TITULO)
            .disposicion(UPDATED_DISPOSICION)
            .codigoDocumento(UPDATED_CODIGO_DOCUMENTO)
            .numeracionDocumento(UPDATED_NUMERACION_DOCUMENTO);

        restTransaccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransaccion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransaccion))
            )
            .andExpect(status().isOk());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
        Transaccion testTransaccion = transaccionList.get(transaccionList.size() - 1);
        assertThat(testTransaccion.getPropietario()).isEqualTo(UPDATED_PROPIETARIO);
        assertThat(testTransaccion.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testTransaccion.getDisposicion()).isEqualTo(UPDATED_DISPOSICION);
        assertThat(testTransaccion.getCodigoDocumento()).isEqualTo(UPDATED_CODIGO_DOCUMENTO);
        assertThat(testTransaccion.getNumeracionDocumento()).isEqualTo(UPDATED_NUMERACION_DOCUMENTO);
    }

    @Test
    @Transactional
    void patchNonExistingTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();
        transaccion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransaccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, transaccion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transaccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();
        transaccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransaccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transaccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTransaccion() throws Exception {
        int databaseSizeBeforeUpdate = transaccionRepository.findAll().size();
        transaccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransaccionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(transaccion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transaccion in the database
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTransaccion() throws Exception {
        // Initialize the database
        transaccionRepository.saveAndFlush(transaccion);

        int databaseSizeBeforeDelete = transaccionRepository.findAll().size();

        // Delete the transaccion
        restTransaccionMockMvc
            .perform(delete(ENTITY_API_URL_ID, transaccion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transaccion> transaccionList = transaccionRepository.findAll();
        assertThat(transaccionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
