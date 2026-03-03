'use client';

export default function DeploymentGuide({ showToast }) {
  function copyEl(id) {
    const el = document.getElementById(id);
    if (el) {
      navigator.clipboard.writeText(el.innerText).then(() => showToast('Copié !', 'success'));
    }
  }

  return (
    <>
      <div className="sql-panel">
        <h3>🚀 Guide de déploiement complet</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Suivez ces étapes dans l&apos;ordre pour mettre la plateforme en ligne aujourd&apos;hui.
        </p>
        <ol className="setup-steps">
          <li>
            <strong style={{ color: '#fff' }}>Google OAuth :</strong>{' '}
            <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>
              console.cloud.google.com
            </a>{' '}
            → Create Project → APIs &amp; Services → Credentials → Create OAuth 2.0 Client ID → Web Application.
            Authorized redirect URI :{' '}
            <code style={{ color: '#34d399' }}>https://VOTRE-ID.supabase.co/auth/v1/callback</code>
          </li>
          <li>
            <strong style={{ color: '#fff' }}>Supabase Google Provider :</strong>{' '}
            Dashboard → Authentication → Providers → Google → coller Client ID &amp; Client Secret → Save.
          </li>
          <li>
            <strong style={{ color: '#fff' }}>SQL :</strong>{' '}
            Supabase → SQL Editor → New Query → copier le script ci-dessous → Run.
          </li>
          <li>
            <strong style={{ color: '#fff' }}>GitHub :</strong>{' '}
            Créez un repo privé → uploadez le projet Next.js (tous les fichiers sauf{' '}
            <code style={{ color: '#34d399' }}>node_modules/</code> et{' '}
            <code style={{ color: '#34d399' }}>.next/</code>).
          </li>
          <li>
            <strong style={{ color: '#fff' }}>Netlify :</strong>{' '}
            netlify.com → Add new site → Import from Git → sélectionnez votre repo → Deploy.
          </li>
          <li>
            <strong style={{ color: '#fff' }}>URL callback :</strong>{' '}
            Supabase → Authentication → URL Configuration → Site URL = votre URL Netlify → Redirect URLs = même URL.
          </li>
          <li>
            ✅ <strong style={{ color: '#fff' }}>Partagez l&apos;URL</strong> Netlify à votre collègue.
            Il se connecte avec son compte Google, c&apos;est tout.
          </li>
        </ol>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Script SQL</h3>
          <button className="copy-btn" onClick={() => copyEl('sqlBlock')}>📋 Copier</button>
        </div>
        <div className="sql-block" id="sqlBlock">
          <span className="cm">{'-- RegistreDPO · Tables (Supabase SQL Editor)'}</span>{'\n\n'}
          <span className="kw">{'CREATE TABLE IF NOT EXISTS'}</span>{' traitements (\n'}
          {'  id                '}<span className="ty">{'UUID DEFAULT'}</span>{' gen_random_uuid() '}<span className="kw">{'PRIMARY KEY'}</span>{',\n'}
          {'  created_at        '}<span className="ty">{'TIMESTAMPTZ DEFAULT'}</span>{' now(),\n'}
          {'  created_by        '}<span className="ty">{'UUID REFERENCES'}</span>{' auth.users(id),\n'}
          {'  updated_at        '}<span className="ty">{'TIMESTAMPTZ'}</span>{',\n'}
          {'  updated_by        '}<span className="ty">{'UUID REFERENCES'}</span>{' auth.users(id),\n'}
          {'  nom               '}<span className="ty">{'TEXT NOT NULL'}</span>{',\n'}
          {'  responsable       '}<span className="ty">{'TEXT NOT NULL'}</span>{',\n'}
          {'  finalite          '}<span className="ty">{'TEXT NOT NULL'}</span>{',\n'}
          {'  description       '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  date_creation     '}<span className="ty">{'DATE'}</span>{',\n'}
          {'  base_legale       '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  donnees_sensibles '}<span className="ty">{'BOOLEAN DEFAULT'}</span>{' false,\n'}
          {'  categories        '}<span className="ty">{'TEXT[]'}</span>{',\n'}
          {'  personnes         '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  duree_conservation '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  aipd_requise      '}<span className="ty">{'TEXT DEFAULT'}</span>{' '}<span className="st">{"'Non'"}</span>{',\n'}
          {'  transfert_hors_ue '}<span className="ty">{'BOOLEAN DEFAULT'}</span>{' false,\n'}
          {'  sous_traitants    '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  mesures_securite  '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  statut            '}<span className="ty">{'TEXT DEFAULT'}</span>{' '}<span className="st">{"'Actif'"}</span>{'\n'}
          {');\n\n'}
          <span className="kw">{'CREATE TABLE IF NOT EXISTS'}</span>{' audit_log (\n'}
          {'  id             '}<span className="ty">{'UUID DEFAULT'}</span>{' gen_random_uuid() '}<span className="kw">{'PRIMARY KEY'}</span>{',\n'}
          {'  created_at     '}<span className="ty">{'TIMESTAMPTZ DEFAULT'}</span>{' now(),\n'}
          {'  user_email     '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  user_name      '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  action         '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  traitement_nom '}<span className="ty">{'TEXT'}</span>{',\n'}
          {'  details        '}<span className="ty">{'TEXT'}</span>{'\n'}
          {');\n\n'}
          <span className="kw">{'ALTER TABLE'}</span>{' traitements '}<span className="kw">{'ENABLE ROW LEVEL SECURITY'}</span>{';\n'}
          <span className="kw">{'ALTER TABLE'}</span>{' audit_log '}<span className="kw">{'ENABLE ROW LEVEL SECURITY'}</span>{';\n\n'}
          <span className="kw">{'CREATE POLICY'}</span>{' '}<span className="st">{'"authenticated_users"'}</span>{' '}<span className="kw">{'ON'}</span>{' traitements\n'}
          {'  '}<span className="kw">{'FOR ALL USING'}</span>{' (auth.uid() '}<span className="kw">{'IS NOT NULL'}</span>{');\n\n'}
          <span className="kw">{'CREATE POLICY'}</span>{' '}<span className="st">{'"authenticated_users"'}</span>{' '}<span className="kw">{'ON'}</span>{' audit_log\n'}
          {'  '}<span className="kw">{'FOR ALL USING'}</span>{' (auth.uid() '}<span className="kw">{'IS NOT NULL'}</span>{');'}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>netlify.toml</h3>
          <button className="copy-btn" onClick={() => copyEl('tomlBlock')}>📋 Copier</button>
        </div>
        <div className="sql-block" id="tomlBlock">
          <span className="cm">{'# netlify.toml — root of your GitHub repo'}</span>{'\n\n'}
          {'[build]\n'}
          {'  command = '}<span className="st">{'"npm run build"'}</span>{'\n'}
          {'  publish = '}<span className="st">{'"out"'}</span>{'\n\n'}
          {'[[redirects]]\n'}
          {'  from   = '}<span className="st">{'"/*"'}</span>{'\n'}
          {'  to     = '}<span className="st">{'"index.html"'}</span>{'\n'}
          {'  status = 200\n\n'}
          {'[[headers]]\n'}
          {'  for = '}<span className="st">{'"/*"'}</span>{'\n'}
          {'  [headers.values]\n'}
          {'    X-Frame-Options        = '}<span className="st">{'"DENY"'}</span>{'\n'}
          {'    X-Content-Type-Options = '}<span className="st">{'"nosniff"'}</span>{'\n'}
          {'    Referrer-Policy        = '}<span className="st">{'"strict-origin-when-cross-origin"'}</span>
        </div>
        <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: '8px', padding: '14px 16px', fontSize: '12.5px', color: 'var(--blue-dark)', marginTop: '14px' }}>
          🔐 <strong>Workflow Git :</strong> modifiez vos fichiers → <code>git add . &amp;&amp; git commit -m &quot;...&quot; &amp;&amp; git push</code> → Netlify redéploie automatiquement en ~60 secondes.
        </div>
      </div>
    </>
  );
}
