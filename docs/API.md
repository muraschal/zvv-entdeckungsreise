# API-Dokumentation

## Endpunkte

### 1. Code-Validierung

```http
POST /api/validate
```

#### Request Body
```json
{
  "code": "string"
}
```

#### Erfolgreiche Antwort
```json
{
  "valid": true,
  "message": "Code ist gültig."
}
```

#### Fehlerantworten
```json
{
  "valid": false,
  "message": "Code ist erforderlich."
}
```
Status: 400

```json
{
  "valid": false,
  "message": "Ungültiger Code."
}
```
Status: 404

```json
{
  "valid": false,
  "message": "Dieser Code wurde bereits verwendet."
}
```
Status: 400

### 2. Code-Einlösung

```http
POST /api/redeem
```

#### Request Body
```json
{
  "code": "string",
  "school": "string",
  "studentCount": "number",
  "travelDate": "string (YYYY-MM-DD)",
  "additionalNotes": "string?",
  "email": "string",
  "className": "string",
  "contactPerson": "string",
  "phoneNumber": "string",
  "accompanistCount": "number",
  "arrivalTime": "string (HH:mm)"
}
```

#### Erfolgreiche Antwort
```json
{
  "success": true,
  "message": "Anmeldung erfolgreich. Vielen Dank!",
  "data": {
    "registrationId": "uuid",
    "school": "string",
    "travelDate": "string",
    "emailSent": true
  }
}
```
Status: 200

#### Fehlerantworten
```json
{
  "success": false,
  "message": "Alle Pflichtfelder müssen ausgefüllt sein."
}
```
Status: 400

```json
{
  "success": false,
  "message": "Bitte gib eine gültige E-Mail-Adresse ein."
}
```
Status: 400

## Fehlerbehandlung

Alle API-Endpunkte verwenden folgende HTTP-Statuscodes:

- `200`: Erfolgreiche Anfrage
- `400`: Ungültige Anfrage (fehlende oder falsche Parameter)
- `404`: Ressource nicht gefunden
- `500`: Serverfehler

## CORS

Die API unterstützt CORS (Cross-Origin Resource Sharing) mit folgenden Einstellungen:

```typescript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
}
``` 