# دليل استخدام نظام الملف الشخصي و WhatsApp

## نظرة عامة
تم تطوير نظام متكامل يحفظ بيانات المستخدمين في MongoDB ويرسل رسائل WhatsApp تلقائياً مع بيانات العميل والمنتج.

## المميزات الجديدة

### 1. صفحة الملف الشخصي (`/profile`)
- **حفظ البيانات في MongoDB**: جميع البيانات تُحفظ في قاعدة البيانات وتبقى موجودة
- **تحميل البيانات التلقائي**: عند زيارة الصفحة، تُحمل البيانات المحفوظة مسبقاً
- **التحقق من المصادقة**: يجب تسجيل الدخول للوصول للصفحة
- **البيانات المطلوبة**:
  - الاسم الأول والأخير
  - البريد الإلكتروني ورقم الهاتف
  - العنوان الكامل (الشارع، المدينة، المحافظة، الرمز البريدي، البلد)

### 2. نظام WhatsApp المتطور
- **رسائل تلقائية**: تتضمن بيانات العميل والمنتج
- **التحقق من الملف الشخصي**: يطلب إكمال الملف الشخصي قبل الطلب
- **معلومات شاملة**: تشمل جميع تفاصيل الطلب والتوصيل

## كيفية الاستخدام

### للمستخدمين:
1. **إنشاء حساب أو تسجيل الدخول**
2. **زيارة صفحة الملف الشخصي** (`/profile`)
3. **إدخال البيانات الشخصية** وحفظها
4. **تصفح المنتجات** واختيار المنتج المطلوب
5. **الضغط على "Order via WhatsApp"** لإرسال الطلب

### للمطورين:

#### تشغيل الخادم:
```bash
# تشغيل خادم API
npm run server

# تشغيل تطبيق Next.js
npm run dev
```

#### APIs الجديدة:

**1. الحصول على الملف الشخصي:**
```
GET /api/profile
Headers: Authorization: Bearer <token>
```

**2. حفظ/تحديث الملف الشخصي:**
```
POST /api/profile
Headers: Authorization: Bearer <token>
Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  }
}
```

**3. إنشاء طلب WhatsApp:**
```
POST /api/whatsapp-order
Headers: Authorization: Bearer <token>
Body: {
  productId: string,
  size: string,
  color: string,
  quantity: number
}
Response: {
  whatsappUrl: string,
  customerInfo: string
}
```

## قاعدة البيانات

### Profile Schema:
```javascript
{
  user: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## رسالة WhatsApp النموذجية:
```
🌲 Forest Fashion - طلب جديد

👤 بيانات العميل:
الاسم: أحمد محمد
البريد الإلكتروني: ahmed@example.com
رقم الهاتف: +201234567890

📍 عنوان التوصيل:
123 شارع النيل
القاهرة, القاهرة
12345
مصر

🛍️ تفاصيل المنتج:
المنتج: Forest Dark Jacket
السعر: $150
المقاس: L
اللون: Black
الكمية: 1

💰 إجمالي الطلب: $150.00

---
تم إرسال هذا الطلب من موقع Forest Fashion
```

## الأمان
- **JWT Authentication**: جميع APIs محمية بـ JWT
- **تشفير البيانات**: كلمات المرور مشفرة
- **التحقق من الملكية**: كل مستخدم يرى بياناته فقط

## الملفات المهمة
- `/app/profile/page.js` - صفحة الملف الشخصي
- `/app/components/WhatsAppOrderButton.js` - زر WhatsApp
- `/server/index.js` - خادم API مع routes الجديدة
- `/app/product/[id]/page.js` - صفحة المنتج مع زر WhatsApp

## رقم WhatsApp
الرقم المستخدم حالياً: `201097767079`
يمكن تغييره في `/server/index.js` في route `/api/whatsapp-order`

## ملاحظات مهمة
1. **يجب تشغيل الخادم** على المنفذ 3001
2. **MongoDB متصل** ويعمل بشكل صحيح
3. **البيانات محفوظة بشكل دائم** في قاعدة البيانات
4. **رسائل WhatsApp تفتح في نافذة جديدة** مع الرسالة معبأة مسبقاً