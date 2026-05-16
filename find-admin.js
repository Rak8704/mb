const mysql = require('mysql2/promise');

async function findAdminCredentials() {
  try {
    console.log('🔌 Connecting to MySQL database...\n');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'nicebet_sports',
    });
    
    console.log('✅ Database connection successful!\n');
    
    // Query admin credentials
    console.log('🔍 Searching for admin users...\n');
    const [admins] = await connection.execute(
      'SELECT id, username, email, password, role, status FROM admins WHERE status = "active"'
    );
    
    if (admins.length === 0) {
      console.log('❌ No active admin users found!\n');
      
      // Show all admins (even inactive)
      const [allAdmins] = await connection.execute(
        'SELECT id, username, email, role, status FROM admins'
      );
      
      if (allAdmins.length > 0) {
        console.log('📋 All admins in system (including inactive):\n');
        allAdmins.forEach((admin) => {
          console.log(`  ID: ${admin.id}`);
          console.log(`  Username: ${admin.username}`);
          console.log(`  Email: ${admin.email}`);
          console.log(`  Role: ${admin.role}`);
          console.log(`  Status: ${admin.status}`);
          console.log('  ---');
        });
      }
    } else {
      console.log('✅ ACTIVE ADMIN CREDENTIALS FOUND:\n');
      admins.forEach((admin, index) => {
        console.log(`Admin ${index + 1}:`);
        console.log(`  ID: ${admin.id}`);
        console.log(`  Username: ${admin.username}`);
        console.log(`  Email: ${admin.email}`);
        console.log(`  Role: ${admin.role}`);
        console.log(`  Status: ${admin.status}`);
        console.log(`  Password Hash: ${admin.password.substring(0, 20)}...`);
        console.log('  ---');
      });
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findAdminCredentials();
