const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Tạo RSA key pair (2048 bit)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Lưu private key
fs.writeFileSync(path.join(__dirname, 'private.key'), privateKey);
console.log('✓ Private key created: private.key');

// Lưu public key
fs.writeFileSync(path.join(__dirname, 'public.key'), publicKey);
console.log('✓ Public key created: public.key');

console.log('\n✓ RSA 2048 keys generated successfully!');
