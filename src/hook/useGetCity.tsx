import { Country, State, City } from "country-state-city";

const useGetCity = () => {
  const usa = Country.getAllCountries().find(
    (country) => country.isoCode === "US"
  );
  const states = usa ? State.getStatesOfCountry(usa.isoCode) : [];
  const allCities = usa
    ? states.flatMap((state) => {
        return City.getCitiesOfState(usa.isoCode, state.isoCode);
      })
    : [];
  const uniqueCities = Array.from(
    new Map(allCities.map((city) => [city.name, city])).values()
  );
  return uniqueCities;
};

export default useGetCity;
