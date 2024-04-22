import { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherBox from './components/WeatherBox';
import PlaceBox from './components/PlaceBox';
import './App.css';

function App() {
    const [place, setPlace] = useState('');
    const [placesList, setPlacesList] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWinters, setIsWinters] = useState(false);
    const [lowestTemp, setLowestTemp] = useState({ temp: Infinity });
    const [highestTemp, setHighestTemp] = useState({ temp: -Infinity });

    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        console.log('currentMonth', currentMonth);
        if (currentMonth >= 11 || currentMonth <= 2) {
            setIsWinters(true);
        }
        const handleSubmitRequestForLastPlace = async () => {
            setLoading(true);
            const url = 'https://api.openweathermap.org/data/2.5/weather';
            const lastAddedPlace = placesList[placesList.length - 1]; // Get the last added place

            try {
                const response = await axios.get(url, {
                    params: {
                        q: lastAddedPlace,
                        units: 'metric',
                        appid: import.meta.env.VITE_API_KEY,
                    },
                });
                if (response.error) {
                    console.error('Error fetching weather data: ', response);
                    setLoading(false);
                    return;
                }
                const newData = { place: lastAddedPlace, data: response.data };
                if (response.error) return;
                if (weatherData === null) {
                    setWeatherData([newData]);
                } else {
                    setWeatherData((prevData) => [...prevData, newData]);
                }

                // Update lowest and highest temperatures if necessary
                if (response.data.main.temp < lowestTemp.temp) {
                    setLowestTemp({
                        place: lastAddedPlace,
                        temp: response.data.main.temp,
                    });
                    console.log('set lowest temp', response.data.main.temp);
                }
                if (response.data.main.temp > highestTemp.temp) {
                    setHighestTemp({
                        place: lastAddedPlace,
                        temp: response.data.main.temp,
                    });
                    console.log('set highest temp', response.data.main.temp);
                }

                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(
                    'Error fetching weather data for last place: ',
                    error
                );
            }
        };

        if (placesList.length > 0) {
            handleSubmitRequestForLastPlace();
        }
    }, [placesList]);

    const handlePlaceSubmit = () => {
        setPlacesList((prev) => [...prev, place]);
        setPlace('');
    };

    return (
        <div className='min-h-screen bg-black text-white'>
            <div className='flex flex-col items-center justify-center gap-5 pt-12'>
                <h1 className='text-4xl font-medium text-blue-400 bg-'>
                    Place Suggestion App 🌍
                </h1>
                <div className='flex w-full items-center justify-center gap-4'>
                    <input
                        type='text'
                        onChange={(e) => setPlace(e.target.value)}
                        value={place}
                        placeholder='Enter a place'
                        className='border border-gray-300 p-2 rounded-lg w-5/12 text-black font-medium'
                    />
                    <button
                        onClick={handlePlaceSubmit}
                        className='p-2 rounded-md bg-blue-400 text-white font-medium'
                    >
                        Add Place
                    </button>
                </div>
                {/* <button onClick={handleSubmitRequest}>Show Weather</button> */}
                {/* <button
                    onClick={handleSubmitRequestForAllPlaces}
                    className='p-2 rounded-md bg-blue-400 text-white font-medium mb-3'
                >
                    Show Weather
                </button>  */}
            </div>
            {placesList.length > 0 && (
                <div className='flex flex-col items-center justify-center gap-3 pt-4'>
                    <span className='text-2xl font-semibold'>
                        Your Travel List Includes:
                    </span>
                    <div className='flex flex-row items-center justify-center gap-3'>
                        {placesList.map((place, index) => (
                            <PlaceBox key={index} props={place} />
                        ))}
                    </div>
                </div>
            )}
            <div className='flex items-center justify-center font-medium text-3xl m-3'>
                {!loading && placesList.length > 0 && (
                    <div>Best Place to visit is {lowestTemp.place}</div>
                )}
            </div>
            <div>
                {/* {loading && <p>Loading...</p>} */}
                {!loading && (
                    <div className='grid grid-flow-row grid-cols-3 px-8 py-5 gap-5'>
                        {/* <h1>Works outer</h1>{' '} */}
                        {weatherData.map((data, index) => {
                            // console.log('Mapping data:', data);
                            return (
                                <div key={index} className='p-3'>
                                    {/* {data.place}: {data.data.main.temp}°C */}
                                    <WeatherBox props={data} />
                                </div>
                            );
                        })}
                        <div>
                            {/* <p>Lowest Temp: {lowestTemp.temp}°C</p>
                            <p>Highest Temp: {highestTemp.temp}°C</p> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
