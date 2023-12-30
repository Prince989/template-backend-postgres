
class EmailTemplate {
  name: string = "";
  link: string = "";
  mode: 'forget' | 'sign' = 'sign';

  constructor(name: string, link: string, mode: 'forget' | 'sign') {
    this.mode = mode;
    this.link = link;
    this.name = name;
  }

  getHTML() {
    const baseUrl = process.env.BASE_URL;

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Please activate your account</title>
          <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
        </head>
        
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
          <table role="presentation"
            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
              <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                  <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                    <tbody>
                      <tr>
                        <td style="padding: 40px 0px 0px;">
                          <div style="text-align: left;">
                            <div style="padding-bottom: 20px;"><img src="${baseUrl}/image/logo.png" alt="Company" style="width: 90px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: left;">
                              <h1 style="margin: 1rem 0">سلام ${this.name}</h1>
                              <h2>گام آخر...</h2>
                              ${(this.mode === 'forget' ? `<p style="padding-bottom: 16px">شما برای بازیابی رمز عبور خود درخواست داده بودید</p>` : "")}
                              <p style="padding-bottom: 16px">${(this.mode === 'forget' ? "Please" : "")} داخل لینک زیر شوید تا حساب کاربری شما تایید شود</p>
                              <p style="padding-bottom: 16px"><a href="${this.link}" target="_blank"
                                  style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">تایید</a></p>
                              <p style="padding-bottom: 16px">اگر این درخواست مربوط به شما و ایمیل شما نیست، میتوانید این پیام را نادیده بگیرید</p>
                              <p style="padding-bottom: 16px">با تشکر,<br>تیم پشتیبانی دات وب</p>
                            </div>
                          </div>
                          <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        
        </html>`;
  }
}

export default EmailTemplate;
