const app = require('express')();
const fetch = require('cross-fetch');
const cities = require('./cities.json');

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.get('/getweather', async (req, res) => {
    let AllWeatherData = [];
    for (let i = 0; i < cities.length; i++) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cities[i].lat}&lon=${cities[i].lon}&appid=1471d4f11a5f30824120908dcd5c21ec`);
        const data = await response.json();
        console.log(data);
        if (data.cod == 200) {
            AllWeatherData.push({
                name: cities[i].name,
                lat: cities[i].lat,
                lon: cities[i].lon,
                time: data.dt,
                main: data.weather[0].main,
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                clouds: data.clouds.all,
                pressure: data.main.pressure,
                sunrise: data.sys.sunrise,
                sunset: data.sys.sunset,
            });
        } else {
            AllWeatherData.push({ name: cities[i].name, error: data.message });
        }
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.send(AllWeatherData);
});