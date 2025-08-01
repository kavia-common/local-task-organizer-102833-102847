import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function TaskForm({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    importance: 'medium',
    timeEstimate: '',
    expiryDate: '',
    attachments: []
  });
  const [newTag, setNewTag] = useState('');
  const [newAttachment, setNewAttachment] = useState({ name: '', url: '', type: 'link' });

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        tags: task.tags || [],
        importance: task.importance || 'medium',
        timeEstimate: task.timeEstimate || '',
        expiryDate: task.expiryDate ? task.expiryDate.split('T')[0] : '',
        attachments: task.attachments || []
      });
    }
  }, [task]);

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      timeEstimate: formData.timeEstimate ? parseInt(formData.timeEstimate) : null,
      expiryDate: formData.expiryDate || null
    };

    onSave(taskData);
  };

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // PUBLIC_INTERFACE
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // PUBLIC_INTERFACE
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // PUBLIC_INTERFACE
  const addAttachment = () => {
    if (newAttachment.name.trim() || newAttachment.url.trim()) {
      const attachment = {
        name: newAttachment.name.trim() || newAttachment.url.trim(),
        url: newAttachment.url.trim(),
        type: newAttachment.type
      };
      
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, attachment]
      }));
      
      setNewAttachment({ name: '', url: '', type: 'link' });
    }
  };

  // PUBLIC_INTERFACE
  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // PUBLIC_INTERFACE
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a data URL for the file (for demo purposes)
      const reader = new FileReader();
      reader.onload = (event) => {
        const attachment = {
          name: file.name,
          url: event.target.result,
          type: file.type.startsWith('image/') ? 'image' : 'file'
        };
        
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachment]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="importance">Importance</label>
              <select
                id="importance"
                value={formData.importance}
                onChange={(e) => handleInputChange('importance', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timeEstimate">Time Estimate (hours)</label>
              <input
                type="number"
                id="timeEstimate"
                value={formData.timeEstimate}
                onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                placeholder="Hours"
                min="0"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Due Date</label>
              <input
                type="date"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <div className="tags-display">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-tag">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag}>Add</button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Attachments</label>
            
            <div className="attachments-section">
              <div className="attachment-inputs">
                <div className="attachment-input-row">
                  <select
                    value={newAttachment.type}
                    onChange={(e) => setNewAttachment(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="link">Link</option>
                    <option value="image">Image URL</option>
                    <option value="file">File</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newAttachment.name}
                    onChange={(e) => setNewAttachment(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={newAttachment.url}
                    onChange={(e) => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                  />
                  <button type="button" onClick={addAttachment}>Add</button>
                </div>
                
                <div className="file-upload">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <span className="file-upload-text">Or upload a file</span>
                </div>
              </div>

              {formData.attachments.length > 0 && (
                <div className="attachments-list">
                  <h4>Current Attachments:</h4>
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <span className="attachment-icon">
                        {attachment.type === 'image' ? '🖼️' : 
                         attachment.type === 'link' ? '🔗' : '📄'}
                      </span>
                      <span className="attachment-name">{attachment.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeAttachment(index)}
                        className="attachment-remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
