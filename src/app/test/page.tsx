'use client';

import { ZVVEntdeckungsreiseForm } from '@/components/ZVVEntdeckungsreiseForm';
import Script from 'next/script';

export default function TestPage() {
  return (
    <>
      {/* ZVV Styles */}
      <link rel="stylesheet" href="https://www-int.zvv.ch/etc.clientlibs/zvv/clientlibs/clientlib-base.min.css" />
      <link rel="stylesheet" href="https://www-int.zvv.ch/etc.clientlibs/zvv/clientlibs/clientlib-site.min.css" />
      
      {/* ZVV Layout Struktur */}
      <div className="cmp-container">
        <div className="cmp-container__content">
          <div className="cmp-container__items">
            <div className="cmp-text">
              <h1>ZVV-Entdeckungsreise Bestellformular</h1>
            </div>
            
            <div className="cmp-container cmp-container--padding-normal">
              <div className="cmp-container__content">
                <div className="cmp-container__items">
                  <div className="cmp-text">
                    <p>Hier können Sie Tickets für die ZVV-Entdeckungsreise bestellen.</p>
                  </div>
                  
                  <div className="cmp-form">
                    <ZVVEntdeckungsreiseForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZVV Scripts */}
      <Script src="https://www-int.zvv.ch/etc.clientlibs/zvv/clientlibs/clientlib-base.min.js" />
      <Script src="https://www-int.zvv.ch/etc.clientlibs/zvv/clientlibs/clientlib-site.min.js" />
    </>
  );
} 