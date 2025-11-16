# 🔔 API Документация: Уведомления тикетов поддержки (Admin)

## Общая информация

Система уведомлений для администраторов поддержки позволяет отслеживать, какие сообщения от пользователей были прочитаны, и получать статистику по непрочитанным сообщениям и тикетам.

**Базовый URL**: `/site-api/admin/support/tickets`

## Новые поля в моделях

### SupportTicketMessageOut (обновленная модель)
```json
{
  "id": "uuid",
  "user_id": "string",
  "message": "string",
  "is_admin": "boolean",
  "created_at": "datetime",
  "is_read_by_admin": "boolean",
  "is_read_by_user": "boolean",
  "read_by_admin_at": "datetime | null",
  "read_by_user_at": "datetime | null"
}
```

### SupportTicketAdminOut (обновленная модель)
```json
{
  "id": "uuid",
  "order_id": "uuid",
  "user_id": "string",
  "user_name": "string | null",
  "status": "string",
  "category": "string",
  "priority": "string",
  "message": "string",
  "admin_response": "string | null",
  "admin_id": "string | null",
  "resolution_notes": "string | null",
  "messages": [SupportTicketMessageOut],
  "created_at": "datetime",
  "updated_at": "datetime",
  "resolved_at": "datetime | null",
  "closed_at": "datetime | null",
  "user_last_read_at": "datetime | null",
  "admin_last_read_at": "datetime | null"
}
```

### AdminUnreadStatsOut
```json
{
  "new_unread_tickets": "integer",
  "total_unread_messages": "integer",
  "unread_by_ticket": [
    {
      "ticket_id": "uuid",
      "unread_count": "integer",
      "last_unread_created_at": "datetime | null"
    }
  ]
}
```

## Новые эндпоинты

### GET `/admin/support/tickets/unread/stats`
Получить статистику по непрочитанным сообщениям от пользователей

**Аутентификация**: Требуется Admin JWT токен

**Ответ**: 200 OK
```json
{
  "new_unread_tickets": 3,
  "total_unread_messages": 7,
  "unread_by_ticket": [
    {
      "ticket_id": "123e4567-e89b-12d3-a456-426614174000",
      "unread_count": 2,
      "last_unread_created_at": "2024-01-15T10:30:00Z"
    },
    {
      "ticket_id": "223e4567-e89b-12d3-a456-426614174001",
      "unread_count": 3,
      "last_unread_created_at": "2024-01-15T09:15:00Z"
    },
    {
      "ticket_id": "323e4567-e89b-12d3-a456-426614174002",
      "unread_count": 2,
      "last_unread_created_at": "2024-01-15T08:45:00Z"
    }
  ]
}
```

**Использование**:
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:8001/site-api/admin/support/tickets/unread/stats
```

---

### POST `/admin/support/tickets/{ticket_id}/mark-read`
Отметить все непрочитанные сообщения в тикете как прочитанные (от пользователей)

**Аутентификация**: Требуется Admin JWT токен

**Параметры пути**:
- `ticket_id` - UUID тикета

**Тело запроса**: Пусто или пустой JSON объект

**Ответ**: 200 OK
```json
{
  "id": "uuid",
  "order_id": "uuid",
  "user_id": "string",
  "user_name": "string | null",
  "status": "string",
  "category": "string",
  "priority": "string",
  "message": "string",
  "admin_response": "string | null",
  "admin_id": "string | null",
  "resolution_notes": "string | null",
  "messages": [SupportTicketMessageOut],
  "created_at": "datetime",
  "updated_at": "datetime",
  "resolved_at": "datetime | null",
  "closed_at": "datetime | null",
  "admin_last_read_at": "datetime (NOW при отметке)"
}
```

**Ошибки**:
- `404 TICKET_NOT_FOUND` - Тикет не найден

**Использование**:
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  http://localhost:8001/site-api/admin/support/tickets/123e4567-e89b-12d3-a456-426614174000/mark-read
```

---

### POST `/admin/support/tickets/messages/{message_id}/mark-read`
Отметить конкретное сообщение как прочитанное (сообщение от пользователя)

**Аутентификация**: Требуется Admin JWT токен

**Параметры пути**:
- `message_id` - UUID сообщения

**Тело запроса**: Пусто или пустой JSON объект

**Ответ**: 200 OK
```json
{
  "id": "uuid",
  "user_id": "string",
  "message": "string",
  "is_admin": false,
  "created_at": "datetime",
  "is_read_by_admin": true,
  "is_read_by_user": "boolean",
  "read_by_admin_at": "datetime (NOW при отметке)",
  "read_by_user_at": "datetime | null"
}
```

**Ошибки**:
- `404 TICKET_NOT_FOUND` - Сообщение не найдено

**Использование**:
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  http://localhost:8001/site-api/admin/support/tickets/messages/123e4567-e89b-12d3-a456-426614174000/mark-read
```

---

## Рекомендуемая логика для админки

### 1. Dashboard администратора (общий обзор)
**Что показывать**:
- Значок уведомления с количеством тикетов с новыми сообщениями от пользователей
- Общее количество непрочитанных сообщений
- Кнопка перехода в список тикетов

**Код**:
```javascript
// Получить статистику при загрузке страницы
async function loadAdminStats() {
  const response = await fetch('/site-api/admin/support/tickets/unread/stats', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const stats = await response.json();
  
  // Показать значок на иконке тикетов в навигации
  if (stats.new_unread_tickets > 0) {
    showNotificationBadge(stats.new_unread_tickets, 'tickets');
  }
  
  // Опционально: показать на dashboard
  document.getElementById('unread-tickets-count').textContent = stats.new_unread_tickets;
  document.getElementById('total-unread-messages').textContent = stats.total_unread_messages;
  
  console.log(`Новых тикетов с сообщениями: ${stats.new_unread_tickets}`);
  console.log(`Всего непрочитанных сообщений: ${stats.total_unread_messages}`);
}
```

### 2. Список тикетов (Admin Tickets List)
**Что показывать**:
- Индикатор рядом с каждым тикетом, если есть новые сообщения
- Количество новых сообщений в каждом тикете
- Сортировка: сначала тикеты с новыми сообщениями

**Код**:
```javascript
async function loadAdminTickets() {
  const response = await fetch('/site-api/admin/support/tickets', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const tickets = await response.json();
  
  // Получить статистику
  const statsResponse = await fetch('/site-api/admin/support/tickets/unread/stats', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const stats = await statsResponse.json();
  const unreadMap = {};
  
  stats.unread_by_ticket.forEach(item => {
    unreadMap[item.ticket_id] = item.unread_count;
  });
  
  // Отсортировать: сначала с новыми сообщениями
  const sortedTickets = tickets.sort((a, b) => {
    const aUnread = unreadMap[a.id] || 0;
    const bUnread = unreadMap[b.id] || 0;
    return bUnread - aUnread;
  });
  
  // Отобразить каждый тикет
  sortedTickets.forEach(ticket => {
    const unreadCount = unreadMap[ticket.id] || 0;
    renderAdminTicketItem(ticket, unreadCount);
  });
}

function renderAdminTicketItem(ticket, unreadCount) {
  const element = document.createElement('tr');
  
  let badge = '';
  if (unreadCount > 0) {
    badge = `<span class="badge badge-danger">${unreadCount}</span>`;
  }
  
  const userName = ticket.user_name || 'N/A';
  const statusClass = `status-${ticket.status}`;
  const priorityClass = `priority-${ticket.priority}`;
  
  element.innerHTML = `
    <td>
      ${badge}
    </td>
    <td>${ticket.id.substring(0, 8)}...</td>
    <td>${userName}</td>
    <td>${ticket.category}</td>
    <td><span class="status ${statusClass}">${ticket.status}</span></td>
    <td><span class="priority ${priorityClass}">${ticket.priority}</span></td>
    <td>${new Date(ticket.created_at).toLocaleString()}</td>
    <td>
      <a href="/admin/tickets/${ticket.id}" class="btn btn-sm btn-primary">Открыть</a>
    </td>
  `;
  
  document.getElementById('tickets-table-body').appendChild(element);
}
```

### 3. Детальный вид тикета (Ticket Detail View)
**Что показывать**:
- Все сообщения от пользователя и ответы администратора
- Индикатор "новое/прочитано" для сообщений пользователя
- После открытия автоматически отметить сообщения как прочитанные

**Код**:
```javascript
async function loadAdminTicketDetail(ticketId) {
  const response = await fetch(`/site-api/admin/support/tickets/${ticketId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const ticket = await response.json();
  renderAdminTicketMessages(ticket);
  
  // Отметить тикет как прочитанный
  await markAdminTicketAsRead(ticketId);
}

async function markAdminTicketAsRead(ticketId) {
  const response = await fetch(`/site-api/admin/support/tickets/${ticketId}/mark-read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    console.log('Ticket marked as read by admin');
    // Обновить значок в навигации
    await updateNotificationBadge();
  }
}

function renderAdminTicketMessages(ticket) {
  const container = document.getElementById('messages-container');
  container.innerHTML = ''; // Очистить
  
  ticket.messages.forEach(msg => {
    const element = document.createElement('div');
    element.className = `message ${msg.is_admin ? 'admin-response' : 'user-message'}`;
    
    let readIndicator = '';
    if (!msg.is_admin) {
      // Для сообщений пользователя показывать статус прочтения админом
      if (msg.is_read_by_admin) {
        readIndicator = '<span class="read-indicator">✓ прочитано админом</span>';
      } else {
        readIndicator = '<span class="unread-indicator">● новое сообщение</span>';
      }
    } else {
      // Для ответов администратора показывать статус прочтения пользователем
      if (msg.is_read_by_user) {
        readIndicator = '<span class="user-read-indicator">✓ прочитано пользователем</span>';
      } else {
        readIndicator = '<span class="user-unread-indicator">● не прочитано пользователем</span>';
      }
    }
    
    element.innerHTML = `
      <div class="message-header">
        <strong>${msg.is_admin ? '🔐 Ответ администратора' : '👤 Сообщение пользователя'}</strong>
        ${readIndicator}
      </div>
      <p>${msg.message}</p>
      <small>${new Date(msg.created_at).toLocaleString()}</small>
      ${msg.read_by_admin_at ? `<small class="read-timestamp">Прочитано: ${new Date(msg.read_by_admin_at).toLocaleString()}</small>` : ''}
      ${msg.is_read_by_user && msg.read_by_user_at ? `<small class="user-read-timestamp">Пользователь прочитал: ${new Date(msg.read_by_user_at).toLocaleString()}</small>` : ''}
    `;
    
    container.appendChild(element);
  });
}
```

### 4. Обновление UI в реальном времени
Если используется WebSocket или polling:

```javascript
// Обновлять статистику каждые 5 секунд на странице с тикетами
setInterval(async () => {
  const stats = await fetch('/site-api/admin/support/tickets/unread/stats', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  }).then(r => r.json());
  
  updateAdminNotificationBadge(stats.new_unread_tickets);
  updateTicketsStatus(stats);
}, 5000);

function updateAdminNotificationBadge(count) {
  const badge = document.getElementById('admin-tickets-badge');
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}
```

---

## Сценарии использования

### Сценарий 1: Администратор получает уведомление о новом сообщении
1. Пользователь отправляет новое сообщение в тикет
2. На dashboard/навигации администратора появляется значок "Уведомления (3)"
3. Значок показывает количество тикетов с новыми сообщениями
4. Администратор кликает на значок и переходит к списку тикетов

### Сценарий 2: Администратор просматривает список тикетов
1. Тикеты отсортированы: сначала те, которые содержат новые сообщения
2. Рядом с каждым тикетом видно количество новых сообщений: "Тикет (3)"
3. Администратор видит приоритет и категорию для каждого тикета
4. Администратор кликает на "Открыть" для просмотра деталей

### Сценарий 3: Администратор открывает детальный вид тикета
1. При открытии вызывается `POST /mark-read` для всех сообщений от пользователя
2. Все непрочитанные сообщения помечаются как прочитанные
3. Значок в навигации обновляется (уменьшается количество)
4. Администратор видит все сообщения с индикаторами прочтения
5. Видно, когда администратор последний раз читал этот тикет (`admin_last_read_at`)
6. Видно, прочитали ли пользователи ответы администратора

### Сценарий 4: Отслеживание ответа пользователя
1. Администратор отправляет ответ пользователю
2. На странице тикета видно, что ответ отправлен
3. Когда пользователь откроет тикет, он автоматически отметит ответ как прочитанный
4. На странице администратора рядом с ответом появится "✓ прочитано пользователем"

---

## Стили для CSS

```css
/* Значок уведомления */
#admin-tickets-badge {
  display: none;
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

/* Статусы тикетов */
.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-new {
  background-color: #e7f3ff;
  color: #0056b3;
}

.status-in_progress {
  background-color: #fff3cd;
  color: #856404;
}

.status-resolved {
  background-color: #d4edda;
  color: #155724;
}

.status-closed {
  background-color: #f8f9fa;
  color: #6c757d;
}

/* Приоритет тикетов */
.priority {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.priority-urgent {
  background-color: #f8d7da;
  color: #721c24;
}

.priority-high {
  background-color: #f5c6cb;
  color: #721c24;
}

.priority-normal {
  background-color: #d1ecf1;
  color: #0c5460;
}

.priority-low {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Сообщения */
.message {
  padding: 12px;
  margin: 8px 0;
  border-radius: 4px;
  border-left: 4px solid #ccc;
}

.message.user-message {
  background-color: #f8f9fa;
  border-left-color: #0056b3;
}

.message.admin-response {
  background-color: #d4edda;
  border-left-color: #28a745;
}

/* Индикаторы прочтения */
.read-indicator {
  display: inline-block;
  color: #28a745;
  font-size: 12px;
  margin-left: 8px;
  font-weight: bold;
}

.unread-indicator {
  display: inline-block;
  color: #dc3545;
  font-size: 14px;
  margin-left: 8px;
  font-weight: bold;
  animation: pulse 1s infinite;
}

.user-read-indicator {
  display: inline-block;
  color: #17a2b8;
  font-size: 12px;
  margin-left: 8px;
  font-weight: bold;
}

.user-unread-indicator {
  display: inline-block;
  color: #ffc107;
  font-size: 14px;
  margin-left: 8px;
  font-weight: bold;
}

.read-timestamp {
  display: block;
  color: #6c757d;
  font-size: 11px;
  margin-top: 4px;
}

.user-read-timestamp {
  display: block;
  color: #17a2b8;
  font-size: 11px;
  margin-top: 4px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## Обработка ошибок

Все ошибки возвращаются в формате:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки"
  }
}
```

**Возможные коды ошибок**:
- `TICKET_NOT_FOUND` - Тикет или сообщение не найдены
