# Tiles business update

This application now defaults to a tiles trading business. New stock products default to BOX. Dimensions such as 4x2 describe feet per tile; stock, purchase and sale quantities and rates remain in boxes, with no area conversion.

## Changes
- Tiles onboarding option and default for new businesses; existing businesses are preserved.
- Product brand, dimensions and finish in item setup, search and API responses. Brand and finish are new nullable database columns; dimensions use the existing size field.
- Inventory CSV import accepts SKU, Brand, Product_Name, Size, Finish, UOM and Quantity. Brand, design and size form the imported display name. Prices and stock are per box.
- Missing import units default to BOX. Missing rates/valuation still default to zero and GST to the existing 18% fallback; explicitly supply actual rates before committing imports. No tax classification is inferred from a design or dimension.
- Duplicate SKUs are skipped, and malformed prices are reported as row errors before inserts.
- Opening stock, purchases and sales continue to use the selected product's base unit. Existing product units and historical transactions are not converted.
- Shade/batch tracking remains opt-in using existing batch handling. No shade data is guessed from the CSV.
- Previous no_tenant dashboard recovery is included.

## Deployment order
1. Back up your database and replace the application source with this version.
2. Run npm ci from the repository root.
3. Set DATABASE_OWNER_URL in your deployment terminal to the existing database owner connection, then run npm run db:migrate. Migration 0149 adds tile_brand/tile_finish and changes the default industry for new tenant rows. It does not rewrite existing rows.
4. Redeploy BOTH Vercel projects (API and web) from this source. Run the migration before either project serves the updated schema.
5. For new tiles, confirm the product unit is BOX. Import the supplied inventory from Settings > Import > Items; preview first and review price, tax and opening value.
6. Verify one purchase and sale in a test business: receiving 10 boxes and selling 3 boxes should leave 7 boxes. This live database smoke check has not been run here.

## Verification
- Focused tile CSV/import and existing line-import tests: 10 passed, including all 28 supplied inventory rows and exact box stock posting through a mocked transaction.
- API and web TypeScript checks passed after using local package copies to work around Windows workspace symlink restrictions.
- Broader domain/web run: 426 passed, 5 menu tests failed. The failing menu code and tests are byte-for-byte unchanged from the original ZIP; these existing expectations disagree with the six-section navigation currently implemented.
- A live PostgreSQL migration, database integration suite, browser review and Vercel deployment were not performed.

This is a targeted adaptation of the existing application, not a rewrite of unrelated accounting, payroll, manufacturing or mobile features. Existing non-tile modules remain available.
