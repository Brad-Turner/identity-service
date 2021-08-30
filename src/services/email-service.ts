import fetch from 'node-fetch';
import FormData from 'form-data';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

interface EmailResponse<T = unknown> {
  status: number;
  content: T;
}

export default class EmailService {
  protected baseUrl: string;
  private auth: string;

  constructor(protected domain: string, key: string) {
    this.baseUrl = `https://api.mailgun.net/v3/${domain}`;
    this.auth = Buffer.from(`api:${key}`).toString('base64');
  }

  protected async send(options: EmailRequest): Promise<EmailResponse> {
    const form = new FormData();

    form.append('from', `Identity Service <mailgun@${this.domain}>`);
    form.append('to', options.to);
    form.append('subject', options.subject);
    form.append('html', options.html);

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'post',
      body: form,
      headers: {
        Authorization: `Basic ${this.auth}`
      }
    });

    let content = await response.text();
    try {
      content = JSON.parse(content);
    } catch (err) {
      err.message = `Unable to parse response as JSON: ${content}`;
      throw err;
    }

    return {
      status: response.status,
      content
    };
  }

  public async sendEmailVerification(email: string, link: string): Promise<EmailResponse> {
    const request = {
      to: email,
      subject: 'Welcome to Identity Service: Verify your account',
      html: `
        <style type="text/css">
          body {
            background: #F7F7F7;
            color: #333333;
            margin: 0;
            padding: 0;
          }
        
          table {
            border-collapse: collapse;
          }
        
          td {
            vertical-align: top;
          }
        </style>
        
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light only" />
        </head>
        
        <body>
          <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; color: #333; text-align: center; background-image: linear-gradient(#F7F7F7, #F7F7F7); letter-spacing: 0.05rem;">
            <tr>
              <td style="width: 100%; padding: 1rem 5vw; ">
                <table style="width: 100%; border-radius: 0.5rem; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; padding: 2vh 0; background: #FFF;">
                  <tr>
                    <td style="padding: 2rem min(2rem, 25vw)">
                      <h2 style="padding: 0 2vw;">Welcome to Identity Service</h2>
                      <h3 style="padding: 0 2vw;">Click below to confirm your email address.</h3>
                      <a href="${link}" style="display: inline-block; margin: 0 2vw; background-color: rgb(112, 14, 99); color: white; border-radius: 0.5rem; padding: 1rem max(15px, 5vw); text-decoration: none; font-weight: 900;">Confirm Email Address</a>
                      <p style="padding: 2vh 2vw 0; font-size: 0.8rem">
                        If you didn't request this email, there's nothing to worry about - you can safely ignore it.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
        
            <tr>
              <td style="padding-top: 1rem; font-size: 0.8rem;">
                <small>
                  &copy; Bradley Turner 2021-${new Date().getFullYear()}. All rights reserved.
                </small>
              </td>
            </tr>
          </table>
        </body>
      `
    };

    return this.send(request);
  }
}
