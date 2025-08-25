const User = require('../models/user');
const config = require('../config/config');

class DatabaseSeeder {
  async seedDefaultUsers() {
    try {
      console.log('🌱 Seeding default users...');

      // Check if default admin exists
      const existingAdmin = await User.findOne({ email: config.DEFAULT_ADMIN.email });
      if (!existingAdmin) {
        const adminUser = new User(config.DEFAULT_ADMIN);
        await adminUser.save();
        console.log('✅ Default admin user created:', config.DEFAULT_ADMIN.email);
      } else {
        console.log('ℹ️  Default admin user already exists:', config.DEFAULT_ADMIN.email);
      }

      // Check if default customer exists
      const existingCustomer = await User.findOne({ email: config.DEFAULT_CUSTOMER.email });
      if (!existingCustomer) {
        const customerUser = new User(config.DEFAULT_CUSTOMER);
        await customerUser.save();
        console.log('✅ Default customer user created:', config.DEFAULT_CUSTOMER.email);
      } else {
        console.log('ℹ️  Default customer user already exists:', config.DEFAULT_CUSTOMER.email);
      }

      console.log('🌱 Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error seeding database:', error.message);
      throw error;
    }
  }

  async seedAll() {
    try {
      await this.seedDefaultUsers();
      console.log('🎉 All database seeding completed!');
    } catch (error) {
      console.error('💥 Database seeding failed:', error.message);
      process.exit(1);
    }
  }
}

module.exports = new DatabaseSeeder();