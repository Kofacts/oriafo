import { supabase } from './supabase';

const TABLE_MAP = {
  'oriafo_ops_finance': 'finance_logs',
  'oriafo_ops_entries': 'finance_logs', 
  'oriafo_ops_production': 'production_logs',
  'oriafo_ops_procurement': 'procurement_logs',
  'oriafo_ops_processing': 'processing_logs',
  'oriafo_ops_staff': 'staff_logs',
  'oriafo_ops_equipment': 'equipment_logs'
};

export async function loadData(key) {
  const table = TABLE_MAP[key];
  if (!table) return [];

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to load data for', key, err);
    return [];
  }
}

export async function saveData(key, entriesArray) {
  const table = TABLE_MAP[key];
  if (!table) return false;

  try {
    const { error } = await supabase
      .from(table)
      .upsert(entriesArray, { onConflict: 'id' });
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save data for', key, err);
    return false;
  }
}

export async function deleteData(key, id) {
  const table = TABLE_MAP[key];
  if (!table) return false;

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete data for', key, err);
    return false;
  }
}
