/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useState } from "react";
import Schedule from "~/components/admin/Schedule";
import Spinner from "~/components/common/Spinner";
import { type scheduleAttributes } from "~/data/models/schedule";
import { type PaginatedList } from "~/lib/types";
import { useScheduleStore } from "~/store/useScheduleStore";

export default function Page() {
  const { setSchedule } = useScheduleStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/schedule", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setSchedule(data as PaginatedList<scheduleAttributes>);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    // First fetch on component mount
    setLoading(true);
    fetchSchedules().finally(() => setLoading(false)); // Ensure loading is updated

    // Set up polling every 5 second
    intervalId = setInterval(fetchSchedules, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [setSchedule]);

  return <>{loading ? <Spinner /> : <Schedule loading={loading} />} </>;
}
