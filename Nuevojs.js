const puppeteer = require('puppeteer');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// //Ejemplo de variable de entorno
// let pruebaenv = process.env.Home;

// console.log(pruebaenv);



async function SelecionarProfesional(Profesionales, page, Tipo) {
    //Desglosa el arr de profesionales en caso de ser mas de 1 
    for (let Profesional of Profesionales) {
        let tipoProfesional = Profesional.Tipo;
        let Nombres = Profesional.Nombres;
        let selectTipoProfesion;
        let addProfesional;
        switch (Tipo) {
            case 1:
                selectTipoProfesion = await page.$('select[id="techProfessionalDesignationId"]');
                break;
            case 2:
                selectTipoProfesion = await page.$('select[id="ecoProfessionalDesignationId"]');
                break;

            default:
                selectTipoProfesion = await page.$('select[id="techProfessionalDesignationId"]');
                break;
        }
        await selectTipoProfesion.type(tipoProfesional);
        for (let Nombre of Nombres) {
            console.log(`Tipo de Profesional ${tipoProfesional} Nombre ${Nombre}`);
            let selectProfesional;
            switch (Tipo) {
                case 1:
                    selectProfesional = await page.$('select[id="techApplicantNameId"]');
                    break;
                case 2:
                    selectProfesional = await page.$('select[id="ecoApplicantNameId"]');
                    break;
                default:
                    selectProfesional = await page.$('select[id="techApplicantNameId"]');
                    break;
            }

            await page.waitForTimeout(300);
            await selectProfesional.type(Nombre);

            await page.waitForTimeout(100);

            addProfesional = await page.$x('//span[contains(.,"Agregar")]');
            switch (Tipo) {
                case 1:
                    await addProfesional[0].click();
                    break;
                case 2:
                    for (let i = 0; i < 5; i++) {
                        try {
                            await addProfesional[i].click();
                        } catch (error) {
                            console.log(`El Click Numero ${i} No es Error --> ${error}`);
                        }
                    }
                    break;
            }
        }
    }
}

function EnviarCorreo(Tipo, Area, Celda, Empresa, EquipoActual, Prueba) {
    // TIPO 1. Liberada 2. radicada 3. Fecha reapertura
    let msg;
    let Color;
    let Texto;
    switch (Tipo) {
        case 1:
            msg = `Posible Area Liberada ${EquipoActual} ${Empresa} ${Area} `;
            Color = '#4CAF50'
            Texto = `Posible Area Liberada`
            break;

        case 2:
            msg = `Posible Areas Radicada ${EquipoActual} ${Empresa} ${Area}   `;
            Color = `#D4AF37`;
            Texto = `Posible Area Radicada`;
            break;

        case 3:
            msg = `Posible Con reapertura ${Empresa} ${Area}   `;
            Color = `#2196F3`;
            Texto = `Posible Area Con Reapertura`;
            break;

        case 5:
            msg = `Ojo PESTAÑAS ${Empresa}   `;
            Color = `#FE1626`;
            Texto = `PESTAÑAS`;
            break;

        default:

            break;
    }

    let transporter = nodemailer.createTransport({
        host: "mail.ceere.net",
        secureConnection: false,
        port: 465,
        tls: {
            ciphers: "SSLv3"
        },
        auth: {
            user: 'Correomineria2@ceere.net',
            Pass: "1998Ceere*"
        }
    });
    let mensaje;
    let mailOptions = {
        from: msg + '"Ceere" <correomineria2@ceere.net>',
        to: 'jorgecalle@hotmail.com, jorgecaller@gmail.com, alexisaza@hotmail.com,  ceereweb@gmail.com, Soporte2ceere@gmail.com, soportee4@gmail.com, soporte.ceere06068@gmail.com',
        subject: `AREA-> ${Area}`,
        text: `AREA-> ${Area} Celda-> ${Celda}`,
        html: `
            <html>
                <head>
                    <style>
                        .container {
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            background-color: #f9f9f9;
                        }
                        .header {
                            background-color: ${Color};
                            color: white;
                            padding: 10px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px;
                            font-size: 12px;
                            color: #777;
                            border-top: 1px solid #ddd;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h3> ${Texto} </h3>
                        </div>
                        <div class="content">
                            <p><strong>Detalles:</strong></p>
                            <ul>
                                <li><strong>Empresa: </strong><br>${Empresa}</li>
                                <li><strong>Area:</strong><br>${Area}</li>
                                <li><strong>Celda:</strong><br>${Celda}</li>
                            <li><strong>Equipo Actual:</strong><br>${EquipoActual}</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p>Creado por Ceere Software - © 2024 Todos los derechos reservados</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
    if (!Prueba) {
        transporter.sendMail(mailOptions, (Error, info) => {
            if (Error) {
                return console.log(`Error al Enviar correo==>  ${Error}`);
            }
            console.log(`Mensaje Si enviado  ${info.response}`);
        });
    }

}