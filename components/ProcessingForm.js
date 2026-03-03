'use client';

const DATA_CATEGORIES = [
  { value: 'Identité',    label: 'Identité' },
  { value: 'Contact',     label: 'Contact' },
  { value: 'Économique',  label: 'Économique' },
  { value: 'Santé',       label: 'Santé' },
  { value: 'Biométrique', label: 'Biométrique' },
  { value: 'Localisation',label: 'Localisation' },
  { value: 'Comportement',label: 'Comportement' },
  { value: 'Opinions',    label: 'Opinions politiques/syndicales' },
  { value: 'Autre',       label: 'Autre' },
];

export default function ProcessingForm({
  formData,
  editingId,
  onSubmit,
  onDelete,
  onReset,
  onCancel,
  onChange,
}) {
  function update(field, value) {
    onChange((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCategory(cat) {
    const cats = formData.categories || [];
    update(
      'categories',
      cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat]
    );
  }

  const cats = formData.categories || [];

  return (
    <>
      {editingId && (
        <div className="edit-banner show">
          ✏️ <span>Modification : {formData.nom}</span>
          <button className="btn-sm" style={{ marginLeft: 'auto' }} onClick={onCancel}>
            Annuler
          </button>
        </div>
      )}

      <div className="form-card">
        {/* ── Section 1 ── */}
        <div className="form-section-title">
          <span className="section-num">1</span> Identification
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom <span className="req">*</span></label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => update('nom', e.target.value)}
              placeholder="ex : Gestion des candidatures"
            />
          </div>
          <div className="form-group">
            <label>Responsable <span className="req">*</span></label>
            <input
              type="text"
              value={formData.responsable}
              onChange={(e) => update('responsable', e.target.value)}
              placeholder="ex : DRH"
            />
          </div>
          <div className="form-group">
            <label>Finalité <span className="req">*</span></label>
            <input
              type="text"
              value={formData.finalite}
              onChange={(e) => update('finalite', e.target.value)}
              placeholder="ex : Recrutement"
            />
          </div>
          <div className="form-group">
            <label>Date de création</label>
            <input
              type="date"
              value={formData.date_creation}
              onChange={(e) => update('date_creation', e.target.value)}
            />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Décrivez le traitement…"
            />
          </div>
        </div>

        {/* ── Section 2 ── */}
        <div className="form-section-title">
          <span className="section-num">2</span> Base légale &amp; données
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Base légale <span className="req">*</span></label>
            <select
              value={formData.base_legale}
              onChange={(e) => update('base_legale', e.target.value)}
            >
              <option value="">Sélectionner…</option>
              <option>Consentement</option>
              <option>Contrat</option>
              <option>Obligation légale</option>
              <option>Intérêt légitime</option>
              <option>Mission d&apos;intérêt public</option>
              <option>Intérêts vitaux</option>
            </select>
          </div>

          <div className="form-group">
            <label>Données sensibles (Art. 9)</label>
            <div style={{ marginTop: '4px' }}>
              <label className="radio-pill">
                <input
                  type="radio"
                  name="sensible"
                  checked={!formData.donnees_sensibles}
                  onChange={() => update('donnees_sensibles', false)}
                />
                Non
              </label>
              <label className="radio-pill">
                <input
                  type="radio"
                  name="sensible"
                  checked={!!formData.donnees_sensibles}
                  onChange={() => update('donnees_sensibles', true)}
                />
                Oui
              </label>
            </div>
          </div>

          <div className="form-group full">
            <label>Catégories de données</label>
            <div className="checkbox-grid">
              {DATA_CATEGORIES.map((cat) => (
                <label key={cat.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={cats.includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Durée de conservation</label>
            <input
              type="text"
              value={formData.duree_conservation}
              onChange={(e) => update('duree_conservation', e.target.value)}
              placeholder="ex : 5 ans"
            />
          </div>
          <div className="form-group">
            <label>Personnes concernées</label>
            <input
              type="text"
              value={formData.personnes}
              onChange={(e) => update('personnes', e.target.value)}
              placeholder="ex : Employés, clients"
            />
          </div>
        </div>

        {/* ── Section 3 ── */}
        <div className="form-section-title">
          <span className="section-num">3</span> Sécurité &amp; transferts
        </div>
        <div className="form-grid cols-3">
          <div className="form-group">
            <label>AIPD requise ?</label>
            <select
              value={formData.aipd_requise}
              onChange={(e) => update('aipd_requise', e.target.value)}
            >
              <option value="Non">Non</option>
              <option value="Oui">Oui</option>
              <option value="À évaluer">À évaluer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Transfert hors UE ?</label>
            <select
              value={formData.transfert_hors_ue ? 'Oui' : 'Non'}
              onChange={(e) => update('transfert_hors_ue', e.target.value === 'Oui')}
            >
              <option value="Non">Non</option>
              <option value="Oui">Oui</option>
            </select>
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select
              value={formData.statut}
              onChange={(e) => update('statut', e.target.value)}
            >
              <option value="Actif">Actif</option>
              <option value="En révision">En révision</option>
              <option value="Archivé">Archivé</option>
            </select>
          </div>
          <div className="form-group full">
            <label>Sous-traitants</label>
            <textarea
              value={formData.sous_traitants}
              onChange={(e) => update('sous_traitants', e.target.value)}
              placeholder="Listez les sous-traitants…"
              style={{ minHeight: '60px' }}
            />
          </div>
          <div className="form-group full">
            <label>Mesures de sécurité</label>
            <textarea
              value={formData.mesures_securite}
              onChange={(e) => update('mesures_securite', e.target.value)}
              placeholder="Chiffrement, pseudonymisation…"
              style={{ minHeight: '60px' }}
            />
          </div>
        </div>

        <div className="form-actions">
          <div>
            {editingId && (
              <button className="btn btn-danger" onClick={onDelete}>
                🗑 Supprimer
              </button>
            )}
          </div>
          <div className="form-actions-right">
            <button className="btn btn-ghost" onClick={onReset}>Réinitialiser</button>
            <button className="btn btn-primary" onClick={onSubmit}>
              {editingId ? '💾 Mettre à jour' : '💾 Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
