const { validationResult } = require("express-validator");
const User = require("../Models/User");
const Establishment = require("../Models/Establishment");
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

exports.sendVerificationEmail = (req, res, next) => {
  // #swagger.tags = ['Email']
  // #swagger.description = '<Manda email'

  const codigoVerificacao = res.locals.userData.codigoVerificacao.split("");
  const email = res.locals.userData.email;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: "gasradaroficial@gmail.com", // Change to your verified sender
    subject: "Codigo de verificação de email",
    text: "Verifique o codigo abaixo no seu smartphone",
    html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
    <html xmlns='http://www.w3.org/1999/xhtml'>
      <head>
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
        <title>GasRadar codigo verificação</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <body>
        <div style='display: flex; justify-content: center'>
          <div style='border: 1px solid #999; width: 40%; text-align: center'>
            <strong>Verifique o codigo abaixo no seu smartphone</strong>
            <div
              style='display: flex; justify-content: center; margin: 30px 0 30px 0'
            >
              <div
                style='
                  display: flex;
                  justify-content: space-evenly;
                  width: 50%;
                  padding: 30px;
                '
              >
                <div style='border: 1px solid #999; padding: 10px'>${codigoVerificacao[0]}</div>
                <div style='border: 1px solid #999; padding: 10px'>${codigoVerificacao[1]}</div>
                <div style='border: 1px solid #999; padding: 10px'>${codigoVerificacao[2]}</div>
                <div style='border: 1px solid #999; padding: 10px'>${codigoVerificacao[3]}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `,
  };
  sgMail
    .send(msg)
    .then(() => {
      delete res.locals.userData.codigoVerificacao;
      delete res.locals.userData.senha;
      res
        .status(200)
        .json({ message: "Email enviado", ...res.locals.userData });
    })
    .catch((err) => {
      User.destroy({
        where: {
          idUsuario: res.locals.userData.idUsuario,
        },
      });
      res
        .status(500)
        .json({ message: "Não foi possivel enviar o email. Usuario excluido" });
    });
};

exports.sendSucessfulCreratedOfAccount = (req, res, next) => {
  // #swagger.tags = ['Email']
  // #swagger.description = 'Manda um email de estabelecimetno aprovado com sucesso'

  const idUsuario = res.locals.data.idUsuario;
  const status = res.locals.data.status;
  const queryResult = res.locals.data.queryResult;
  let email;

  console.log(idUsuario);

  User.findOne({
    where: {
      idUsuario: Number(idUsuario),
    },
  }).then((establishment) => {
    email = establishment.dataValues.email;
    console.log(establishment.dataValues.email);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email, // Change to your recipient
      from: "gasradaroficial@gmail.com", // Change to your verified sender
      subject: "Aprovação de estabelecimento",
      text: "Verifique o codigo abaixo no seu smartphone",
      html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
    <html xmlns='http://www.w3.org/1999/xhtml'>
      <head>
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
        <title>GasRadar codigo verificação</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <body>
          <h3>Seu estabelecimento foi ${status}!</h3>
      </body>
    </html>
    `,
    };
    sgMail
      .send(msg)
      .then(() => {
        if (!queryResult) {
          return res
            .status(200)
            .json({ message: `Estabelecimento não encontrado` });
        }
        return res
          .status(200)
          .json({ message: `Estabelecimento ${status} com sucesso` });
      })
      .catch((err) => {
        Establishment.update(
          {
            status: "PENDENTE",
          },
          {
            where: {
              email,
            },
          }
        );
        res.status(500).json({
          message: "Não foi possivel enviar o email. Usuario excluido",
        });
      });
  });
};
