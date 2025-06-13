import { useEffect, useState, useRef, useCallback } from 'react';

export function useBlockData({ schema, data, block_id, slug, site_name, setData, onChange, onChangeBlock }) {
  // Helper to normalize values (undefined -> '', useful for consistent comparisons)
  const normalize = useCallback((val) => (val !== undefined && val !== null ? val : ''), []);

  // initialData will hold the data as it was when the component first loaded or after a successful save.
  const [initialData, setInitialData] = useState({});
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [resetButton, setResetButton] = useState(false);

  // A ref to track if initialData has been set for the current block_id,
  // preventing it from being set multiple times on re-renders for the same block.
  const initialDataInitializedRef = useRef(false);
  const currentBlockIdRef = useRef(null); // To track which block_id initialData corresponds to

  // Effect to initialize `initialData` when the component mounts or `block_id` changes.
  useEffect(() => {
    // If block_id changes, reset initialization status
    if (currentBlockIdRef.current !== block_id) {
      initialDataInitializedRef.current = false;
      currentBlockIdRef.current = block_id;
    }

    // Only initialize if not already initialized for this block_id
    if (!initialDataInitializedRef.current) {
      // Wait until all fields in `data` are defined/non-empty before setting initialData.
      // This prevents capturing incomplete data as the "initial" state.
      const allFieldsReady = schema.every(f => {
        const val = data?.[f.key];
        return val !== undefined && val !== null; // Check for null as well
      });

      if (allFieldsReady) {
        const values = {};
        for (const field of schema) {
          values[field.key] = normalize(data[field.key]);
        }
        setInitialData(values);
        initialDataInitializedRef.current = true; // Mark as initialized
      }
    }
  }, [block_id, data, schema, normalize]); // Add normalize and schema to dependencies

  // Function to determine if any data fields have changed from their initial state
  const hasDataChanged = useCallback(() => {
    if (!initialDataInitializedRef.current) return false; // Don't check if initial data isn't set yet

    return schema.some((field) => {
      const current = normalize(data?.[field.key]);
      const initVal = normalize(initialData[field.key]);

      // Optional: console log changes for debugging, but only when actually changed
      if (current !== initVal) {
        // console.log(`[🧨 Изменено поле]: ${field.key}`);
        // console.log('  └ current:', current);
        // console.log('  └ initial:', initVal);
        return true;
      }
      return false;
    });
  }, [data, initialData, schema, normalize]); // Dependencies for useCallback

  // This `showSaveButton` flag now directly reflects `hasDataChanged()`
  const showSaveButton = hasDataChanged();

  const handleFieldChange = useCallback(
    (key, value) => {
      onChange(prev => {
        const updated = { ...prev, [key]: value }
        onChangeBlock?.(block_id, { data: updated })
        return updated
      })
    },
    [onChange, onChangeBlock, block_id]
  )

  const handleSaveData = async (updatedData = data) => {
    try {
      const filtered = {};
      for (const field of schema) {
        filtered[field.key] = updatedData?.[field.key];
      }

      const url = `${import.meta.env.VITE_API_URL}/blocks/update-data/${site_name}/${slug}/${block_id}`;

      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ data: filtered }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      await res.json();

      // On successful save, update initialData to the newly saved state.
      // This will cause `hasDataChanged` to return `false` until new edits are made.
      setInitialData(filtered);
      initialDataInitializedRef.current = true; // Confirm initialized after save

      setShowSavedToast(true);
      setResetButton(true);

      setTimeout(() => {
        setShowSavedToast(false);
        setResetButton(false);
      }, 2000);

      // Propagate the updated data to the global state if `setData` is provided
      if (setData) {
        setData((prev) => {
          const updatedBlocks = { ...prev.blocks };
          const pageBlocks = updatedBlocks[slug]?.map((b) =>
            b.real_id === block_id ? { ...b, data: { ...filtered } } : b
          );
          return {
            ...prev,
            blocks: {
              ...updatedBlocks,
              [slug]: pageBlocks,
            },
          };
        });
      }
    } catch (err) {
      console.error('❌ PATCH упал:', err);
      alert('Ошибка сохранения');
    }
  };

  return {
    handleFieldChange,
    handleSaveData,
    showSavedToast,
    resetButton,
    showSaveButton, // Now directly derived from hasDataChanged
    hasDataChanged, // Still export if parent needs to check directly
  };
}