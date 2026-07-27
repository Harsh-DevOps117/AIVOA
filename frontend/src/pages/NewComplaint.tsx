import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCurrentComplaint, Complaint, processComplaintText, uploadComplaintFile } from '../store/slices/complaintSlice';
import { AppDispatch, RootState } from '../store/store';

const NewComplaint: React.FC = () => {
  const [text, setText] = useState('');
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const previousComplaintRef = useRef<Complaint | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentComplaint, loading } = useSelector((state: RootState) => state.complaints);

  useEffect(() => {
    if (currentComplaint && previousComplaintRef.current && currentComplaint.id === previousComplaintRef.current.id) {
      const changes = new Set<string>();
      Object.keys(currentComplaint).forEach((key) => {
        const field = key as keyof Complaint;
        if (field !== 'id' && field !== 'created_at' && field !== 'status' && currentComplaint[field] !== previousComplaintRef.current![field]) {
          changes.add(key);
        }
      });

      if (changes.size > 0) {
        setChangedFields(changes);
        const timer = setTimeout(() => {
          setChangedFields(new Set());
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
    previousComplaintRef.current = currentComplaint;
  }, [currentComplaint]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      dispatch(uploadComplaintFile({ file: acceptedFiles[0], complaint_id: currentComplaint?.id }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim()) {
      dispatch(processComplaintText({ text, complaint_id: currentComplaint?.id }));
      setText('');
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const handleReset = () => {
    setText('');
    dispatch(clearCurrentComplaint());
  };

  const handleCommit = () => {
    if (currentComplaint) {
      dispatch(clearCurrentComplaint());
      navigate('/dashboard');
    }
  };

  const getValue = (val: any) => {
    if (loading) return "Extracting...";
    return val || "";
  };

  const getFieldClass = (fieldName: string) => {
    const baseClass = "w-full px-3 py-2 border rounded-md text-sm focus:outline-none transition-all duration-700";
    if (changedFields.has(fieldName)) {
      return `${baseClass} bg-[#f0fcf3] border-[#5db872] text-brand-ink shadow-[0_0_12px_rgba(93,184,114,0.3)]`;
    }
    return `${baseClass} bg-brand-canvas border-brand-hairline text-brand-ink`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">

      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-[48px] leading-[1.1] text-brand-ink mb-2 tracking-tight">
              Log Customer Complaint
            </h1>
            <p className="text-[18px] text-brand-body font-medium">
              API & FDF Quality Assurance Module
            </p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm border ${currentComplaint ? 'bg-[#5db872] text-brand-on-primary border-[#5db872]' : 'bg-brand-surface-card text-brand-muted border-brand-hairline'}`}>
            {currentComplaint ? 'Ready to Commit' : 'Pending'}
          </span>
        </div>

        <div className="bg-brand-surface-card rounded-xl p-8 border border-brand-hairline shadow-sm space-y-10">

          <section>
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-5">1. ORIGIN & CUSTOMER DETAILS</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Complaint Source</label>
                <input type="text" readOnly className={getFieldClass('complaint_source')} value={getValue(currentComplaint?.complaint_source)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Customer Name</label>
                <input type="text" readOnly className={getFieldClass('customer_name')} value={getValue(currentComplaint?.customer_name)} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-5">2. PRODUCT & BATCH IDENTIFICATION</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Product Name</label>
                <input type="text" readOnly className={getFieldClass('product_name')} value={getValue(currentComplaint?.product_name)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Product Strength</label>
                <input type="text" readOnly className={getFieldClass('product_strength')} value={getValue(currentComplaint?.product_strength)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Batch / Lot Number</label>
                <input type="text" readOnly className={getFieldClass('batch_number')} value={getValue(currentComplaint?.batch_number)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Affected Quantity</label>
                <input type="text" readOnly className={getFieldClass('affected_quantity')} value={getValue(currentComplaint?.affected_quantity)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Manufacturing Date</label>
                <input type="text" readOnly className={getFieldClass('manufacturing_date')} value={getValue(currentComplaint?.manufacturing_date)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Expiry Date</label>
                <input type="text" readOnly className={getFieldClass('expiry_date')} value={getValue(currentComplaint?.expiry_date)} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-5">3. FACILITY & MATERIAL IMPACT</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Originating Site Block</label>
                <input type="text" readOnly className={getFieldClass('originating_site_block')} value={getValue(currentComplaint?.originating_site_block)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">Impacted Non-Product Materials (NPM)</label>
                <input type="text" readOnly className={getFieldClass('impacted_npm')} value={getValue(currentComplaint?.impacted_npm)} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-5">4. DEFECT ANALYSIS</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-ink mb-2">Complaint Category</label>
              <input type="text" readOnly className={getFieldClass('complaint_category')} value={getValue(currentComplaint?.complaint_category)} />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-brand-ink mb-2">Complaint Description</label>
              <textarea readOnly rows={3} className={`${getFieldClass('issue_description')} resize-none`} value={getValue(currentComplaint?.issue_description)} />
            </div>

            <div className="bg-brand-surface-soft border border-brand-hairline rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h4 className="text-[14px] font-bold text-brand-ink">AIVIO Copilot Risk Assessment</h4>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Severity (Suggested)</label>
                  <input type="text" readOnly className={getFieldClass('severity')} value={getValue(currentComplaint?.severity)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Suggested Next Action</label>
                  <input type="text" readOnly className={getFieldClass('suggested_next_action')} value={getValue(currentComplaint?.suggested_next_action)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Initial Risk Assessment</label>
                <input type="text" readOnly className={getFieldClass('initial_risk_assessment')} value={getValue(currentComplaint?.initial_risk_assessment)} />
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-brand-hairline pt-6">
              <button onClick={handleReset} className="text-sm font-medium text-brand-ink hover:text-brand-primary transition-colors">
                Reset Form
              </button>
              <button
                onClick={handleCommit}
                disabled={!currentComplaint}
                className={`px-8 py-3 rounded-md text-sm font-medium transition-colors shadow-sm ${
                  currentComplaint
                    ? 'bg-brand-primary hover:bg-brand-primary-active text-brand-on-primary'
                    : 'bg-brand-surface-soft text-brand-muted cursor-not-allowed'
                }`}
              >
                Commit to QMS Ledger
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-brand-surface-dark rounded-xl p-6 shadow-xl sticky top-24 border border-brand-surface-dark flex flex-col min-h-[600px]">
        <div className="flex items-center gap-2 mb-8">
          <svg className="w-4 h-4 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <h3 className="text-brand-on-dark font-medium text-sm tracking-wide">AIVIO Assistant</h3>
        </div>

        <div className="bg-brand-surface-dark-elevated rounded-lg p-5 mb-8 border border-[#333]">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center ${
              isDragActive ? 'border-brand-primary bg-[#2a2522]' : 'border-[#444] hover:border-[#666]'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-brand-on-dark-soft mb-1">Drop document</p>
            <p className="text-[10px] text-[#666] tracking-wider uppercase">PDF or TXT</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 mb-8 relative border-l border-[#333] ml-4 pl-6 overflow-y-auto">
           <div className="absolute w-5 h-5 bg-brand-surface-dark-elevated border border-[#444] rounded-full -left-[11px] top-0 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-[#666] rounded-full"></div>
           </div>

           {loading && (
             <div className="absolute w-5 h-5 bg-brand-primary border border-brand-primary rounded-full -left-[11px] top-14 flex items-center justify-center text-brand-on-primary animate-pulse">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             </div>
           )}

           {currentComplaint && !loading && (
             <div className="absolute w-5 h-5 bg-[#5db872] border border-[#5db872] rounded-full -left-[11px] top-14 flex items-center justify-center text-[#181715]">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
             </div>
           )}

           <div className="bg-brand-surface-dark-elevated text-brand-on-dark rounded-xl rounded-tl-none p-4 text-sm font-mono border border-[#333]">
              {loading
                ? <span className="animate-pulse text-brand-on-dark-soft">Processing...</span>
                : currentComplaint
                  ? <span className="text-[#5db872]">Extraction complete.</span>
                  : <span className="text-brand-on-dark-soft text-[13px]">Awaiting input...</span>}
           </div>
        </div>

        <div className="bg-brand-surface-dark-elevated rounded-2xl p-2 border border-[#333] flex items-end focus-within:border-[#555] focus-within:bg-[#2a2825] transition-all shadow-inner mt-auto relative min-h-[52px]">
          <textarea
            placeholder={currentComplaint ? "Type to update..." : "Paste text..."}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-brand-on-dark outline-none placeholder-[#666] resize-none overflow-y-auto w-full mb-0.5"
            rows={1}
            value={text}
            onChange={handleTextareaInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmit();
              }
            }}
          />
          <button
            onClick={(e) => handleTextSubmit(e)}
            disabled={!text.trim() || loading}
            className={`p-2 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ml-2 mb-0.5 ${
              text.trim() && !loading
                ? 'bg-brand-on-dark text-brand-surface-dark hover:scale-105'
                : 'bg-[#333] text-[#666] cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default NewComplaint;
