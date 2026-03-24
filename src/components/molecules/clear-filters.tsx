'use client';

import { X } from 'lucide-react';
import useSearchParams from '@/hooks/use-search-params';

interface Props {
  /** URL param keys that count as active filters */
  filterKeys: string[];
  /** Optional display label overrides: { tab: 'Status', type: 'Type' } */
  labels?: Record<string, string>;
  /** Keys whose default value should NOT count as active (e.g. tab='all') */
  defaultValues?: Record<string, string>;
  className?: string;
}

const ClearFilters = ({ filterKeys, labels, defaultValues = {}, className }: Props) => {
  const { searchParams, clearParams, setParams } = useSearchParams();

  const activeFilters = filterKeys.filter((key) => {
    const value = searchParams.get(key);
    if (!value) return false;
    if (defaultValues[key] !== undefined && value === defaultValues[key]) return false;
    return true;
  });

  if (activeFilters.length === 0) return null;

  const handleClearAll = () => {
    // For keys with a default value, reset to that default instead of deleting
    const toSet = activeFilters
      .filter((k) => defaultValues[k] !== undefined)
      .map((k) => ({ name: k, value: defaultValues[k] }));

    const toDelete = activeFilters.filter((k) => defaultValues[k] === undefined);

    if (toSet.length) setParams(toSet);
    if (toDelete.length) clearParams(toDelete);
  };

  const handleRemoveOne = (key: string) => {
    if (defaultValues[key] !== undefined) {
      setParams([{ name: key, value: defaultValues[key] }]);
    } else {
      clearParams([key]);
    }
  };

  const getLabel = (key: string) => {
    if (labels?.[key]) return labels[key];
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getValueLabel = (key: string) => {
    const value = searchParams.get(key) ?? '';
    // Shorten ISO date strings to dd/MM/yyyy
    if (value.includes('T') && value.includes('-')) {
      try {
        return new Date(value).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch {
        return value;
      }
    }
    return value;
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      {activeFilters.map((key) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        >
          <span className="text-primary/60">{getLabel(key)}:</span>
          {getValueLabel(key)}
          <button
            onClick={() => handleRemoveOne(key)}
            className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
            aria-label={`Remove ${getLabel(key)} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {activeFilters.length > 1 && (
        <button
          onClick={handleClearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="h-3 w-3" />
          Clear all
        </button>
      )}
    </div>
  );
};

export default ClearFilters;
