import type { BookingInput } from "@/lib/types";

export type VerificationResult = {
  verified: boolean;
  method: "demo" | "otp" | "admin_approval";
  verifiedAt?: string;
};

export interface VerificationProvider {
  verifyBooking(input: BookingInput): Promise<VerificationResult>;
}

export class DemoVerificationProvider implements VerificationProvider {
  async verifyBooking(): Promise<VerificationResult> {
    return {
      verified: true,
      method: "demo",
      verifiedAt: new Date().toISOString()
    };
  }
}
