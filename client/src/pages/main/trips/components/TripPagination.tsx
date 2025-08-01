interface TripPaginationProps {
  page: number
  setPage: (p: number) => void
  totalPages: number
}

export default function TripPagination({ page, setPage, totalPages }: TripPaginationProps) {
  if (totalPages <= 1) return null
  
  const maxVisiblePages = 5 // Show maximum 5 page buttons
  
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  return (
    <div className="flex justify-center items-center gap-1 my-8">
      <button 
        onClick={() => setPage(Math.max(1, page-1))} 
        disabled={page === 1}
        className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-100"
      >
        &lt;
      </button>
      
      {startPage > 1 && (
        <>
          <button 
            onClick={() => setPage(1)}
            className={`w-10 h-10 rounded-full ${page === 1 ? 'bg-cyan-500 text-white' : 'hover:bg-gray-100'}`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {Array.from({length: endPage - startPage + 1}, (_, i) => (
        <button 
          key={startPage + i}
          onClick={() => setPage(startPage + i)}
          className={`w-10 h-10 rounded-full ${page === startPage + i ? 'bg-cyan-500 text-white' : 'hover:bg-gray-100'}`}
        >
          {startPage + i}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button 
            onClick={() => setPage(totalPages)}
            className={`w-10 h-10 rounded-full ${page === totalPages ? 'bg-cyan-500 text-white' : 'hover:bg-gray-100'}`}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        onClick={() => setPage(Math.min(totalPages, page+1))} 
        disabled={page === totalPages}
        className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-100"
      >
        &gt;
      </button>
    </div>
  )
}