import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CheckInFormData, CheckInResponse } from '../types/CheckIn';
import { mapCheckInToSupabase, mapSupabaseToCheckIn } from '../utils/supabase-utils';

interface CheckInState {
  checkIns: CheckInResponse[];
  loading: boolean;
  error: string | null;
  fetchCheckIns: () => Promise<void>;
  addCheckIn: (checkIn: CheckInFormData) => Promise<void>;
  verifyCheckIn: (id: string) => Promise<void>;
  flagCheckIn: (id: string) => Promise<void>;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  checkIns: [],
  loading: false,
  error: null,

  fetchCheckIns: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const mappedData = data?.map(mapSupabaseToCheckIn) || [];
      set({ checkIns: mappedData });
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      set({ error: 'Failed to fetch check-ins' });
    } finally {
      set({ loading: false });
    }
  },

  addCheckIn: async (checkIn) => {
    set({ loading: true, error: null });
    try {
      const mappedData = mapCheckInToSupabase(checkIn);
      const { error } = await supabase
        .from('check_ins')
        .insert([mappedData]);

      if (error) throw error;
      await get().fetchCheckIns();
    } catch (error) {
      console.error('Error in addCheckIn:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyCheckIn: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('check_ins')
        .update({ verified: true, flagged: false })
        .eq('id', id);

      if (error) throw error;
      await get().fetchCheckIns();
    } catch (error) {
      console.error('Error in verifyCheckIn:', error);
      set({ error: 'Failed to verify check-in' });
    } finally {
      set({ loading: false });
    }
  },

  flagCheckIn: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('check_ins')
        .update({ verified: false, flagged: true })
        .eq('id', id);

      if (error) throw error;
      await get().fetchCheckIns();
    } catch (error) {
      console.error('Error in flagCheckIn:', error);
      set({ error: 'Failed to flag check-in' });
    } finally {
      set({ loading: false });
    }
  },
}));