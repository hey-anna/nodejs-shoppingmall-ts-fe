export type CardField = "number" | "name" | "expiry" | "cvc";

export type CardValue = {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  focus: CardField; // PaymentForm과 동일하게 "" 금지
  // focus: CardField | ""; // 초기값 허용하려면 "" 포함
};
