'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, color: '#1A1A1A' }}>灵枢</h1>
          <pre style={{ fontSize: 12, color: '#666', marginTop: 16 }}>
            {error.digest ? `Error digest: ${error.digest}` : error.message}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 24,
              padding: '12px 32px',
              background: '#4A7C49',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
