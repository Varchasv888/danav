# Shared specification fixtures

Business rules exist twice: in TypeScript (`packages/domain`, used by the cloud API and web app)
and in Dart (the offline Flutter app). These JSON files are the contract between them. Every case
here must pass in **both** test suites; a change to a rule starts with a change to a fixture.

The cloud API also recomputes every document synced from an offline device and flags any mismatch.
