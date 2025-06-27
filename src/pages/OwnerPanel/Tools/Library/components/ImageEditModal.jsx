// src/pages/OwnerPanel/Tools/Library/components/ImageEditModal.jsx

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
// Предполагается, что вы добавите updateImage в ваш хук
// import { useLibraryCrud } from '../../../hooks/useLibraryCrud';

export default function ImageEditModal({ isOpen, onClose, imageToEdit }) {
  // const { updateImage } = useLibraryCrud(); // Раскомментировать
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (imageToEdit) {
      setAltText(imageToEdit.alt_text || '');
      setDescription(imageToEdit.description || '');
    }
  }, [imageToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageToEdit) return;

    const payload = {
      alt_text: altText,
      description: description,
    };
    
    console.log("Updating image with payload:", { id: imageToEdit.id, ...payload });
    // await updateImage.mutateAsync({ id: imageToEdit.id, ...payload }); // Раскомментировать
    onClose();
  };

  if (!imageToEdit) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Редактировать детали изображения">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-2 border rounded-md bg-gray-50">
          <img src={imageToEdit.medium_url || imageToEdit.url} alt={imageToEdit.alt_text} className="object-contain w-full rounded-md max-h-60" />
          <p className="mt-2 text-xs text-center text-gray-500 truncate">{imageToEdit.filename}</p>
        </div>
        <div>
          <label htmlFor="img-alt-edit" className="block text-sm font-medium text-gray-700">Alt текст (для SEO)</label>
          <input id="img-alt-edit" type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="img-desc-edit" className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea id="img-desc-edit" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
        </div>
        <div className="flex justify-end pt-4 space-x-3 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
            Отмена
          </button>
          <button type="submit" /* disabled={updateImage.isLoading} */ className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 disabled:opacity-50">
            Сохранить
          </button>
        </div>
      </form>
    </BaseModal>
  );
}