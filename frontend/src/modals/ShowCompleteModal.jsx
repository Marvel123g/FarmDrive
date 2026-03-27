import React, { useState, useRef } from 'react';
import socket from '../components/Socket';

export default function ShowCompleteModal({ deliveryId, onClose, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const MAX_PICTURES = 2;
  const MIN_PICTURES = 1;
const [pictures, setPictures] = useState([]);
const [picturePreviews, setPicturePreviews] = useState([]);

const handlePictureUpload = (e) => {
  const files = Array.from(e.target.files);
  setUploadError('');

  // Check total pictures limit
  if (pictures.length + files.length > MAX_PICTURES) {
    setUploadError(`You can only upload up to ${MAX_PICTURES} pictures. You already have ${pictures.length}.`);
    return;
  }

  // Validate each file
  const validFiles = [];
  const invalidFiles = [];

  if (invalidFiles.length > 0) {
    setUploadError(invalidFiles.join(', '));
  }

  if (validFiles.length > 0) {
    // Create preview URLs for valid files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setPictures(prev => [...prev, ...validFiles]);
    setPicturePreviews(prev => [...prev, ...newPreviews]);
  }

  // Reset file input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

const removePicture = (index) => {
  // Revoke the preview URL to avoid memory leaks
  URL.revokeObjectURL(picturePreviews[index]);
  
  setPictures(prev => prev.filter((_, i) => i !== index));
  setPicturePreviews(prev => prev.filter((_, i) => i !== index));
  setUploadError('');
};

const handleComplete = async () => {
  // Validate minimum pictures
  if (pictures.length < MIN_PICTURES) {
    setUploadError(`Please upload at least ${MIN_PICTURES} picture(s) as proof of delivery`);
    return;
  }
  setIsSubmitting(true);
  setUploadError('');

  try {
    const formData = new FormData();
  
    pictures.forEach((picture) => {
      formData.append('pictures', picture);
    });

    const response = await fetch(`/api/v1/transit/complete`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
  } catch (error) {
    console.error('Error completing delivery:', error);
    setUploadError('An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    picturePreviews.forEach(preview => URL.revokeObjectURL(preview));
  };
}, []);

// In your JSX:

  return (
    <div className="complete-modal-overlay" onClick={onClose}>
      <div className="complete-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="success-icon">✅</div>
          <h2>Complete Delivery</h2>
          <p>Confirm that you've successfully delivered the produce</p>
        </div>

        <div className="modal-content">
          {/* Picture Upload Section */}
          <div className="picture-section">
            <label className="picture-label">
              Proof of Delivery <span className="required">*</span>
            </label>
            <div className="picture-requirements">
              <span>📸 Upload {MIN_PICTURES}-{MAX_PICTURES} pictures</span>
              <span>• Max 5MB each</span>
              <span>• JPG, PNG, GIF accepted</span>
            </div>
            
            <div className="picture-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePictureUpload}
                className="picture-input"
                id="picture-upload"
                disabled={pictures.length >= MAX_PICTURES}
              />
              <label 
                htmlFor="picture-upload" 
                className={`upload-label ${pictures.length >= MAX_PICTURES ? 'disabled' : ''}`}
              >
                <span className="upload-icon">📷</span>
                <span>Upload Pictures</span>
                <span className="upload-count">{pictures.length}/{MAX_PICTURES}</span>
              </label>
            </div>

            {uploadError && (
              <div className="upload-error">
                <span>⚠️</span>
                <span>{uploadError}</span>
              </div>
            )}

            {/* Picture Preview Grid */}
            {pictures.length > 0 && (
              <div className="picture-preview-grid">
                {pictures.map((picture, index) => (
                  <div key={index} className="picture-preview-item">
                    <img 
                      src={picture.preview} 
                      alt={`Delivery proof ${index + 1}`}
                      className="preview-image"
                    />
                    <button 
                      className="remove-picture-btn"
                      onClick={() => removePicture(index)}
                      type="button"
                    >
                      ×
                    </button>
                    <div className="picture-number">{index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}