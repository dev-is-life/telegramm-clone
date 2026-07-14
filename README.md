# Telegram Clone 🚀

Real-time xabar almashish ilovasi - Telegram'ning zamonaviy kloni. Bu to'liq funksional chat ilovasi bo'lib, real-time xabarlar, OTP asosidagi autentifikatsiya, kontakt boshqaruvi va boshqa ko'plab xususiyatlarga ega.

## 🎯 Loyiha Kimlar Uchun?

Bu loyiha quyidagilar uchun mo'ljallangan:
- **Dasturchilar**: Real-time ilovalarni yaratishni o'rganmoqchi bo'lganlar
- **Talabalar**: Full-stack development amaliyotini oshirmoqchi bo'lganlar
- **Startaplar**: O'z chat ilovasini yaratmoqchi bo'lganlar
- **Open Source hissa qo'shuvchilar**: Loyihani rivojlantirishda ishtirok etmoqchi bo'lganlar

## ✨ Asosiy Xususiyatlar

### 🔐 Autentifikatsiya
- **OTP asosidagi tizim**: Parol yo'q, faqat email orqali OTP kod bilan kirish
- **Google OAuth**: Google hisobi orqali kirish imkoniyati
- **Email verification**: Xavfsizlik uchun email tasdiqlash

### 💬 Xabarlash
- **Real-time xabarlar**: Socket.io orqali onlayn xabar almashish
- **Matnli xabarlar**: Oddiy matnli xabarlar yuborish
- **Rasmli xabarlar**: UploadThing orqali rasm yuborish
- **Xabar reaksiyalari**: Emoji bilan reaksiya qo'shish
- **Xabar tahrirlash**: Yuborilgan xabarlarni tahrirlash
- **Xabar o'chirish**: Xabarlarni o'chirish imkoniyati
- **O'qilgan status**: Sent/Delivered/Read statuslari
- **Typing indicator**: Yozilayotganini ko'rsatish

### 👥 Kontakt Boshqaruvi
- **Kontakt qo'shish**: Email orqali yangi kontakt qo'shish
- **Kontakt ro'yxati**: Barcha kontaktlarni ko'rish
- **Oxirgi xabar**: Har bir kontactning oxirgi xabari
- **Online status**: Foydalanuvchilarning online/offline holati

### ⚙️ Profil Sozlamalari
- **Avatar yuklash**: Profil rasmini o'zgartirish
- **Ism va Familiya**: Profil ma'lumotlarini tahrirlash
- **Bio**: Haqida ma'lumot qo'shish
- **Email o'zgartirish**: Email manzilini yangilash
- **Ovozli bildirishnomalar**: Xabar kelganda ovoz
- **Yuborish ovozi**: Xabar yuborilganda ovoz
- **Sessiyani o'chirish**: Hisobni o'chirish

### 🎨 UI/UX
- **Dark Mode**: Tungi rejim
- **Responsive design**: Mobil va desktop uchun moslashuvchan
- **Zamonaviy dizayn**: shadcn/ui komponentlari
- **Animatsiyalar**: Silk animatsiyalar

## 🏗️ Texnik Arxitektura

Loyiha 3 qismdan iborat:

### 1. **Client** (Frontend)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **File Upload**: UploadThing
- **Notifications**: React Toastify

### 2. **Server** (Backend API)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + OTP
- **Email Service**: Nodemailer
- **Password Hashing**: bcrypt
- **CORS**: Cross-origin resource sharing

### 3. **Socket** (Real-time Server)
- **Framework**: Socket.io
- **Port**: 5000
- **Features**: 
  - Online user tracking
  - Real-time messaging
  - Typing indicators
  - Message updates
  - Contact creation notifications

## 🔧 Environment O'zgaruvchilari

### Server (.env)
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017

# Server
PORT=4000
CLIENT_URL=http://localhost:3000

# JWT
JWT_SECRET=your-jwt-secret-key

# SMTP (Email uchun)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Client (.env.local)
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB
MONGO_URI=mongodb://localhost:27017

# API
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Socket
Socket server alohida portda (5000) ishlaydi, qo'shimcha environment o'zgaruvchilari talab qilinmaydi.

## 📋 Prerequisities

Loyihani ishga tushirish uchun quyidagilar kerak:

- **Node.js** (v18 yoki yangiroq)
- **MongoDB** (lokal yoki cloud)
- **npm** yoki **yarn**
- **Git**
- **SMTP Email** (Gmail yoki boshqa email service)

## 🚀 Tezkor O'rnatish

### 1. Prerequisities
- **Node.js** (v18+)
- **MongoDB** (lokal yoki cloud)
- **npm** yoki **yarn**

### 2. MongoDB ni ishga tushiring
```bash
mongod
# Yoki MongoDB Atlasdan foydalaning
```

### 3. Dependencies o'rnatish
```bash
# Server
cd server
npm install

# Socket
cd ../socket
npm install

# Client
cd ../client
npm install
```

### 4. Environment fayllarini sozlash

**Server/.env:**
```env
MONGO_URI=mongodb://localhost:27017
PORT=4000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Client/.env.local:**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGO_URI=mongodb://localhost:27017
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Barcha servislarni ishga tushiring (3 ta terminalda)

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Socket:**
```bash
cd socket
npm run socket
```

**Terminal 3 - Client:**
```bash
cd client
npm run dev
```

### 6. Gmail SMTP App Password
1. Google Account > Security > 2-Step Verification
2. App passwords > "Mail" uchun password yarating
3. Server `.env` faylida `SMTP_PASS` sifatida ishlating

## 📁 Loyiha Tuzilishi

```
Telegramm-clone/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── (chat)/       # Chat interface
│   │   ├── auth/         # Authentication pages
│   │   └── api/          # API routes
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── forms/       # Form components
│   │   └── cards/       # Card components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── models/          # TypeScript models
│   ├── types/           # TypeScript types
│   └── http/            # Axios configuration
├── server/              # Express.js backend
│   ├── controllers/     # Route controllers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── midleweres/     # Express middlewares
│   ├── service/        # Business logic (email service)
│   ├── errors/         # Error handlers
│   └── lib/            # Constants and utilities
├── socket/             # Socket.io server
│   └── socket.js       # Socket event handlers
└── README.md           # This file
```

## 🛠️ Ishlatilgan Texnologiyalar

### Frontend
- Next.js 15.4.6
- React 18.3.1
- TypeScript 5
- TailwindCSS 4
- shadcn/ui
- Socket.io Client 4.8.1
- TanStack Query 5.90.5
- NextAuth.js 4.24.13
- React Hook Form 7.62.0
- Zod 4.0.17
- Zustand 5.0.7
- UploadThing 7.7.4
- Axios 1.13.1

### Backend
- Express.js 5.1.0
- Mongoose 8.19.2
- Socket.io 4.8.1
- Nodemailer 7.0.9
- bcrypt 6.0.0
- jsonwebtoken 9.0.2

## 📝 Autentifikatsiya Jarayoni

1. **Login**: Foydalanuvchi email kiritadi
2. **OTP yuborish**: Server 6 xonali OTP kod generatsiya qiladi va emailga yuboradi
3. **OTP tasdiqlash**: Foydalanuvchi kodni kiritadi
4. **Token generatsiya**: Server JWT token generatsiya qiladi
5. **Session**: NextAuth orqali session yaratiladi
6. **Kirish**: Foydalanuvchi tizimga kiradi

## 🎯 Real-time Messaging Ishlashi

1. **Socket ulanish**: Client socket serverga ulanadi (port 5000)
2. **Online status**: User online ekanligini bildiradi
3. **Xabar yuborish**: 
   - Xabar avval API orqali MongoDB'ga saqlanadi
   - Keyin socket orqali qabul qiluvchiga yuboriladi
4. **Real-time yangilanishlar**: 
   - Xabar tahrirlanganda
   - Xabar o'chirilganda
   - Reaksiya qo'shilganda
   - Typing indicator

## 🐞 Troubleshooting

### MongoDB ulanish muammosi
```bash
# MongoDB ishlayaptimi tekshiring
mongod --version

# MongoDB serviceni boshlang
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Port band bo'lsa
```bash
# Portni tekshiring
netstat -ano | findstr :4000  # Windows
lsof -i :4000  # Mac/Linux

# Boshqa port ishlating
# .env faylida PORT ni o'zgartiring
```

### OTP kelmasa
- SMTP sozlamalarini tekshiring
- Gmail app passwordni yangilang
- Spam folderini tekshiring

## 🤝 Hissa Qo'shish

Loyihaga hissa qo'shish uchun:

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. Changes commit qiling (`git commit -m 'Add amazing feature'`)
4. Branchga push qiling (`git push origin feature/amazing-feature`)
5. Pull Request oching

## 📄 Litsenziya

Bu loyiha o'quv maqsadlarida yaratilgan. Open source litsenziyasi ostida tarqatilishi mumkin.

## 👨‍💻 Ishlatish Tartibi

1. **MongoDB ni ishga tushiring**
2. **3 ta terminalda servislarni boshlang:**
   - Terminal 1: `cd server && npm run dev`
   - Terminal 2: `cd socket && npm run socket`
   - Terminal 3: `cd client && npm run dev`
3. **Brauzerda http://localhost:3000 ni oching**
4. **Google yoki Email orqali kirishingiz mumkin**
5. **Kontakt qo'shing va xabar almashing!**

## 📞 Qo'shimcha Ma'lumot

Agar savollaringiz bo'lsa yoki muammoga duch kelsangiz, loyiha repositoryda issue yarating.

---

**Yaratilgan ❤️ bilan | Full-stack Real-time Chat Application**
