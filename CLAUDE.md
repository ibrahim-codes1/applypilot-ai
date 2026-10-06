## Rules Learned from Week 2

1. Job preference forms must block submission when required fields are empty or contain only whitespace.

2. Form fields must use accessible labels and a single field-level validation message; duplicate error messages are not allowed.

3. Optional salary inputs must accept an empty value, but when provided they must be numeric and greater than zero.

4. New form validation logic must include automated tests for valid input, missing required fields, whitespace-only input, and numeric edge cases.

5. A feature is not considered complete until manual browser verification and the automated test suite both pass.