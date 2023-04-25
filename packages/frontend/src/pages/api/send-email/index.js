import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  const { email, subject, message } = req.body;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'oheirelav@gmail.com', // Change to your verified sender
    subject: subject,
    // templateId: 'd-28e9b090264e4fb1951b9b16ea173668'
    text: message
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
}
