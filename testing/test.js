const { Builder, By, until } = require('selenium-webdriver');

async function loginTest() {

    // Crear navegador
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        // Abrir página
        await driver.get('http://localhost:5173/login#');

        // Maximizar ventana
        await driver.manage().window().maximize();

        // Esperar inputs
        await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);

        // Escribir email
        await driver.findElement(By.css('input[type="email"]'))
            .sendKeys('l22056714@saltillo.tecnm.mx');

        // Escribir password
        await driver.findElement(By.css('input[type="password"]'))
            .sendKeys('12345');

        // Click botón ingresar
        await driver.findElement(By.css('button[type="submit"]'))
            .click();

        // Esperar mensaje de error
        const errorDiv = await driver.wait(
            until.elementLocated(
                By.xpath("//div[contains(text(),'Usuario o contraseña incorrectos')]")
            ),
            5000
        );

        // Verificar si se mostró
        if (await errorDiv.isDisplayed()) {
            console.log("Funcionamiento correcto");
        }

    } catch (error) {

        console.error("Error en la prueba:");
        console.error(error);

    } finally {

        // Esperar un poco antes de cerrar
        await driver.sleep(3000);

        // Cerrar navegador
        await driver.quit();
    }
}

loginTest();