<template>
  <ModalTemplate>
    <template #header>
      <ModalHeader title="AGB & Datenschutz" />
    </template>

    <div class="space-y-3 p-4">
      <p class="text-sm text-gray-500">
        Scrolle nach unten um die Header/Footer Scroll-Indikatoren zu sehen.
        Der Header bekommt einen Border wenn gescrollt, der Footer wenn nicht am
        Ende.
      </p>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">
          § 1 Geltungsbereich
        </h4>
        <p class="mt-1 text-sm text-gray-600">
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen,
          die über unseren Online-Shop getätigt werden. Mit der Bestellung
          erkennt der Kunde diese AGB an.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">
          § 2 Vertragsschluss
        </h4>
        <p class="mt-1 text-sm text-gray-600">
          Die Darstellung der Produkte im Online-Shop stellt kein rechtlich
          bindendes Angebot dar. Durch Anklicken des Buttons "Bestellen" gibt
          der Kunde eine verbindliche Bestellung ab.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">§ 3 Preise</h4>
        <p class="mt-1 text-sm text-gray-600">
          Alle Preise verstehen sich inklusive der gesetzlichen
          Mehrwertsteuer. Versandkosten werden gesondert ausgewiesen und vom
          Kunden zusätzlich getragen.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">§ 4 Lieferung</h4>
        <p class="mt-1 text-sm text-gray-600">
          Die Lieferung erfolgt innerhalb Deutschlands. Lieferzeiten werden auf
          der Produktseite angegeben. Bei Nichtverfügbarkeit wird der Kunde
          unverzüglich informiert.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">§ 5 Zahlung</h4>
        <p class="mt-1 text-sm text-gray-600">
          Es stehen folgende Zahlungsarten zur Verfügung: Kreditkarte,
          PayPal, Sofortüberweisung und Rechnung. Der Rechnungsbetrag ist
          innerhalb von 14 Tagen nach Rechnungsdatum zu begleichen.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">
          § 6 Widerrufsrecht
        </h4>
        <p class="mt-1 text-sm text-gray-600">
          Der Kunde hat das Recht, binnen 14 Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab
          dem Tag des Erhalts der Ware.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">§ 7 Gewährleistung</h4>
        <p class="mt-1 text-sm text-gray-600">
          Es gelten die gesetzlichen Gewährleistungsrechte. Mängel sind
          unverzüglich nach Entdeckung anzuzeigen. Die Gewährleistungsfrist
          beträgt zwei Jahre ab Lieferung.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">§ 8 Datenschutz</h4>
        <p class="mt-1 text-sm text-gray-600">
          Personenbezogene Daten werden nur im Rahmen der Bestellabwicklung
          erhoben und verarbeitet. Weitere Informationen finden Sie in unserer
          Datenschutzerklärung.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">§ 9 Haftung</h4>
        <p class="mt-1 text-sm text-gray-600">
          Die Haftung für leichte Fahrlässigkeit wird ausgeschlossen, soweit
          keine wesentlichen Vertragspflichten betroffen sind. Die Haftung für
          Personenschäden bleibt unberührt.
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-3">
        <h4 class="text-sm font-semibold text-gray-800">
          § 10 Schlussbestimmungen
        </h4>
        <p class="mt-1 text-sm text-gray-600">
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist
          Berlin, soweit der Kunde Kaufmann ist. Sollten einzelne Bestimmungen
          unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 p-4">
        <button
          class="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium active:bg-gray-50"
          @click="dismiss(null, 'cancel')">
          Ablehnen
        </button>
        <button
          class="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white active:bg-blue-700"
          @click="dismiss({ accepted: true }, 'accept')">
          Akzeptieren
        </button>
      </div>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
  import ModalHeader from '../ModalHeader.vue';
  import ModalTemplate from '../ModalTemplate.vue';
  import { dismiss } from '../useModal';
</script>
