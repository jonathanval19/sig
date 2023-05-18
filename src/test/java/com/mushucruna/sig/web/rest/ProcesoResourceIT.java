package com.mushucruna.sig.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mushucruna.sig.IntegrationTest;
import com.mushucruna.sig.domain.Proceso;
import com.mushucruna.sig.domain.enumeration.TipoProceso;
import com.mushucruna.sig.repository.ProcesoRepository;
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
 * Integration tests for the {@link ProcesoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProcesoResourceIT {

    private static final TipoProceso DEFAULT_TIPOPROCESO = TipoProceso.ESTRATEGICO;
    private static final TipoProceso UPDATED_TIPOPROCESO = TipoProceso.VALOR;

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/procesos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProcesoRepository procesoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProcesoMockMvc;

    private Proceso proceso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proceso createEntity(EntityManager em) {
        Proceso proceso = new Proceso().tipoproceso(DEFAULT_TIPOPROCESO).codigo(DEFAULT_CODIGO).descripcion(DEFAULT_DESCRIPCION);
        return proceso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proceso createUpdatedEntity(EntityManager em) {
        Proceso proceso = new Proceso().tipoproceso(UPDATED_TIPOPROCESO).codigo(UPDATED_CODIGO).descripcion(UPDATED_DESCRIPCION);
        return proceso;
    }

    @BeforeEach
    public void initTest() {
        proceso = createEntity(em);
    }

    @Test
    @Transactional
    void createProceso() throws Exception {
        int databaseSizeBeforeCreate = procesoRepository.findAll().size();
        // Create the Proceso
        restProcesoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proceso)))
            .andExpect(status().isCreated());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeCreate + 1);
        Proceso testProceso = procesoList.get(procesoList.size() - 1);
        assertThat(testProceso.getTipoproceso()).isEqualTo(DEFAULT_TIPOPROCESO);
        assertThat(testProceso.getCodigo()).isEqualTo(DEFAULT_CODIGO);
        assertThat(testProceso.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createProcesoWithExistingId() throws Exception {
        // Create the Proceso with an existing ID
        proceso.setId(1L);

        int databaseSizeBeforeCreate = procesoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProcesoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proceso)))
            .andExpect(status().isBadRequest());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProcesos() throws Exception {
        // Initialize the database
        procesoRepository.saveAndFlush(proceso);

        // Get all the procesoList
        restProcesoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proceso.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipoproceso").value(hasItem(DEFAULT_TIPOPROCESO.toString())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getProceso() throws Exception {
        // Initialize the database
        procesoRepository.saveAndFlush(proceso);

        // Get the proceso
        restProcesoMockMvc
            .perform(get(ENTITY_API_URL_ID, proceso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(proceso.getId().intValue()))
            .andExpect(jsonPath("$.tipoproceso").value(DEFAULT_TIPOPROCESO.toString()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingProceso() throws Exception {
        // Get the proceso
        restProcesoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProceso() throws Exception {
        // Initialize the database
        procesoRepository.saveAndFlush(proceso);

        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();

        // Update the proceso
        Proceso updatedProceso = procesoRepository.findById(proceso.getId()).get();
        // Disconnect from session so that the updates on updatedProceso are not directly saved in db
        em.detach(updatedProceso);
        updatedProceso.tipoproceso(UPDATED_TIPOPROCESO).codigo(UPDATED_CODIGO).descripcion(UPDATED_DESCRIPCION);

        restProcesoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProceso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProceso))
            )
            .andExpect(status().isOk());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
        Proceso testProceso = procesoList.get(procesoList.size() - 1);
        assertThat(testProceso.getTipoproceso()).isEqualTo(UPDATED_TIPOPROCESO);
        assertThat(testProceso.getCodigo()).isEqualTo(UPDATED_CODIGO);
        assertThat(testProceso.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingProceso() throws Exception {
        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();
        proceso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcesoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, proceso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proceso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProceso() throws Exception {
        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();
        proceso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcesoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proceso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProceso() throws Exception {
        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();
        proceso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcesoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proceso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProcesoWithPatch() throws Exception {
        // Initialize the database
        procesoRepository.saveAndFlush(proceso);

        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();

        // Update the proceso using partial update
        Proceso partialUpdatedProceso = new Proceso();
        partialUpdatedProceso.setId(proceso.getId());

        partialUpdatedProceso.descripcion(UPDATED_DESCRIPCION);

        restProcesoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProceso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProceso))
            )
            .andExpect(status().isOk());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
        Proceso testProceso = procesoList.get(procesoList.size() - 1);
        assertThat(testProceso.getTipoproceso()).isEqualTo(DEFAULT_TIPOPROCESO);
        assertThat(testProceso.getCodigo()).isEqualTo(DEFAULT_CODIGO);
        assertThat(testProceso.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdateProcesoWithPatch() throws Exception {
        // Initialize the database
        procesoRepository.saveAndFlush(proceso);

        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();

        // Update the proceso using partial update
        Proceso partialUpdatedProceso = new Proceso();
        partialUpdatedProceso.setId(proceso.getId());

        partialUpdatedProceso.tipoproceso(UPDATED_TIPOPROCESO).codigo(UPDATED_CODIGO).descripcion(UPDATED_DESCRIPCION);

        restProcesoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProceso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProceso))
            )
            .andExpect(status().isOk());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
        Proceso testProceso = procesoList.get(procesoList.size() - 1);
        assertThat(testProceso.getTipoproceso()).isEqualTo(UPDATED_TIPOPROCESO);
        assertThat(testProceso.getCodigo()).isEqualTo(UPDATED_CODIGO);
        assertThat(testProceso.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingProceso() throws Exception {
        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();
        proceso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcesoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, proceso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proceso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProceso() throws Exception {
        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();
        proceso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcesoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proceso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProceso() throws Exception {
        int databaseSizeBeforeUpdate = procesoRepository.findAll().size();
        proceso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcesoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(proceso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proceso in the database
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProceso() throws Exception {
        // Initialize the database
        procesoRepository.saveAndFlush(proceso);

        int databaseSizeBeforeDelete = procesoRepository.findAll().size();

        // Delete the proceso
        restProcesoMockMvc
            .perform(delete(ENTITY_API_URL_ID, proceso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Proceso> procesoList = procesoRepository.findAll();
        assertThat(procesoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
