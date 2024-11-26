/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NotAllowed from "~/components/common/NotAllowed";
import FacultyList from "~/components/common/Table/FacultyList";
import { type facultyAttributes } from "~/data/models/schedule";
import { api } from "~/trpc/react";

export default function Page() {
  const session = useSession();

  const [loading, setLoading] = useState<boolean>(true);
  const [faculty, setFaculty] = useState<facultyAttributes[]>([]); // Initialize as an empty array

  const { data, isLoading, error } = api.schedule.getAllFaculty.useQuery(undefined, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching faculty data:", error);
      setLoading(false);
    }

    if (data) {
      setFaculty(data as facultyAttributes[]);
      setLoading(false);
    }
  }, [data, error]);

  if (
    session.data?.user.role === "Security Guard" ||
    session.data?.user.role === "Room Viewer"
  ) {
    return <NotAllowed />;
  }
  return <FacultyList loading={loading} faculties={faculty} />;
}
