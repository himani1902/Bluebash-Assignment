import React, { Suspense, useState } from 'react';
import Button from './design-system/Button.jsx';
import Card from './design-system/Card.jsx';
import { default as DSHeader } from './design-system/primitives/Header.jsx';
import eventBus from './eventBus.js';

const ChatApp = React.lazy(() => import('chat_app/ChatApp'));
const EmailApp = React.lazy(() => import('email_app/EmailApp'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Could send to monitoring here in real apps
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 12, border: '1px solid #f5c2c7', background: '#f8d7da', color: '#842029', borderRadius: 6 }}>
          <strong>Failed to load micro-app.</strong>
          <div style={{ fontSize: 12, marginTop: 6 }}>Ensure remotes are running and refresh.</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [active, setActive] = useState('chat');

  const sendBroadcast = () => {
    eventBus.emit('broadcast', { from: 'host', timestamp: Date.now() });
  };

  return (
    <div className="container">
      <DSHeader title={<span>Bluebash Micro‑Frontend</span>} right={<Button onClick={sendBroadcast} className="btn">Broadcast Event</Button>} />
      <div className="surface" style={{ padding: 16, marginTop: 16 }}>
        <div className="row">
          <Button variant={active === 'chat' ? 'primary' : 'secondary'} onClick={() => setActive('chat')}>Chat</Button>
          <Button variant={active === 'email' ? 'primary' : 'secondary'} onClick={() => setActive('email')}>Email</Button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Card title="Design System">
            <p className="text-muted">Components are owned by Host and shared to remotes.</p>
          </Card>
        </div>
        <div style={{ marginTop: 16 }}>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading ...</div>}>
              {active === 'chat' ? <ChatApp /> : <EmailApp />}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}


