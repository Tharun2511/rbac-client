export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Internal Workflow Platform</h1>
      {children}
    </main>
  );
}
