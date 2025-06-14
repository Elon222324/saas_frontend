import { useEffect, useState, useRef, useCallback } from 'react';

export function useBlockData({ schema, data, block_id, slug, site_name, setData, onChange, onChangeBlock }) {
  const normalize = useCallback((val) => (val !== undefined && val !== null ? val : ''), []);

  const [initialData, setInitialData] = useState({});
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [resetButton, setResetButton] = useState(false);

  const initialDataInitializedRef = useRef(false);
  const currentBlockIdRef = useRef(null);

  useEffect(() => {
    if (currentBlockIdRef.current !== block_id) {
      initialDataInitializedRef.current = false;
      currentBlockIdRef.current = block_id;
    }

    if (!initialDataInitializedRef.current) {
      const allFieldsReady = schema.every(f => {
        const val = data?.[f.key];
        return val !== undefined && val !== null;
      });

      if (allFieldsReady) {
        const values = {};
        for (const field of schema) {
          values[field.key] = normalize(data[field.key]);
        }

        console.log('[📦 useBlockData] initialData set:', values)
        setInitialData(values);
        initialDataInitializedRef.current = true;
      }
    }
  }, [block_id, data, schema, normalize]);

  const hasDataChanged = useCallback(() => {
    if (!initialDataInitializedRef.current) return false;

    return schema.some((field) => {
      const current = normalize(data?.[field.key]);
      const initVal = normalize(initialData[field.key]);

      if (current !== initVal) {
        console.log(`[🧨 Изменено поле]: ${field.key}`);
        console.log('  └ current:', current);
        console.log('  └ initial:', initVal);
        return true;
      }
      return false;
    });
  }, [data, initialData, schema, normalize]);

  const showSaveButton = hasDataChanged();

  const handleFieldChange = useCallback((key, value) => {
    onChange((prev) => {
      const updated = { ...prev, [key]: value };

      if (onChangeBlock) {
        const diff = {};
        for (const field of schema) {
          const current = normalize(updated[field.key]);
          const initial = normalize(initialData[field.key]);
          if (current !== initial) {
            diff[field.key] = current;
          }
        }

        if (Object.keys(diff).length > 0) {
          onChangeBlock(block_id, { data: diff });
        }
      }

      return updated;
    });
  }, [onChange, onChangeBlock, block_id, initialData, schema, normalize]);

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

      setInitialData(filtered);
      initialDataInitializedRef.current = true;

      setShowSavedToast(true);
      setResetButton(true);

      setTimeout(() => {
        setShowSavedToast(false);
        setResetButton(false);
      }, 2000);

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
    showSaveButton,
    hasDataChanged,
  };
}
