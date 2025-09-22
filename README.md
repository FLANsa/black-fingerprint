# Phone Store Demo

A comprehensive web application for managing phone store inventory and sales, designed for the Saudi market.

## Key Features

### 📱 Inventory Management
- Add and manage new and used phones
- Manage accessories and add-ons
- Advanced barcode system for products
- Inventory tracking and alerts

### 💰 Sales System
- Create sales invoices
- Customer and sales management
- Detailed sales reports
- Multiple payment options

### 🔍 Search and Filter
- Advanced product search
- Filter by category and price
- Detailed product display

### 📊 Reports and Statistics
- Comprehensive dashboard
- Daily and monthly sales reports
- Inventory statistics
- Performance reports

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python Flask
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Analytics**: Firebase Analytics
- **Deployment**: Render.com

## Installation and Setup

### Requirements
- Python 3.7+
- Node.js 14+
- Firebase account

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/FLANsa/phone-store-demo.git
cd phone-store-demo
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
npm install
```

3. **Setup Firebase**
- Create a new project in Firebase Console
- Enable Firestore Database
- Enable Authentication
- Enable Storage
- Enable Analytics
- Copy Firebase configuration to `js/firebase-config.js`

4. **Run the project**
```bash
python start.py
```

## Project Structure

```
phone-store-demo/
├── templates/          # HTML templates
├── static/            # Static files
│   ├── css/          # CSS files
│   ├── js/           # JavaScript files
│   └── images/       # Images
├── app.py            # Main application
├── requirements.txt  # Python dependencies
├── package.json      # Node.js dependencies
└── README.md        # This file
```

## Usage

### Adding a New Product
1. Navigate to "Add New Phone" page
2. Fill in product details
3. Upload product image
4. Save the product

### Creating a Sale
1. Navigate to "Create Sale" page
2. Select products
3. Enter customer details
4. Save the sale

## Firebase Configuration

The project uses Firebase v10+ with the following services:
- **Firestore**: Database for storing products, sales, and customers
- **Authentication**: User authentication and authorization
- **Storage**: File storage for product images
- **Analytics**: Usage analytics and reporting

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact us via:
- Email: support@phonestoredemo.com
- GitHub Issues: [Create an issue](https://github.com/FLANsa/phone-store-demo/issues)

## Future Updates

- [ ] Mobile application
- [ ] Customer loyalty points system
- [ ] Payment gateway integration
- [ ] Advanced reporting
- [ ] Notification system

---

**Phone Store Demo** - Our vision is to provide the best phone store management solutions in Saudi Arabia.