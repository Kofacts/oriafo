import React, { useState, useRef } from 'react';
import { extractLineItems, emptyItem } from '../lib/api';
import PaperCard from './PaperCard';
import ReviewTable from './ReviewTable';

export default function Finance({ entries, onSaveEntries, onUpdateEntry, onDeleteEntry }) {
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [logFilter, setLogFilter] = useState('all');
  
  const [pending, setPending] = useState({ type: null, items: [] });
  const fileInputRef = useRef(null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleChoosePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedType) return;
    
    setFile(selectedFile);
    
    // Create data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => setDataUrl(event.target.result);
    reader.readAsDataURL(selectedFile);

    setStatus('Reading photo...');
    setIsError(false);

    try {
      const items = await extractLineItems(selectedFile, selectedType);
      
      if (items.length) {
        setStatus(`Found ${items.length} line item${items.length === 1 ? '' : 's'}. Review below before saving.`);
      } else {
        setStatus('No line items found. You can add them manually below.');
      }
      
      setPending({ type: selectedType, items: items.length ? items : [emptyItem()] });
    } catch (err) {
      setIsError(true);
      setStatus(err.message || 'Something went wrong reading this photo.');
      setPending({ type: selectedType, items: [emptyItem()] });
    }
  };

  const handleUpdateField = (id, field, value) => {
    setPending(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleAddRow = () => {
    setPending(prev => ({
      ...prev,
      items: [...prev.items, emptyItem()]
    }));
  };

  const handleDeleteRow = (id) => {
    setPending(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const resetUploadState = () => {
    setPending({ type: null, items: [] });
    setFile(null);
    setDataUrl(null);
    setStatus('');
    setIsError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirm = async () => {
    const validItems = pending.items.filter(i => i.description.trim() && !isNaN(parseFloat(i.amount)) && parseFloat(i.amount) > 0);

    if (!validItems.length) {
      alert('Add at least one line with a description and an amount greater than zero before confirming.');
      return;
    }

    const newEntries = validItems.map(i => ({
      id: i.id,
      type: pending.type,
      date: i.date || '',
      description: i.description.trim(),
      amount: parseFloat(i.amount),
      source: 'photo',
      createdAt: new Date().toISOString()
    }));

    await onSaveEntries(newEntries);
    resetUploadState();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, logFilter]);

  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA !== dateB) {
      return dateB - dateA; // Newest actual date first
    }
    // Fallback to when it was uploaded
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  let filteredEntries = logFilter === 'all' ? sortedEntries : sortedEntries.filter(e => e.type === logFilter);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredEntries = filteredEntries.filter(e => 
      e.description.toLowerCase().includes(q) || 
      e.date.includes(q) || 
      String(e.amount).includes(q)
    );
  }

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE) || 1;
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const uploadHint = selectedType === 'in' 
    ? 'Upload a photo of the transfer receipt'
    : selectedType === 'out'
      ? 'Upload a photo of the expense log'
      : 'Pick Money In or Money Out above, then upload a photo';

  return (
    <section className="tab-panel active">
      <h1 className="page-title">Finance</h1>
      <p className="page-sub">Upload a photo, mark whether it's money in or money out, then review before saving.</p>

      <div className="toggle-group" id="type-toggle">
        <button 
          className={`toggle-btn ${selectedType === 'in' ? 'selected' : ''}`} 
          data-type="in"
          onClick={() => handleTypeSelect('in')}
        >
          <span className="dot"></span>Money In
        </button>
        <button 
          className={`toggle-btn ${selectedType === 'out' ? 'selected' : ''}`} 
          data-type="out"
          onClick={() => handleTypeSelect('out')}
        >
          <span className="dot"></span>Money Out
        </button>
      </div>

      <div className={`upload-box ${file ? 'has-image' : ''}`}>
        <p>{uploadHint}</p>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          disabled={!selectedType}
          onChange={handleFileChange}
        />
        <button 
          className="btn btn-primary" 
          disabled={!selectedType}
          onClick={handleChoosePhoto}
        >
          Choose photo
        </button>
        
        {dataUrl && (
          <div id="preview-area-finance">
            <img className="preview-img" src={dataUrl} alt="Uploaded photo preview" />
            <div className={`status-line ${isError ? 'error' : ''}`}>{status}</div>
          </div>
        )}
      </div>

      <ReviewTable 
        pending={pending}
        onUpdateField={handleUpdateField}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onConfirm={handleConfirm}
        onCancel={resetUploadState}
      />

      <div className="log-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
        <div>Confirmed activity</div>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search entries..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 0, width: '220px', padding: '6px 12px' }}
        />
      </div>
      <div className="log-filter">
        <button 
          className={`filter-pill ${logFilter === 'all' ? 'selected' : ''}`} 
          onClick={() => setLogFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-pill ${logFilter === 'in' ? 'selected' : ''}`} 
          onClick={() => setLogFilter('in')}
        >
          In
        </button>
        <button 
          className={`filter-pill ${logFilter === 'out' ? 'selected' : ''}`} 
          onClick={() => setLogFilter('out')}
        >
          Out
        </button>
      </div>
      <div className="log-list">
        {paginatedEntries.length > 0 ? (
          paginatedEntries.map(entry => (
            <PaperCard key={entry.id} entry={entry} onUpdate={onUpdateEntry} onDelete={onDeleteEntry} />
          ))
        ) : (
          <div className="empty-state">Nothing logged here yet.</div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
          <button 
            className="btn btn-ghost" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn btn-ghost" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
