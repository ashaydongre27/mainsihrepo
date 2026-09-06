/**
 * JOBLEX In-Portal Notification Engine Routes (Node.js / Express)
 * Real-Time Alert Dispatcher & SSE Stream for Student, University & Industry Portals
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const DB = require('../data/database');
const { supabase, isConfigured } = require('../config/supabase');

// Active SSE client connections map: recipientId -> Set of response objects
const sseClients = new Map();

function ensureNotifications() {
  if (!DB.inPortalNotifications) {
    DB.inPortalNotifications = [];
  }
  return DB.inPortalNotifications;
}

/**
 * GET /api/notifications
 * Retrieves unread and read notifications for current recipient
 */
router.get('/', async (req, res) => {
  try {
    const recipientId = req.query.recipientId || req.query.userId || req.user?.id || req.user?.email || '';

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('in_portal_notifications')
          .select('*')
          .eq('recipient_id', recipientId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const unreadCount = data.filter(n => !n.is_read).length;
          return res.json({ success: true, notifications: data, unreadCount });
        }
      } catch (err) {
        console.warn('[Notifications GET] Supabase warning:', err.message);
      }
    }

    const notifications = recipientId
      ? ensureNotifications()
          .filter(n => n.recipientId === recipientId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];

    const unreadCount = notifications.filter(n => !n.isRead).length;
    return res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error('[Notifications GET Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Marks a notification as read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notifs = ensureNotifications();
    const notif = notifs.find(n => n.id === id);

    if (notif) {
      notif.isRead = true;
    }

    if (isConfigured && supabase) {
      try {
        await supabase.from('in_portal_notifications').update({ is_read: true }).eq('id', id);
      } catch (err) {
        console.warn('[Notifications Read] Supabase warning:', err.message);
      }
    }

    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    console.error('[Notifications Read Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/notifications/read-all
 * Marks all notifications as read for current user
 */
router.post('/read-all', async (req, res) => {
  try {
    const { recipientId = 'usr-student-01' } = req.body || {};
    const notifs = ensureNotifications();

    notifs.forEach(n => {
      if (n.recipientId === recipientId) {
        n.isRead = true;
      }
    });

    if (isConfigured && supabase) {
      try {
        await supabase.from('in_portal_notifications').update({ is_read: true }).eq('recipient_id', recipientId);
      } catch (err) {
        console.warn('[Notifications Read-All] Supabase warning:', err.message);
      }
    }

    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('[Notifications Read-All Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/notifications/dispatch
 * Internal dispatcher to push new notifications to a user
 */
router.post('/dispatch', async (req, res) => {
  try {
    const {
      recipientId,
      senderId = null,
      title,
      message,
      actionUrl = null,
      category = 'system_alert'
    } = req.body || {};

    if (!recipientId || !title || !message) {
      return res.status(400).json({ success: false, error: 'recipientId, title, and message are required.' });
    }

    const newNotif = {
      id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      recipientId,
      senderId,
      title,
      message,
      actionUrl,
      category,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    ensureNotifications().unshift(newNotif);

    if (isConfigured && supabase) {
      try {
        await supabase.from('in_portal_notifications').insert({
          id: newNotif.id,
          recipient_id: recipientId,
          sender_id: senderId,
          title,
          message,
          action_url: actionUrl,
          category,
          is_read: false
        });
      } catch (err) {
        console.warn('[Notifications Dispatch] Supabase warning:', err.message);
      }
    }

    // Push to active SSE connections if connected
    if (sseClients.has(recipientId)) {
      const payload = `data: ${JSON.stringify(newNotif)}\n\n`;
      sseClients.get(recipientId).forEach(clientRes => {
        try {
          clientRes.write(payload);
        } catch (e) {
          // Client disconnected
        }
      });
    }

    return res.status(201).json({ success: true, notification: newNotif });
  } catch (err) {
    console.error('[Notifications Dispatch Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/notifications/stream
 * Server-Sent Events (SSE) live push stream for real-time header bells
 */
router.get('/stream', (req, res) => {
  const recipientId = req.query.recipientId || req.user?.id || 'usr-student-01';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  if (!sseClients.has(recipientId)) {
    sseClients.set(recipientId, new Set());
  }
  sseClients.get(recipientId).add(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

  req.on('close', () => {
    if (sseClients.has(recipientId)) {
      sseClients.get(recipientId).delete(res);
      if (sseClients.get(recipientId).size === 0) {
        sseClients.delete(recipientId);
      }
    }
  });
});

module.exports = router;
