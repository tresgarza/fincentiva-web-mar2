import { copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Configuración de Firebase 🔥\n');
console.log('Este script te ayudará a configurar las credenciales de Firebase.\n');
console.log('Por favor, asegúrate de:');
console.log('1. Ir a la Consola de Firebase (https://console.firebase.google.com)');
console.log('2. Seleccionar tu proyecto');
console.log('3. Ir a Configuración > Configuración del proyecto');
console.log('4. Ir a la pestaña "Cuentas de servicio"');
console.log('5. Bajo "SDK de Admin de Firebase", hacer clic en "Generar nueva clave privada"');
console.log('6. Guardar el archivo JSON descargado\n');

rl.question('¿Cuál es la ruta completa del archivo JSON descargado? ', (filePath) => {
  try {
    const targetPath = join(__dirname, 'src', 'config', 'serviceAccount.json');
    copyFileSync(filePath, targetPath);
    console.log('\n✅ Credenciales copiadas exitosamente a:', targetPath);
    console.log('\nPuedes probar la conexión ejecutando:');
    console.log('node src/scripts/test-firebase.js');
  } catch (error) {
    console.error('\n❌ Error al copiar el archivo:', error.message);
    console.log('\nAsegúrate de que:');
    console.log('1. La ruta del archivo es correcta');
    console.log('2. El archivo existe');
    console.log('3. Tienes permisos para leer el archivo');
  } finally {
    rl.close();
  }
}); 