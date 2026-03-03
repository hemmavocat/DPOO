'use client';

import { fmt } from '../lib/utils';

export default function AuditLog({ data, loading, onRefresh }) {
  function renderBody() {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner" /> Chargement…
        </div>
      );
    }
    if (!data || !data.length) {
      return (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>Aucune action enregistrée.</p>
        </div>
      );
    }
    return data.map((e) => (
      <div key={e.id} className="audit-entry">
        <div className="audit-dot" />
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600 }}>{e.action}</span>
          {e.traitement_nom && (
            <span style={{ color: 'var(--blue)' }}> · {e.traitement_nom}</span>
          )}
          {e.details && (
            <span style={{ color: 'var(--muted)' }}> — {e.details}</span>
          )}
          <div style={{ marginTop: '3px', color: 'var(--subtle)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px' }}>
            {e.user_name || e.user_email} · {fmt(e.created_at)}
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div className="form-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Journal d&apos;audit</h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            Toutes les actions sur le registre
          </p>
        </div>
        <button className="btn-sm" onClick={onRefresh}>↻ Actualiser</button>
      </div>
      <div id="auditBody">{renderBody()}</div>
    </div>
  );
}
