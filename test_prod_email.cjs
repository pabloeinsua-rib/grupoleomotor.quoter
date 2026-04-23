import axios from 'axios';
(async () => {
    const res = await axios.get('https://ais-dev-zeaqwbxxvxoszjwa5t2luj-7977497277.europe-west2.run.app/api/email/status');
    console.log(res.data);
})();
