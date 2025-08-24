# OppoTrain Backend - Admin Only

نظام backend بسيط وآمن مبني بـ Node.js و Express، يستخدم Firebase Admin SDK للمصادقة. **لا يحتوي على تسجيل مستخدمين جدد** - فقط تسجيل دخول للمشرفين الموجودين.

## 🚀 **المميزات**

- **تسجيل دخول المشرفين فقط** - لا يوجد تسجيل مستخدمين جدد
- **Firebase Admin SDK** - مصادقة آمنة وموثوقة
- **JWT Tokens** - جلسات آمنة
- **نظام مصادقة بسيط** - بدون تعقيدات
- **إدارة الملف الشخصي** - تحديث البيانات الشخصية
- **إحصائيات النظام** - معلومات أساسية عن الخادم

## 🛠️ **التقنيات المستخدمة**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Admin SDK + Firestore
- **Authentication**: Firebase Admin Auth + JWT (JSON Web Tokens)
- **Validation**: Custom middleware
- **CORS**: Cross-origin resource sharing

## 📋 **المتطلبات**

- Node.js (v14 أو أحدث)
- npm أو yarn
- مشروع Firebase مع Admin SDK
- Service Account Key من Firebase

## 🚀 **التثبيت والإعداد**

### 1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd OppoTrain-Backend
```

### 2. **تثبيت التبعيات**
```bash
npm install
```

### 3. **إعداد Firebase Admin SDK**

#### **الطريقة الأولى: Service Account Key (مفضلة)**
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Project Settings** > **Service Accounts**
4. اضغط **Generate New Private Key**
5. احفظ الملف
6. انسخ محتوى الملف إلى متغير البيئة

#### **الطريقة الثانية: ملف Service Account**
1. احفظ ملف Service Account في مجلد المشروع
2. أضف path الملف إلى متغير البيئة

### 4. **إعداد متغيرات البيئة**
```bash
# انسخ ملف البيئة
cp env.example .env

# عدل الملف بإعداداتك
nano .env
```

**مثال على ملف .env:**
```env
# إعدادات الخادم
PORT=3000
NODE_ENV=development

# إعدادات JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# أو
GOOGLE_APPLICATION_CREDENTIALS=./path/to/serviceAccountKey.json
```

### 5. **إنشاء مشرف (مرة واحدة فقط)**
```bash
npm run create-admin
```

### 6. **تشغيل الخادم**
```bash
# وضع التطوير (مع إعادة التشغيل التلقائي)
npm run dev

# وضع الإنتاج
npm start
```

## 📚 **API Endpoints**

### **المصادقة** (`/api/auth`)

| الطريقة | المسار | الوصف | المصادقة مطلوبة |
|---------|--------|--------|-----------------|
| POST | `/login` | تسجيل دخول المشرف | لا |
| GET | `/profile` | ملف المستخدم الحالي | نعم |
| POST | `/refresh-token` | تحديث token | نعم |
| POST | `/logout` | تسجيل الخروج | نعم |
| GET | `/validate` | التحقق من صحة token | نعم |

### **إدارة المشرف** (`/api/admin`)

| الطريقة | المسار | الوصف | المصادقة مطلوبة |
|---------|--------|--------|-----------------|
| GET | `/profile` | ملف المشرف | نعم |
| PUT | `/profile` | تحديث ملف المشرف | نعم |
| GET | `/stats` | إحصائيات النظام | نعم |

### **فحص الصحة**

| الطريقة | المسار | الوصف |
|---------|--------|--------|
| GET | `/health` | حالة الخادم |

## 🔐 **كيفية المصادقة**

### **تسجيل الدخول**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oppotrain.com",
    "password": "admin123"
  }'
```

### **استخدام Token**
```bash
curl -X GET http://localhost:3000/api/admin/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 📊 **هيكل المشروع**

```
src/
├── app.js                 # الملف الرئيسي للتطبيق
├── config/
│   └── firebase-admin.js # إعدادات Firebase Admin SDK
├── controllers/
│   ├── authController.js # تحكم المصادقة
│   └── userController.js # تحكم المستخدم
├── middlewares/
│   ├── authMiddleware.js # middleware المصادقة
│   └── validationMiddleware.js # التحقق من صحة البيانات
├── routes/
│   ├── index.js          # Routes الرئيسية
│   ├── authRoutes.js     # Routes المصادقة
│   └── userRoutes.js     # Routes المستخدم
├── services/
│   └── authService.js    # خدمة المصادقة
└── scripts/
    └── createAdmin.js    # سكريبت إنشاء المشرف
```

## 🔒 **الأمان**

- **Firebase Admin SDK** - مصادقة موثوقة من Google
- **JWT Tokens** - جلسات آمنة وقابلة للتحديث
- **Custom Claims** - أدوار المستخدمين
- **Validation** - التحقق من صحة البيانات المدخلة
- **CORS Protection** - حماية من الطلبات غير المصرح بها

## 🚨 **ملاحظات مهمة**

1. **لا يوجد تسجيل مستخدمين جدد** - المشرفون يتم إنشاؤهم فقط عبر Firebase Console أو السكريبت
2. **Service Account Key** - يجب أن يكون آمناً ولا يتم مشاركته
3. **JWT Secret** - يجب أن يكون قوياً وفريداً في الإنتاج
4. **Firebase Rules** - تأكد من إعداد قواعد الأمان المناسبة

## 🧪 **اختبار النظام**

```bash
# فحص صحة الخادم
curl http://localhost:3000/health

# معلومات API
curl http://localhost:3000/api

# تسجيل دخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## 🆘 **الدعم**

إذا واجهت أي مشاكل:

1. تأكد من إعدادات Firebase Admin SDK
2. تحقق من متغيرات البيئة
3. تأكد من أن Service Account Key صحيح
4. راجع سجلات Firebase Console

## 📝 **التطوير المستقبلي**

- إضافة rate limiting
- إضافة logging شامل
- إضافة monitoring
- إضافة tests
- إضافة Docker support

---

**مبني بـ ❤️ باستخدام Node.js و Express و Firebase Admin SDK**
