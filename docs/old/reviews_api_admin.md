# Product Reviews API - Admin Documentation

## Overview

This API allows administrators to manage product reviews, including moderation, status changes, and deletion. All endpoints require admin authentication.

## Base URL

```
/site-api/api/admin
```

## Authentication

All endpoints require a valid admin JWT token in the `Authorization` header:

```
Authorization: Bearer <admin_access_token>
```

---

## Endpoints

### 1. List All Reviews

Retrieve a paginated list of all reviews with optional filtering by status.

**Request:**
```
GET /reviews
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | - | Filter by status: `pending`, `approved`, or `rejected` |
| `limit` | integer | No | 50 | Number of reviews per page (max 200) |
| `offset` | integer | No | 0 | Pagination offset |

**Example Request:**
```
GET /reviews?status=pending&limit=20&offset=0
```

**Success Response:**
```
Status: 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "product_id": 1,
    "rating": 5,
    "comment": "Отличный товар, очень доволен покупкой!",
    "status": "pending",
    "created_at": "2025-11-13T10:30:00Z",
    "updated_at": "2025-11-13T10:30:00Z",
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "first_name": "Иван",
      "last_name": "Петров",
      "email": "ivan@example.com",
      "phone": "+7-900-123-45-67"
    }
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "a47ac10b-58cc-4372-a567-0e02b2c3d480",
    "product_id": 2,
    "rating": 3,
    "comment": "Нормальный товар",
    "status": "pending",
    "created_at": "2025-11-12T14:15:00Z",
    "updated_at": "2025-11-12T14:15:00Z",
    "user": {
      "id": "a47ac10b-58cc-4372-a567-0e02b2c3d480",
      "first_name": "Мария",
      "last_name": "Сидорова",
      "email": "maria@example.com",
      "phone": "+7-900-123-45-68"
    }
  }
]
```

---

### 2. Get Review Details

Retrieve detailed information about a specific review.

**Request:**
```
GET /reviews/{review_id}
Authorization: Bearer <admin_access_token>
```

**Parameters:**
| Field | Type | Location | Description |
|-------|------|----------|-------------|
| `review_id` | UUID | URL Path | ID of the review |

**Success Response:**
```
Status: 200 OK
Content-Type: application/json
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "product_id": 1,
  "rating": 5,
  "comment": "Отличный товар, очень доволен покупкой!",
  "status": "pending",
  "created_at": "2025-11-13T10:30:00Z",
  "updated_at": "2025-11-13T10:30:00Z",
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "first_name": "Иван",
    "last_name": "Петров",
    "email": "ivan@example.com",
    "phone": "+7-900-123-45-67"
  }
}
```

**Error Responses:**

- **404 Not Found** - Review not found:
```json
{
  "error": {
    "code": "HTTP_ERROR",
    "message": "Отзыв не найден."
  }
}
```

---

### 3. Update Review Status

Approve, reject, or update the text of a review.

**Request:**
```
PATCH /reviews/{review_id}
Content-Type: application/json
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "status": "approved",
  "comment": "Проверено администратором"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | New status: `pending`, `approved`, or `rejected` |
| `comment` | string | No | Updated comment text (for moderation notes) |

**Success Response:**
```
Status: 200 OK
Content-Type: application/json
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "product_id": 1,
  "rating": 5,
  "comment": "Проверено администратором",
  "status": "approved",
  "created_at": "2025-11-13T10:30:00Z",
  "updated_at": "2025-11-13T11:45:00Z",
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "first_name": "Иван",
    "last_name": "Петров",
    "email": "ivan@example.com",
    "phone": "+7-900-123-45-67"
  }
}
```

**Error Responses:**

- **404 Not Found** - Review not found:
```json
{
  "error": {
    "code": "HTTP_ERROR",
    "message": "Отзыв не найден."
  }
}
```

- **400 Bad Request** - No update data provided:
```json
{
  "error": {
    "code": "HTTP_ERROR",
    "message": "Не указаны поля для обновления."
  }
}
```

---

### 4. Delete Review

Delete a review permanently.

**Request:**
```
DELETE /reviews/{review_id}
Authorization: Bearer <admin_access_token>
```

**Parameters:**
| Field | Type | Location | Description |
|-------|------|----------|-------------|
| `review_id` | UUID | URL Path | ID of the review to delete |

**Success Response:**
```
Status: 204 No Content
```

**Error Responses:**

- **404 Not Found** - Review not found:
```json
{
  "error": {
    "code": "HTTP_ERROR",
    "message": "Отзыв не найден."
  }
}
```

---

## Review Status Reference

| Status | Description | Visible to Users |
|--------|-------------|------------------|
| `pending` | Review awaiting moderation | No |
| `approved` | Review has been approved | Yes |
| `rejected` | Review has been rejected | No |

---

## Moderation Workflow

### Typical Moderation Flow

1. User creates a review → status: `pending`
2. Admin reviews the content
3. Admin updates status to `approved` or `rejected`
4. If `approved`, review becomes visible on the product page
5. If `rejected`, review remains hidden

### Example Workflow

```javascript
// Get pending reviews for moderation
GET /reviews?status=pending

// Review details
GET /reviews/{review_id}

// Approve the review
PATCH /reviews/{review_id}
{
  "status": "approved"
}

// Or reject the review
PATCH /reviews/{review_id}
{
  "status": "rejected",
  "comment": "Содержит неприемлемый язык"
}
```

---

## Example Admin Panel Integration

### Get Pending Reviews

```javascript
const getPendingReviews = async (adminToken) => {
  const response = await fetch('/site-api/api/admin/reviews?status=pending&limit=50', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });

  const reviews = await response.json();
  return reviews;
};
```

### Approve a Review

```javascript
const approveReview = async (reviewId, adminToken) => {
  const response = await fetch(`/site-api/api/admin/reviews/${reviewId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'approved'
    })
  });

  if (response.ok) {
    const updatedReview = await response.json();
    console.log('Review approved:', updatedReview);
  }
};
```

### Reject a Review

```javascript
const rejectReview = async (reviewId, reason, adminToken) => {
  const response = await fetch(`/site-api/api/admin/reviews/${reviewId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'rejected',
      comment: reason
    })
  });

  if (response.ok) {
    const updatedReview = await response.json();
    console.log('Review rejected:', updatedReview);
  }
};
```

### Delete a Review

```javascript
const deleteReview = async (reviewId, adminToken) => {
  const response = await fetch(`/site-api/api/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });

  if (response.status === 204) {
    console.log('Review deleted successfully');
  }
};
```

---

## Common Use Cases

### Moderate Reviews Periodically

1. Fetch pending reviews: `GET /reviews?status=pending`
2. Review each one: `GET /reviews/{review_id}`
3. Approve or reject: `PATCH /reviews/{review_id}`

### Search for Specific Reviews

Use the status filter to find:
- Pending reviews: `?status=pending`
- Approved reviews: `?status=approved`
- Rejected reviews: `?status=rejected`

### Batch Operations

To approve multiple reviews, call the PATCH endpoint for each review ID in sequence.

### Delete Inappropriate Content

Use DELETE endpoint to permanently remove problematic reviews.

