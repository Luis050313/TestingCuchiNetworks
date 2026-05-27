const { Builder, By, until } = require('selenium-webdriver');

async function loginTest() {

    // Crear navegador
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        // Abrir login
        await driver.get('http://localhost:5173/login#');

        // Maximizar ventana
        await driver.manage().window().maximize();

        // Esperar input email
        await driver.wait(
            until.elementLocated(By.css('input[type="email"]')),
            5000
        );

        // Escribir email
        await driver.findElement(By.css('input[type="email"]'))
            .sendKeys('eduardo.valdivia.lugo@cuchi.net');

        // Escribir password
        await driver.findElement(By.css('input[type="password"]'))
            .sendKeys('ositoBimbo');

        // Click botón ingresar
        await driver.findElement(By.css('button[type="submit"]'))
            .click();

        // Esperar redirección al dashboard
        await driver.wait(
            until.urlContains('/admin/dashboard'),
            5000
        );

        // Obtener URL actual
        const currentUrl = await driver.getCurrentUrl();

        // Verificar acceso correcto
        if (currentUrl.includes('/admin/dashboard')) {

            console.log("Funcionamiento correcto");
            console.log("Ingresó al dashboard");

        } else {

            console.log("No ingresó correctamente");

        }

    } catch (error) {

        console.error("Error en la prueba:");
        console.error(error);

    } finally {

        // Esperar antes de cerrar
        await driver.sleep(3000);

        // Cerrar navegador
        await driver.quit();
    }
}

loginTest();