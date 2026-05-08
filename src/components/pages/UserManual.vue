<template>
  <div>
    <div class="page-header">
      <div class="breadcrumb"><span @click="page='dashboard'" style="cursor:pointer">Home</span> › User Manual</div>
      <h1>User Manual</h1>
      <p>Complete guide to using the BCPO Station 1 Impound Management System v2.0</p>
    </div>

    <!-- TABLE OF CONTENTS -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title" style="margin-bottom:16px">📑 Table of Contents</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px">
        <div v-for="(sec,i) in sections" :key="i" style="font-size:13px;color:rgba(255,255,255,0.7);cursor:pointer;padding:4px 0;display:flex;align-items:center;gap:8px" @click="scrollTo('section-'+i)">
          <span style="color:var(--gold);font-weight:600">{{ i+1 }}.</span> {{ sec.icon }} {{ sec.title }}
        </div>
      </div>
    </div>

    <!-- SECTIONS -->
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- 1. GETTING STARTED -->
      <div :id="'section-0'" class="card">
        <div class="card-title" style="margin-bottom:16px">🚀 1. Getting Started</div>
        <div class="manual-content">
          <div class="manual-subsection">
            <strong>System Overview</strong>
            <p>The BCPO Station 1 Impound Management System is a digital platform designed for the Butuan City Police Office — Station 1 to manage impounded vehicles, generate official receipts, track vehicle statuses, and produce analytical reports.</p>
          </div>
          <div class="manual-subsection">
            <strong>System Requirements</strong>
            <ul>
              <li>Modern web browser (Google Chrome, Microsoft Edge, or Mozilla Firefox)</li>
              <li>Internet connection for initial loading</li>
              <li>Printer for generating hard-copy receipts</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Logging In</strong>
            <ol>
              <li>Open the application in your web browser.</li>
              <li>Enter your <strong>Username</strong> and <strong>Password</strong> in the login form.</li>
              <li>Optionally check <strong>"Remember username &amp; password"</strong> to auto-fill next time.</li>
              <li>Click <strong>🚔 LOGIN TO SYSTEM</strong> to access the dashboard.</li>
            </ol>
            <div class="manual-note">
              <span>🔒</span> Only authorized personnel with valid credentials can access the system. Contact your system administrator if you forget your login credentials.
            </div>
          </div>
          <div class="manual-subsection">
            <strong>Logging Out</strong>
            <p>Click the <strong>Logout</strong> button on the top-right corner of the navigation bar (or in the mobile menu). A confirmation dialog will appear — click <strong>Confirm</strong> to securely log out.</p>
          </div>
        </div>
      </div>

      <!-- 2. DASHBOARD -->
      <div :id="'section-1'" class="card">
        <div class="card-title" style="margin-bottom:16px">🏠 2. Dashboard</div>
        <div class="manual-content">
          <p>The Dashboard is the main landing page after login. It provides a real-time overview of all impound activity.</p>
          <div class="manual-subsection">
            <strong>Summary Cards</strong>
            <ul>
              <li><strong>Total Impounded</strong> — Cumulative count of all vehicle records in the system.</li>
              <li><strong>Released</strong> — Number of vehicles that have been verified and released.</li>
              <li><strong>Currently Held</strong> — Active impounds still pending release.</li>
              <li><strong>Today's Apprehensions</strong> — Records entered with today's date.</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Recent Records Table</strong>
            <p>Below the summary cards, a table displays the most recent impound records with quick-action buttons:</p>
            <ul>
              <li><strong>View Receipt</strong> — Opens the formatted official impound receipt.</li>
              <li><strong>View Details</strong> — Shows full record information including vehicle photo.</li>
              <li><strong>Edit</strong> — Modify record details (requires authorization password).</li>
              <li><strong>Release / Impound</strong> — Change vehicle status (requires authorization password).</li>
              <li><strong>Delete</strong> — Permanently remove the record (requires authorization password).</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3. IMPOUNDING RECEIPT -->
      <div :id="'section-2'" class="card">
        <div class="card-title" style="margin-bottom:16px">📄 3. Creating an Impounding Receipt</div>
        <div class="manual-content">
          <p>Click <strong>Impounding Receipt</strong> in the navigation bar to open the receipt creation form.</p>
          <div class="manual-subsection">
            <strong>Step 1: Vehicle Information</strong>
            <ul>
              <li><strong>Type of Vehicle</strong> — Select from: Motorcycle, Car, SUV, Pickup Truck, Truck, Van, Jeepney, Tricycle, or Other.</li>
              <li><strong>Plate Number</strong> — Enter the license plate (auto-capitalized). <em>Required field.</em></li>
              <li><strong>Color</strong> — Vehicle color description.</li>
              <li><strong>Engine Number</strong> — Engine serial number (auto-capitalized).</li>
              <li><strong>Chassis Number</strong> — Chassis/frame serial number (auto-capitalized).</li>
              <li><strong>Date Apprehended</strong> — Defaults to today's date.</li>
              <li><strong>Time</strong> — Time of apprehension.</li>
              <li><strong>Location</strong> — Vicinity of apprehension.</li>
              <li><strong>Vehicle Photo</strong> — Optional. Click or drag-and-drop an image. Photos are automatically resized for storage efficiency. Click the ✕ button to remove.</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Step 2: Driver &amp; Owner Information</strong>
            <ul>
              <li><strong>Driver's Name</strong> — Full name of the driver. <em>Required field.</em></li>
              <li><strong>Driver's Address</strong> — Complete residential address.</li>
              <li><strong>Registered Owner</strong> — Full name of the vehicle's registered owner.</li>
              <li><strong>Owner's Address</strong> — Complete residential address of the owner.</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Step 3: Violations &amp; Officers</strong>
            <ul>
              <li><strong>Violation 1</strong> — Primary violation (required). Select from dropdown.</li>
              <li><strong>Violation 2</strong> — Secondary violation (optional).</li>
              <li><strong>Apprehending Officer(s)</strong> — Select one or two officers from the officer directory.</li>
              <li><strong>Remarks/Notes</strong> — Any additional information about the apprehension.</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Step 4: Save &amp; Print</strong>
            <ol>
              <li>Click <strong>Save Record</strong> to commit the record. A success message with the Receipt ID will appear.</li>
              <li>Click <strong>Preview Receipt</strong> to view the formatted official receipt.</li>
              <li>Click <strong>Print Receipt</strong> to send the receipt to your printer.</li>
              <li>Click <strong>Clear Form</strong> to reset all fields for a new entry.</li>
            </ol>
          </div>
          <div class="manual-note">
            <span>📝</span> Required fields are: <strong>Vehicle Type</strong>, <strong>Plate Number</strong>, and <strong>Driver's Name</strong>. The system will alert you if these are missing.
          </div>
        </div>
      </div>

      <!-- 4. IMPOUND RECORDS -->
      <div :id="'section-3'" class="card">
        <div class="card-title" style="margin-bottom:16px">📋 4. Impound Records</div>
        <div class="manual-content">
          <p>Click <strong>Impound Records</strong> in the navigation bar to access the complete searchable registry of all impounded vehicles.</p>
          <div class="manual-subsection">
            <strong>Searching &amp; Filtering</strong>
            <ul>
              <li><strong>Search Bar</strong> — Search by plate number, driver name, officer name, or owner name.</li>
              <li><strong>Status Filter</strong> — Filter by All Status, Impounded, Released, or Pending.</li>
              <li><strong>Vehicle Type Filter</strong> — Filter by specific vehicle types.</li>
              <li><strong>CSV Export</strong> — Click <strong>⬇ CSV</strong> to download all filtered records as a spreadsheet-compatible file.</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Record Actions</strong>
            <p>Each record row has the following action buttons:</p>
            <ul>
              <li><strong>View Details</strong> — Opens a modal showing all record information, including vehicle photo (if uploaded), organized by section.</li>
              <li><strong>View Receipt</strong> — Opens the official impounding receipt for viewing/printing.</li>
              <li><strong>Edit</strong> — Opens the edit form to modify record details. Requires the <strong>authorization password</strong> to save changes.</li>
              <li><strong>Release</strong> — Mark an impounded vehicle as released. Requires password confirmation.</li>
              <li><strong>Impound</strong> — Re-impound a previously released vehicle. Requires password confirmation.</li>
              <li><strong>Delete</strong> — Permanently remove the record. Requires password confirmation.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 5. STATISTICS & REPORTS -->
      <div :id="'section-4'" class="card">
        <div class="card-title" style="margin-bottom:16px">📊 5. Statistics &amp; Reports</div>
        <div class="manual-content">
          <p>Click <strong>Statistics &amp; Reports</strong> in the navigation bar to access analytics and data summaries.</p>
          <div class="manual-subsection">
            <strong>Overview Tab</strong>
            <ul>
              <li>Summary cards showing Total Impounded, Released, and Active/Held counts.</li>
              <li><strong>Monthly Trend</strong> — Line chart showing impound and release trends over time. Click <strong>⬇ CSV</strong> to export.</li>
              <li><strong>Status Breakdown</strong> — Doughnut chart showing the ratio of impounded vs. released vehicles.</li>
            </ul>
          </div>
          <div class="manual-subsection">
            <strong>Violations Analysis Tab</strong>
            <ul>
              <li><strong>Top Violations</strong> — Horizontal bar chart of the most common violations.</li>
              <li><strong>Violation Summary Table</strong> — Detailed breakdown with count, percentage, and trend bar for each violation type.</li>
              <li>Click <strong>⬇ Export</strong> to download violation data.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 6. EDIT & DELETE -->
      <div :id="'section-5'" class="card">
        <div class="card-title" style="margin-bottom:16px">✏️ 6. Editing &amp; Deleting Records</div>
        <div class="manual-content">
          <div class="manual-subsection">
            <strong>Editing a Record</strong>
            <ol>
              <li>Click the <strong>Edit</strong> button on any record (from Dashboard, Impound Records, or View Receipt).</li>
              <li>The Edit modal will open with all current record data pre-filled.</li>
              <li>Modify any fields as needed — vehicle info, driver/owner details, violations, officers, remarks, or vehicle photo.</li>
              <li>Enter the <strong>Authorization Password</strong> at the bottom of the form.</li>
              <li>Click <strong>Save Changes</strong> to confirm the update.</li>
            </ol>
          </div>
          <div class="manual-subsection">
            <strong>Deleting a Record</strong>
            <ol>
              <li>Click the <strong>Delete</strong> button on any record.</li>
              <li>A confirmation dialog will appear showing the vehicle's plate number.</li>
              <li>Enter the <strong>Authorization Password</strong>.</li>
              <li>Click <strong>Delete Record</strong> to permanently remove the record.</li>
            </ol>
            <div class="manual-warning">
              <span>⚠️</span> <strong>Deletion is permanent and cannot be undone.</strong> Make sure you have a backup before deleting critical records.
            </div>
          </div>
          <div class="manual-subsection">
            <strong>Releasing / Re-Impounding a Vehicle</strong>
            <ol>
              <li>Click the <strong>Release</strong> button on an impounded vehicle (or <strong>Impound</strong> on a released vehicle).</li>
              <li>A confirmation dialog will appear.</li>
              <li>Enter the <strong>Authorization Password</strong> and confirm.</li>
            </ol>
          </div>
          <div class="manual-note" style="background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.3)">
            <span>🔐</span> The authorization password <strong style="color:var(--gold2);font-size:15px;letter-spacing:1px">bcps1</strong> is required for all <strong>Edit</strong>, <strong>Delete</strong>, <strong>Release</strong>, and <strong>Re-Impound</strong> operations. This ensures that only authorized personnel can modify or remove records. Keep this password confidential.
          </div>
        </div>
      </div>

      <!-- 7. VIEW DETAILS -->
      <div :id="'section-6'" class="card">
        <div class="card-title" style="margin-bottom:16px">🔍 7. Viewing Record Details</div>
        <div class="manual-content">
          <p>Click <strong>View Details</strong> on any record to open a comprehensive information modal. The details are organized in the following sections:</p>
          <ul>
            <li><strong>Status</strong> — Current status badge (Impounded / Released / Pending) and Record ID.</li>
            <li><strong>🚗 Vehicle Information</strong> — Type, plate number, color, engine number, chassis number.</li>
            <li><strong>📋 Apprehension Details</strong> — Date, time, location, violations, and apprehending officers.</li>
            <li><strong>👤 Driver &amp; Owner</strong> — Driver name/address and registered owner name/address.</li>
            <li><strong>📷 Vehicle Photo</strong> — If a photo was uploaded, it will be displayed here. Click the photo to open it full-size in a new tab.</li>
            <li><strong>📝 Remarks</strong> — Any additional notes (shown only if remarks were entered).</li>
          </ul>
        </div>
      </div>

      <!-- 8. VEHICLE PHOTO -->
      <div :id="'section-7'" class="card">
        <div class="card-title" style="margin-bottom:16px">📷 8. Vehicle Photo Upload</div>
        <div class="manual-content">
          <p>You can optionally attach a photo of the impounded vehicle for visual documentation.</p>
          <div class="manual-subsection">
            <strong>Uploading a Photo</strong>
            <ol>
              <li>In the Vehicle Information section (when creating a receipt or editing a record), locate the <strong>VEHICLE PHOTO</strong> field.</li>
              <li>Click the upload area or drag-and-drop an image file onto it.</li>
              <li>Accepted formats: JPEG, PNG, GIF, WebP, and other common image formats.</li>
              <li>The image is automatically resized to a maximum of 800 pixels for efficient storage.</li>
            </ol>
          </div>
          <div class="manual-subsection">
            <strong>Removing a Photo</strong>
            <p>Click the red <strong>✕</strong> button on the top-right corner of the photo preview to remove it.</p>
          </div>
          <div class="manual-subsection">
            <strong>Viewing a Photo</strong>
            <p>In <strong>View Details</strong>, the photo appears under the Driver &amp; Owner section. Click on the photo to open it full-size in a new browser tab.</p>
          </div>
          <div class="manual-note">
            <span>💡</span> Photos are stored locally in the browser's storage. It is recommended to keep photo sizes reasonable and create regular backups.
          </div>
        </div>
      </div>

      <!-- 9. BACKUP & RESTORE -->
      <div :id="'section-8'" class="card">
        <div class="card-title" style="margin-bottom:16px">💾 9. Backup &amp; Restore</div>
        <div class="manual-content">
          <p>Click <strong>Backup &amp; Restore</strong> in the navigation bar to manage your data.</p>
          <div class="manual-subsection">
            <strong>Creating a Backup</strong>
            <ol>
              <li>Click <strong>Create Backup</strong> to download all impound records as a <code>.json</code> file.</li>
              <li>The file is saved to your computer's Downloads folder.</li>
              <li>The filename includes the current date for easy identification.</li>
            </ol>
          </div>
          <div class="manual-subsection">
            <strong>Restoring from Backup</strong>
            <ol>
              <li>Click <strong>Restore</strong> or drag-and-drop a previously saved <code>.json</code> backup file.</li>
              <li>The system will verify the file and load the records.</li>
              <li>Existing records will be replaced with the backup data.</li>
            </ol>
          </div>
          <div class="manual-warning">
            <span>⚠️</span> Restoring a backup will <strong>overwrite all current records</strong>. Always create a fresh backup before restoring older data.
          </div>
          <div class="manual-note">
            <span>💡</span> It is strongly recommended to create a backup at the <strong>end of every shift</strong> and store copies on a USB drive or cloud storage.
          </div>
        </div>
      </div>

      <!-- 10. TROUBLESHOOTING -->
      <div :id="'section-9'" class="card">
        <div class="card-title" style="margin-bottom:16px">🛠️ 10. Troubleshooting &amp; FAQ</div>
        <div class="manual-content">
          <div class="manual-subsection">
            <strong>Common Issues</strong>
            <div class="faq-item">
              <div class="faq-q">Q: I can't log in to the system.</div>
              <div class="faq-a">A: Ensure you are entering the correct username and password. Credentials are case-sensitive. Contact your system administrator if you need your credentials reset.</div>
            </div>
            <div class="faq-item">
              <div class="faq-q">Q: The authorization password is not working for Edit/Delete.</div>
              <div class="faq-a">A: The authorization password is <strong>bcps1</strong>. It is case-sensitive — make sure to type it exactly as shown in lowercase.</div>
            </div>
            <div class="faq-item">
              <div class="faq-q">Q: My records disappeared after clearing browser data.</div>
              <div class="faq-a">A: Records are stored in your browser's local storage. Clearing browser data will remove them. Always maintain regular backups using the Backup &amp; Restore feature.</div>
            </div>
            <div class="faq-item">
              <div class="faq-q">Q: The receipt is not printing correctly.</div>
              <div class="faq-a">A: Ensure your printer is connected and set to A4/Letter paper size. Use Chrome or Edge for best print results. Disable "Headers and Footers" in print settings for a cleaner output.</div>
            </div>
            <div class="faq-item">
              <div class="faq-q">Q: Can I use this system on my phone?</div>
              <div class="faq-a">A: Yes, the system is responsive and works on mobile devices. Use the hamburger menu (☰) to navigate between pages.</div>
            </div>
            <div class="faq-item">
              <div class="faq-q">Q: How do I export data to Excel?</div>
              <div class="faq-a">A: Go to <strong>Impound Records</strong> or <strong>Statistics &amp; Reports</strong> and click the <strong>⬇ CSV</strong> button. Open the downloaded CSV file in Microsoft Excel, Google Sheets, or any spreadsheet application.</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- WORKFLOW -->
    <div style="margin-top:20px" class="card">
      <div class="card-title" style="margin-bottom:16px">🔄 Workflow Summary</div>
      <div style="display:flex;align-items:center;gap:0;overflow-x:auto;padding:10px 0">
        <div v-for="(step,i) in workflow" :key="i" style="display:flex;align-items:center">
          <div style="text-align:center;min-width:130px">
            <div style="width:50px;height:50px;border-radius:50%;background:rgba(201,168,76,0.15);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 8px">{{ step.icon }}</div>
            <div style="font-size:12px;font-weight:600;color:var(--gold2)">{{ step.title }}</div>
            <div style="font-size:10px;color:var(--gray);margin-top:3px">{{ step.desc }}</div>
          </div>
          <div v-if="i < workflow.length-1" style="color:var(--gold);font-size:20px;margin:0 4px;opacity:0.5">→</div>
        </div>
      </div>
    </div>

    <!-- SYSTEM INFO -->
    <div style="margin-top:20px" class="card">
      <div class="card-title" style="margin-bottom:16px">ℹ️ System Information</div>
      <div class="manual-content">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="manual-info-item"><span class="manual-info-label">System</span><span>BCPO Impound Management System</span></div>
          <div class="manual-info-item"><span class="manual-info-label">Version</span><span>v2.0</span></div>
          <div class="manual-info-item"><span class="manual-info-label">Organization</span><span>Butuan City Police Office — Station 1</span></div>
          <div class="manual-info-item"><span class="manual-info-label">Data Storage</span><span>Browser Local Storage</span></div>
          <div class="manual-info-item"><span class="manual-info-label">Supported Browsers</span><span>Chrome, Edge, Firefox</span></div>
          <div class="manual-info-item"><span class="manual-info-label">Responsive</span><span>Desktop, Tablet &amp; Mobile</span></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useImpoundStore } from '../../composables/useImpoundStore.js'
const { page } = useImpoundStore()

const sections = [
  { icon: '🚀', title: 'Getting Started' },
  { icon: '🏠', title: 'Dashboard' },
  { icon: '📄', title: 'Creating an Impounding Receipt' },
  { icon: '📋', title: 'Impound Records' },
  { icon: '📊', title: 'Statistics & Reports' },
  { icon: '✏️', title: 'Editing & Deleting Records' },
  { icon: '🔍', title: 'Viewing Record Details' },
  { icon: '📷', title: 'Vehicle Photo Upload' },
  { icon: '💾', title: 'Backup & Restore' },
  { icon: '🛠️', title: 'Troubleshooting & FAQ' },
]

const workflow = [
  { icon:'🚔', title:'Apprehend',    desc:'Vehicle stopped' },
  { icon:'📋', title:'Fill Form',    desc:'Enter details' },
  { icon:'💾', title:'Save Record',  desc:'Commit to DB' },
  { icon:'🖨️', title:'Print Receipt',desc:'Official copy' },
  { icon:'🔍', title:'Verify Docs',  desc:'Check papers' },
  { icon:'✅', title:'Release',      desc:'Mark as released' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.manual-content { font-size: 13px; color: rgba(255,255,255,0.78); line-height: 1.75 }
.manual-content p { margin-bottom: 12px }
.manual-content ul, .manual-content ol { margin: 8px 0 12px 20px }
.manual-content li { margin-bottom: 6px }
.manual-content li strong { color: var(--gold2) }
.manual-content code { background: rgba(201,168,76,0.1); color: var(--gold2); padding: 1px 6px; border-radius: 4px; font-size: 12px }
.manual-subsection { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border2) }
.manual-subsection:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0 }
.manual-subsection > strong { display: block; font-size: 14px; color: var(--gold2); margin-bottom: 8px }
.manual-note {
  background: rgba(33,150,243,0.08); border: 1px solid rgba(33,150,243,0.25); border-radius: 8px;
  padding: 12px 16px; font-size: 12px; display: flex; align-items: flex-start; gap: 10px;
  color: rgba(255,255,255,0.75); margin-top: 12px; line-height: 1.6
}
.manual-warning {
  background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.3); border-radius: 8px;
  padding: 12px 16px; font-size: 12px; display: flex; align-items: flex-start; gap: 10px;
  color: rgba(255,255,255,0.75); margin-top: 12px; line-height: 1.6
}
.faq-item { margin-bottom: 14px; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border2); border-radius: 8px }
.faq-q { font-weight: 600; color: var(--gold2); font-size: 13px; margin-bottom: 6px }
.faq-a { font-size: 12.5px; color: rgba(255,255,255,0.7); line-height: 1.6 }
.manual-info-item { display: flex; flex-direction: column; gap: 3px; font-size: 13px; color: rgba(255,255,255,0.8) }
.manual-info-label { font-size: 11px; color: var(--gray); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase }
</style>
