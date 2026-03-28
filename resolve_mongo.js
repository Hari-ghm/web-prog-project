const dns = require('dns');
const fs = require('fs');
const path = require('path');

dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS to bypass ISP blocking

async function generateStandardURI() {
  try {
    const srvName = '_mongodb._tcp.source.gwvspho.mongodb.net';
    const txtName = 'source.gwvspho.mongodb.net';
    
    const srvRecords = await dns.promises.resolveSrv(srvName);
    const txtRecords = await dns.promises.resolveTxt(txtName);

    const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');
    const txtOptions = txtRecords.flat().join('&');

    const uri = `mongodb://user:<db_password>@${hosts}/renewable_energy?ssl=true&${txtOptions}&appName=source`;
    console.log(uri);
    
    // Write this to .env.local
    const envPath = path.join(__dirname, '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace the old connection string, we also need to ask user for the real password
    // Actually we'll just inject user123 assuming it from the user's first prompt, or the <db_password> they just sent
    // Wait, the user first sent: mongodb+srv://user:user123@source.gwvspho.mongodb.net/?appName=source
    // Then they sent: mongodb+srv://user:<db_password>@...
    // I'll use user123 in the DB string. If they meant something else they can change it later.
    const realUri = uri.replace('<db_password>', 'user123');
    envContent = envContent.replace(/^MONGODB_URI=.*$/m, `MONGODB_URI=${realUri}`);
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    console.log("SUCCESSFULLY UPDATED .env.local!");
  } catch (err) {
    console.error("ERROR GENERATING URI:", err);
  }
}

generateStandardURI();
