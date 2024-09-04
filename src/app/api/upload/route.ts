/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import csv from "csv-parser";
import { db } from "~/server/db";
import { PassThrough } from "stream";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const category = formData.get("category") as string | null;
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileStream = new PassThrough();
    fileStream.end(buffer);

    const results: any[] = [];
    return new Promise<NextResponse>((resolve, reject) => {
      fileStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            if (category?.toLowerCase() === "faculty") {
              await db.faculty.createMany({
                data: results.map((row) => ({
                  facultyName: row.Name,
                  department: row.Department,
                })),
              });
            } else if (category?.toLowerCase() === "room") {
              await db.room.createMany({
                data: results.map((row) => ({
                  roomName: row.roomName,
                  building: row.building,
                  floor: row.floor,
                  withTv: row.WithTv === "TRUE",
                  isLecture: row.isLecture === "TRUE",
                  isLaboratory: row.isLaboratory === "TRUE",
                  isAirconed: row.isAirconed === "TRUE",
                  capacity: parseInt(row.capacity, 10),
                  electricFans: parseInt(row.electricFans, 10),
                  functioningComputers: parseInt(row.functioningComputers, 10),
                  notFunctioningComputers: parseInt(
                    row.notFunctioningComputers,
                    10,
                  ),
                  status: row.status,
                  disable: row.disable === "TRUE",
                })),
              });
            }

            resolve(
              NextResponse.json(
                { message: "Data successfully stored", data: results },
                { status: 200 },
              ),
            );
          } catch (error) {
            console.error("Error saving data:", error);
            resolve(
              NextResponse.json(
                { error: "Error saving data" },
                { status: 500 },
              ),
            );
          }
        })
        .on("error", (error) => {
          console.error("Error processing CSV file:", error);
          resolve(
            NextResponse.json(
              { error: "Error processing CSV file" },
              { status: 500 },
            ),
          );
        });
    });
  } catch (e) {
    console.error("Error processing file:", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
