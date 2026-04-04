
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { getDb, initializeDatabase } = require("./init");

function seed() {
  initializeDatabase();
  const db = getDb();

  const users = [
    { name: "Super Admin",   email: "admin@finance.com",   password: "Admin@123",   role: "admin"   },
    { name: "Alice Analyst", email: "analyst@finance.com", password: "Analyst@123", role: "analyst" },
    { name: "Bob Viewer",    email: "viewer@finance.com",  password: "Viewer@123",  role: "viewer"  },
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password, role)
    VALUES (@name, @email, @password, @role)
  `);

  for (const user of users) {
    const hashed = bcrypt.hashSync(user.password, 10);
    insertUser.run({ ...user, password: hashed });
  }
  console.log("✅ Default users seeded");

  const admin = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@finance.com");

  const records = [
    { amount: 5000, type: "income",  category: "Salary",      date: "2025-03-01", notes: "March salary",        created_by: admin.id },
    { amount: 1200, type: "expense", category: "Rent",        date: "2025-03-02", notes: "Monthly rent",         created_by: admin.id },
    { amount: 300,  type: "expense", category: "Utilities",   date: "2025-03-05", notes: "Electricity bill",     created_by: admin.id },
    { amount: 800,  type: "income",  category: "Freelance",   date: "2025-03-10", notes: "Design project",       created_by: admin.id },
    { amount: 150,  type: "expense", category: "Groceries",   date: "2025-03-12", notes: "Weekly groceries",     created_by: admin.id },
    { amount: 2500, type: "income",  category: "Investment",  date: "2025-03-15", notes: "Stock dividends",      created_by: admin.id },
    { amount: 400,  type: "expense", category: "Transport",   date: "2025-03-18", notes: "Fuel and maintenance", created_by: admin.id },
    { amount: 5000, type: "income",  category: "Salary",      date: "2025-04-01", notes: "April salary",        created_by: admin.id },
    { amount: 1200, type: "expense", category: "Rent",        date: "2025-04-02", notes: "Monthly rent",         created_by: admin.id },
    { amount: 600,  type: "expense", category: "Entertainment",date: "2025-04-08",notes: "Streaming + dining",   created_by: admin.id },
    { amount: 3500, type: "income",  category: "Freelance",   date: "2025-04-12", notes: "Web dev contract",     created_by: admin.id },
    { amount: 200,  type: "expense", category: "Groceries",   date: "2025-04-15", notes: "Weekly groceries",     created_by: admin.id },
  ];

  const insertRecord = db.prepare(`
    INSERT OR IGNORE INTO financial_records (amount, type, category, date, notes, created_by)
    VALUES (@amount, @type, @category, @date, @notes, @created_by)
  `);

  for (const record of records) {
    insertRecord.run(record);
  }
  console.log("✅ Sample financial records seeded");
  console.log("\n📋 Default Credentials:");
  console.log("   Admin:   admin@finance.com   / Admin@123");
  console.log("   Analyst: analyst@finance.com / Analyst@123");
  console.log("   Viewer:  viewer@finance.com  / Viewer@123\n");
}

seed();