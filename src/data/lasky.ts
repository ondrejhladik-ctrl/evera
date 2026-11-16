/** 7. konference gestalt psychoterapie GESTALT LÁSKY 2024 (proběhlá akce). Texty ze zálohy starého webu. */
export const NAV = [
  { label: 'O konferenci', href: '/gestalt-lasky/#o-konferenci' },
  { label: 'Program', href: '/gestalt-lasky/#program' },
  { label: 'Informace', href: '/gestalt-lasky/#informace' },
  { label: 'O nás', href: '/gestalt-lasky/#o-nas' },
  { label: 'Fotografie', href: '/gestalt-lasky/#fotografie' },
];

export const LOGO = '/media/2023/06/logo_horizontal_bez.webp';
export const VIDEO = 'https://www.youtube.com/watch?v=llTs-x6PPYc';
export const DOPIS = '/media/2024/04/dopis.pdf';

/** Fotky v pořadí z galerie starého webu; každá má verzi -800 a -1600. */
const P = (n: string, dir = '2023/06') => ({ s: `/media/${dir}/${n}-800.webp`, l: `/media/${dir}/${n}-1600.webp` });
export const PHOTOS = [
  ...['DSC_1100', 'DSC_0537-2', 'DSC_0570-2', 'DSC_0503-2', 'DSC_0607', 'DSC_0648-2', 'DSC_0600-2', 'DSC_1346', 'DSC_0590', 'DSC_0366', 'DSC_0817-2'].map((n) => P(n)),
  P('Obrazek-2', '2025/10'), P('Obrazek-1', '2025/10'),
  ...['DSC_0069', 'DSC_0311', 'DSC_0776-2', 'DSC_0189-2', 'DSC_0091-2', 'DSC_1404', 'DSC_1384', 'DSC_1253', 'DSC_0177', 'DSC_1207', 'DSC_1141', 'DSC_1093', 'DSC_1052', 'DSC_1049-2', 'DSC_0873-2', 'DSC_0833-2', 'DSC_0727', 'DSC_0749', 'DSC_0718-2', 'DSC_0715-2', 'DSC_0574-2', 'DSC_0581-2', 'DSC_0458-2', 'DSC_0513-2', 'DSC_0387-2', 'DSC_0337-2', 'DSC_0517-2', 'DSC_0942', 'DSC_1241', 'DSC_0635', 'DSC_0240', 'DSC_1057', 'DSC_0546-2'].map((n) => P(n)),
];

export const TEAM = [
  { name: 'Markéta Chlupová', img: '/media/2026/01/Marketa-400.webp', bio: 'je individuální, skupinová a rodinná terapeutka s 25-letou praxí ve zdravotnictví a soukromém sektoru. V IVGT působí od roku 2017 jako procesní terapeutka a je členka kmenového týmu.' },
  { name: 'Ester Neumanová', img: '/media/2026/06/Ester-400.webp', bio: 'je psycholožka, Gestalt terapeutka, lektorka a supervizorka. Spolupodílela se na organizaci několika předchozích Gestalt konferencí.' },
  { name: 'Alena Vávrová', img: '/media/2026/02/Alena-400x400-1.webp', bio: 'je dětská psycholožka a Gestaltterapeutka, poradkyně pro rodiče a rodinná terapeutka, ředitelka Institutu dětského poradenství a terapie INDEPT s.r.o. Má soukromou praxi, zároveň se věnuje vzdělávání Gestalt terapeutů a dětských psychoterapeutů v Čechách i v zahraničí. V IVGT působila jako interní lektor od roku 2006, nyní je externí lektorkou.' },
];
