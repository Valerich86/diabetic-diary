"use client";

import { useState, useEffect } from "react";
import { DailyRecords } from "@/lib/types";
import ActionCard from "../UI/action-card";
import Loading from "../loading";
import SearchPeriod from "../forms/search-period";

interface Props {
  userId: number;
  begin: string;
  end: string;
}

export function ActionList({ userId, begin, end }:Props) {
  const [actions, setActions] = useState<DailyRecords[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [startDate, setStartDate] = useState(begin);
  const [endDate, setEndDate] = useState(end);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, refresh]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/all-records?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      );
      const { data } = await response.json();
      setActions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full x-spacing`}>
      <SearchPeriod
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      {isLoading && <Loading />}
      <div className="w-full lg:w-1/2 flex flex-col gap-7 mt-7">
        {actions.length === 0 && !isLoading && <p className="text-gray-500">В указанный период записей нет...</p>}
        {actions.length > 0 &&
          actions.map((item, index) => (
            <div key={index} className="w-full">
              <strong className="text-lg font-extrabold">{new Date(item.date).toLocaleDateString('ru-RU')}</strong>
              <div className="border"></div>
              <div className="w-full flex flex-col gap-5 mt-5">
                {item.daily_records.map((record, index) => (
                  <ActionCard key={index} act={record} refresh={refresh} setRefresh = {setRefresh}/>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
