import React, { useState, useEffect } from 'react';
import './annotationlist.css';
import AnnotationEditor from './AnnotationEditor';
import { getAnnotations, createAnnotation, deleteAnnotation } from "../api/feedbackAPi";

const AnnotationList = ({ feedbackId }) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [selectionOffsets, setSelectionOffsets] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (feedbackId) {
      fetchAnnotations();
    }
  }, [feedbackId]);

  const fetchAnnotations = async () => {
    const data = await getAnnotations(feedbackId);
    setAnnotations(data);
  };

  const handleAddAnnotation = async (annotation) => {
    const newAnnotation = await createAnnotation(annotation);
    setAnnotations((prev) => [...prev, newAnnotation]);
  };

  const handleDeleteAnnotation = async (id) => {
    await deleteAnnotation(id);
    setAnnotations((prev) => prev.filter((annotation) => annotation.id !== id));
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selected = selection?.toString().trim();
    if (selected) {
        const range = selection.getRangeAt(0);
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        setSelectedText(selected);
        setSelectionOffsets({
            start: startOffset,
            end: endOffset,
        });
    }
};

  return (
    <div className="annotation-list">
      <h2>Annotations</h2>
      <div
        id="feedback-content"
        className="feedback-content"
        onMouseUp={handleTextSelection}
      >
        {/* Replace with the actual feedback content */}
        This is your feedback text. Select text to add an annotation.
      </div>
      <AnnotationEditor
        feedbackId={feedbackId}
        addAnnotation={handleAddAnnotation}
        selectedText={selectedText}
        selectionOffsets={selectionOffsets}
      />
      <ul>
        {annotations && annotations.length > 0 ? (
          annotations.map((annotation) => (
            <li key={annotation.id}>
              Line {annotation.line_number}: {annotation.comment}{' '}
              <button onClick={() => handleDeleteAnnotation(annotation.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No annotations available</li>
        )}
      </ul>
    </div>
  );
};

export default AnnotationList;
