import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Combobox } from '@headlessui/react';
import WeatherBox from './components/WeatherBox';
import PlaceBox from './components/PlaceBox';
import './App.css';

function Home() {
    const [place, setPlace] = useState('');
    const [placesList, setPlacesList] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWinters, setIsWinters] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [lowestTemp, setLowestTemp] = useState({ temp: Infinity });
    const [highestTemp, setHighestTemp] = useState({ temp: -Infinity });

    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        console.log('currentMonth', currentMonth);
        if (currentMonth >= 11 || currentMonth <= 2) {
            setIsWinters(true);
        }
    }, []);

    useEffect(() => {
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

    const handleInputChange = async (inputCity) => {
        console.log('Input:', inputCity);
        await setPlace((prev) => inputCity);
        console.log('Place:', inputCity);
        axios
            .get(
                `https://api.api-ninjas.com/v1/city?name=${inputCity}&limit=5`,
                {
                    headers: {
                        'X-Api-Key': import.meta.env.VITE_CITY_API,
                    },
                }
            )
            .then((res) => {
                setSuggestions(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className='min-h-screen bg-black text-white'>
            <div className='flex flex-col items-center justify-center gap-5 pt-12'>
                <h1 className='text-4xl font-medium text-blue-400'>
                    Place Suggestion App 🌍
                </h1>
                <div className='flex w-full items-center justify-center gap-4 text-black'>
                    <div className='w-5/12'>
                        <Combobox value={place} onChange={setPlace}>
                            <Combobox.Input
                                onChange={(event) =>
                                    handleInputChange(event.target.value)
                                }
                                className='[&:has(:focus-visible)]:ring-4 border border-gray-300 p-2 w-full rounded-lg text-black font-medium'
                            />
                            <Combobox.Options className='absolute z-10 bg-white border-gray-300 rounded-lg mt-3 w-5/12'>
                                {suggestions.map((suggestion, index) => {
                                    return (
                                        <Combobox.Option
                                            key={index}
                                            value={suggestion.name}
                                            as={Fragment}
                                            className='cursor-pointer p-2'
                                        >
                                            {({ active, selected }) => (
                                                <li
                                                    className={`${
                                                        active
                                                            ? 'bg-blue-500 text-white rounded-md'
                                                            : 'bg-white text-black rounded-md'
                                                    }`}
                                                >
                                                    {/* {selected && <CheckIcon />} */}
                                                    {suggestion.name}
                                                </li>
                                            )}
                                        </Combobox.Option>
                                    );
                                })}
                            </Combobox.Options>
                        </Combobox>
                    </div>
                    {/* <input
                        type='text'
                        list='places'
                        onChange={(e) => handleInputChange(e.target.value)}
                        value={place}
                        placeholder='Enter a place'
                        className='border border-gray-300 p-2 rounded-lg w-5/12 text-black font-medium'
                    /> */}
                    {/* {suggestions.length > 0 && (
                        <datalist id='places' className='visible'>
                            {suggestions.map((suggestion, index) => {
                                console.log(suggestion);
                                return (
                                    <option key={index} value={suggestion} />
                                );
                            })}
                        </datalist>
                    )} */}
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
                    </div>
                )}
                <div>
                    <p>Lowest Temp: {lowestTemp.temp}°C</p>
                    <p>Highest Temp: {highestTemp.temp}°C</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
