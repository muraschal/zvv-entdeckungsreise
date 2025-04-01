export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <div className="cmp-page">
          <div className="cmp-page__content">
            <main className="cmp-page__main">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
} 