/**
 * Poptávkový formulář → e-mail (Web3Forms)
 *
 * Statický web sám maily neposílá, odeslání řeší Web3Forms (zdarma, bez účtu).
 * KAM CHODÍ MAILY = určuje přístupový klíč níže:
 *   1) na https://web3forms.com zadej cílový e-mail (info@evera.cz) – klíč přijde do té schránky
 *   2) klíč vlož do WEB3FORMS_KEY
 * Dokud je klíč prázdný, formulář nic neodešle a ukáže upozornění.
 */
export const WEB3FORMS_KEY = '7acb9782-4f2e-4721-98bb-f8764894fe96';
export const FORM_SUBJECT = 'Nová poptávka z webu evera.cz';
export const FORM_FROM = 'Evera web';
