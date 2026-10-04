# ArogyaCare frontend

## Run locally

Use Node.js 18 or newer. From this project folder:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The Spring Boot API should be running at `http://localhost:8080`.

On an empty H2 database, backend startup inserts sample clinicians, patients, appointments, a clinic, and a prescription. The evaluation patient sign-in is `john.doe@hospital.com` / `patient123`. Seed data is skipped when patient records already exist, and H2 memory data resets when the backend process stops.

Set `VITE_API_BASE_URL` and `VITE_SOAP_URL` in `.env` to use different backend URLs. Restart Vite after changing environment variables. `npm run build` creates a production bundle in `dist/`.

## CORS

REST controllers allow cross-origin access for local frontend development. The SOAP servlet allows `http://localhost:5173`. For deployment, replace broad REST `@CrossOrigin(origins = "*")` rules with the exact trusted frontend origin and configure the SOAP origin to match. Do not use wildcard origins alongside credentialed cookies.

## Current backend integration constraints

- Patient self-registration is available from the landing page. The backend stores a salted PBKDF2 password hash and patient sign-in verifies those credentials. Existing evaluation accounts for administrator, doctor, and John Doe remain available.
- The backend does not yet enforce authenticated sessions or role permissions on its clinical endpoints. Add server-side token/session authorization before deploying beyond local evaluation.
- Patient and doctor IDs are resolved by matching the account email/name against records returned by the backend. Those records must exist for clinical workflows.
- The appointment list and status request contracts and patient deletion route were added to support the requested portal workflows. The status route now accepts `PUT /api/v1/appointments/{id}/status` with `{ "status": "COMPLETED" }`.
- Pharmacy order totals are submitted as zero because the backend has no medicine catalog or pricing endpoint. The order API accepts the request and preserves the address/status, but does not provide payment or delivery tracking updates.
- Appointment deletion is not exposed. Patient deletion may be rejected by the database when clinical records reference that patient; clinical history should not be removed as a side effect.
- Doctor booking/queue screens use actual appointment records. A time is disabled when an existing non-cancelled booking has the same doctor and timestamp. The backend also rejects a race with HTTP 409.

The SOAP report requires a patient record and returns the service's raw XML response for review.
