// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { networkInterfaces } from 'os';

function getLocalIpAddresses() {
  const interfaces: any = networkInterfaces();
  const addresses: any = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ name, address: iface.address });
      }
    }
  }

  return addresses;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend integration

  // Set the global prefix if needed
  // app.setGlobalPrefix('api'); // Uncomment this if you want all routes to start with /api

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces

  // Get and display IP addresses
  const ipAddresses = getLocalIpAddresses();
  console.log(`Application is running on port ${port}`);
  console.log('Available IP addresses:');
  ipAddresses.forEach((ip: any) => {
    console.log(`- ${ip.name}: http://${ip.address}:${port}`);
  });
}
bootstrap();
