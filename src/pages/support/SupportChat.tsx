import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, Avatar, Badge,
  IconButton, OutlinedInput, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAvatarColor, getInitials } from '../../utils/avatar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/stores/store';
import type { SupportConversation } from '../../redux/slices/supportConversationsSlice';
import { socketConversationUpdated } from '../../redux/slices/supportConversationsSlice';
import type { ConversationMessage } from '../../redux/slices/conversationMessagesSlice';
import { socketMessageReceived } from '../../redux/slices/conversationMessagesSlice';
import { fetchSupportConversations } from '../../redux/sagas/supportChat/fetchSupportConversationsAction';
import { fetchConversationMessages } from '../../redux/sagas/supportChat/fetchConversationMessagesAction';
// import { assignConversation } from '../../redux/sagas/supportChat/assignConversationAction';
import { resolveConversation } from '../../redux/sagas/supportChat/resolveConversationAction';
import { sendMessage } from '../../redux/sagas/supportChat/sendMessageAction';
import { uploadChat } from '../../redux/sagas/supportChat/uploadChatAction';
import { fetchSupportCount } from '../../redux/sagas/supportChat/supportCountAction';
import { getSocket, disconnectSocket } from '../../services/socket';

type Filter = 'All' | 'Customers' | 'Partners';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

const getFileExt = (url: string) => {
  try { return new URL(url).pathname.split('.').pop()?.toLowerCase() ?? ''; }
  catch { return url.split('.').pop()?.toLowerCase() ?? ''; }
};

const renderMsgContent = (text: string, isAdmin: boolean) => {
  if (/^https?:\/\//i.test(text)) {
    const ext = getFileExt(text);
    if (IMAGE_EXTS.includes(ext)) {
      return (
        <Box
          component="img"
          src={text}
          alt="attachment"
          sx={{ maxWidth: 220, maxHeight: 180, borderRadius: 1.5, display: 'block', cursor: 'pointer', objectFit: 'cover' }}
          onClick={() => window.open(text, '_blank')}
        />
      );
    }
    const fileName = decodeURIComponent(text.split('/').pop() ?? 'Download File');
    return (
      <Box
        component="a"
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'flex', alignItems: 'center', gap: 0.8,
          color: isAdmin ? '#93c5fd' : '#1d4ed8',
          fontSize: '0.83rem', textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <AttachFileIcon sx={{ fontSize: 16 }} />
        {fileName}
      </Box>
    );
  }
  return (
    <Typography sx={{ fontSize: '0.83rem', color: isAdmin ? '#fff' : '#111827', lineHeight: 1.55 }}>
      {text}
    </Typography>
  );
};


const SupportChat: React.FC = () => {
  const dispatch = useDispatch();

  // ── Redux state ──
  const { conversations, loading: convLoading } = useSelector((state: RootState) => state.supportConversations);
  const { messages, loading: msgLoading, uploadLoading } = useSelector((state: RootState) => state.conversationMessages);
  const { data: supportCount } = useSelector((state: RootState) => state.supportCount);

  // ── Local state ──
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [filter, setFilter]       = useState<Filter>('All');
  const [search, setSearch]       = useState('');
  const [reply, setReply]         = useState('');
  // const [assigning, setAssigning] = useState(false);
  const [resolving, setResolving] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep ref in sync so socket handlers always see latest activeId
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  // ── Socket.IO: connect on mount, disconnect on unmount ──
  useEffect(() => {
    const socket = getSocket();

    const onNewMessage = (msg: ConversationMessage) => {
      if (msg.conversationId === activeIdRef.current) {
        dispatch(socketMessageReceived(msg));
      }
      dispatch(socketConversationUpdated({
        _id: msg.conversationId,
        lastMessage: msg.text,
        lastMessageAt: msg.createdAt,
        ...(msg.senderType !== 'admin' ? { unreadByAdmin: 1 } : {}),
      }));
    };

    const onConversationUpdated = (conv: Partial<SupportConversation> & { _id: string }) => {
      dispatch(socketConversationUpdated(conv));
    };

    socket.on('new_message', onNewMessage);
    socket.on('conversation_updated', onConversationUpdated);

    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('conversation_updated', onConversationUpdated);
      disconnectSocket();
    };
  }, [dispatch]);

  // ── Socket.IO: join/leave conversation room on selection ──
  useEffect(() => {
    if (!activeId) return;
    const socket = getSocket();
    socket.emit('join_conversation', { conversationId: activeId });
    return () => {
      socket.emit('leave_conversation', { conversationId: activeId });
    };
  }, [activeId]);

  // ── 1. Page load pe conversations fetch karo ──
  useEffect(() => {
    dispatch(fetchSupportConversations({}));
    dispatch(fetchSupportCount());
  }, [dispatch]);

  // ── 2. Filter change hone par re-fetch ──
  useEffect(() => {
    if (filter === 'All') {
      dispatch(fetchSupportConversations({}));
    } else if (filter === 'Customers') {
      dispatch(fetchSupportConversations({ type: 'user' }));
    } else {
      dispatch(fetchSupportConversations({ type: 'rider' }));
    }
  }, [filter, dispatch]);

  // ── 3. Conversation select hone par messages fetch karo ──
  useEffect(() => {
    if (activeId) {
      dispatch(fetchConversationMessages({ conversationId: activeId }));
    }
  }, [activeId, dispatch]);

  // ── 4. Auto-scroll to latest message ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  // ── 5. First conversation auto-select ──
  useEffect(() => {
    if (conversations?.length && !activeId) {
      setActiveId(conversations[0]._id);
    }
  }, [conversations, activeId]);

  const activeConv = conversations?.find((c: SupportConversation) => c._id === activeId); // ✅ any → SupportConversation

  // ── Filter + search ──
  // ✅ FIXED: userType → senderType, userName → senderName
  const filtered = (conversations ?? []).filter((c: SupportConversation) => {
    const matchFilter =
      filter === 'All' ||
      (filter === 'Customers' && c.senderType === 'user') ||
      (filter === 'Partners'    && c.senderType === 'rider');
    const matchSearch =
      !search ||
      c.senderName?.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── Send reply (admin POST) ──
  const handleSend = () => {
    if (!reply.trim() || !activeId) return;
    dispatch(sendMessage({ conversationId: activeId, text: reply.trim() }));
    setReply('');
  };

  // ── Conversation select ──
  const handleSelect = (id: string) => {
    setActiveId(id);
  };

  // ── 6. Assign conversation ──
  // const handleAssign = () => {
  //   if (!activeId) return;
  //   setAssigning(true);
  //   dispatch(
  //     assignConversation({
  //       conversationId: activeId,
  //       adminId: 'YOUR_ADMIN_ID',
  //       onSuccess: () => {
  //         setAssigning(false);
  //         dispatch(fetchSupportConversations({}));
  //       },
  //       onError: () => setAssigning(false),
  //     })
  //   );
  // };

  // ── 7. Upload attachment ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeId) return;
    dispatch(uploadChat({ conversationId: activeId, file }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── 8. Resolve conversation ──
  const handleResolve = () => {
    if (!activeId) return;
    setResolving(true);
    dispatch(
      resolveConversation({
        conversationId: activeId,
        onSuccess: () => {
          setResolving(false);
          dispatch(fetchSupportConversations({}));
          setActiveId(null);
        },
        onError: () => setResolving(false),
      })
    );
  };

  return (
    <AdminLayout pageTitle="Support Chat">
      <Box
        sx={{
          display: 'flex', height: 'calc(100vh - 112px)',
          border: '1px solid #e5e7eb', borderRadius: 2,
          overflow: 'hidden', bgcolor: '#fff',
        }}
      >

        {/* ── Left Panel: Conversation List ── */}
        <Box sx={{ width: 282, flexShrink: 0, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>

          <Box sx={{ px: 2, pt: 2, pb: 1.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Support Chat</Typography>
              {(supportCount?.count ?? 0) > 0 && (
                <Chip
                  label={`${supportCount!.count} unread`}
                  size="small"
                  sx={{
                    bgcolor: '#ffe6d6', color: '#E8490F',
                    fontSize: '0.62rem', fontWeight: 700,
                    height: 18, borderRadius: 1,
                    '& .MuiChip-label': { px: 0.7 },
                  }}
                />
              )}
            </Box>
            <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.2 }}>Customer & Partner conversations</Typography>
          </Box>

          <Box sx={{ px: 2, pb: 1.2 }}>
            <OutlinedInput
              size="small" fullWidth placeholder="Search conversations..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              startAdornment={<InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#9ca3af' }} /></InputAdornment>}
              sx={{ fontSize: '0.8rem', borderRadius: 2, height: 34, '& fieldset': { borderColor: '#e5e7eb' }, '& input': { py: 0.5 } }}
            />
          </Box>

          <Box sx={{ px: 2, pb: 1.2, display: 'flex', gap: 0.7 }}>
            {(['All', 'Customers', 'Partners'] as Filter[]).map((f) => (
              <Button key={f} size="small" onClick={() => setFilter(f)}
                sx={{
                  fontSize: '0.7rem', fontWeight: 600, textTransform: 'none', borderRadius: 10,
                  px: 1.4, py: 0.25, minWidth: 0,
                  bgcolor: filter === f ? '#E8490F' : '#f3f4f6',
                  color: filter === f ? '#fff' : '#6b7280',
                  '&:hover': { bgcolor: filter === f ? '#c93d0c' : '#e5e7eb' },
                }}
              >{f}</Button>
            ))}
          </Box>

          <Typography sx={{ px: 2, pb: 0.8, fontSize: '0.68rem', fontWeight: 600, color: '#9ca3af', letterSpacing: 0.4 }}>
            All Conversations ({filtered.length})
          </Typography>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {convLoading ? (
              <Typography sx={{ textAlign: 'center', py: 4, fontSize: '0.8rem', color: '#9ca3af' }}>
                Loading...
              </Typography>
            ) : filtered.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4, fontSize: '0.8rem', color: '#9ca3af' }}>
                No conversations
              </Typography>
            ) : (
              // ✅ FIXED: conv: any → conv: SupportConversation
              filtered.map((conv: SupportConversation) => {
                const isActive = conv._id === activeId;
                // ✅ FIXED: conv.userType → conv.senderType
                const userType = conv.senderType === 'user' ? 'Customer' : 'Partner';
                return (
                  <Box key={conv._id} onClick={() => handleSelect(conv._id)}
                    sx={{
                      display: 'flex', alignItems: 'flex-start', gap: 1.2,
                      px: 2, py: 1.2, cursor: 'pointer',
                      bgcolor: isActive ? '#fff5f2' : 'transparent',
                      borderLeft: `3px solid ${isActive ? '#E8490F' : 'transparent'}`,
                      '&:hover': { bgcolor: isActive ? '#fff5f2' : '#f9fafb' },
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* ✅ FIXED: conv.userName → conv.senderName */}
                    <Avatar sx={{ width: 36, height: 36, bgcolor: getAvatarColor(conv.senderName ?? ''), fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, mt: 0.2 }}>
                      {getInitials(conv.senderName ?? '?')}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                        {/* ✅ FIXED: conv.userName → conv.senderName */}
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.senderName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.63rem', color: '#9ca3af', flexShrink: 0 }}>
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Typography>
                      </Box>
                      <Chip label={userType} size="small"
                        sx={{
                          fontSize: '0.58rem', fontWeight: 700, height: 15, mb: 0.4,
                          bgcolor: userType === 'Customer' ? '#dbeafe' : '#dcfce7',
                          color: userType === 'Customer' ? '#1d4ed8' : '#15803d',
                          border: 'none', borderRadius: 0.8,
                          '& .MuiChip-label': { px: 0.7 },
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 165 }}>
                          {conv.lastMessage ?? ''}
                        </Typography>
                        {conv.unreadByAdmin > 0 && (
                          <Box sx={{ width: 17, height: 17, borderRadius: '50%', bgcolor: '#ef4444', color: '#fff', fontSize: '0.58rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {conv.unreadByAdmin}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        {/* ── Right Panel: Chat Window ── */}
        {activeConv ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Chat Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.4, borderBottom: '1px solid #e5e7eb', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#9ca3af', border: '2px solid #fff' }} />}
                >
                  {/* ✅ FIXED: activeConv.userName → activeConv.senderName */}
                  <Avatar sx={{ width: 38, height: 38, bgcolor: getAvatarColor(activeConv.senderName ?? ''), fontSize: '0.75rem', fontWeight: 700 }}>
                    {getInitials(activeConv.senderName ?? '?')}
                  </Avatar>
                </Badge>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    {/* ✅ FIXED: activeConv.userName → activeConv.senderName */}
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{activeConv.senderName}</Typography>
                    {/* ✅ FIXED: activeConv.userType → activeConv.senderType (3 places below) */}
                    <Chip
                      label={activeConv.senderType === 'user' ? 'Customer' : 'Partner'} size="small"
                      sx={{
                        fontSize: '0.62rem', fontWeight: 700, height: 18,
                        bgcolor: activeConv.senderType === 'user' ? '#dbeafe' : '#dcfce7',
                        color: activeConv.senderType === 'user' ? '#1d4ed8' : '#15803d',
                        border: 'none', borderRadius: 1, '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                    {/* Status chip */}
                    <Chip
                      label={activeConv.status === 'resolved' ? 'Resolved' : 'Open'} size="small"
                      sx={{
                        fontSize: '0.62rem', fontWeight: 700, height: 18,
                        bgcolor: activeConv.status === 'resolved' ? '#f0fdf4' : '#fffbeb',
                        color: activeConv.status === 'resolved' ? '#16a34a' : '#d97706',
                        border: 'none', borderRadius: 1, '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.2 }}>
                    ID: {activeConv._id?.slice(-8).toUpperCase()}
                    {activeConv.assignedTo && ` · Assigned`}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {/* Mark Resolved */}
                <Button size="small"
                  disabled={resolving || activeConv.status === 'resolved'}
                  onClick={handleResolve}
                  startIcon={<CheckIcon sx={{ fontSize: '13px !important' }} />}
                  sx={{ fontSize: '0.74rem', fontWeight: 500, textTransform: 'none', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 2, px: 1.8, py: 0.5, '&:hover': { bgcolor: '#f9fafb' } }}
                >
                  {resolving ? 'Resolving...' : 'Mark Resolved'}
                </Button>
              </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1.4, bgcolor: '#f9fafb' }}>
              {msgLoading ? (
                <Typography sx={{ textAlign: 'center', py: 4, fontSize: '0.8rem', color: '#9ca3af' }}>
                  Loading messages...
                </Typography>
              ) : (messages ?? []).map((msg: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                const isAdmin = msg.senderType === 'admin';
                const text = msg.text ?? '';
                const isImage = /^https?:\/\//i.test(text) && IMAGE_EXTS.includes(getFileExt(text));
                return (
                  <Box key={msg._id} sx={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{ maxWidth: '60%' }}>
                      <Box sx={{
                        px: isImage ? 0.5 : 1.8,
                        py: isImage ? 0.5 : 1.1,
                        borderRadius: isAdmin ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        bgcolor: isImage ? 'transparent' : (isAdmin ? '#0D1B3E' : '#fff'),
                        border: (!isAdmin && !isImage) ? '1px solid #e5e7eb' : 'none',
                        boxShadow: isImage ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                      }}>
                        {renderMsgContent(text, isAdmin)}
                      </Box>
                      <Typography sx={{ fontSize: '0.62rem', color: '#9ca3af', mt: 0.4, textAlign: isAdmin ? 'right' : 'left' }}>
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>

            {/* Reply Input */}
            <Box sx={{ px: 2.5, py: 1.3, borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: '#fff' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <IconButton
                size="small"
                disabled={uploadLoading}
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: uploadLoading ? '#d1d5db' : '#9ca3af', '&:hover': { color: '#6b7280', bgcolor: '#f3f4f6' } }}
              >
                <AttachFileIcon sx={{ fontSize: 18 }} />
              </IconButton>
              {/* <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#6b7280', bgcolor: '#f3f4f6' } }}>
                <ImageIcon sx={{ fontSize: 18 }} />
              </IconButton>  */}
              <OutlinedInput
                fullWidth size="small" placeholder="Type a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                sx={{ fontSize: '0.85rem', borderRadius: 3, flex: 1, '& fieldset': { borderColor: '#e5e7eb' }, '& input': { py: 0.8 } }}
              />
              {/* <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#6b7280', bgcolor: '#f3f4f6' } }}>
                <EmojiEmotionsOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton> */}
              <IconButton onClick={handleSend}
                sx={{ width: 36, height: 36, bgcolor: '#E8490F', color: '#fff', borderRadius: '50%', flexShrink: 0, '&:hover': { bgcolor: '#c93d0c' } }}
              >
                <SendIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af' }}>Select a conversation</Typography>
          </Box>
        )}

      </Box>
    </AdminLayout>
  );
};

export default SupportChat;
