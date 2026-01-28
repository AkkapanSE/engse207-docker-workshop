// ============================================
// Contact Controller
// Developer: สมหญิง (Backend Dev)
// Version: 1.0 (มี Bug!)
// ⚠️ Bug: ไม่ได้ validate ความยาว name!
// ============================================

const pool = require('../database/db');

exports.getAllContacts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows, count: result.rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: 'ไม่สามารถดึงข้อมูลได้' });
    }
};

exports.createContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, error: 'กรุณาระบุชื่อ' });
        }
        
        // ⚠️ Bug: ไม่ได้ตรวจสอบความยาว name ก่อน INSERT!
        // Database มี VARCHAR(50) แต่ไม่ได้เช็คก่อน
        
        const result = await pool.query(
            'INSERT INTO contacts (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
            [name.trim(), email || null, phone || null]
        );
        
        res.status(201).json({ success: true, data: result.rows[0], message: 'เพิ่มรายชื่อสำเร็จ' });
    } catch (error) {
        // ⚠️ Bug: ส่ง database error ตรงๆ!
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'ไม่พบรายชื่อ' });
        }
        
        res.json({ success: true, message: 'ลบรายชื่อสำเร็จ' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'ไม่สามารถลบได้' });
    }
};