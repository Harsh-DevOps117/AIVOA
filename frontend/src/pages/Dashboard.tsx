import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchComplaints, Complaint } from '../store/slices/complaintSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, loading } = useSelector((state: RootState) => state.complaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const criticalComplaints = complaints.filter(c => c.severity?.toLowerCase() === 'critical').length;
  const closedComplaints = complaints.filter(c => c.status?.toLowerCase() === 'closed').length;

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 font-sans">
      
      <div className="max-w-2xl">
        <h1 className="font-display text-[48px] leading-[1.1] text-brand-ink mb-4 tracking-tight">
          QMS Overview
        </h1>
        <p className="text-[18px] leading-[1.5] text-brand-body font-medium">
          Monitor your organization's pharmaceutical quality signals. All metrics are processed and classified by AIVIO Copilot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-surface-dark p-8 rounded-xl shadow-sm border border-brand-surface-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <h3 className="text-sm font-medium text-brand-on-dark-soft uppercase tracking-wider">Total Complaints</h3>
            </div>
            <h2 className="font-display text-[64px] leading-none text-brand-on-dark mb-2">
              {complaints.length}
            </h2>
          </div>
          <p className="text-sm text-brand-on-dark-soft">Active in the current reporting period</p>
        </div>
        
        <div className="bg-brand-surface-card p-8 rounded-xl shadow-sm border border-brand-hairline flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-brand-muted uppercase tracking-wider mb-4">Critical Risk</h3>
            <h2 className="font-display text-[64px] leading-none text-brand-ink mb-2">
              {criticalComplaints}
            </h2>
          </div>
          <p className="text-sm text-brand-muted">Requires immediate CAPA response</p>
        </div>

        <div className="bg-brand-surface-card p-8 rounded-xl shadow-sm border border-brand-hairline flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-brand-muted uppercase tracking-wider mb-4">Resolved</h3>
            <h2 className="font-display text-[64px] leading-none text-brand-ink mb-2">
              {closedComplaints}
            </h2>
          </div>
          <p className="text-sm text-brand-muted">Successfully investigated and closed</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-6 border-b border-brand-hairline pb-4">
          <h2 className="font-display text-2xl text-brand-ink">Recent Signals</h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-brand-ink hover:text-brand-primary transition-colors cursor-pointer"
          >
            {showAll ? 'Show Recent Only' : 'View All Reports →'}
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-brand-muted font-mono text-sm animate-pulse">
            Fetching ledger...
          </div>
        ) : (
          <div className="overflow-x-auto bg-brand-canvas">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-hairline">
                  <th className="px-4 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Complaint ID</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Product & Batch</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Issue Type</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">AI Severity</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-hairline-soft">
                {(showAll ? complaints : complaints.slice(0, 5)).map((complaint) => (
                  <tr 
                    key={complaint.id} 
                    onClick={() => setSelectedComplaint(complaint)}
                    className="hover:bg-brand-surface-soft transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-5">
                      <span className="font-mono text-sm text-brand-ink">#CM-{1000 + complaint.id}</span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="text-sm font-medium text-brand-ink">{complaint.product_name || 'N/A'}</div>
                      <div className="text-xs text-brand-muted mt-1">{complaint.batch_number || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-sm text-brand-ink">{complaint.complaint_category || 'Uncategorized'}</span>
                    </td>
                    <td className="px-4 py-5">
                      {complaint.severity?.toLowerCase() === 'critical' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-primary text-brand-on-primary tracking-wide">
                          CRITICAL
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-surface-card border border-brand-hairline text-brand-ink tracking-wide">
                          {complaint.severity?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-5 text-sm text-brand-muted">
                      {new Date(complaint.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-brand-muted text-sm border-b border-brand-hairline">
                      No quality signals have been recorded yet. 
                      <br/>Head over to "Log Complaint" to parse your first document.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-brand-surface-card border border-brand-hairline rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="absolute top-6 right-6 text-brand-muted hover:text-brand-ink transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-surface-soft border border-brand-hairline text-brand-ink mb-4">
                  #CM-{1000 + selectedComplaint.id}
                </span>
                <h2 className="font-display text-4xl text-brand-ink tracking-tight mb-2">Complaint Summary</h2>
                <p className="text-brand-body text-sm font-medium">Logged on {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8 pb-8 border-b border-brand-hairline">
                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Customer & Origin</h4>
                    <p className="text-brand-ink text-sm font-medium">{selectedComplaint.customer_name || 'N/A'} • {selectedComplaint.complaint_source || 'Unknown Source'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Product Affected</h4>
                    <p className="text-brand-ink text-sm font-medium">{selectedComplaint.product_name || 'N/A'} ({selectedComplaint.product_strength || 'N/A'})</p>
                    <p className="text-brand-muted text-xs mt-1">Batch: {selectedComplaint.batch_number || 'N/A'}</p>
                  </div>
                </div>

                <div className="pb-8 border-b border-brand-hairline">
                  <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">Issue Description</h4>
                  <p className="text-brand-ink text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedComplaint.issue_description || 'No description provided.'}
                  </p>
                </div>

                <div className="bg-brand-surface-soft border border-brand-hairline rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <h4 className="text-sm font-bold text-brand-ink">AIVIO Copilot Assessment</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">Severity</h5>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${selectedComplaint.severity?.toLowerCase() === 'critical' ? 'bg-brand-primary text-brand-on-primary' : 'bg-brand-canvas border border-brand-hairline text-brand-ink'}`}>
                        {selectedComplaint.severity?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">Suggested Action</h5>
                      <p className="text-brand-ink text-sm font-medium">{selectedComplaint.suggested_next_action || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">Initial Risk Assessment</h5>
                    <p className="text-brand-ink text-sm leading-relaxed">{selectedComplaint.initial_risk_assessment || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
