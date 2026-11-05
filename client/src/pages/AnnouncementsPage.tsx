import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Pin,
  Calendar,
  User,
  X,
  Tag,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Announcement } from '../types';
import { dataService } from '../services/dataService';
import { generateAnnouncementDraft } from '../services/aiService';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    dataService.getAnnouncements()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // AI Draft State
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [showAiDraftBox, setShowAiDraftBox] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General' as Announcement['category'],
    targetAudience: 'All' as Announcement['targetAudience'],
    author: 'Pelagia Svare (Head Admin)',
    isPinned: false,
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addAnnouncement(formData);
    setAnnouncements(dataService.getAnnouncements());
    setIsModalOpen(false);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      targetAudience: 'All',
      author: 'Pelagia Svare (Head Admin)',
      isPinned: false,
    });
    setAiPromptTopic('');
    setShowAiDraftBox(false);
  };

  const handleGenerateAiDraft = async () => {
    if (!aiPromptTopic.trim()) return;
    setIsGeneratingDraft(true);
    try {
      const draft = await generateAnnouncementDraft(
        aiPromptTopic,
        formData.targetAudience,
        formData.category
      );
      setFormData((prev) => ({
        ...prev,
        title: draft.title,
        content: draft.content,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Notice Board</h1>
          <p className="page-subtitle">
            Publish academic bulletins, exam schedules, sports updates, and administrative memos
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Announcement
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'Academic', 'Sports', 'Finance', 'General', 'Urgent'].map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat} Notices
          </button>
        ))}
      </div>

      {/* Notices Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredAnnouncements.map((anc) => (
          <div
            key={anc.id}
            className="glass-panel"
            style={{
              position: 'relative',
              borderLeft: anc.isPinned ? '4px solid #f59e0b' : '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  className={`badge ${
                    anc.category === 'Academic'
                      ? 'badge-info'
                      : anc.category === 'Sports'
                      ? 'badge-success'
                      : anc.category === 'Finance'
                      ? 'badge-warning'
                      : 'badge-danger'
                  }`}
                >
                  {anc.category}
                </span>

                <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                  Audience: {anc.targetAudience}
                </span>

                {anc.isPinned && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                    <Pin size={13} /> Pinned
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>Published: {anc.publishedDate}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>{anc.title}</h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {anc.content}
            </p>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <User size={13} />
              <span>Posted by <strong>{anc.author}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Post Announcement</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePost}>
              <div className="modal-body">
                {/* AI Announcement Assistant Card */}
                <div style={{ background: '#f0f5fa', border: '1px solid #c3d7e8', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#496d8f' }}>
                      <Sparkles size={14} style={{ color: '#6c95bc' }} /> PedoZim AI Notice Drafter
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                      onClick={() => setShowAiDraftBox(!showAiDraftBox)}
                    >
                      {showAiDraftBox ? 'Hide AI Drafter' : '✨ Draft with AI'}
                    </button>
                  </div>

                  {showAiDraftBox && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Enter a short topic, and Gemini AI will draft the announcement headline & WhatsApp notice:
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ fontSize: '12px' }}
                          placeholder="e.g., Interhouse sports day on Friday, all house colors required"
                          value={aiPromptTopic}
                          onChange={(e) => setAiPromptTopic(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={isGeneratingDraft || !aiPromptTopic.trim()}
                          onClick={handleGenerateAiDraft}
                          style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {isGeneratingDraft ? <Loader2 size={12} className="spin-animate" /> : <Sparkles size={12} />}
                          {isGeneratingDraft ? 'Drafting...' : 'Generate'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Announcement Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. End of Term Exam Timetable"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    >
                      <option value="General">General</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Finance">Finance</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select
                      className="form-select"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    >
                      <option value="All">All School Community</option>
                      <option value="Teachers">Teachers Only</option>
                      <option value="Parents">Parents Only</option>
                      <option value="Students">Students Only</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Announcement Body *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    required
                    placeholder="Provide detailed information regarding the announcement..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="checkbox"
                    id="pinToggle"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  />
                  <label htmlFor="pinToggle" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                    Pin this announcement to top of notice board
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
