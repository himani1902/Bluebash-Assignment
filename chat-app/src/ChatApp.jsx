import React, { useEffect, useRef, useState } from 'react';
import { Input, Stack, Badge, Button, Card } from 'host/design-system';
import eventBus from 'host/event-bus';

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Alice', text: 'Hello from Chat micro-app!', ts: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const off = eventBus.on('broadcast', (payload) => {
      setMessages((prev) => prev.concat({ id: Date.now(), author: 'Host', text: `Broadcast @ ${new Date(payload.timestamp).toLocaleTimeString()}`, ts: Date.now() }));
    });
    return off;
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => prev.concat({ id: Date.now(), author: 'You', text: input.trim(), ts: Date.now() }));
    eventBus.emit('chat:new-message', { text: input.trim() });
    setInput('');
    setIsTyping(false);
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(Boolean(e.target.value.trim()));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => setMessages([{ id: Date.now(), author: 'System', text: 'Chat cleared.', ts: Date.now() }]);

  return (
    <div>
      <Stack direction="row" gap={8}>
        <h2 style={{ margin: 0 }}>Chat</h2>
        <Badge>micro-app</Badge>
      </Stack>
      <Card>
        <div ref={listRef} style={{ maxHeight: 260, overflowY: 'auto', paddingRight: 6 }} className="col">
          {messages.map((m) => {
            const isYou = m.author === 'You';
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: isYou ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  background: isYou ? 'linear-gradient(180deg, rgba(79,70,229,.9), rgba(79,70,229,.75))' : 'rgba(255,255,255,.06)',
                  color: isYou ? '#eef2ff' : 'inherit',
                  border: isYou ? '1px solid #4338ca' : '1px solid var(--color-border)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  boxShadow: 'var(--shadow-1)'
                }}>
                  <div style={{ display: 'flex', gap: 8, }}>
                    <strong style={{ opacity: .9 }}>{m.author}</strong>
                    <span className="text-muted" style={{ marginLeft: 'auto', fontSize: 12 }}>
                      {new Date(m.ts).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ marginTop: 4 }}>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <div className="row-lg" style={{ marginTop: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Input value={input} onChange={onInputChange} onKeyDown={onKeyDown} placeholder="Type message and press Enter" />
        </div>
        <Button variant="primary" onClick={send}>Send</Button>
        <Button variant="secondary" onClick={clear}>Clear</Button>
      </div>
      {isTyping && <div className="text-muted" style={{ marginTop: 6, fontSize: 12 }}>Typing…</div>}
    </div>
  );
}


