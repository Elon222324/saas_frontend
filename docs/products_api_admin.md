# API Продуктов (Admin) - `/products`

## Аутентификация
Все эндпоинты (кроме `/products/public/`) требуют JWT токен в заголовке:
```
Authorization: Bearer <jwt_token>
```

---

## Эндпоинты

### 1. Получить все товары (админка)
```
GET /products/
```
**Ответ:** `ProductOut[]`

---

### 2. Получить активные товары (публичный)
```
GET /products/public/
```
**Auth:** Не требуется  
**Ответ:** `ProductOut[]`

---

### 3. Получить товар по ID
```
GET /products/{product_id}
```
**Ответ:** `ProductOut`

---

### 4. Создать товар
```
POST /products/
```
**Body:** `ProductCreate`  
**Ответ:** `ProductOut` (201)

---

### 5. Обновить товар
```
PATCH /products/{product_id}
```
**Body:** `ProductUpdate` (частичный)  
**Ответ:** `ProductOut`

---

### 6. Удалить товар
```
DELETE /products/{product_id}
```
**Ответ:** 204 No Content

---

## Схемы данных

### ProductCreate (обязательные поля)
```typescript
{
  title: string,
  slug: string,
  currency?: string = "₽",
  description?: string,
  full_description?: string,
  image_url?: string,
  gallery?: string[],
  category_id?: number,
  labels?: number[],
  props?: object,
  related_product_ids?: number[],
  custom_data?: object,
  order?: number = 0,
  active?: boolean = true,
  variants: ProductVariantIn[],  // ОБЯЗАТЕЛЬНО
  extra_group_ids?: number[],
  descriptive_option_value_ids?: number[],
  // SEO
  meta_title?: string,
  meta_description?: string,
  keywords?: string
}
```

### ProductUpdate (все поля опциональны)
```typescript
{
  title?: string,
  slug?: string,
  currency?: string,
  description?: string,
  full_description?: string,
  image_url?: string,
  gallery?: string[],
  category_id?: number,
  labels?: number[],
  props?: object,
  related_product_ids?: number[],
  custom_data?: object,
  order?: number,
  active?: boolean,
  variants?: ProductVariantIn[],
  extra_group_ids?: number[],
  descriptive_option_value_ids?: number[],
  // SEO
  meta_title?: string,
  meta_description?: string,
  keywords?: string
}
```

### ProductVariantIn
```typescript
{
  image_url?: string,
  price: number,  // ОБЯЗАТЕЛЬНО
  old_price?: number,
  sku?: string,
  weight?: string,
  is_available?: boolean = true,
  option_value_ids?: number[]
}
```

### ProductOut (ответ)
```typescript
{
  id: number,
  title: string,
  slug: string,
  currency: string | null,
  description: string | null,
  full_description: string | null,
  image_url: string | null,
  gallery: string[] | null,
  category_id: number | null,
  labels: number[] | null,
  rating: number | null,
  rating_count: number,
  props: object | null,
  related_product_ids: number[] | null,
  custom_data: object | null,
  order: number,
  active: boolean,
  created_at: string (ISO 8601),
  updated_at: string (ISO 8601),
  variants: ProductVariantOut[],
  extra_groups: ExtraGroupOut[],
  descriptive_options: DescriptiveGroupOut[],
  // SEO
  meta_title: string | null,
  meta_description: string | null,
  keywords: string | null
}
```

### ProductVariantOut
```typescript
{
  id: number,
  product_id: number,
  image_url: string | null,
  price: number,
  old_price: number | null,
  sku: string | null,
  weight: string | null,
  is_available: boolean,
  option_value_ids: number[]
}
```

### ExtraGroupOut
```typescript
{
  id: number,
  name: string,
  selection_type: string,
  min_selection: number,
  max_selection: number | null,
  items: ExtraItemOut[]
}
```

### ExtraItemOut
```typescript
{
  id: number,
  name: string,
  image_url: string | null,
  order: number,
  price: number
}
```

### DescriptiveGroupOut
```typescript
{
  id: number,
  name: string,
  slug: string,
  values: DescriptiveOptionValueOut[]
}
```

### DescriptiveOptionValueOut
```typescript
{
  id: number,
  value: string,
  order: number
}
```

---

## Ошибки

| Код | Описание |
|-----|----------|
| 401 | Не авторизован / неверный токен |
| 404 | Товар не найден |
| 409 | Товар с таким slug уже существует |
| 400 | Неверные данные запроса |
| 500 | Внутренняя ошибка сервера |

