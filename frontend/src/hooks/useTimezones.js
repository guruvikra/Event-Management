import { useState, useEffect } from 'react';
import { timezoneService } from '../services/timezoneService.js';

export const useTimezones = () => {
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimezones = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await timezoneService.getAllTimezones();
        setTimezones(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching timezones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimezones();
  }, []);

  return { timezones, loading, error };
};