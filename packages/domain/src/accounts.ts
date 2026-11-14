import { validateJournal, type JournalError, type JournalLine } from "./posting.js";

/**
 * Chart of accounts. Groups follow the structure Indian accountants know from Tally
 * (Capital Account, Current Assets, Duties & Taxes, Sundry Debtors, ...), so a business
 * switching over finds the same shape. Nature is set on primary groups and inherited.
 */
export type Nature = "asset" | "liability" | "equity" | "income" | "expense";

export interface GroupTemplate {
  key: string;
  name: string;
  nameHi: string;
  nature: Nature;
  parent?: string;
  /** For income/expense: direct items feed gross profit, indirect items come after it. */
  pl?: "trading" | "operating";
}

export interface AccountTemplate {
  key: string;
  name: string;
  nameHi: string;
  group: string;
}

export const GROUP_TEMPLATE: readonly GroupTemplate[] = [
  { key: "capital", name: "Capital Account", nameHi: "पूँजी खाता", nature: "equity" },
  { key: "reserves", name: "Reserves & Surplus", nameHi: "आरक्षित और अधिशेष", nature: "equity", parent: "capital" },
  { key: "loans_liability", name: "Loans (Liability)", nameHi: "ऋण (देयता)", nature: "liability" },
  { key: "secured_loans", name: "Secured Loans", nameHi: "सुरक्षित ऋण", nature: "liability", parent: "loans_liability" },
  { key: "unsecured_loans", name: "Unsecured Loans", nameHi: "असुरक्षित ऋण", nature: "liability", parent: "loans_liability" },
  { key: "bank_od", name: "Bank OD / Cash Credit", nameHi: "बैंक ओडी / कैश क्रेडिट", nature: "liability", parent: "loans_liability" },
  { key: "current_liabilities", name: "Current Liabilities", nameHi: "चालू देयताएँ", nature: "liability" },
  { key: "duties_taxes", name: "Duties & Taxes", nameHi: "शुल्क और कर", nature: "liability", parent: "current_liabilities" },
  { key: "sundry_creditors", name: "Sundry Creditors", nameHi: "विविध लेनदार", nature: "liability", parent: "current_liabilities" },
  { key: "provisions", name: "Provisions", nameHi: "प्रावधान", nature: "liability", parent: "current_liabilities" },
  { key: "suspense", name: "Suspense Account", nameHi: "उचंत खाता", nature: "liability" },
  { key: "fixed_assets", name: "Fixed Assets", nameHi: "स्थायी संपत्ति", nature: "asset" },
  { key: "investments", name: "Investments", nameHi: "निवेश", nature: "asset" },
  { key: "current_assets", name: "Current Assets", nameHi: "चालू संपत्ति", nature: "asset" },
  { key: "bank_accounts", name: "Bank Accounts", nameHi: "बैंक खाते", nature: "asset", parent: "current_assets" },
  { key: "cash_in_hand", name: "Cash-in-Hand", nameHi: "हाथ में नकद", nature: "asset", parent: "current_assets" },
  { key: "sundry_debtors", name: "Sundry Debtors", nameHi: "विविध देनदार", nature: "asset", parent: "current_assets" },
  { key: "stock_in_hand", name: "Stock-in-Hand", nameHi: "स्टॉक", nature: "asset", parent: "current_assets" },
  { key: "loans_advances_asset", name: "Loans & Advances (Asset)", nameHi: "ऋण और अग्रिम (संपत्ति)", nature: "asset", parent: "current_assets" },
  { key: "deposits_asset", name: "Deposits (Asset)", nameHi: "जमा (संपत्ति)", nature: "asset", parent: "current_assets" },
  { key: "sales_accounts", name: "Sales Accounts", nameHi: "बिक्री खाते", nature: "income", pl: "trading" },
  { key: "direct_income", name: "Direct Incomes", nameHi: "प्रत्यक्ष आय", nature: "income", pl: "trading" },
  { key: "indirect_income", name: "Indirect Incomes", nameHi: "अप्रत्यक्ष आय", nature: "income", pl: "operating" },
  { key: "purchase_accounts", name: "Purchase Accounts", nameHi: "खरीद खाते", nature: "expense", pl: "trading" },
  { key: "direct_expenses", name: "Direct Expenses", nameHi: "प्रत्यक्ष व्यय", nature: "expense", pl: "trading" },
  { key: "indirect_expenses", name: "Indirect Expenses", nameHi: "अप्रत्यक्ष व्यय", nature: "expense", pl: "operating" },
];

export const ACCOUNT_TEMPLATE: readonly AccountTemplate[] = [
  { key: "closing_stock", name: "Closing Stock", nameHi: "अंतिम स्टॉक", group: "stock_in_hand" },
  { key: "stock_change", name: "Change in Stock", nameHi: "स्टॉक में परिवर्तन", group: "direct_expenses" },
  { key: "cash", name: "Cash", nameHi: "नकद", group: "cash_in_hand" },
  { key: "owners_capital", name: "Owner's Capital", nameHi: "मालिक की पूँजी", group: "capital" },
  { key: "sales", name: "Sales", nameHi: "बिक्री", group: "sales_accounts" },
  { key: "sales_returns", name: "Sales Returns", nameHi: "बिक्री वापसी", group: "sales_accounts" },
  { key: "purchases", name: "Purchases", nameHi: "खरीद", group: "purchase_accounts" },
  { key: "purchase_returns", name: "Purchase Returns", nameHi: "खरीद वापसी", group: "purchase_accounts" },
  { key: "output_cgst", name: "Output CGST", nameHi: "आउटपुट सीजीएसटी", group: "duties_taxes" },
  { key: "output_sgst", name: "Output SGST", nameHi: "आउटपुट एसजीएसटी", group: "duties_taxes" },
  { key: "output_utgst", name: "Output UTGST", nameHi: "आउटपुट यूटीजीएसटी", group: "duties_taxes" },
  { key: "output_igst", name: "Output IGST", nameHi: "आउटपुट आईजीएसटी", group: "duties_taxes" },
  { key: "output_cess", name: "Output Cess", nameHi: "आउटपुट सेस", group: "duties_taxes" },
  { key: "input_cgst", name: "Input CGST", nameHi: "इनपुट सीजीएसटी", group: "duties_taxes" },
  { key: "input_sgst", name: "Input SGST", nameHi: "इनपुट एसजीएसटी", group: "duties_taxes" },
  { key: "input_utgst", name: "Input UTGST", nameHi: "इनपुट यूटीजीएसटी", group: "duties_taxes" },
  { key: "input_igst", name: "Input IGST", nameHi: "इनपुट आईजीएसटी", group: "duties_taxes" },
  { key: "input_cess", name: "Input Cess", nameHi: "इनपुट सेस", group: "duties_taxes" },
  { key: "tds_payable", name: "TDS Payable", nameHi: "देय टीडीएस", group: "duties_taxes" },
  { key: "tcs_payable", name: "TCS Payable", nameHi: "देय टीसीएस", group: "duties_taxes" },
  { key: "round_off", name: "Round Off", nameHi: "राउंड ऑफ़", group: "indirect_expenses" },
  { key: "discount_allowed", name: "Discount Allowed", nameHi: "दी गई छूट", group: "indirect_expenses" },
  { key: "discount_received", name: "Discount Received", nameHi: "प्राप्त छूट", group: "indirect_income" },
  { key: "freight_inward", name: "Freight Inward", nameHi: "आवक भाड़ा", group: "direct_expenses" },
  { key: "salaries", name: "Salaries & Wages", nameHi: "वेतन और मज़दूरी", group: "indirect_expenses" },
  { key: "employer_contributions", name: "Employer PF, ESI & LWF", nameHi: "नियोक्ता पीएफ, ईएसआई और एलडब्ल्यूएफ", group: "indirect_expenses" },
  { key: "gratuity_leave", name: "Gratuity & Leave Encashment", nameHi: "ग्रेच्युटी और अवकाश नकदीकरण", group: "indirect_expenses" },
  { key: "salary_payable", name: "Salary Payable", nameHi: "देय वेतन", group: "current_liabilities" },
  { key: "pf_payable", name: "PF Payable", nameHi: "देय पीएफ", group: "current_liabilities" },
  { key: "esi_payable", name: "ESI Payable", nameHi: "देय ईएसआई", group: "current_liabilities" },
  { key: "lwf_payable", name: "LWF Payable", nameHi: "देय श्रम कल्याण निधि", group: "current_liabilities" },
  { key: "pt_payable", name: "Professional Tax Payable", nameHi: "देय व्यवसाय कर", group: "duties_taxes" },
  { key: "stipend", name: "Stipend", nameHi: "वृत्तिका", group: "indirect_expenses" },
  { key: "salary_advances", name: "Salary Advances", nameHi: "वेतन अग्रिम", group: "loans_advances_asset" },
  { key: "upi_clearing", name: "UPI Receipts (to bank)", nameHi: "यूपीआई प्राप्तियाँ (बैंक में आनी हैं)", group: "current_assets" },
  { key: "card_clearing", name: "Card Receipts (to bank)", nameHi: "कार्ड प्राप्तियाँ (बैंक में आनी हैं)", group: "current_assets" },
  { key: "cash_short_excess", name: "Cash Short / Excess", nameHi: "नकद कमी / अधिकता", group: "indirect_expenses" },
  { key: "rent", name: "Rent", nameHi: "किराया", group: "indirect_expenses" },
  { key: "electricity", name: "Electricity", nameHi: "बिजली", group: "indirect_expenses" },
  { key: "bank_charges", name: "Bank Charges", nameHi: "बैंक शुल्क", group: "indirect_expenses" },
  { key: "interest_received", name: "Interest Received", nameHi: "प्राप्त ब्याज", group: "indirect_income" },
  { key: "gateway_charges", name: "Payment Gateway Charges", nameHi: "पेमेंट गेटवे शुल्क", group: "indirect_expenses" },
  { key: "depreciation", name: "Depreciation", nameHi: "मूल्यह्रास", group: "indirect_expenses" },
  { key: "profit_on_sale_of_assets", name: "Profit on Sale of Assets", nameHi: "संपत्ति बिक्री पर लाभ", group: "indirect_income" },
  { key: "loss_on_sale_of_assets", name: "Loss on Sale of Assets", nameHi: "संपत्ति बिक्री पर हानि", group: "indirect_expenses" },
  { key: "reimbursements_payable", name: "Expense Reimbursements Payable", nameHi: "देय व्यय प्रतिपूर्ति", group: "current_liabilities" },
  { key: "travel", name: "Travelling & Conveyance", nameHi: "यात्रा और वाहन व्यय", group: "indirect_expenses" },
  { key: "lodging", name: "Hotel & Lodging", nameHi: "होटल और ठहरना", group: "indirect_expenses" },
  { key: "staff_welfare", name: "Staff Welfare & Meals", nameHi: "कर्मचारी कल्याण और भोजन", group: "indirect_expenses" },
  { key: "stationery", name: "Printing & Stationery", nameHi: "छपाई और स्टेशनरी", group: "indirect_expenses" },
  { key: "telephone", name: "Telephone & Internet", nameHi: "टेलीफ़ोन और इंटरनेट", group: "indirect_expenses" },
  { key: "courier", name: "Postage & Courier", nameHi: "डाक और कूरियर", group: "indirect_expenses" },
  { key: "brokerage", name: "Brokerage & Commission", nameHi: "दलाली और कमीशन", group: "indirect_expenses" },
  { key: "alteration_labour", name: "Alteration & Tailoring Labour", nameHi: "ऑल्टरेशन और सिलाई मज़दूरी", group: "direct_expenses" },
  { key: "stock_writedown", name: "Stock Write-down", nameHi: "स्टॉक मूल्य में कटौती", group: "indirect_expenses" },
  { key: "stock_provision", name: "Provision for Stock Write-down", nameHi: "स्टॉक कटौती का प्रावधान", group: "current_assets" },
  { key: "recon_differences", name: "Reconciliation Differences", nameHi: "मिलान अंतर", group: "indirect_expenses" },
  { key: "repair_deposits", name: "Repair Deposits", nameHi: "रिपेयर जमा", group: "current_liabilities" },
  { key: "repair_income", name: "Repair & Service Income", nameHi: "रिपेयर और सेवा आय", group: "indirect_income" },
  { key: "gift_vouchers", name: "Gift Vouchers Outstanding", nameHi: "बकाया गिफ्ट वाउचर", group: "current_liabilities" },
  { key: "vouchers_written_back", name: "Unredeemed Vouchers Written Back", nameHi: "बिना भुनाए वाउचर की वापसी", group: "indirect_income" },
];

/** Groups whose accounts count as cash or bank (for payment, receipt and contra vouchers). */
export const CASH_BANK_GROUPS = ["cash_in_hand", "bank_accounts", "bank_od"] as const;

/** Debit-normal natures show positive balances as Dr; the rest as Cr. */
export const isDebitNature = (n: Nature) => n === "asset" || n === "expense";

export const VOUCHER_TYPES = ["journal", "payment", "receipt", "contra"] as const;
export type VoucherType = (typeof VOUCHER_TYPES)[number];

export interface VoucherLine extends JournalLine {
  /** True when the account sits under Cash-in-Hand, Bank Accounts or Bank OD. */
  cashOrBank: boolean;
}

export type VoucherError =
  | JournalError
  | { code: "payment_needs_cash_bank_credit" }
  | { code: "receipt_needs_cash_bank_debit" }
  | { code: "contra_only_cash_bank" };

const positive = (v: JournalLine["debit"]) => v !== undefined && v !== null && Number(v) > 0;

/** Journal balance rules plus the rule each voucher type adds (as in Tally). */
export function validateVoucher(type: VoucherType, lines: VoucherLine[]): VoucherError[] {
  const errors: VoucherError[] = [...validateJournal(lines)];
  if (type === "payment" && !lines.some((l) => l.cashOrBank && positive(l.credit))) errors.push({ code: "payment_needs_cash_bank_credit" });
  if (type === "receipt" && !lines.some((l) => l.cashOrBank && positive(l.debit))) errors.push({ code: "receipt_needs_cash_bank_debit" });
  if (type === "contra" && lines.some((l) => !l.cashOrBank)) errors.push({ code: "contra_only_cash_bank" });
  return errors;
}
