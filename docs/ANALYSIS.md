# Analisis Aplikasi Forex Trading Helper

## Fitur-Fitur Aplikasi

### 1. Lot Calculator (Kalkulator Ukuran Posisi)

Fitur untuk menghitung ukuran posisi trading yang tepat berdasarkan risk management.

#### Input Parameters:
- **Mata Uang Akun (Account Currency)**: USD, EUR, JPY, GBP, AUD, CAD, CHF, NZD, IDR
- **Risiko per Transaksi (%)**: Persentase risiko dari saldo akun
- **Saldo Akun (Account Balance)**: Total saldo dalam mata uang akun
- **Stop Loss**: Dalam pips (untuk forex) atau poin (untuk XAU/USD)
- **Pair**: Pasangan mata uang yang akan ditrading
  - Major pairs: EURUSD, GBPUSD, AUDUSD, NZDUSD, USDJPY, USDCHF, USDCAD
  - Cross pairs: EURJPY, EURGBP, EURCHF, GBPJPY, GBPCHF, AUDJPY, AUDCHF, CADJPY, CHFJPY, NZDJPY
  - XAU/USD (Emas)
- **Harga Terkini/Konversi**: Hanya diperlukan untuk kasus tertentu

#### Output:
- **Ukuran Lot**: Ukuran lot yang harus digunakan
- **Ukuran Posisi**: Jumlah unit yang akan ditrading
- **Jumlah Risiko**: Total risiko dalam mata uang akun

#### Rumus Perhitungan:

**Rumus Umum:**
```
Lot = RisikoAkun / (SL × DesimalPip × UkuranKontrak × Konversi(QC→Akun))
```

**Detail Perhitungan:**

1. **Jumlah Risiko (Risk Amount)**:
   ```
   Risk Amount = Account Balance × (Risk % / 100)
   ```

2. **Nilai Pip per Lot**:
   - Untuk XXX/USD dengan Account Currency = USD: $10 per lot
   - Untuk USD/XXX dengan Account Currency = USD: $10 / Current Price per lot
   - Untuk Cross Pair: Perlu konversi dari Quote Currency ke Account Currency
   - Untuk XAU/USD: $1 per poin per lot (dalam USD)

3. **Ukuran Lot**:
   ```
   Lot Size = Risk Amount / (Stop Loss × Pip Value per Lot)
   ```

4. **Ukuran Posisi (Position Size)**:
   ```
   Position Size = Lot Size × Contract Size
   ```
   - Standard lot = 100,000 units
   - Mini lot = 10,000 units
   - Micro lot = 1,000 units

5. **Konversi Mata Uang** (jika diperlukan):
   - Jika Account Currency ≠ Quote Currency, perlu konversi
   - Contoh: EURGBP dengan Account USD → perlu harga GBPUSD untuk konversi

#### Logika Kondisional:

- **XXX/USD & AC=USD**: Tidak perlu harga (nilai pip 1 lot = $10)
- **USD/XXX & AC=USD**: Perlu harga simbol saat ini
- **Cross Pair**: Perlu harga QC→AC (contoh: GBPUSD untuk EURGBP saat akun USD)
- **XAU/USD**: SL dalam poin (mis. $5 = 500 poin), nilai pip 1 lot = $1/poin dalam USD
- **Mata Uang Akun ≠ Quote**: Butuh konversi (isi harga yang benar atau kebalikannya 1/harga)

### 2. Trade History (Riwayat Trading)

Fitur untuk mencatat dan menyimpan semua transaksi trading yang telah dilakukan.

#### Data yang Disimpan:
- **Trade ID**: Unique identifier untuk setiap trade
- **Tanggal & Waktu**: Timestamp entry dan exit
- **Pair**: Pasangan mata uang yang ditrading
- **Direction**: Buy atau Sell
- **Entry Price**: Harga saat masuk posisi
- **Exit Price**: Harga saat keluar posisi
- **Lot Size**: Ukuran lot yang digunakan
- **Stop Loss**: Level stop loss yang ditetapkan
- **Take Profit**: Level take profit yang ditetapkan
- **Pips/Points**: Selisih pips/poin antara entry dan exit
- **Profit/Loss**: Keuntungan atau kerugian dalam mata uang akun
- **Risk Amount**: Jumlah risiko yang digunakan
- **Risk/Reward Ratio**: Rasio risiko terhadap reward
- **Status**: Win, Loss, atau Break Even
- **Notes**: Catatan tambahan dari trader

#### Fitur Tambahan:
- Filter berdasarkan tanggal, pair, status (win/loss)
- Sort berdasarkan berbagai kolom
- Export ke CSV/Excel
- Statistik ringkasan

### 3. Reports & Analytics (Laporan & Analisis)

Fitur untuk menganalisis performa trading dan menghasilkan laporan statistik.

#### Metrik yang Dihitung:

1. **Win Rate**:
   ```
   Win Rate = (Jumlah Winning Trades / Total Trades) × 100%
   ```

2. **Average Win**:
   ```
   Average Win = Total Profit dari Winning Trades / Jumlah Winning Trades
   ```

3. **Average Loss**:
   ```
   Average Loss = Total Loss dari Losing Trades / Jumlah Losing Trades
   ```

4. **Profit Factor**:
   ```
   Profit Factor = Total Profit / Total Loss
   ```

5. **Expectancy**:
   ```
   Expectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss)
   ```

6. **Total Profit/Loss**:
   ```
   Total P/L = Sum of all Profit/Loss
   ```

7. **Maximum Drawdown**:
   ```
   Maximum Drawdown = Maximum peak to trough decline
   ```

8. **Risk/Reward Ratio Average**:
   ```
   Average R/R = Sum of all R/R ratios / Total Trades
   ```

9. **Best Trade**: Trade dengan profit terbesar
10. **Worst Trade**: Trade dengan loss terbesar
11. **Longest Winning Streak**: Jumlah win berturut-turut terpanjang
12. **Longest Losing Streak**: Jumlah loss berturut-turut terpanjang

#### Visualisasi:
- Grafik equity curve
- Grafik profit/loss per bulan
- Grafik win rate per pair
- Grafik distribusi profit/loss
- Pie chart win vs loss

### 4. Trade Journal (Jurnal Trading)

Fitur untuk mencatat analisis, strategi, dan pembelajaran dari setiap trade.

#### Data yang Dicatat:
- **Pre-Trade Analysis**: Analisis sebelum masuk trade
- **Strategy Used**: Strategi yang digunakan
- **Market Condition**: Kondisi pasar saat itu
- **Emotional State**: Kondisi emosional trader
- **Lessons Learned**: Pelajaran yang didapat
- **Screenshots**: Screenshot chart atau analisis

### 5. Risk Management Calculator

Fitur tambahan untuk menghitung berbagai parameter risk management.

#### Perhitungan:
- **Position Sizing**: Berdasarkan risk percentage
- **Maximum Risk per Day**: Batas risiko harian
- **Maximum Risk per Week**: Batas risiko mingguan
- **Account Growth Projection**: Proyeksi pertumbuhan akun

## Modul-Modul Aplikasi

### 1. Domain Layer (DDD)

#### 1.1. Lot Calculator Domain
- **Entities**:
  - `PositionSizeCalculation`: Entitas utama untuk perhitungan
  - `CurrencyPair`: Entitas pasangan mata uang
  - `AccountCurrency`: Entitas mata uang akun
- **Value Objects**:
  - `RiskPercentage`: Persentase risiko
  - `AccountBalance`: Saldo akun
  - `StopLoss`: Stop loss dalam pips/poin
  - `LotSize`: Ukuran lot
  - `PipValue`: Nilai pip
- **Domain Services**:
  - `PositionSizeCalculator`: Service untuk menghitung ukuran posisi
  - `CurrencyConverter`: Service untuk konversi mata uang
  - `PipValueCalculator`: Service untuk menghitung nilai pip

#### 1.2. Trade History Domain
- **Entities**:
  - `Trade`: Entitas utama untuk trade
  - `TradeEntry`: Entry point trade
  - `TradeExit`: Exit point trade
- **Value Objects**:
  - `TradeId`: Unique identifier
  - `Price`: Harga entry/exit
  - `ProfitLoss`: Profit/loss amount
  - `Pips`: Jumlah pips
- **Domain Services**:
  - `TradeAnalyzer`: Service untuk menganalisis trade
  - `TradeValidator`: Service untuk validasi trade data

#### 1.3. Reports Domain
- **Entities**:
  - `TradingReport`: Entitas laporan trading
  - `PerformanceMetrics`: Metrik performa
- **Value Objects**:
  - `WinRate`: Win rate percentage
  - `ProfitFactor`: Profit factor value
  - `Drawdown`: Drawdown value
- **Domain Services**:
  - `ReportGenerator`: Service untuk generate laporan
  - `MetricsCalculator`: Service untuk menghitung metrik

#### 1.4. User Domain
- **Entities**:
  - `User`: Entitas user
  - `UserProfile`: Profil user
  - `UserSettings`: Pengaturan user
- **Value Objects**:
  - `UserId`: Unique identifier
  - `Email`: Email address
  - `Password`: Password (hashed)
- **Domain Services**:
  - `AuthenticationService`: Service untuk autentikasi
  - `AuthorizationService`: Service untuk autorisasi

### 2. Application Layer

#### 2.1. Lot Calculator Application
- **Commands**:
  - `CalculatePositionSizeCommand`: Command untuk menghitung ukuran posisi
- **Queries**:
  - `GetCurrencyPairsQuery`: Query untuk mendapatkan daftar pair
  - `GetPipValueQuery`: Query untuk mendapatkan nilai pip
- **DTOs**:
  - `PositionSizeCalculationDTO`: DTO untuk hasil perhitungan
  - `CurrencyPairDTO`: DTO untuk currency pair

#### 2.2. Trade History Application
- **Commands**:
  - `CreateTradeCommand`: Command untuk membuat trade baru
  - `UpdateTradeCommand`: Command untuk update trade
  - `DeleteTradeCommand`: Command untuk delete trade
- **Queries**:
  - `GetTradesQuery`: Query untuk mendapatkan daftar trades
  - `GetTradeByIdQuery`: Query untuk mendapatkan trade by ID
  - `GetTradesByDateRangeQuery`: Query untuk filter by date range
- **DTOs**:
  - `TradeDTO`: DTO untuk trade
  - `TradeListDTO`: DTO untuk list trades

#### 2.3. Reports Application
- **Commands**:
  - `GenerateReportCommand`: Command untuk generate laporan
- **Queries**:
  - `GetPerformanceMetricsQuery`: Query untuk mendapatkan metrik
  - `GetReportQuery`: Query untuk mendapatkan laporan
- **DTOs**:
  - `ReportDTO`: DTO untuk laporan
  - `MetricsDTO`: DTO untuk metrik

#### 2.4. User Application
- **Commands**:
  - `RegisterUserCommand`: Command untuk registrasi user
  - `LoginUserCommand`: Command untuk login
  - `UpdateUserProfileCommand`: Command untuk update profil
  - `ChangePasswordCommand`: Command untuk ganti password
- **Queries**:
  - `GetUserProfileQuery`: Query untuk mendapatkan profil user
- **DTOs**:
  - `UserDTO`: DTO untuk user
  - `LoginDTO`: DTO untuk login
  - `RegisterDTO`: DTO untuk registrasi

### 3. Infrastructure Layer

#### 3.1. Persistence
- **Repositories**:
  - `ITradeRepository`: Interface untuk trade repository
  - `IUserRepository`: Interface untuk user repository
  - `TradeRepository`: Implementasi trade repository (database)
  - `UserRepository`: Implementasi user repository (database)
- **Database**:
  - Database schema untuk trades, users, settings
  - Migration scripts
  - ORM configuration (Prisma/TypeORM)

#### 3.2. External Services
- **Currency Service**: Service untuk mendapatkan harga mata uang terkini (optional, bisa manual input)
- **Exchange Rate API**: API untuk konversi mata uang (optional)

#### 3.3. Logging
- **Error Logger**: Service untuk logging error
- **Audit Logger**: Service untuk logging aktivitas user
- **Log Storage**: File system atau database untuk menyimpan logs

#### 3.4. Authentication & Authorization
- **JWT Service**: Service untuk generate dan validate JWT tokens
- **Password Hashing**: Service untuk hash dan verify password (bcrypt)
- **Session Management**: Service untuk manage user sessions

### 4. Presentation Layer

#### 4.1. API Controllers
- `LotCalculatorController`: REST API untuk lot calculator
- `TradeHistoryController`: REST API untuk trade history
- `ReportsController`: REST API untuk reports
- `AuthController`: REST API untuk authentication

#### 4.2. Frontend Components
- **Lot Calculator UI**:
  - Form input untuk parameter
  - Result display
  - Currency pair selector
  - Real-time calculation
- **Trade History UI**:
  - Trade list table
  - Trade form (create/edit)
  - Filter and search
  - Export functionality
- **Reports UI**:
  - Dashboard dengan metrik
  - Charts dan visualisasi
  - Report export
- **Auth UI**:
  - Login page
  - Register page
  - Profile page

## Todo List

### Phase 1: Backend Development

#### 1.1. Project Setup & Architecture
- [x] Setup project structure dengan DDD architecture
- [x] Setup TypeScript configuration
- [x] Setup dependency injection container
- [x] Setup database (PostgreSQL)
- [x] Setup ORM (Prisma)
- [x] Setup testing framework (Bun Test)
- [x] Setup linting dan formatting (ESLint)

#### 1.2. Domain Layer - Core Domains
- [x] Implement Lot Calculator Domain
  - [x] Create PositionSizeCalculation entity
  - [x] Create value objects (RiskPercentage, AccountBalance, etc.)
  - [x] Implement PositionSizeCalculator domain service
  - [x] Implement CurrencyConverter domain service
  - [x] Implement PipValueCalculator domain service
  - [x] Write domain unit tests
- [x] Implement Trade History Domain
  - [x] Create Trade entity
  - [x] Create value objects (TradeId, Price, ProfitLoss, etc.)
  - [x] Implement TradeAnalyzer domain service
  - [x] Implement TradeValidator domain service
  - [x] Write domain unit tests
- [x] Implement Reports Domain
  - [x] Create TradingReport entity
  - [x] Create PerformanceMetrics entity
  - [x] Implement ReportGenerator domain service
  - [x] Implement MetricsCalculator domain service
  - [x] Write domain unit tests
- [x] Implement User Domain
  - [x] Create User entity
  - [x] Create value objects (UserId, Email, Password)
  - [x] Implement AuthenticationService domain service
  - [x] Implement AuthorizationService domain service
  - [x] Write domain unit tests

#### 1.3. Application Layer
- [x] Implement Lot Calculator Application
  - [x] Create CalculatePositionSizeCommand handler
  - [x] Create queries (GetCurrencyPairsQuery, GetPipValueQuery)
  - [x] Create DTOs
  - [x] Write application tests (partial - key handlers tested)
- [x] Implement Trade History Application
  - [x] Create commands (CreateTradeCommand, UpdateTradeCommand, DeleteTradeCommand)
  - [x] Create queries (GetTradesQuery, GetTradeByIdQuery, etc.)
  - [x] Create DTOs
  - [x] Write application tests (partial - key handlers tested)
- [x] Implement Reports Application
  - [x] Create GenerateReportCommand handler
  - [x] Create queries (GetPerformanceMetricsQuery, GetReportQuery)
  - [x] Create DTOs
  - [x] Write application tests (partial - key handlers tested)
- [x] Implement User Application
  - [x] Create commands (RegisterUserCommand, LoginUserCommand, etc.)
  - [x] Create queries (GetUserProfileQuery)
  - [x] Create DTOs
  - [x] Write application tests (partial - key handlers tested)

#### 1.4. Infrastructure Layer
- [x] Setup Database
  - [x] Design database schema
  - [x] Create migration scripts
  - [x] Setup repository implementations
  - [x] Write repository tests (partial)
- [x] Implement Logging
  - [x] Create ErrorLogger service
  - [x] Create AuditLogger service
  - [ ] Setup log storage
  - [ ] Implement log rotation
- [x] Implement Authentication
  - [x] Setup JWT service
  - [x] Implement password hashing (bcrypt)
  - [ ] Implement session management
  - [x] Write authentication tests
- [ ] Setup External Services (Optional)
  - [ ] Integrate currency exchange rate API (optional)
  - [ ] Setup error handling for external services

#### 1.5. API Layer
- [x] Setup REST API framework (Bun.serve)
- [x] Implement LotCalculatorController
  - [x] POST /api/lot-calculator/calculate
  - [x] GET /api/lot-calculator/pairs
  - [x] GET /api/lot-calculator/pip-value
- [x] Implement TradeHistoryController
  - [x] GET /api/trades
  - [x] GET /api/trades/:id
  - [x] POST /api/trades
  - [x] PUT /api/trades/:id
  - [x] DELETE /api/trades/:id
- [x] Implement ReportsController
  - [x] GET /api/reports/metrics
  - [x] POST /api/reports/generate
  - [x] GET /api/reports/:id
- [x] Implement AuthController
  - [x] POST /api/auth/register
  - [x] POST /api/auth/login
  - [x] GET /api/auth/me
  - [x] PUT /api/auth/profile
  - [x] POST /api/auth/change-password
- [x] Implement middleware
  - [x] Authentication middleware
  - [x] Error handling middleware
  - [x] Request validation middleware
  - [ ] Authorization middleware
- [ ] Write API integration tests

#### 1.6. Backend Testing & Documentation
- [x] Write comprehensive unit tests
  - [x] Domain layer unit tests (Value Objects, Entities, Domain Services)
  - [x] Application layer unit tests (partial - key handlers tested)
  - [x] Infrastructure layer unit tests (Authentication services)
- [ ] Write integration tests
- [ ] Write E2E tests untuk critical flows
- [x] Setup API documentation (Swagger)
- [x] Write API documentation
- [ ] Performance testing dan optimization

### Phase 2: Frontend Development

#### 2.1. Frontend Setup
- [ ] Setup React framework
- [ ] Setup state management (Redux)
- [ ] Setup routing (React Router)
- [ ] Setup UI component library (shadcn/ui/Tailwind)
- [ ] Setup form handling (React Hook Form)
- [ ] Setup API client (Axios/Fetch wrapper)
- [ ] Setup authentication context/store

#### 2.2. Lot Calculator UI
- [ ] Design lot calculator form
- [ ] Implement currency pair selector
- [ ] Implement account currency selector
- [ ] Implement input fields (risk %, balance, stop loss, price)
- [ ] Implement real-time calculation
- [ ] Implement result display
- [ ] Add form validation
- [ ] Add error handling
- [ ] Write component tests

#### 2.3. Trade History UI
- [ ] Design trade list table
- [ ] Implement trade form (create/edit)
- [ ] Implement filter and search functionality
- [ ] Implement sort functionality
- [ ] Implement pagination
- [ ] Implement export to CSV/Excel
- [ ] Add form validation
- [ ] Add error handling
- [ ] Write component tests

#### 2.4. Reports UI
- [ ] Design dashboard layout
- [ ] Implement metrics cards display
- [ ] Implement charts (equity curve, profit/loss, win rate)
- [ ] Implement date range selector
- [ ] Implement report export functionality
- [ ] Add loading states
- [ ] Add error handling
- [ ] Write component tests

#### 2.5. Authentication UI
- [ ] Design login page
- [ ] Design register page
- [ ] Design profile page
- [ ] Implement login form
- [ ] Implement register form
- [ ] Implement profile edit form
- [ ] Implement password change form
- [ ] Add form validation
- [ ] Add error handling
- [ ] Implement protected routes
- [ ] Write component tests

#### 2.6. Common UI Components
- [ ] Design and implement layout components
- [ ] Design and implement navigation
- [ ] Design and implement loading indicators
- [ ] Design and implement error messages
- [ ] Design and implement success messages
- [ ] Design and implement modals/dialogs
- [ ] Implement responsive design
- [ ] Add dark mode support (optional)

#### 2.7. Frontend Testing & Optimization
- [ ] Write component unit tests
- [ ] Write integration tests
- [ ] Write E2E tests (Cypress)
- [ ] Performance optimization
- [ ] Bundle size optimization
- [ ] Accessibility testing
- [ ] Cross-browser testing

### Phase 3: Integration & Deployment

#### 3.1. Integration
- [ ] Integrate frontend dengan backend API
- [ ] Test end-to-end flows
- [ ] Fix integration issues
- [ ] Performance testing
- [ ] Security testing

#### 3.2. Deployment
- [ ] Setup production environment
- [ ] Setup CI/CD pipeline
- [ ] Setup database migration strategy
- [ ] Setup monitoring dan logging
- [ ] Setup error tracking (Sentry)
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Setup domain dan SSL

#### 3.3. Documentation
- [ ] Write user documentation
- [ ] Write developer documentation
- [ ] Create API documentation
- [ ] Create deployment guide

## Arsitektur: Domain-Driven Design (DDD)

### Struktur Folder

```
src/
├── domain/                    # Domain Layer
│   ├── lot-calculator/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── services/
│   │   └── repositories/
│   ├── trade-history/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── services/
│   │   └── repositories/
│   ├── reports/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── services/
│   │   └── repositories/
│   └── user/
│       ├── entities/
│       ├── value-objects/
│       ├── services/
│       └── repositories/
├── application/               # Application Layer
│   ├── lot-calculator/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── dtos/
│   ├── trade-history/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── dtos/
│   ├── reports/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── dtos/
│   └── user/
│       ├── commands/
│       ├── queries/
│       └── dtos/
├── infrastructure/            # Infrastructure Layer
│   ├── persistence/
│   │   ├── repositories/
│   │   ├── database/
│   │   └── migrations/
│   ├── logging/
│   ├── authentication/
│   └── external-services/
├── presentation/             # Presentation Layer
│   ├── api/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   └── web/
│       ├── components/
│       ├── pages/
│       └── hooks/
└── shared/                    # Shared Kernel
    ├── errors/
    ├── events/
    └── utils/
```

### Prinsip DDD yang Diterapkan:

1. **Bounded Contexts**: Setiap domain (lot-calculator, trade-history, reports, user) adalah bounded context terpisah
2. **Entities**: Setiap domain memiliki entities yang memiliki identity
3. **Value Objects**: Immutable objects yang tidak memiliki identity
4. **Domain Services**: Business logic yang tidak cocok di entities atau value objects
5. **Repositories**: Abstraction untuk data access
6. **Aggregates**: Entities yang dikelompokkan bersama dengan root entity
7. **Domain Events**: Events yang terjadi di domain layer

## Prinsip SOLID

### 1. Single Responsibility Principle (SRP)
- Setiap class/function memiliki satu tanggung jawab
- **Contoh**:
  - `PositionSizeCalculator` hanya bertanggung jawab untuk menghitung ukuran posisi
  - `CurrencyConverter` hanya bertanggung jawab untuk konversi mata uang
  - `TradeRepository` hanya bertanggung jawab untuk akses data trade

### 2. Open/Closed Principle (OCP)
- Open for extension, closed for modification
- **Contoh**:
  - Menggunakan interface untuk repository, sehingga bisa di-extend dengan implementasi baru tanpa mengubah kode yang ada
  - Strategy pattern untuk different calculation methods
  - Plugin architecture untuk report generators

### 3. Liskov Substitution Principle (LSP)
- Subtypes harus bisa menggantikan base types
- **Contoh**:
  - Implementasi repository harus bisa menggantikan interface repository
  - Different currency converters harus bisa saling menggantikan

### 4. Interface Segregation Principle (ISP)
- Clients tidak boleh dipaksa depend pada interfaces yang tidak mereka gunakan
- **Contoh**:
  - Memisahkan interface untuk read dan write operations
  - Specific interfaces untuk specific use cases

### 5. Dependency Inversion Principle (DIP)
- High-level modules tidak boleh depend pada low-level modules, keduanya harus depend pada abstractions
- **Contoh**:
  - Application layer depend pada repository interfaces, bukan implementasi
  - Domain services depend pada abstractions, bukan concrete implementations
  - Dependency injection untuk semua dependencies

## Teknologi Stack yang Direkomendasikan

### Backend:
- **Runtime**: Node.js dengan Bun atau TypeScript
- **Framework**: Express.js atau Fastify
- **Database**: PostgreSQL atau SQLite
- **ORM**: Prisma atau TypeORM
- **Authentication**: JWT dengan bcrypt
- **Validation**: Zod atau class-validator
- **Testing**: Jest atau Vitest
- **Logging**: Winston atau Pino

### Frontend:
- **Framework**: React dengan TypeScript
- **State Management**: Zustand atau Redux Toolkit
- **Routing**: React Router
- **UI Library**: shadcn/ui dengan Tailwind CSS
- **Form Handling**: React Hook Form dengan Zod
- **API Client**: Axios atau Fetch API
- **Charts**: Recharts atau Chart.js
- **Testing**: Vitest dengan React Testing Library
- **E2E Testing**: Playwright atau Cypress

### DevOps:
- **CI/CD**: GitHub Actions atau GitLab CI
- **Containerization**: Docker
- **Deployment**: Vercel, Railway, atau AWS
- **Monitoring**: Sentry untuk error tracking
- **Logging**: Cloud logging service

## Catatan Tambahan

1. **Security**:
   - Semua password harus di-hash menggunakan bcrypt
   - JWT tokens dengan expiration time
   - Input validation dan sanitization
   - SQL injection prevention (gunakan ORM)
   - XSS prevention
   - CORS configuration

2. **Performance**:
   - Database indexing untuk queries yang sering digunakan
   - Caching untuk data yang tidak sering berubah
   - Pagination untuk large datasets
   - Lazy loading untuk frontend components

3. **Scalability**:
   - Stateless API design
   - Horizontal scaling capability
   - Database connection pooling
   - Async processing untuk heavy operations

4. **Maintainability**:
   - Comprehensive error handling
   - Logging untuk debugging
   - Code documentation
   - Unit tests coverage > 80%
   - Integration tests untuk critical flows

