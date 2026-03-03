'use client';

export default function Toast({ msg, type, show }) {
  return (
    <div className={`toast ${type || ''} ${show ? 'show' : ''}`.trim()}>
      {msg}
    </div>
  );
}
