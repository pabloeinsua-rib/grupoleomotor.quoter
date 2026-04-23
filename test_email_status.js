import axios from 'axios';

(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/email/status');
    console.log(res.data);
  } catch(e) {
    console.error(e.message);
  }
})();
