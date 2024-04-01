export const convertKelvinToCelcius = (temp: number): number => {
  const celsius = temp - 273.15; // Conversion formula from Kelvin to Celsius
  return Math.round(celsius * 100) / 100;
};
