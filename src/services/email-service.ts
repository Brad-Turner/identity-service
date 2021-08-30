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
        <body style="background-color: #F7F7F7; padding: 5vh 5vw; letter-spacing: 0.05rem;" >
          <table style="width: 100%; color: #222; text-align: center;">
            <tr>
              <td style="width: 100%; border-radius: 0.5rem; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; padding: 2vh 0; background-color: #FFF;">
                <h2>Welcome to Identity Service</h2>
                <h3>Click below to confirm your email address.</h3>
                <a href="${link}" style="display: inline-block; background-color: rgb(112, 14, 99); color: white; border-radius: 0.5rem; padding: 1rem 3rem; text-decoration: none;">Confirm Email Address</a>
                <p>
                  If you didn't request this email, there's nothing to worry about - you can safely ignore it.
                </p>
              </td>
            </tr>
        
            <tr>
              <td style="padding-top: 1rem;">
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
