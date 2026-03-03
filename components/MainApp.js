'use client';

import Dashboard        from './Dashboard';
import ProcessingForm   from './ProcessingForm';
import AuditLog         from './AuditLog';
import DeploymentGuide  from './DeploymentGuide';

const TAB_LABELS = {
  dashboard: '📊 Tableau de bord',
  form:      '➕ Nouveau traitement',
  audit:     '📋 Journal d\'audit',
  setup:     '🛠 Déploiement',
};

export default function MainApp({
  currentUser,
  allData,
  activeTab,
  editingId,
  formData,
  auditData,
  auditLoading,
  tableLoading,
  tableError,
  onSwitchTab,
  onSignOut,
  onExportCSV,
  onNewTraitement,
  onEditRecord,
  onSubmitForm,
  onDeleteRecord,
  onResetForm,
  onCancelEdit,
  onUpdateForm,
  onLoadAudit,
  showToast,
}) {
  const m      = currentUser?.user_metadata || {};
  const name   = m.full_name || m.name || currentUser?.email || '';
  const avatar = m.avatar_url || m.picture || '';

  return (
    <div id="app">
      <header>
        <div className="logo">
          RegistreDPO <span className="logo-badge">MVP</span>
        </div>
        <div className="header-right">
          <div className="header-user">
            <div className="status-dot" />
            <span>{name}</span>
            {avatar
              ? <img src={avatar} className="user-avatar" alt={name} />
              : <div className="user-avatar-fallback">{name.charAt(0).toUpperCase()}</div>
            }
          </div>
          <button className="btn-sm" onClick={onExportCSV}>⬇ Export CSV</button>
          <button className="btn-sm" onClick={onSignOut}>Déconnexion</button>
        </div>
      </header>

      <main>
        <h1 className="page-title">Registre des Traitements</h1>
        <p className="page-sub">Article 30 RGPD · Gestion centralisée des activités de traitement</p>

        <div className="tabs">
          {Object.entries(TAB_LABELS).map(([key, label]) => (
            <div
              key={key}
              className={`tab${activeTab === key ? ' active' : ''}`}
              onClick={() => onSwitchTab(key)}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Dashboard tab */}
        <div className={`tab-content${activeTab === 'dashboard' ? ' active' : ''}`} id="tab-dashboard">
          <Dashboard
            allData={allData}
            loading={tableLoading}
            error={tableError}
            onNewTraitement={onNewTraitement}
            onEditRecord={onEditRecord}
          />
        </div>

        {/* Form tab */}
        <div className={`tab-content${activeTab === 'form' ? ' active' : ''}`} id="tab-form">
          <ProcessingForm
            formData={formData}
            editingId={editingId}
            onSubmit={onSubmitForm}
            onDelete={onDeleteRecord}
            onReset={onResetForm}
            onCancel={onCancelEdit}
            onChange={onUpdateForm}
          />
        </div>

        {/* Audit tab */}
        <div className={`tab-content${activeTab === 'audit' ? ' active' : ''}`} id="tab-audit">
          <AuditLog
            data={auditData}
            loading={auditLoading}
            onRefresh={onLoadAudit}
          />
        </div>

        {/* Deployment tab */}
        <div className={`tab-content${activeTab === 'setup' ? ' active' : ''}`} id="tab-setup">
          <DeploymentGuide showToast={showToast} />
        </div>
      </main>
    </div>
  );
}
