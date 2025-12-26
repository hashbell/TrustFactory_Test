# TrustFactory - E-commerce Shopping Cart

A modern e-commerce shopping cart application built with Laravel, React, Inertia.js, and Tailwind CSS.

## Demo Video

- [Part 1 - Application Walkthrough](https://www.loom.com/share/a3d323ef7dcf424aa03ffd2fa0ca493f)
- [Part 2 - Code Explanation](https://www.loom.com/share/c845b2f735ec44ce84caa9237acdff28)

## Installation

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- SQLite (or configure your preferred database)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trustfactory
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

## Configuration

Shop-specific settings can be configured via environment variables:

```env
# Stock
SHOP_LOW_STOCK_THRESHOLD=5           # Trigger notification when stock <= this

# Pagination
SHOP_PRODUCTS_PER_PAGE=12            # Products per page on index

# Admin
SHOP_ADMIN_EMAIL=admin@trustfactory.test  # Receives notifications and reports

# Reports
SHOP_DAILY_REPORT_ENABLED=true       # Enable/disable daily sales report
SHOP_DAILY_REPORT_TIME=18:00         # Time to send daily report (24h format)
SHOP_DAILY_REPORT_MAX_CACHED=7       # Max cached reports for admin UI

# Notifications
SHOP_LOW_STOCK_NOTIFICATION=true     # Enable/disable low stock emails
SHOP_LOW_STOCK_MAX_CACHED=10         # Max cached alerts for admin UI
```

## Development

### Run the development servers

```bash
# Option 1: Run all servers concurrently
composer dev

# Option 2: Run individually
php artisan serve          # Laravel server (http://localhost:8000)
npm run dev                # Vite dev server (hot reload)
php artisan queue:work     # Queue worker (for emails)
php artisan schedule:work  # Scheduler (for daily reports)
```
## Testing

```bash
php artisan test
```

## Code Quality

This project uses **Laravel Pint** for code formatting and **PHPStan** (Level 5) for static analysis.

### Laravel Pint

```bash
# Auto-fix code style
composer format

# Check style without fixing
composer format:check

# Or run directly
./vendor/bin/pint
```

### PHPStan

```bash
# Run static analysis
composer lint

# Or run directly
./vendor/bin/phpstan analyse --memory-limit=2G
```

### Run All Checks

```bash
# Run format check, PHPStan, and tests in one command
composer check
```

### Default Users

After seeding, the following test users are available:

| Role  | Email                    | Password |
|-------|--------------------------|----------|
| Admin | admin@trustfactory.test  | password |
| User  | test_user@trustfactory.test | password |

## Queue Configuration

For low stock notifications and daily reports to work:

1. **Configure mail settings in `.env`**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=your-smtp-host
   MAIL_PORT=587
   MAIL_USERNAME=your-username
   MAIL_PASSWORD=your-password
   MAIL_FROM_ADDRESS=noreply@trustfactory.test
   MAIL_FROM_NAME="TrustFactory"
   ```

2. **Run the queue worker**
   ```bash
   php artisan queue:work
   ```

## Scheduled Tasks

The daily sales report runs at the configured time (default: 6 PM). To enable:

```bash
# Add to crontab
* * * * * cd /path/to/trustfactory && php artisan schedule:run >> /dev/null 2>&1
```

Or run manually:
```bash
php artisan report:daily-sales
```

## Routes

### Public Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | /products | List all products (supports `?sort=latest\|price-asc\|price-desc`) |
| GET | /products/{id} | View product details |

### Authenticated Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | /cart | View cart |
| POST | /cart | Add item to cart |
| PATCH | /cart/{productId} | Update item quantity |
| DELETE | /cart/{productId} | Remove item from cart |
| POST | /cart/clear | Clear entire cart |
| POST | /checkout | Process checkout |
| GET | /orders | View order history |
| GET | /orders/{id} | View order details |

### Admin Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | /admin/products | List all products |
| GET | /admin/products/create | Create product form |
| POST | /admin/products | Store new product |
| GET | /admin/products/{id}/edit | Edit product form |
| PUT | /admin/products/{id} | Update product |
| DELETE | /admin/products/{id} | Delete product |


## Features

- **Product Browsing**: Browse products with pagination, sorting, and detailed views
- **Shopping Cart**: Add products, update quantities, and remove items
- **Checkout**: Complete purchases with automatic stock management
- **Order History**: View past orders with detailed breakdowns
- **User Authentication**: Secure login and registration
- **Admin Dashboard**: Manage products with CRUD operations
- **Low Stock Notifications**: Automatic email alerts when products run low
- **Daily Sales Reports**: Scheduled email reports of daily sales
- **Real-time Admin Notifications**: Live polling for inventory alerts and sales reports

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 18 with TypeScript
- **UI Bridge**: Inertia.js
- **Styling**: Tailwind CSS
- **Database**: SQLite (configurable)
- **Queue**: Laravel Queues for background jobs
- **Code Quality**: PHPStan (Level 5) + Laravel Pint
- **PHP Version**: 8.2+

## Architecture

This project follows **Clean Architecture** and **SOLID principles**:

- **Models**: Eloquent models with relationships
- **Repositories**: Data access abstraction layer (Interface-based)
- **Services**: Business logic layer
- **Controllers**: HTTP request handlers
- **Jobs**: Background processing for notifications

### Why React Inside Laravel (Monorepo)?

This project uses the **monorepo approach** with React residing in Laravel's `resources/js` folder rather than as a separate project. Here's why:

#### This Approach (Monorepo + Inertia.js)

| Aspect | Benefit |
|--------|---------|
| **Routing** | Laravel handles all routing - no client-side router needed |
| **Authentication** | Session-based auth - simpler than API tokens |
| **Deployment** | Single deployment - one server, one codebase |
| **Data Flow** | Props passed directly from controllers - no API calls |
| **SEO** | Server-side rendering support out of the box |
| **Development** | Faster iteration - no CORS, no API versioning |

#### When to Use Separate Projects Instead

Consider separating React into its own project if you need:

- **Mobile apps** consuming the same API
- **Third-party integrations** requiring a public API
- **Independent scaling** of frontend and backend
- **Separate teams** for frontend and backend development
- **Multiple frontends** (web, admin panel, mobile)

#### Architectural Decision

This project uses the monorepo approach where React lives inside Laravel's `resources/js` directory, with Inertia.js bridging the two. Controllers pass data directly as props to React components—no separate API layer, no JSON responses, no client-side routing.

The alternative would be a separate React SPA consuming a Laravel API via REST or GraphQL, using something like Sanctum for authentication and Axios for HTTP requests. That approach makes sense when you need a public API for mobile apps or third-party integrations, or when frontend and backend teams work independently.

For this shopping cart application, the monorepo approach is the better fit. It's a single web application with no mobile app requirement. Laravel Breeze officially scaffolds projects this way, and Inertia.js was specifically designed for this pattern. Session-based authentication is simpler than token-based auth, and having everything in one codebase speeds up development since there's no CORS configuration or API versioning to deal with.

### Directory Structure

```
app/
├── Contracts/
│   └── Repositories/      # Repository interfaces (loose coupling)
├── Http/
│   ├── Controllers/       # HTTP controllers
│   ├── Middleware/        # Request middleware
│   └── Requests/          # Form request validation
├── Jobs/                  # Background jobs (notifications, reports)
├── Mail/                  # Mailable classes
├── Models/                # Eloquent models
├── Repositories/          # Repository implementations
└── Services/              # Business logic services

resources/js/
├── Components/            # Reusable React components
├── Layouts/               # Page layouts
├── Pages/                 # Inertia pages (routes)
└── types/                 # TypeScript definitions

config/
└── shop.php               # Shop-specific configuration
```

### SOLID Principles Implementation

| Principle | Implementation |
|-----------|----------------|
| **Single Responsibility** | Controllers → Services → Repositories (each has one job) |
| **Open/Closed** | Configurable via `config/shop.php` without code changes |
| **Liskov Substitution** | All repositories implement interfaces |
| **Interface Segregation** | Focused interfaces (4 methods, not 20) |
| **Dependency Inversion** | Services depend on interfaces, not concrete classes |



## Future Improvements

Given more time, the following features and enhancements could be implemented:

### Features

- **Payment Integration**: Integrate with Stripe/PayPal for real payment processing
- **Product Categories**: Add category management and filtering
- **Product Search**: Full-text search with filters (price range, availability)
- **Wishlist**: Allow users to save products for later
- **Product Reviews**: User ratings and reviews system
- **Inventory Management**: Bulk stock updates, stock history tracking
- **Order Status Tracking**: Order lifecycle (processing → shipped → delivered)
- **Email Templates**: Customizable email templates with better styling
- **Multiple Images**: Support multiple product images with gallery view

### Technical Improvements

- **API Layer**: RESTful API for mobile app integration
- **Real-time Notifications**: WebSockets (Laravel Reverb) instead of polling
- **Caching**: Redis caching for products and cart data
- **Image Uploads**: Cloud storage (S3) for product images
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Docker**: Containerized development environment
- **Rate Limiting**: API throttling for abuse prevention
- **Audit Logging**: Track admin actions and order changes
- **Multi-currency**: Support for multiple currencies
- **Internationalization (i18n)**: Multi-language support

### Testing

- **E2E Tests**: Browser testing with Laravel Dusk or Playwright
- **Load Testing**: Performance benchmarks with k6 or Artillery
- **Higher PHPStan Level**: Upgrade from Level 5 to Level 8+

## Contact

For further enquiries, reach out via email: **bellopromise5322@gmail.com**
