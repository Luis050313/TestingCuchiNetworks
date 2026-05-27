// Importamos herramientas de Selenium
// Builder: crea el navegador
// By: busca elementos HTML
// until: espera condiciones
// Key: permite usar teclas del teclado
const { Builder, By, until, Key } = require('selenium-webdriver');

// Función principal de la prueba
async function bruteForceTest() {

    // Crear una instancia automatizada de Chrome
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        // Abrir la página de login
        await driver.get('http://localhost:5173/login#');

        // Maximizar ventana del navegador
        await driver.manage().window().maximize();

        // Esperar hasta que aparezca el input del email
        // Máximo espera 5 segundos
        await driver.wait(
            until.elementLocated(By.css('input[type="email"]')),
            5000
        );

        // Ciclo que realizará 101 intentos de login
        for (let i = 1; i <= 101; i++) {

            // Mostrar número de intento en consola
            console.log(`\n🔐 Intento ${i}`);

            // Buscar input del correo
            const emailInput = await driver.findElement(
                By.css('input[type="email"]')
            );

            // Buscar input de contraseña
            const passwordInput = await driver.findElement(
                By.css('input[type="password"]')
            );

            // Seleccionar todo el texto del email
            await emailInput.sendKeys(Key.CONTROL, 'a');

            // Borrar contenido del email
            await emailInput.sendKeys(Key.BACK_SPACE);

            // Seleccionar todo el texto de la contraseña
            await passwordInput.sendKeys(Key.CONTROL, 'a');

            // Borrar contenido de la contraseña
            await passwordInput.sendKeys(Key.BACK_SPACE);

            // Escribir un correo válido
            await emailInput.sendKeys(
                'eduardo.valdivia.lugo@cuchi.net'
            );

            // Crear contraseña incorrecta dinámica
            // Ejemplo: password1, password2, etc.
            const currentPassword = `password${i}`;

            // Escribir contraseña incorrecta
            await passwordInput.sendKeys(currentPassword);

            // Buscar botón submit y hacer click
            await driver.findElement(
                By.css('button[type="submit"]')
            ).click();

            // Esperar 800 milisegundos para permitir respuesta
            await driver.sleep(800);

            // Obtener URL actual
            const currentUrl = await driver.getCurrentUrl();

            // Validar si accidentalmente logró entrar
            if (currentUrl.includes('/dashboard')) {

                // Mostrar mensaje de acceso exitoso
                console.log("⚠️ LOGIN EXITOSO");

                // Mostrar contraseña encontrada
                console.log(
                    `✅ Contraseña encontrada: ${currentPassword}`
                );

                // Detener prueba
                break;

            } else {

                // Mostrar rechazo de login
                console.log(
                    `❌ Login rechazado con: ${currentPassword}`
                );

            }

            // Intentar detectar bloqueo por rate limiting
            try {

                // Obtener código HTML completo
                const pageSource = await driver.getPageSource();

                // Buscar mensaje de demasiados intentos
                if (pageSource.includes('Demasiados intentos')) {

                    // Mostrar detección del bloqueo
                    console.log("\n🚫 RATE LIMIT DETECTADO");

                    console.log(
                        "El sistema bloqueó temporalmente los intentos."
                    );

                    // Detener prueba
                    break;
                }

            } catch (e) {

                // Ignorar errores secundarios
            }
        }

        // Finalización de la prueba
        console.log("\n🏁 Prueba de fuerza bruta finalizada");

    } catch (error) {

        // Mostrar errores generales
        console.error("\n❌ Error en la prueba:");
        console.error(error);

    } finally {

        // Esperar 5 segundos antes de cerrar
        await driver.sleep(5000);

        // Cerrar navegador
        await driver.quit();
    }
}

// Ejecutar función principal
bruteForceTest();
