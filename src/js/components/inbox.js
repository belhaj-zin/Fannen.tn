document.addEventListener('DOMContentLoaded', () => {
    // Protected Route Simulation
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user' };

    if (!authState.isLoggedIn || authState.role !== 'artisan') {
        window.location.href = 'auth.html';
        return;
    }

    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-message-input');
    const chatContainer = document.getElementById('chat-messages-container');
    
    // Load sent messages from localStorage
    const sentMessages = JSON.parse(localStorage.getItem('fannen_sent_messages') || '[]');
    sentMessages.forEach(msg => {
        appendMessage(msg.content, 'sent');
    });

    if (chatForm && chatInput && chatContainer) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const messageText = chatInput.value.trim();
            if (!messageText) return;
            
            // Append message to UI
            appendMessage(messageText, 'sent');
            
            // Save to localStorage
            sentMessages.push({
                id: 'msg-' + Date.now(),
                content: messageText,
                status: 'unread',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('fannen_sent_messages', JSON.stringify(sentMessages));
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    }

    function appendMessage(text, type) {
        if (!chatContainer) return;
        
        const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const html = `
            <div class="message-bubble message-${type}">
                <p>${text}</p>
                <div class="text-right" style="font-size: 0.7rem; margin-top: 0.25rem; ${type === 'sent' ? 'color: rgba(255,255,255,0.8);' : 'color: var(--color-text-lighter);'}">
                    ${timeStr} ${type === 'sent' ? '&check;&check;' : ''}
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', html);
    }

    // 1. Fetch and populate conversations
    const conversationListContainer = document.getElementById('conversation-list-container');
    if (conversationListContainer) {
        fetch('../js/data/conversations.json')
            .then(res => res.json())
            .then(data => {
                conversationListContainer.innerHTML = '';
                data.forEach(conv => {
                    const activeClass = conv.isActive ? 'active' : '';
                    const badgeHtml = conv.unreadCount > 0 ? `<span class="badge" style="position:static; margin: auto 0; padding: 0.25rem 0.5rem; font-size: 0.65rem;">${conv.unreadCount}</span>` : '';
                    
                    const div = document.createElement('div');
                    div.className = `conversation-item ${activeClass}`;
                    div.id = conv.id;
                    div.innerHTML = `
                        <img src="${conv.avatar}" alt="${conv.partnerName}" class="avatar">
                        <div style="flex:1;">
                            <div class="flex justify-between items-center" style="margin-bottom: 0.25rem;">
                                <strong class="text-sm font-bold">${conv.partnerName}</strong>
                                <span class="text-xs text-text-lighter" style="font-size: 0.75rem;">${conv.timestamp}</span>
                            </div>
                            <p class="text-sm text-text-light" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">
                                ${conv.lastMessage}</p>
                        </div>
                        ${badgeHtml}
                    `;
                    conversationListContainer.appendChild(div);
                });
                
                attachConversationListeners();
                
                // Auto-load active conversation
                const activeItem = document.querySelector('.conversation-item.active');
                if (activeItem) {
                    activeItem.click();
                }
            })
            .catch(err => console.error('Error loading conversations:', err));
    }

    function attachConversationListeners() {
        const conversationItems = document.querySelectorAll('.conversation-item');
        conversationItems.forEach(item => {
            item.addEventListener('click', () => {
                conversationItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const chatHeaderTitle = document.querySelector('.chat-header h2');
                const chatHeaderAvatar = document.querySelector('.chat-header img');
                const authorName = item.querySelector('.font-bold').textContent;
                
                chatHeaderTitle.textContent = "Chat with " + authorName;
                chatHeaderAvatar.src = item.querySelector('img').src;
                
                chatContainer.innerHTML = `
                    <div class="text-center" style="margin-bottom: 2rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-lighter); letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); padding-bottom: 0.25rem;">Today</span>
                    </div>
                `;

                // Fetch and render messages for this conversation
                fetch('../js/data/messages.json')
                    .then(res => res.json())
                    .then(messages => {
                        const convMessages = messages.filter(msg => msg.conversationId === item.id);
                        if (convMessages.length === 0) {
                            chatContainer.innerHTML += `
                                <div class="text-center text-text-lighter" style="margin-top: 2rem; font-size: 0.875rem;">
                                    No messages yet.
                                </div>
                            `;
                        } else {
                            convMessages.forEach(msg => {
                                const html = `
                                    <div class="message-bubble message-${msg.type}">
                                        <p>${msg.content}</p>
                                        <div class="text-right" style="font-size: 0.7rem; margin-top: 0.25rem; ${msg.type === 'sent' ? 'color: rgba(255,255,255,0.8);' : 'color: var(--color-text-lighter);'}">
                                            ${msg.time} ${msg.type === 'sent' ? '&check;&check;' : ''}
                                        </div>
                                    </div>
                                `;
                                chatContainer.insertAdjacentHTML('beforeend', html);
                            });
                        }
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    })
                    .catch(err => console.error('Error loading messages:', err));
            });
        });
    }

    // 2 & 3. Info and More Buttons
    const infoBtn = document.querySelector('button[aria-label="Info"]');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            alert("Information:\nUser is highly interested in ceramics.\nJoined: Oct 2023");
        });
    }

    const moreBtn = document.querySelector('button[aria-label="More"]');
    if (moreBtn) {
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let popup = document.getElementById('more-popup-mock');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'more-popup-mock';
                popup.style.cssText = `
                    position: absolute; right: 2rem; top: 5rem; background: white; border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm); box-shadow: var(--shadow-sm); z-index: 100;
                    display: flex; flex-direction: column; padding: 0.5rem; gap: 0.5rem;
                `;
                popup.innerHTML = `
                    <button class="btn-ghost" style="text-align: left; padding: 0.25rem 0.5rem;">Archive Chat</button>
                    <button class="btn-ghost" style="text-align: left; padding: 0.25rem 0.5rem; color: red;">Delete Chat</button>
                `;
                document.body.appendChild(popup);
                
                document.addEventListener('click', () => popup.style.display = 'none');
            }
            popup.style.display = popup.style.display === 'none' ? 'flex' : 'none';
        });
    }

    // 5. Attachment Button
    const attachBtn = document.getElementById('btn-attach');
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
                if(e.target.files.length > 0) {
                    appendMessage(`[Attachment: ${e.target.files[0].name}]`, 'sent');
                }
            };
            input.click();
        });
    }
});
