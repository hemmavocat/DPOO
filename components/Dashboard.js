'use client';

import { useState } from 'react';
import { fmt } from '../lib/utils';

export default function Dashboard({ allData, loading, error, onNewTraitement, onEditRecord }) {
  const [search, setSearch]           = useState('');
  const [filterBase, setFilterBase]   = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const filtered = allData.filter((d) =>
    (!search || [d.nom, d.responsable, d.finalite].some((v) => v?.toLowerCase().includes(search.toLowerCase()))) &&
    (!filterBase   || d.base_legale === filterBase) &&
    (!filterStatut || d.statut === filterStatut)
  );

  const stats = {
    total:     allData.length,
    sensibles: allData.filter((d) => d.donnees_sensibles).length,
    aipd:      allData.filter((d) => d.aipd_requise === 'Oui').length,
    respo:     new Set(allData.map((d) => d.responsable).filter(Boolean)).size,
  };

  function renderTable() {
    if (loading) {
      return <div className="loading"><div className="spinner" /> Chargement…</div>;
    }
    if (error) {
      return (
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <p>{error}</p>
          <p style={{ fontSize: '11px', marginTop: '6px' }}>
            Avez-vous exécuté le script SQL ? (onglet Déploiement)
          </p>
        </div>
      );
    }
    if (!filtered.length) {
      return (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>Aucun traitement enregistré.</p>
          <p style={{ marginTop: '6px', fontSize: '11px' }}>
            Ajoutez votre premier traitement via &quot;+ Ajouter&quot;.
          </p>
        </div>
      );
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Traitement</th>
            <th>Responsable</th>
            <th>Base légale</th>
            <th>Sensible</th>
            <th>AIPD</th>
            <th>Statut</th>
            <th>Modifié</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => {
            const sensibleBadge = t.donnees_sensibles
              ? <span className="badge badge-red">Oui</span>
              : <span className="badge badge-gray">Non</span>;

            const aipdBadge = t.aipd_requise === 'Oui'
              ? <span className="badge badge-orange">Oui</span>
              : t.aipd_requise === 'À évaluer'
              ? <span className="badge badge-blue">Évaluer</span>
              : <span className="badge badge-green">Non</span>;

            const statutBadge = t.statut === 'Actif'
              ? <span className="badge badge-green">Actif</span>
              : t.statut === 'En révision'
              ? <span className="badge badge-orange">En révision</span>
              : <span className="badge badge-gray">Archivé</span>;

            return (
              <tr key={t.id}>
                <td>
                  <strong>{t.nom}</strong><br />
                  <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{t.finalite || ''}</span>
                </td>
                <td>{t.responsable}</td>
                <td>{t.base_legale || '—'}</td>
                <td>{sensibleBadge}</td>
                <td>{aipdBadge}</td>
                <td>{statutBadge}</td>
                <td style={{ fontSize: '11px', color: 'var(--subtle)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmt(t.updated_at || t.created_at)}
                </td>
                <td>
                  <button className="action-btn" onClick={() => onEditRecord(t.id)}>✏️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  const dash = loading ? '—' : null;

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total traitements</div>
          <div className="stat-value">{dash ?? stats.total}</div>
          <div className="stat-sub">enregistrés</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Données sensibles</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{dash ?? stats.sensibles}</div>
          <div className="stat-sub">Art. 9 RGPD</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AIPD requise</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{dash ?? stats.aipd}</div>
          <div className="stat-sub">à mener</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Responsables</div>
          <div className="stat-value">{dash ?? stats.respo}</div>
          <div className="stat-sub">distincts</div>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="toolbar-left">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterBase}
            onChange={(e) => setFilterBase(e.target.value)}
          >
            <option value="">Toutes bases légales</option>
            <option>Consentement</option>
            <option>Contrat</option>
            <option>Obligation légale</option>
            <option>Intérêt légitime</option>
            <option>Mission d&apos;intérêt public</option>
            <option>Intérêts vitaux</option>
          </select>
          <select
            className="filter-select"
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <option value="">Tous statuts</option>
            <option>Actif</option>
            <option>En révision</option>
            <option>Archivé</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={onNewTraitement}>+ Ajouter</button>
      </div>

      <div className="table-card">
        <div id="tableBody">{renderTable()}</div>
      </div>
    </>
  );
}
