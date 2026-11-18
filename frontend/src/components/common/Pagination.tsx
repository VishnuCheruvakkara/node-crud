import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const pages = Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-100">
      {/* Information text & Per-page selector */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-semibold text-primary">{startItem}</span> to{' '}
          <span className="font-semibold text-primary">{endItem}</span> of{' '}
          <span className="font-semibold text-primary">{totalItems}</span> users
        </p>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <label htmlFor="per-page-select">Per page:</label>
            <select
              id="per-page-select"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-secondary bg-white focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        )}
      </div>

      {/* Page controls */}
      <div className="inline-flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-gray-200 text-secondary hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous Page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-secondary hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-gray-200 text-secondary hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next Page"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
