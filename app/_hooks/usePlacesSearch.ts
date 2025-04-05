import { useState, useEffect } from "react";
import { Place } from "../_types";
import * as Sentry from "@sentry/react-native";

export const usePlacesSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const fetchPlaces = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&language=ko&region=kr&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        setResults(data.results);
        setIsDropdownVisible(true);
      } else {
        Sentry.captureMessage(`Places API failed: ${data.status}`);
        setResults([]);
        setIsDropdownVisible(false);
      }
    } catch (error) {
      Sentry.captureException(error);

      setResults([]);
      setIsDropdownVisible(false);
    }
  };
  useEffect(() => {
    setSearchQuery(selectedQuery);
    setIsDropdownVisible(false);
  },[selectedQuery])
  useEffect(() => {
    if (results.length > 0) {
      setIsDropdownVisible(true);
    }
  }, [results]);

  return {
    searchQuery,
    selectedQuery,
    results,
    isDropdownVisible,
    setSearchQuery,
    setIsDropdownVisible,
    setSelectedQuery,
    fetchPlaces, // 호출은 외부에서 결정
  };
};
