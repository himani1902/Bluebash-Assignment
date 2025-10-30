import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Badge, Button, Card, Input } from 'host/design-system';
import eventBus from 'host/event-bus';

export default function EmailApp() {
  const [emails, setEmails] = useState([
    { id: 1, from: 'hr@bluebash.com', subject: 'Welcome to the assignment!', read: false }
  ]);
  const [filter, setFilter] = useState('all');
  const [compose, setCompose] = useState({ to: '', subject: '' });
  const [toError, setToError] = useState('');
  const [lastChat, setLastChat] = useState(null);

  useEffect(() => {
    const off = eventBus.on('chat:new-message', ({ text }) => {
      setLastChat(text);
    });
    return off;
  }, []);

  const isValidEmail = (value) => /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(value);

  const addEmail = () => {
    if (!compose.to.trim() || !isValidEmail(compose.to)) {
      setToError('Please enter a valid email address.');
      return;
    }
    setEmails((prev) => prev.concat({ id: Date.now(), from: compose.to.trim(), subject: compose.subject || 'New system notification', read: false }));
    setCompose({ to: '', subject: '' });
    setToError('');
  };

  const toggleRead = (id) => {
    setEmails((prev) => prev.map(e => e.id === id ? { ...e, read: !e.read } : e));
  };

  const unreadCount = useMemo(() => emails.filter(e => !e.read).length, [emails]);
  const filtered = useMemo(() => filter === 'unread' ? emails.filter(e => !e.read) : emails, [emails, filter]);

  return (
    <div>
      <Stack direction="row" gap={8}>
        <h2 style={{ margin: 0 }}>Email</h2>
        <Badge>micro-app</Badge>
        <Badge>Unread: {unreadCount}</Badge>
      </Stack>
      <div className="row" style={{ marginTop: 8 }}>
        <Button variant={filter==='unread' ? 'primary' : 'secondary'} onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}>
          {filter === 'unread' ? 'Show All' : 'Show Unread'}
        </Button>
      </div>
      <Card title="Inbox">
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
          {filtered.map((e) => {
            const dot = <span style={{ width: 8, height: 8, borderRadius: 999, background: e.read ? '#475569' : '#22c55e', display: 'inline-block' }} />;
            const avatar = (
              <div style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,.08)', display: 'grid', placeItems: 'center', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12 }}>{(e.from || '?').slice(0,1).toUpperCase()}</span>
              </div>
            );
            return (
              <li key={e.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderBottom: '1px solid var(--color-border)',
                background: e.read ? 'transparent' : 'rgba(34,197,94,.06)'
              }}>
                {avatar}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <strong style={{ whiteSpace: 'nowrap' }}>{e.from}</strong>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.read ? e.subject : <strong>{e.subject}</strong>}
                    </span>
                    <span style={{ marginLeft: 'auto' }}>
                      {dot}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => toggleRead(e.id)}>
                  {e.read ? 'Mark Unread' : 'Mark Read'}
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card title="Compose" style={{ marginTop: 12 }}>
        <div className="row-lg" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Input
              placeholder="To"
              value={compose.to}
              onChange={(e) => {
                const v = e.target.value;
                setCompose({ ...compose, to: v });
                setToError(v && !isValidEmail(v) ? 'Enter a valid email (e.g. user@domain.com).' : '');
              }}
              style={{ height: 40, ...(toError ? { borderColor: '#ef4444' } : null) }}
            />
            <div style={{ minHeight: 16, color: '#fca5a5', fontSize: 12, marginTop: 4 }}>
              {toError || ''}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Input
              placeholder="Subject"
              value={compose.subject}
              onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
              style={{ height: 40 }}
            />
            <div style={{ minHeight: 16 }} />
          </div>
          <Button variant="primary" onClick={addEmail} disabled={!compose.to.trim() || !!toError}>Send</Button>
        </div>
      </Card>
      {lastChat && (
        <p className="text-muted" style={{ marginTop: 12 }}>Last chat message: <em>{lastChat}</em></p>
      )}
    </div>
  );
}


