import PostalMime from 'postal-mime';
import { Blob } from 'buffer';

const p = new PostalMime();
const str = "Message-ID: <123456789>\r\nSubject: Test\r\nFrom: sender@test.com\r\n\r\nHello world";
const b = new Blob([str], { type: 'message/rfc822' });

p.parse(b).then(res => {
   console.log(res);
}).catch(console.error);
