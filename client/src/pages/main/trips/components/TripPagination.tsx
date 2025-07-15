interface TripPaginationProps {
  page: number
  setPage: (p: number) => void
  totalPages: number
}

const pageBtnStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#222',
  fontSize: 18,
  borderRadius: 6,
  padding: '6px 12px',
  cursor: 'pointer',
  minWidth: 36,
  transition: 'background 0.2s',
  outline: 'none',
  margin: 0,
  opacity: 1,
  fontWeight: 500,
}

export default function TripPagination({ page, setPage, totalPages }: TripPaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
      <button onClick={() => setPage(Math.max(1, page-1))} disabled={page === 1} style={pageBtnStyle}>&lt;</button>
      {Array.from({length: totalPages}, (_, i) => (
        <button key={i+1} onClick={() => setPage(i+1)} style={{ ...pageBtnStyle, fontWeight: page === i+1 ? 700 : 400, background: page === i+1 ? '#F3F4F6' : 'transparent' }}>{i+1}</button>
      ))}
      <button onClick={() => setPage(Math.min(totalPages, page+1))} disabled={page === totalPages} style={pageBtnStyle}>&gt;</button>
    </div>
  )
} 