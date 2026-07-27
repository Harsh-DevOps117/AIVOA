import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/client';

export interface Complaint {
  id: number;
  complaint_source?: string;
  customer_name?: string;
  product_name?: string;
  product_strength?: string;
  batch_number?: string;
  affected_quantity?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  originating_site_block?: string;
  impacted_npm?: string;
  complaint_category?: string;
  issue_description?: string;
  severity?: string;
  suggested_next_action?: string;
  initial_risk_assessment?: string;
  status: string;
  completeness_status?: string;
  missing_info?: string;
  created_at: string;
}

interface ComplaintState {
  complaints: Complaint[];
  currentComplaint: Complaint | null;
  loading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  currentComplaint: null,
  loading: false,
  error: null,
};

export const fetchComplaints = createAsyncThunk(
  'complaints/fetchAll',
  async () => {
    const response = await api.get('/api/complaints/');
    return response.data;
  }
);

export const processComplaintText = createAsyncThunk(
  'complaints/processText',
  async ({ text, complaint_id }: { text: string; complaint_id?: number }) => {
    const response = await api.post('/api/complaints/process', { text, complaint_id });
    return response.data;
  }
);

export const uploadComplaintFile = createAsyncThunk(
  'complaints/uploadFile',
  async ({ file, complaint_id }: { file: File; complaint_id?: number }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (complaint_id) {
      formData.append('complaint_id', complaint_id.toString());
    }
    const response = await api.post('/api/complaints/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const updateComplaint = createAsyncThunk(
  'complaints/update',
  async ({ id, data }: { id: number; data: Partial<Complaint> }) => {
    const response = await api.put(`/api/complaints/${id}`, data);
    return response.data;
  }
);

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearCurrentComplaint: (state) => {
      state.currentComplaint = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch complaints';
      })
      .addCase(processComplaintText.pending, (state) => {
        state.loading = true;
      })
      .addCase(processComplaintText.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComplaint = action.payload;
        const index = state.complaints.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        } else {
          state.complaints.unshift(action.payload);
        }
      })
      .addCase(processComplaintText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process complaint';
      })
      .addCase(uploadComplaintFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadComplaintFile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComplaint = action.payload;
        const index = state.complaints.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        } else {
          state.complaints.unshift(action.payload);
        }
      })
      .addCase(uploadComplaintFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload file';
      });
  },
});

export const { clearCurrentComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;
