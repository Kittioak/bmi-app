import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { calculateBMI } from "@/lib/bmiUtils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { weight, height } = await req.json();

    if (!weight || !height) {
      return NextResponse.json(
        { error: "Weight and height are required" },
        { status: 400 }
      );
    }

    const bmiValue = calculateBMI(Number(weight), Number(height));

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const record = await prisma.bMI_Record.create({
      data: {
        user_id: user.id,
        weight: Number(weight),
        height: Number(height),
        bmi_value: bmiValue,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error saving BMI record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const records = await prisma.bMI_Record.findMany({
      where: { user_id: user.id },
      orderBy: { recorded_at: "desc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching BMI records:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
