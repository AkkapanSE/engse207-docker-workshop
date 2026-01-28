// ============================================
// Contact Manager - Frontend JavaScript
// Developer: สมชาย
// Version: 1.0 (with Mock Data)
// ============================================

const API_BASE = '/api';

// ============================================
// 🔶 MOCK DATA CONFIGURATION
// ============================================
// ตั้งค่า USE_MOCK = true เพื่อทดสอบ UI โดยไม่ต้องรอ Backend
// เมื่อ Backend พร้อมแล้ว ให้เปลี่ยนเป็น false

const USE_MOCK = false;  // ⬅️ เปลี่ยนเป็น false เมื่อ merge แล้ว

// Mock Data - ใช้ format เดียวกับ API Contract
const MOCK_CONTACTS = [
    { id: 1, name: "ทดสอบ หนึ่ง", email: "test1@example.com", phone: "081-111-1111" },
    { id: 2, name: "ทดสอบ สอง", email: "test2@example.com", phone: "082-222-2222" },
    { id: 3, name: "ทดสอบ สาม", email: "test3@example.com", phone: "083-333-3333" }
];

let mockIdCounter = 4;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (USE_MOCK) {
        console.log("🔶🔶🔶 MOCK MODE ENABLED 🔶🔶🔶");
        console.log("เปลี่ยน USE_MOCK = false เมื่อ API พร้อม");
        document.getElementById('mockIndicator').style.display = 'inline-block';
    }
    
    loadContacts();
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterContacts(e.target.value);
    });
});

// ============================================
// API Functions (รองรับทั้ง Mock และ Real)
// ============================================

async function loadContacts() {
    try {
        if (USE_MOCK) {
            console.log("🔶 [MOCK] Loading contacts...");
            await delay(300);
            renderContacts(MOCK_CONTACTS);
            return;
        }
        
        const response = await fetch(`${API_BASE}/contacts`);
        const data = await response.json();
        
        if (data.success) {
            renderContacts(data.data);
        } else {
            showStatus('ไม่สามารถโหลดข้อมูลได้', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
}

async function addContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!name) {
        showStatus('กรุณาใส่ชื่อ', 'error');
        return;
    }
    
    // ⚠️ Bug: ไม่ได้ validate ความยาวของ name!
    // จะถูกค้นพบตอน Integration Test
    
    try {
        if (USE_MOCK) {
            console.log("🔶 [MOCK] Adding:", { name, email, phone });
            await delay(300);
            
            MOCK_CONTACTS.push({
                id: mockIdCounter++,
                name, email: email || null, phone: phone || null
            });
            
            showStatus('เพิ่มรายชื่อสำเร็จ! (Mock)', 'success');
            hideAddForm();
            clearForm();
            loadContacts();
            return;
        }
        
        const response = await fetch(`${API_BASE}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showStatus('เพิ่มรายชื่อสำเร็จ!', 'success');
            hideAddForm();
            clearForm();
            loadContacts();
        } else {
            showStatus(data.error || 'ไม่สามารถเพิ่มได้', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('เกิดข้อผิดพลาด', 'error');
    }
}

async function deleteContact(id) {
    if (!confirm('ต้องการลบรายชื่อนี้?')) return;
    
    try {
        if (USE_MOCK) {
            console.log("🔶 [MOCK] Deleting:", id);
            await delay(300);
            
            const index = MOCK_CONTACTS.findIndex(c => c.id === id);
            if (index > -1) MOCK_CONTACTS.splice(index, 1);
            
            showStatus('ลบรายชื่อสำเร็จ! (Mock)', 'success');
            loadContacts();
            return;
        }
        
        const response = await fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' });
        const data = await response.json();
        
        if (data.success) {
            showStatus('ลบรายชื่อสำเร็จ!', 'success');
            loadContacts();
        } else {
            showStatus('ไม่สามารถลบได้', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('เกิดข้อผิดพลาด', 'error');
    }
}

// ============================================
// UI Functions
// ============================================

function renderContacts(contacts) {
    const list = document.getElementById('contactList');
    
    if (contacts.length === 0) {
        list.innerHTML = '<div class="loading">📭 ไม่มีรายชื่อติดต่อ</div>';
        return;
    }
    
    list.innerHTML = contacts.map(c => `
        <div class="contact-card" data-name="${c.name.toLowerCase()}">
            <div class="contact-info">
                <h3>👤 ${escapeHtml(c.name)}</h3>
                <p>
                    ${c.email ? `📧 ${escapeHtml(c.email)}` : ''}
                    ${c.phone ? ` 📱 ${escapeHtml(c.phone)}` : ''}
                </p>
            </div>
            <button class="btn btn-danger" onclick="deleteContact(${c.id})">🗑️ ลบ</button>
        </div>
    `).join('');
}

function filterContacts(term) {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach(card => {
        card.style.display = card.dataset.name.includes(term.toLowerCase()) ? 'flex' : 'none';
    });
}

function showAddForm() { document.getElementById('addForm').style.display = 'block'; }
function hideAddForm() { document.getElementById('addForm').style.display = 'none'; }
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}

function showStatus(message, type) {
    const el = document.getElementById('statusMessage');
    el.textContent = message;
    el.className = `status-message ${type}`;
    setTimeout(() => { el.className = 'status-message'; }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
