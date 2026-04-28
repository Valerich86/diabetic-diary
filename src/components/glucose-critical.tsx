'use client';

import { useState, useEffect } from 'react';
import SearchPeriod from '@/components/forms/search-period';
import GlucoseChart from '@/components/glucose-chart';
import { getFormattedDateTime } from '@/lib/time-date-formatter';
import Loading from './loading';

export default function GlucoseAnalysis({userId}:{userId:number}) {
  const [startDate, setStartDate] = useState<string>(
    getFormattedDateTime().fDate
  );
  const [endDate, setEndDate] = useState<string>(
    getFormattedDateTime().fDate
  );
  const [targetAmount, setTargetAmount] = useState<number>(10);
  const [glucoseData, setGlucoseData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/glucose-measurements/critical?userId=${userId}&startDate=${startDate}&endDate=${endDate}&targetAmount=${targetAmount}`
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setGlucoseData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, targetAmount]);

  return (
    <div className="w-full">
      <SearchPeriod
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {loading && <Loading />}
      {error && <div className="text-red-500 py-4">{error}</div>}

      {!loading && glucoseData.length > 0 && (
        <div className='w-full overflow-x-hidden'>
          <GlucoseChart data={glucoseData} />
        </div>
      ) }
        {!loading && !error && glucoseData.length === 0 && (
          <div className=" text-gray-500">
            Нет данных за выбранный период
          </div>
        )}
    </div>
  );
}
