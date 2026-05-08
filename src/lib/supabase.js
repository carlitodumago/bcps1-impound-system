import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Field mapping: App (camelCase) ↔ Supabase (snake_case) ──

export function toDbRecord(r) {
  return {
    plate: r.plate || '',
    type: r.type || 'Other',
    color: r.color || '',
    engine_no: r.engineNo || '',
    chassis_no: r.chassisNo || '',
    date_apprehended: r.date || null,
    time_apprehended: r.time || null,
    location: r.location || '',
    photo: r.photo || '',
    driver_name: r.driver || '',
    driver_address: r.driverAddress || '',
    owner_name: r.owner || '',
    owner_address: r.ownerAddress || '',
    violation_1: r.vio1 || null,
    violation_2: r.vio2 || null,
    officer_1: r.officer || '',
    officer_2: r.officer2 || '',
    remarks: r.remarks || '',
    status: r.status || 'Impounded',
  }
}

export function toAppRecord(r) {
  return {
    id: r.id,
    plate: r.plate || '',
    type: r.type || '',
    color: r.color || '',
    engineNo: r.engine_no || '',
    chassisNo: r.chassis_no || '',
    date: r.date_apprehended || '',
    time: r.time_apprehended ? r.time_apprehended.substring(0, 5) : '',
    location: r.location || '',
    photo: r.photo || '',
    driver: r.driver_name || '',
    driverAddress: r.driver_address || '',
    owner: r.owner_name || '',
    ownerAddress: r.owner_address || '',
    vio1: r.violation_1 || '',
    vio2: r.violation_2 || '',
    officer: r.officer_1 || '',
    officer2: r.officer_2 || '',
    remarks: r.remarks || '',
    status: r.status || 'Impounded',
  }
}
