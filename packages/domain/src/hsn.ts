/**
 * The HSN (goods) and SAC (services) codes an apparel, footwear and fabric business meets most. Descriptions
 * are short plain words, not the tariff text. No tax rate is stored here: apparel and footwear tax depends on
 * the price slab, and rates change, so each business keeps its own rate where it wants one.
 */
export interface HsnEntry { code: string; description: string; kind: "goods" | "service" }

const g = (code: string, description: string): HsnEntry => ({ code, description, kind: "goods" });
const s = (code: string, description: string): HsnEntry => ({ code, description, kind: "service" });

export const HSN_STANDARD: readonly HsnEntry[] = [
  g("6101", "Men's overcoats and jackets, knitted"), g("6102", "Women's overcoats and jackets, knitted"),
  g("6103", "Men's suits, jackets and trousers, knitted"), g("6104", "Women's suits, dresses, skirts and trousers, knitted"),
  g("6105", "Men's shirts, knitted"), g("6106", "Women's blouses and shirts, knitted"),
  g("6107", "Men's underwear and nightwear, knitted"), g("6108", "Women's slips, briefs and nightwear, knitted"),
  g("6109", "T-shirts, singlets and vests, knitted"), g("6110", "Jerseys, pullovers and cardigans, knitted"),
  g("6111", "Babies' garments, knitted"), g("6112", "Track suits, ski suits and swimwear, knitted"),
  g("6114", "Other garments, knitted"), g("6115", "Tights, stockings and socks, knitted"),
  g("6116", "Gloves, knitted"), g("6117", "Other clothing accessories, knitted"),
  g("6201", "Men's overcoats and jackets, woven"), g("6202", "Women's overcoats and jackets, woven"),
  g("6203", "Men's suits, jackets and trousers, woven"), g("6204", "Women's suits, dresses, skirts and trousers, woven"),
  g("6205", "Men's shirts, woven"), g("6206", "Women's blouses and shirts, woven"),
  g("6207", "Men's underwear and nightwear, woven"), g("6208", "Women's slips and nightwear, woven"),
  g("6209", "Babies' garments, woven"), g("6210", "Garments of felt or coated fabric"),
  g("6211", "Track suits, swimwear and other garments, woven"), g("6212", "Brassieres, girdles and corsets"),
  g("6213", "Handkerchiefs"), g("6214", "Shawls, scarves and veils"), g("6215", "Ties and bow ties"), g("6217", "Other clothing accessories, woven"),
  g("6301", "Blankets and travelling rugs"), g("6302", "Bed, table, toilet and kitchen linen"), g("6304", "Other furnishing articles"), g("6305", "Sacks and bags for packing"),
  g("6401", "Waterproof footwear"), g("6402", "Other footwear, rubber or plastic"), g("6403", "Footwear with leather uppers"),
  g("6404", "Footwear with textile uppers"), g("6405", "Other footwear"), g("6406", "Parts of footwear"),
  g("6505", "Hats and caps, knitted or made up"), g("4202", "Handbags, wallets and travel goods"), g("4203", "Leather clothing and belts"),
  g("5007", "Woven silk fabrics"), g("5208", "Woven cotton fabrics, light"), g("5209", "Woven cotton fabrics, heavy"), g("5407", "Woven synthetic filament fabrics"),
  g("5512", "Woven synthetic staple fibre fabrics"), g("6001", "Pile fabrics, knitted"), g("6004", "Knitted fabrics, elastic"), g("6006", "Other knitted fabrics"),
  g("5205", "Cotton yarn"), g("5402", "Synthetic filament yarn"),
  g("9606", "Buttons"), g("9607", "Slide fasteners (zips)"), g("5806", "Narrow woven fabrics and ribbons"), g("6307", "Other made-up textile articles"),
  s("998821", "Textile manufacturing services (job work)"), s("998822", "Wearing apparel manufacturing services (job work)"),
  s("996511", "Road transport of goods"), s("997212", "Renting of commercial property"),
] as const;
