import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Verschiedene Testfälle, die generiert werden sollen
const TEST_CASES = ['VALID', 'EXPIRED', 'USED', 'SPECIAL'];

// Fibonacci-Folge für die Verteilung der Reisedaten
const fibonacciNumbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

// Kreative Arrays für zufällige Testdaten
const funnySchoolNames = [
  'Zauberschule Hogwärts am Zürichsee',
  'Akademie für kreative Fahrplanlektüre',
  'Bildungszentrum Röstigraben',
  'Kuhglocken-Konservatorium Appenzell',
  'Schule für ambitionierte Berggänger',
  'Schokoladenfabrik & Bildungszentrum',
  'Gipfeli-Universität Zürich',
  'Käsekunst-Kollegium Gruyère',
  'Schule für zeitgenössische Jodeltechnik',
  'Schweizer Taschenmesser-Kampfakademie',
  'Matterhorn View Elite School',
  'Wilhelm Tell Präzisionsschule',
  'Heidi und Geissenpeter Grundschule'
];

const funnyContactNames = [
  'Dr. Fondue Käsemeister',
  'Prof. Ricola Halswohltat',
  'Direktor Toblerone Dreieckig',
  'Frau Emmentaler Löcherig',
  'Herr Uhrwerk Präzision',
  'Fräulein Jodel Bergecho',
  'Mag. Alphörnchen Langton',
  'Dr. Neutralität Schweizer',
  'Prof. Rösti Goldbraun',
  'Frau Gondelbahn Steiler',
  'Herr ZVV Verspätung',
  'Fräulein Pünktlich Ticktack'
];

const funnyClasses = [
  '4a - Die Raclette-Racker',
  '5b - Die Alphorn-Athleten',
  '6c - Die Schokobanausen',
  '4. Klasse (Spezialklasse für angehende Zugführer)',
  '5. Klasse mit Vertiefung Kuhfaden-Olympiade',
  '6. Klasse der Jodel-Champions',
  'Zauberschüler Junior',
  'Berggipfelstürmer-Kadetten',
  'Matterhorn-Klasse',
  'Spezialklasse Käseproduktion'
];

const funnyEmailDomains = [
  'schoggi.ch',
  'bergschule.swiss',
  'zuerigschnetzlets.edu',
  'helvetia-lernt.ch',
  'jodel-academy.swiss',
  'alphorni.edu',
  'gipfeli-uni.ch',
  'kaese-college.swiss',
  'zvv-ausbildung.ch',
  'matterhorn.edu'
];

const funnyPhoneNumbers = [
  '044 CHUCHICHÄSCHTLI',
  '043 ALPHORN-SOUND',
  '041 RÖSTI-HOTLINE',
  '044 123 FONDUE',
  '043 SCHOGGI 999',
  '041 BERG-CALLING',
  '044 TELL-APFEL',
  '043 HEIDI-RUFT',
  '041 PUNKTLICH 00',
  '044 SCHWEIZER-UHR'
];

const funnyNotes = [
  'Bitte Schokolade für den Notfall mitbringen',
  'Alle Schüler können bereits perfekt jodeln',
  'Wir bringen unser eigenes Alphorn mit',
  'Wir sind eine Klasse mit ausgeprägtem Käsegeschmack',
  'Klasse hat Höhenangst, bitte nur flache Strecken',
  'Wir verteilen Schoggi-Frösche im Zug',
  'Unsere Klasse ist besonders pünktlich (Schweizer Uhren!)',
  'Dürfen wir während der Fahrt Fondue zubereiten?',
  'Teilnahme an der interkantonalen Gummistiefel-Weitwurf-Meisterschaft',
  'Klasse bereitet sich auf Weltrekord im Käsefondue-Konsum vor',
  'Wir üben bereits im Bus Schwyzerdütsch',
  'Bitte genügend Platz für unseren Mini-Alpsimulator einplanen'
];

// Funktion zum Generieren realistischerer Reisedaten über das ganze Jahr
function generateTravelDate() {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Verwende eine Fibonacci-Zahl für die Verteilung (addiere zufälligen Offset für mehr Varianz)
  const fibonacci = fibonacciNumbers[Math.floor(Math.random() * fibonacciNumbers.length)];
  const randomOffset = Math.floor(Math.random() * 7); // 0-6 Tage zusätzlich
  
  // Bestimme einen zufälligen Monat im Jahr (0-11)
  const randomMonth = Math.floor(Math.random() * 12);
  
  // Bestimme einen zufälligen Tag im Monat (1-28 um Probleme mit Monatsenden zu vermeiden)
  let randomDay = Math.min(1 + (fibonacci + randomOffset) % 28, 28);
  
  // Erstelle Datum
  const travelDate = new Date(currentYear, randomMonth, randomDay);
  
  // Sorge dafür, dass historische Daten und zukünftige Daten erstellt werden
  if (Math.random() > 0.7) {
    // 30% zukünftige Daten
    if (travelDate < now) {
      travelDate.setFullYear(currentYear + 1);
    }
  } else {
    // 70% vergangene Daten
    if (travelDate > now) {
      travelDate.setFullYear(currentYear - 1);
    }
  }
  
  return travelDate;
}

// Funktion zum Generieren zufälliger Registrierungsdaten
function generateRandomRegistration(createdAt: Date) {
  const randomSchool = funnySchoolNames[Math.floor(Math.random() * funnySchoolNames.length)];
  const randomContact = funnyContactNames[Math.floor(Math.random() * funnyContactNames.length)];
  const randomClass = funnyClasses[Math.floor(Math.random() * funnyClasses.length)];
  const randomEmail = `test.${randomContact.split(' ')[1].toLowerCase()}@${funnyEmailDomains[Math.floor(Math.random() * funnyEmailDomains.length)]}`;
  const randomPhone = funnyPhoneNumbers[Math.floor(Math.random() * funnyPhoneNumbers.length)];
  const randomNote = funnyNotes[Math.floor(Math.random() * funnyNotes.length)];
  
  // Zufällige Anzahl Schüler und Begleitpersonen
  const studentCount = Math.floor(Math.random() * 20) + 15; // 15-34 Schüler
  const accompanistCount = Math.floor(Math.random() * 3) + 1; // 1-3 Begleitpersonen
  
  // Zufällige Ankunftszeit zwischen 8:00 und 10:30
  const hour = Math.floor(Math.random() * 3) + 8; // 8-10 Uhr
  const minute = Math.floor(Math.random() * 6) * 5; // 0, 5, 10, 15, 20, 25
  const arrivalTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  // Reisedatum über das Jahr verteilt mit Fibonacci-Verteilung
  const travelDate = generateTravelDate();
  
  return {
    school: randomSchool,
    student_count: studentCount,
    travel_date: travelDate.toISOString().split('T')[0],
    additional_notes: randomNote,
    email: randomEmail,
    class: randomClass,
    contact_person: randomContact,
    phone_number: randomPhone,
    accompanist_count: accompanistCount,
    arrival_time: arrivalTime,
    created_at: createdAt.toISOString()
  };
}

// Generiere einen eindeutigen, lesbaren Code
function generateUniqueCode(testCase: string): string {
  const timestamp = format(new Date(), 'yyyyMMdd');
  const randomId = uuidv4().substring(0, 8).toUpperCase();
  return `INT_${testCase}_${timestamp}_${randomId}`;
}

export async function POST(request: Request) {
  console.log('Testcode-Generierungs-Anfrage erhalten');
  try {
    // Prüfe ob wir in der INT-Umgebung sind
    const isIntegrationEnv = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
    console.log('Umgebung:', { isIntegrationEnv, NODE_ENV: process.env.NODE_ENV, VERCEL_ENV: process.env.VERCEL_ENV });
    
    if (!isIntegrationEnv) {
      console.log('Nicht in INT-Umgebung, Anfrage abgelehnt');
      return NextResponse.json(
        { error: 'Testcodes können nur in der INT-Umgebung generiert werden' },
        { status: 403 }
      );
    }
    
    // Prüfe, ob der API-Endpunkt von der Admin-Seite aufgerufen wird
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    
    const isLocalRequest = origin.includes('localhost') || referer.includes('localhost');
    const isVercelRequest = origin.includes('vercel.app') || referer.includes('vercel.app');
    const isZvvRequest = origin.includes('zvv.ch') || referer.includes('zvv.ch');
    const isValidOrigin = isLocalRequest || isVercelRequest || isZvvRequest;
    
    console.log('Origin Checks:', { origin, referer, isLocalRequest, isVercelRequest, isZvvRequest, isValidOrigin });
    
    if (!isValidOrigin) {
      console.error('Ungültiger Ursprung:', origin, referer);
      return NextResponse.json(
        { error: 'Ungültiger Ursprung der Anfrage' },
        { status: 403 }
      );
    }

    // Verwende Admin-Client für direkten DB-Zugriff
    console.log('Erstelle Supabase-Client mit ServiceRole-Schlüssel');
    const supabase = createAdminClient();
    
    if (!supabase) {
      console.error('Supabase-Client konnte nicht erstellt werden');
      return NextResponse.json(
        { error: 'Datenbankverbindung konnte nicht hergestellt werden' },
        { status: 500 }
      );
    }

    // Erstelle 10 Testcodes + einen für jeden Testfall
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    
    // Basis-Testcodes für jeden Testfall
    const baseTestCodes = TEST_CASES.map(testCase => {
      // Je nach Testfall unterschiedliche Eigenschaften setzen
      let expiresAt = tomorrow;
      let status = 'unused';
      
      if (testCase === 'EXPIRED') {
        expiresAt = yesterday;
      } else if (testCase === 'USED') {
        status = 'used';
      }
      
      return {
        code: generateUniqueCode(testCase),
        status: status,
        expires_at: expiresAt.toISOString(),
        created_at: now.toISOString()
      };
    });
    
    // Zusätzliche 'USED' Testcodes für mehr Testdaten
    const additionalUsedCodes = Array.from({ length: 10 }, () => {
      // Generiere ein zufälliges Erstellungsdatum innerhalb des letzten Jahres
      const randomCreationDate = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 365); // 0-364 Tage zurück
      randomCreationDate.setDate(randomCreationDate.getDate() - randomDaysAgo);
      
      return {
        code: generateUniqueCode('USED'),
        status: 'used',
        expires_at: tomorrow.toISOString(),
        created_at: randomCreationDate.toISOString()
      };
    });
    
    const newCodes = [...baseTestCodes, ...additionalUsedCodes];
    console.log('Generierte Codes:', newCodes);

    // Füge die neuen Codes in die Datenbank ein
    const { data, error } = await supabase
      .from('codes')
      .insert(newCodes)
      .select();

    if (error) {
      console.error('Datenbankfehler beim Einfügen:', error);
      return NextResponse.json(
        { error: `Datenbankfehler: ${error.message}` },
        { status: 500 }
      );
    }

    // Finde alle 'USED' Testcodes und erstelle dafür Musterbestellungen
    const usedCodes = data?.filter(code => code.code.includes('INT_USED_')) || [];
    const createdRegistrations = [];
    
    if (usedCodes.length > 0) {
      console.log(`Erstelle kreative Musterbestellungen für ${usedCodes.length} Codes`);
      
      // Erstelle für jeden verwendeten Code eine Bestellung
      for (const usedCode of usedCodes) {
        // Erstelle ein zufälliges Erstellungsdatum basierend auf dem Code-Erstellungsdatum
        const codeDate = new Date(usedCode.created_at);
        const registrationDate = new Date(codeDate);
        // Füge 1-3 Tage hinzu für die Bestellung nach Code-Erstellung
        registrationDate.setDate(codeDate.getDate() + Math.floor(Math.random() * 3) + 1);
        
        // Generiere zufällige, lustige Registrierungsdaten
        const randomRegistration = generateRandomRegistration(registrationDate);
        
        try {
          // Erstelle eine Testbestellung mit dem verwendeten Code
          const { data: registrationData, error: registrationError } = await supabase
            .from('registrations')
            .insert({
              code: usedCode.code,
              ...randomRegistration
            })
            .select();
          
          if (registrationError) {
            console.error(`Fehler beim Erstellen der Musterbestellung für Code ${usedCode.code}:`, registrationError);
          } else {
            console.log(`Kreative Musterbestellung für Code ${usedCode.code} erfolgreich erstellt:`, registrationData);
            createdRegistrations.push(registrationData[0]);
          }
        } catch (err) {
          console.error(`Fehler bei Bestellung für Code ${usedCode.code}:`, err);
        }
      }
    }

    console.log('Testcodes erfolgreich in Datenbank eingefügt');
    return NextResponse.json({ 
      message: 'Testcodes erfolgreich generiert',
      count: newCodes.length,
      codes: newCodes.map(code => code.code),
      registrationsCreated: createdRegistrations.length,
      sampleRegistrations: createdRegistrations.slice(0, 3) // Gebe zur Info maximal 3 zurück
    });

  } catch (error) {
    console.error('Fehler beim Generieren der Testcodes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 