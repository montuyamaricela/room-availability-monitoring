"use client";

import { useEffect, useState } from "react";
import FeedBacks from "~/components/admin/FeedBacks";
import Spinner from "~/components/common/Spinner";
import { type feedBackAttributes } from "~/data/models/feedback";
import { type PaginatedList } from "~/lib/types";
import { useFeedbackStore } from "~/store/useFeedbackStore";
import { api } from "~/trpc/react";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true); // Initially loading is true

  const { setFeedbacks } = useFeedbackStore();

  const { data, isLoading, error, refetch } =
    api.feedback.getAllFeedback.useQuery(undefined, {
      refetchInterval: 5000,
    });

  useEffect(() => {
    if (data) {
      // Assuming the data you get is a list of activity logs
      setFeedbacks(data as unknown as PaginatedList<feedBackAttributes>);
    }

    if (error) {
      console.error("Error fetching room logs:", error);
    }

    // Set loading to false after the first successful fetch
    setLoading(isLoading);
  }, [data, error, isLoading, setFeedbacks]);

  return <>{isLoading ? <Spinner /> : <FeedBacks />}</>;
}
