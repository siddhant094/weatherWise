import React from 'react';

const WeatherBox = (props) => {
    // console.log('props', props.props.data);
    const data = props.props.data;
    return (
        <div
            className={`p-3 [&_p_span]:font-bold [&_p_span]:text-xl bg-gradient-to-r to-cyan-500 from-blue-500 rounded-lg`}
        >
            <p>
                <span>Destination:</span> {data.name}
            </p>
            <p>
                <span>Temperature: </span> {data.main.temp}
            </p>
            <p>
                <span>Min Temp: </span> {data.main.temp_min}
            </p>
            <p>
                <span>Max Temp:</span> {data.main.temp_max}
            </p>
            <p>
                <span>Feels Like:</span> {data.main.feels_like}
            </p>
        </div>
    );
};

export default WeatherBox;

{
    /* 
useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    console.log('currentMonth', currentMonth);
    if (currentMonth >= 11 || currentMonth <= 2) {
        setIsWinters(true);
    }
    const handleSubmitRequestForAllPlaces = async () => {
        setLoading(true);
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

        try {
            const promises = placesList.map(async (placeItem) => {
                const response = await axios.get(url, {
                    params: {
                        q: placeItem,
                        units: 'metric',
                        appid: api_key,
                    },
                });
                if (response.data.main.temp < lowestTemp.temp) {
                    setLowestTemp({
                        place: placeItem,
                        temp: response.data.main.temp,
                    });
                    console.log('set lowest temp', response.data.main.temp);
                }

                if (response.data.main.temp > highestTemp.temp) {
                    setHighestTemp({
                        place: placeItem,
                        temp: response.data.main.temp,
                    });
                    console.log(
                        'set highest temp',
                        response.data.main.temp
                    );
                }
                if (response.error) {
                    console.error(
                        'Error fetching weather data: ',
                        response
                    );
                }
                return { place: placeItem, data: response.data };
            });

            const weatherDataArray = await Promise.all(promises);
            setWeatherData(weatherDataArray);
            setLoading(false);
            console.log('weatherDataArray', weatherDataArray);
            // console.log('loading', loading);
        } catch (error) {
            setLoading(false);
            console.error(
                'Error fetching weather data for all places: ',
                error
            );
        }
    };

    if (placesList.length > 0) {
        handleSubmitRequestForAllPlaces();
    }
}, [placesList]);

*/
}
