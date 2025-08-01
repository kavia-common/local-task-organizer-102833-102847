import React, { useState } from 'react';

// PUBLIC_INTERFACE
function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [showAttachments, setShowAttachments] = useState(false);

  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // PUBLIC_INTERFACE
  const isOverdue = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // PUBLIC_INTERFACE
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'high': return 'importance-high';
      case 'medium': return 'importance-medium';
      case 'low': return 'importance-low';
      default: return '';
    }
  };

  // PUBLIC_INTERFACE
  const handleAttachmentClick = (attachment) => {
    if (attachment.type === 'link' || attachment.type === 'url') {
      window.open(attachment.url, '_blank');
    } else if (attachment.type === 'file' && attachment.url) {
      // For file attachments, attempt to open or download
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name || 'attachment';
      link.click();
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task.expiryDate) ? 'overdue' : ''}`}>
      <div className="task-main">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="checkbox"
          />
        </div>
        
        <div className="task-content">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            {task.importance && (
              <span className={`importance-badge ${getImportanceClass(task.importance)}`}>
                {task.importance}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
            
            <div className="task-details">
              {task.timeEstimate && (
                <span className="time-estimate">⏱️ {task.timeEstimate}h</span>
              )}
              {task.expiryDate && (
                <span className={`due-date ${isOverdue(task.expiryDate) ? 'overdue-text' : ''}`}>
                  📅 {formatDate(task.expiryDate)}
                </span>
              )}
              {task.attachments && task.attachments.length > 0 && (
                <button 
                  className="attachments-toggle"
                  onClick={() => setShowAttachments(!showAttachments)}
                >
                  📎 {task.attachments.length} attachment{task.attachments.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
          
          {showAttachments && task.attachments && task.attachments.length > 0 && (
            <div className="attachments-list">
              {task.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <button
                    className="attachment-link"
                    onClick={() => handleAttachmentClick(attachment)}
                  >
                    <span className="attachment-icon">
                      {attachment.type === 'image' ? '🖼️' : 
                       attachment.type === 'link' ? '🔗' : '📄'}
                    </span>
                    <span className="attachment-name">
                      {attachment.name || attachment.url}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="task-actions">
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
