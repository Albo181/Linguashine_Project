import React, { useState, useEffect } from "react";
import "./annotationlist.css";
import AnnotationEditor from "./AnnotationEditor";
import { getAnnotations, createAnnotation, deleteAnnotation } from "../api/feedbackAPi";

const AnnotationList = ({ feedbackId }) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [selectionOffsets, setSelectionOffsets] = useState({ start: 0, end: 0 });
  const [feedbackText, setFeedbackText] = useState("This is your feedback text."); // Example feedback text

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
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const container = document.getElementById("feedback-content");

    if (!container.contains(range.commonAncestorContainer)) {
      return; // Selection is outside feedback content
    }

    const selected = selection.toString().trim();
    if (selected) {
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;

      setSelectedText(selected);
      setSelectionOffsets({
        start: Math.min(startOffset, endOffset),
        end: Math.max(startOffset, endOffset),
      });
    }
  };

  const highlightAnnotations = (text, annotations) => {
    const parts = [];
    let lastIndex = 0;

    annotations.forEach(({ start_offset, end_offset, comment }) => {
      // Text before the annotation
      if (start_offset > lastIndex) {
        parts.push(text.slice(lastIndex, start_offset));
      }
      // Highlighted annotation
      parts.push(
        <span key={start_offset} className="highlight" title={comment}>
          {text.slice(start_offset, end_offset)}
        </span>
      );
      lastIndex = end_offset;
    });

    // Remaining text after the last annotation
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="annotation-list">
      <h2>Annotations</h2>
      <div
        id="feedback-content"
        className="feedback-content"
        onMouseUp={handleTextSelection}
      >
        {highlightAnnotations(feedbackText, annotations)}
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
              Line {annotation.line_number}: {annotation.comment}{" "}
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
