import React from 'react';
import './EventLogsModal.css';

const EventLogsModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatLogTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const renderLogs = () => {
    if (!event.logs || event.logs.length === 0) {
      return (
        <div className="no-logs">
          <div className="no-logs-icon">📝</div>
          <div className="no-logs-text">No update history yet</div>
        </div>
      );
    }

    // Sort logs by date (newest first)
    const sortedLogs = [...event.logs].sort((a, b) => 
      new Date(b.at) - new Date(a.at)
    );

    return (
      <div className="logs-list">
        {sortedLogs.map((log, index) => (
          <div key={index} className="log-entry">
            <div className="log-header">
              <span className="log-time">
                🕐 {formatLogTime(log.at)}
              </span>
            </div>
            <div className="log-description">
              {log.description || 'Event updated'}
            </div>
            
            {log.changes && log.changes.length > 0 && (
              <div className="log-changes">
                {log.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="change-item">
                    <div className="change-field">{change.field}:</div>
                    <div className="change-values">
                      <span className="old-value">
                        {typeof change.oldValue === 'object' 
                          ? JSON.stringify(change.oldValue) 
                          : String(change.oldValue)
                        }
                      </span>
                      <span className="arrow">→</span>
                      <span className="new-value">
                        {typeof change.newValue === 'object' 
                          ? JSON.stringify(change.newValue) 
                          : String(change.newValue)
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logs-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Event Update History</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {renderLogs()}
        </div>
      </div>
    </div>
  );
};

export default EventLogsModal;