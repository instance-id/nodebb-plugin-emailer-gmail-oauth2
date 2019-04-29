
# NodeBB Emailer (Gmail-Oauth2)


This NodeBB plugin allows NodeBB to send emails to users through the third-party transactional email service [Gmail-Oauth2](http://gmail.com).

To customise options for this plugin, please consult the "Emailer (Gmail-Oauth2)" page in the administration panel, under the "Plugins" heading.

## Why you might want to use this plugin?

Hello, 
I appreciate you taking a look at my plugin. The purpose for this plugin was, I have a Google for Business account and so I have multiple domains (a primary which is my actual account email, but then secondary/alias domains, which when receiving emails, they all come into one inbox) on my account in which I can send and receive emails. With the "normal" way of using Gmail to send emails, you have to use your account login and password and it just sends as the email address in which your account login is. I wanted to be able to send out emails from NodeBB from one of my secondary/alias domains, with this plugin, you are able to do just that!

-----------------

### IMPORTANT NOTES - In order to send email from an address that is not your accounts primary email address it *must* be added to your gmail account as a secondary / alias email account. To know if it is properly added, you can open the https://mail.google.com and click Compose to begin writing a new email. In the From: field of the email message, if you are able to hit a dropdown and select a different email address to send from, then you will be able to put that address into the "Email Address" section within the Email Settings box. If not, you must properly add the domain and address to your account as a secondary/alias domain/address.

Here are instructions for adding a secondary/alias domain to your Gmail account.
https://mediatemple.net/community/products/googleapps/204645570/adding-a-domain-alias-in-g-suite

Here are instructions for adding a secondary/alias email address to your Gmail account to be able to actually use it once the domain is added to your account as per above.
https://support.google.com/mail/answer/22370

-------------
## Installation

Setup is a bit complicated, so instead of rewriting all of the instructions from scratch, I am going to include some links to some in depth and very informative setup guides for some of the more standard parts of the install on the Google/Gmail side of things.

After installation and activation of the plugin, you can go to the Plugins menu in the admin page and you will find "Emailer (Gmail-Oauth2)". Inside there you will see places to input some data. In the link below you will find the instructions necessary to generate and obtain most of that information.

 
https://masashi-k.blogspot.com/2013/06/sending-mail-with-gmail-using-xoauth2.html
(Many thanks to the writer of this blog post)

After you follow all the steps within the blog above, you would have 5 total pieces of information.
ClientID
ClientSecret
RefreshToken
Authentication Email: (the primary email address of your account for authentication purposes)
Authorized URL (This can just be the URL of your site, ex. https://forum.mysite.com)

You will then input that information into the Emailer(Gmail-Oauth2) plugin page, save, and then rebuild/restart your forum.

After that is complete, in your admin panel, go to the Settings tab, and then Email.
On this page, under the Email Address section, you will input the email address you would like your email from the forum to actually be sent from.



