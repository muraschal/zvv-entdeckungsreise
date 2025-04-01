# Komponenten-Dokumentation

## Formular-Komponenten

### RegisterPage
`src/app/register/page.tsx`

Die Hauptkomponente für das Anmeldeformular.

#### Props
Keine (Client Component)

#### State
```typescript
{
  formData: {
    code: string;
    school: string;
    studentCount: string;
    travelDate: string;
    additionalNotes: string;
    email: string;
    className: string;
    contactPerson: string;
    phoneNumber: string;
    accompanistCount: string;
    arrivalTime: string;
  };
  isLoading: boolean;
  error: string;
  success: boolean;
}
```

#### Funktionen
- `handleChange`: Verarbeitet Änderungen in Formularfeldern
- `handleSubmit`: Verarbeitet das Absenden des Formulars
- Validierung des Codes
- Einreichung der Anmeldung
- Fehlerbehandlung
- Erfolgsanzeige

#### Verwendung
```tsx
// In app/register/page.tsx
export default function RegisterPage() {
  // ... Implementierung
}
```

## Layout-Komponenten

### RootLayout
`src/app/layout.tsx`

Die Root-Layout-Komponente für die gesamte Anwendung.

#### Props
```typescript
{
  children: React.ReactNode;
}
```

#### Metadaten
```typescript
export const metadata = {
  title: 'ZVV Ticketcode-Validierung',
  description: 'API für die Validierung und das Einlösen von Ticketcodes für die ZVV-Entdeckungsreise'
};
```

## Gemeinsame Komponenten

### SuccessMessage
Zeigt eine Erfolgsmeldung nach erfolgreicher Anmeldung.

#### Props
```typescript
{
  onBackToHome: () => void;
}
```

### ErrorMessage
Zeigt Fehlermeldungen im Formular an.

#### Props
```typescript
{
  message: string;
}
```

## Formularfelder

### InputField
Wiederverwendbare Komponente für Formulareingabefelder.

#### Props
```typescript
{
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}
```

## Styling

Die Komponenten verwenden Tailwind CSS für das Styling. Wichtige Klassen:

```css
/* Formular-Container */
.max-w-md .mx-auto .mt-10 .p-6 .bg-white .rounded-lg .shadow-md

/* Eingabefelder */
.w-full .px-3 .py-2 .border .border-gray-300 .rounded-md

/* Buttons */
.bg-blue-500 .text-white .py-2 .px-4 .rounded .hover:bg-blue-600

/* Fehlermeldungen */
.bg-red-100 .border .border-red-400 .text-red-700 .px-4 .py-3 .rounded
``` 