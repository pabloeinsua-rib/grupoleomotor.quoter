import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('http://localhost:3000/api/env-check');
    console.log("DEV ENV:", res.data);
  } catch(e) {
    console.log(e.message);
  }
}
test();
