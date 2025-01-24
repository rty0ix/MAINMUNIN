import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader, MessageSquare, Paperclip, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, saveChatSession, loadChatSessions } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { UserApprovalList } from '../components/admin/UserApprovalList';
import { supabase } from '../lib/supabase';
import { getDeepSeek } from '../lib/deepseek';
import type { Message, ChatSession } from '../types';

export const BPOA = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState('');
  
  const [activeTab, setActiveTab] = useState<'chat' | 'users'>('chat');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data: { publicUrl }, error } = supabase
          .storage
          .from('assets')
          .getPublicUrl('63e768ddbc6a9a0a4f9c59a4_BPOA_logo.png');
          
        if (error) throw error;
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  // Load chat sessions on component mount
  useEffect(() => {
    const loadSavedSessions = async () => {
      try {
        setIsLoading(true);
        const sessions = await loadChatSessions();
        if (sessions) {
          setChatSessions(sessions);
          if (sessions.length > 0 && !activeChatId) {
            setActiveChatId(sessions[0].id);
            setMessages(sessions[0].messages);
          }
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSessions();
  }, []);

  // Save chat session when messages change
  useEffect(() => {
    const saveSession = async () => {
      if (activeChatId && messages.length > 0) {
        try {
          const title = messages[0]?.content.slice(0, 30) || 'New Chat';
          await saveChatSession(activeChatId, messages, title);
        } catch (error) {
          console.error('Error saving chat session:', error);
        }
      }
    };

    saveSession();
  }, [messages, activeChatId]);

  const createNewChat = async () => {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setChatSessions([newChat, ...chatSessions]);
    setActiveChatId(newChat.id);
    setMessages([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await uploadDocument(file);
      
      const fileMessage: Message = {
        role: 'user',
        content: `Uploaded file: ${file.name}`
      };

      const summaryMessage: Message = {
        role: 'assistant',
        content: `Document Analysis:\n${result.summary}\n\nYou can access the document here: ${result.url}`
      };

      const newMessages = [...messages, fileMessage, summaryMessage];
      setMessages(newMessages);

      if (activeChatId) {
        const updatedSessions = chatSessions.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: newMessages,
              title: chat.messages.length === 0 ? `Analysis of ${file.name}` : chat.title
            };
          }
          return chat;
        });
        setChatSessions(updatedSessions);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error processing document. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const deepseek = getDeepSeek();
      const response = await deepseek.chat(inputText);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text
      };
      
      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);

      if (activeChatId) {
        const updatedSessions = chatSessions.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: newMessages,
              title: chat.messages.length === 0 ? inputText.slice(0, 30) : chat.title
            };
          }
          return chat;
        });
        setChatSessions(updatedSessions);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error processing your request. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/10 z-50"
      >
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bpoa-login')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            {logoUrl && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src={logoUrl}
                alt="BPOA Logo"
                className="h-8 w-auto"
              />
            )}
          </div>
          {user?.isAdmin && (
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'users'
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </motion.header>

      <div className="flex h-screen pt-16">
        {activeTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-32 bg-zinc-900 border-r border-white/10 overflow-y-auto"
          >
            <div className="p-2">
              <button
                onClick={createNewChat}
                className="w-full flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-2 px-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">New</span>
              </button>
            </div>
            <div className="space-y-1">
              {chatSessions.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left px-2 py-2 hover:bg-white/5 transition-colors ${
                    chat.id === activeChatId ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="text-xs font-medium truncate">{chat.title}</div>
                  <div className="text-[10px] text-white/50">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex-1 flex flex-col bg-gradient-to-b from-zinc-900 to-black">
          {activeTab === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="w-6 h-6 animate-spin text-white/50" />
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Paperclip className="w-6 h-6 text-white/70" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                  />
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isProcessing || !inputText.trim()}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-6 h-6 text-white/70" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <UserApprovalList />
          )}
        </div>
      </div>
    </div>
  );
};