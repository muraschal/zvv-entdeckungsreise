import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Verschiedene Testfälle, die generiert werden sollen
const TEST_CASES = ['VALID', 'EXPIRED', 'USED', 'SPECIAL'];

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

// Funktion zum Generieren zufälliger Registrierungsdaten
function generateRandomRegistration() {
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
  
  // Reisedatum in den nächsten 30 Tagen
  const today = new Date();
  const travelDate = new Date(today);
  travelDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
  
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

    // Erstelle die Testcodes für jeden Testfall
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    
    const newCodes = TEST_CASES.map(testCase => {
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

    // Finde den USED-Testcode und erstelle eine lustige Musterbestellung dafür
    const usedCode = data?.find(code => code.code.includes('INT_USED_'));
    let createdRegistration = null;
    
    if (usedCode) {
      console.log('Erstelle kreative Musterbestellung für Code:', usedCode.code);
      
      // Generiere zufällige, lustige Registrierungsdaten
      const randomRegistration = generateRandomRegistration();
      
      // Erstelle eine Testbestellung mit dem verwendeten Code
      const { data: registrationData, error: registrationError } = await supabase
        .from('registrations')
        .insert({
          code: usedCode.code,
          ...randomRegistration,
          created_at: now.toISOString()
        })
        .select();
      
      if (registrationError) {
        console.error('Fehler beim Erstellen der Musterbestellung:', registrationError);
        // Wir werfen hier keinen Fehler, da die Codes bereits erstellt wurden
      } else {
        console.log('Kreative Musterbestellung erfolgreich erstellt:', registrationData);
        createdRegistration = registrationData[0];
      }
    }

    console.log('Testcodes erfolgreich in Datenbank eingefügt');
    return NextResponse.json({ 
      message: 'Testcodes erfolgreich generiert',
      count: newCodes.length,
      codes: newCodes.map(code => code.code),
      includesUsedCode: !!usedCode,
      sampleRegistrationCreated: !!createdRegistration,
      sampleRegistration: createdRegistration 
    });

  } catch (error) {
    console.error('Fehler beim Generieren der Testcodes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 