'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { fmt } from '../lib/utils';
import LoginScreen from '../components/LoginScreen';
import MainApp     from '../components/MainApp';
import Toast       from '../components/Toast';

const EMPTY_FORM = {
  nom: '',
  responsable: '',
  finalite: '',
  description: '',
  date_creation: '',
  base_legale: '',
  donnees_sensibles: false,
  categories: [],
  personnes: '',
  duree_conservation: '',
  aipd_requise: 'Non',
  transfert_hors_ue: false,
  sous_traitants: '',
  mesures_securite: '',
  statut: 'Actif',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  // ── Auth state ───────────────────────────────────────────────
  const [currentUser,   setCurrentUser]   = useState(null);

  // ── Data state ───────────────────────────────────────────────
  const [allData,       setAllData]       = useState([]);
  const [tableLoading,  setTableLoading]  = useState(false);
  const [tableError,    setTableError]    = useState(null);
  const [auditData,     setAuditData]     = useState(null);
  const [auditLoading,  setAuditLoading]  = useState(false);

  // ── UI state ─────────────────────────────────────────────────
  const [activeTab,     setActiveTab]     = useState('dashboard');
  const [editingId,     setEditingId]     = useState(null);
  const [formData,      setFormData]      = useState({ ...EMPTY_FORM, date_creation: todayISO() });
  const [toast,         setToast]         = useState({ msg: '', type: '', show: false });
  const [loginMsg,      setLoginMsg]      = useState(null);
  const [loginLoading,  setLoginLoading]  = useState(false);

  // ── Refs ─────────────────────────────────────────────────────
  const rtChannelRef  = useRef(null);
  const toastTimerRef = useRef(null);

  // ── Init: check existing session ─────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setCurrentUser(data.session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((ev, sess) => {
      if (ev === 'SIGNED_IN' && sess)  setCurrentUser(sess.user);
      if (ev === 'SIGNED_OUT')         setCurrentUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load data + realtime when authenticated ──────────────────
  useEffect(() => {
    if (!currentUser) return;
    loadData();
    setupRt();
    return () => {
      if (rtChannelRef.current) {
        supabase.removeChannel(rtChannelRef.current);
        rtChannelRef.current = null;
      }
    };
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load audit when tab switches to audit ────────────────────
  useEffect(() => {
    if (activeTab === 'audit' && currentUser) loadAudit();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toast helper ─────────────────────────────────────────────
  function showToast(msg, type = '') {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, type, show: true });
    toastTimerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      3500
    );
  }

  // ── Auth ─────────────────────────────────────────────────────
  async function signInWithGoogle() {
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          queryParams: { access_type: 'offline', prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (e) {
      setLoginMsg({ text: e.message, type: 'error' });
      setLoginLoading(false);
    }
  }

  async function signOut() {
    if (rtChannelRef.current) {
      supabase.removeChannel(rtChannelRef.current);
      rtChannelRef.current = null;
    }
    await supabase.auth.signOut();
    setAllData([]);
  }

  // ── Realtime ─────────────────────────────────────────────────
  function setupRt() {
    if (rtChannelRef.current) return;
    rtChannelRef.current = supabase
      .channel('rt-traitements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'traitements' }, () => loadData())
      .subscribe();
  }

  // ── Data operations ───────────────────────────────────────────
  async function loadData() {
    setTableLoading(true);
    setTableError(null);
    try {
      const { data, error } = await supabase
        .from('traitements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllData(data || []);
    } catch (e) {
      setTableError(e.message);
    } finally {
      setTableLoading(false);
    }
  }

  async function logAudit(action, nom, details = '') {
    if (!currentUser) return;
    const m = currentUser.user_metadata || {};
    try {
      await supabase.from('audit_log').insert([{
        user_email:     currentUser.email,
        user_name:      m.full_name || m.name || currentUser.email,
        action,
        traitement_nom: nom,
        details,
      }]);
    } catch (e) {}
  }

  async function loadAudit() {
    setAuditLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setAuditData(data || []);
    } catch (e) {
      setAuditData([]);
    } finally {
      setAuditLoading(false);
    }
  }

  // ── Form operations ───────────────────────────────────────────
  async function submitForm() {
    const { nom, responsable, finalite } = formData;
    if (!nom || !responsable || !finalite) {
      showToast('Remplissez les champs obligatoires (*)', 'error');
      return;
    }

    const record = {
      nom,
      responsable,
      finalite,
      description:        formData.description,
      date_creation:      formData.date_creation || null,
      base_legale:        formData.base_legale,
      donnees_sensibles:  formData.donnees_sensibles,
      categories:         formData.categories,
      personnes:          formData.personnes,
      duree_conservation: formData.duree_conservation,
      aipd_requise:       formData.aipd_requise,
      transfert_hors_ue:  formData.transfert_hors_ue,
      sous_traitants:     formData.sous_traitants,
      mesures_securite:   formData.mesures_securite,
      statut:             formData.statut,
    };

    try {
      if (editingId) {
        record.updated_at = new Date().toISOString();
        record.updated_by = currentUser?.id;
        const { error } = await supabase.from('traitements').update(record).eq('id', editingId);
        if (error) throw error;
        await logAudit('Modification', nom, `Statut: ${record.statut}`);
        showToast('✅ Traitement mis à jour !', 'success');
      } else {
        record.created_by = currentUser?.id;
        const { error } = await supabase.from('traitements').insert([record]);
        if (error) throw error;
        await logAudit('Création', nom, `Base légale: ${record.base_legale}`);
        showToast('✅ Traitement enregistré !', 'success');
      }
      cancelEdit();
      setActiveTab('dashboard');
      loadData();
    } catch (e) {
      showToast('Erreur: ' + e.message, 'error');
    }
  }

  async function deleteCurrentEdit() {
    if (!editingId || !confirm('Supprimer définitivement ?')) return;
    const t = allData.find((d) => d.id === editingId);
    try {
      const { error } = await supabase.from('traitements').delete().eq('id', editingId);
      if (error) throw error;
      await logAudit('Suppression', t?.nom || '');
      showToast('Traitement supprimé.', 'success');
      cancelEdit();
      setActiveTab('dashboard');
      loadData();
    } catch (e) {
      showToast('Erreur: ' + e.message, 'error');
    }
  }

  function editRecord(id) {
    const t = allData.find((d) => d.id === id);
    if (!t) return;
    setEditingId(id);
    setFormData({
      nom:                t.nom || '',
      responsable:        t.responsable || '',
      finalite:           t.finalite || '',
      description:        t.description || '',
      date_creation:      t.date_creation || '',
      base_legale:        t.base_legale || '',
      donnees_sensibles:  t.donnees_sensibles || false,
      categories:         t.categories || [],
      personnes:          t.personnes || '',
      duree_conservation: t.duree_conservation || '',
      aipd_requise:       t.aipd_requise || 'Non',
      transfert_hors_ue:  t.transfert_hors_ue || false,
      sous_traitants:     t.sous_traitants || '',
      mesures_securite:   t.mesures_securite || '',
      statut:             t.statut || 'Actif',
    });
    setActiveTab('form');
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  function resetForm() {
    setFormData({ ...EMPTY_FORM, date_creation: todayISO() });
    setEditingId(null);
  }

  function newTraitement() {
    resetForm();
    setActiveTab('form');
  }

  // ── CSV export ────────────────────────────────────────────────
  function exportCSV() {
    if (!allData.length) { showToast('Aucune donnée.', 'error'); return; }
    const headers = [
      'Nom', 'Responsable', 'Finalité', 'Base légale',
      'Données sensibles', 'Catégories', 'Personnes',
      'Durée conservation', 'AIPD', 'Transfert hors UE', 'Statut', 'Créé le',
    ];
    const rows = allData.map((t) =>
      [
        t.nom, t.responsable, t.finalite, t.base_legale || '',
        (t.donnees_sensibles ? 'Oui' : 'Non'),
        (t.categories || []).join('; '),
        t.personnes || '', t.duree_conservation || '',
        t.aipd_requise || '',
        (t.transfert_hors_ue ? 'Oui' : 'Non'),
        t.statut || '', fmt(t.created_at),
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`)
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob(
        ['\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')],
        { type: 'text/csv;charset=utf-8;' }
      )
    );
    a.download = `registre-dpo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    logAudit('Export CSV', '', `${allData.length} traitements`);
    showToast('✅ CSV exporté !', 'success');
  }

  // ── Render ────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <>
        <LoginScreen
          onSignIn={signInWithGoogle}
          loginMsg={loginMsg}
          loginLoading={loginLoading}
        />
        <Toast {...toast} />
      </>
    );
  }

  return (
    <>
      <MainApp
        currentUser={currentUser}
        allData={allData}
        activeTab={activeTab}
        editingId={editingId}
        formData={formData}
        auditData={auditData}
        auditLoading={auditLoading}
        tableLoading={tableLoading}
        tableError={tableError}
        onSwitchTab={setActiveTab}
        onSignOut={signOut}
        onExportCSV={exportCSV}
        onNewTraitement={newTraitement}
        onEditRecord={editRecord}
        onSubmitForm={submitForm}
        onDeleteRecord={deleteCurrentEdit}
        onResetForm={resetForm}
        onCancelEdit={cancelEdit}
        onUpdateForm={setFormData}
        onLoadAudit={loadAudit}
        showToast={showToast}
      />
      <Toast {...toast} />
    </>
  );
}
