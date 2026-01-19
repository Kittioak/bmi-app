export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) return 0;
  // height is in cm, convert to meters
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
}

export function getBMIResult(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < 18.5) {
    return { label: "Underweight (ผอมเกินไป)", color: "text-blue-500" };
  } else if (bmi >= 18.5 && bmi < 23) {
    return { label: "Normal (น้ำหนักปกติ)", color: "text-green-500" };
  } else if (bmi >= 23 && bmi < 25) {
    return { label: "Overweight (น้ำหนักเกิน - ท้วม)", color: "text-yellow-500" };
  } else if (bmi >= 25 && bmi < 30) {
    return { label: "Obese Level 1 (อ้วน)", color: "text-orange-500" };
  } else {
    return { label: "Obese Level 2 (อ้วนมาก)", color: "text-red-500" };
  }
}
