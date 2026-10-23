import { Kind, Lang, siteUrl } from './config'

// Email layout shared by the campaigns (rendered with their content) and the
// Brevo templates (rendered with a placeholder, for campaigns made in Brevo).
// Product emails get Brevo's unsubscribe link, legal emails have none.

const texts: Record<
  Lang,
  {
    names: Record<Kind, string>
    reasons: Record<Kind, string>
    unsubscribe: string
    placeholder: string
    company: string
    links: [string, string][]
  }
> = {
  fr: {
    placeholder: 'Votre contenu ici.',
    names: {
      legal: 'Rolebase · E-mail légal (FR)',
      product: 'Rolebase · Newsletter produit (FR)',
    },
    reasons: {
      legal:
        "Vous recevez cet e-mail d'information sur votre contrat parce que vous avez un compte Rolebase.",
      product:
        'Vous recevez la newsletter produit de Rolebase parce que vous avez un compte Rolebase.',
    },
    unsubscribe: 'Se désinscrire',
    company:
      'Rolebase est exploité par GDFR, SASU au capital de 1&nbsp;000&nbsp;€, 61 rue de Lyon, 75012 Paris, RCS Paris 102 951 001.',
    links: [
      ['Mentions légales', '/fr/legal'],
      ['Conditions générales', '/fr/terms'],
      ['Confidentialité', '/fr/privacy'],
    ],
  },
  en: {
    placeholder: 'Your content here.',
    names: {
      legal: 'Rolebase · Legal email (EN)',
      product: 'Rolebase · Product newsletter (EN)',
    },
    reasons: {
      legal:
        'You are receiving this information email about your agreement because you have a Rolebase account.',
      product:
        'You are receiving the Rolebase product newsletter because you have a Rolebase account.',
    },
    unsubscribe: 'Unsubscribe',
    company:
      'Rolebase is operated by GDFR, SASU with a share capital of €1,000, 61 rue de Lyon, 75012 Paris, France, Paris Trade Register 102 951 001.',
    links: [
      ['Legal notice', '/en/legal'],
      ['Terms', '/en/terms'],
      ['Privacy', '/en/privacy'],
    ],
  },
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const font = 'Basiercircle, Arial, sans-serif'
const footerColor = '#7a7067'

export function getTemplateName(kind: Kind, lang: Lang) {
  return texts[lang].names[kind]
}

interface Content {
  subject: string
  preview?: string
  html: string
}

export function renderTemplate(kind: Kind, lang: Lang, content?: Content) {
  const t = texts[lang]
  const {
    subject,
    preview = '',
    html,
  } = content || {
    subject: '',
    html: `<p style="margin:0;font-size:16px;line-height:26px;">${t.placeholder}</p>`,
  }
  const links = t.links.map(
    ([label, href]) =>
      `<a href="${siteUrl}${href}" style="color:${footerColor};">${label}</a>`
  )
  if (kind === 'product') {
    links.push(
      `<a href="{{ unsubscribe }}" style="color:${footerColor};">${t.unsubscribe}</a>`
    )
  }

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
<style>
@font-face{font-family:Basiercircle;font-weight:400;src:url(${siteUrl}/emails/basiercircle-regular-webfont.woff2) format('woff2');}
@font-face{font-family:Basiercircle;font-weight:600;src:url(${siteUrl}/emails/basiercircle-semibold-webfont.woff2) format('woff2');}
</style>
</head>
<body style="margin:0;padding:0;background-color:#f9f6f3;color:#29241f;font-family:${font};">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f6f3;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
<tr><td align="center" style="padding-bottom:24px;">
<a href="${siteUrl}/${lang}"><img src="${siteUrl}/logo.png" width="150" alt="Rolebase" style="display:block;border:0;"></a>
</td></tr>
<tr><td style="background-color:#ffffff;border-radius:12px;padding:32px;font-family:${font};color:#29241f;">
${html}
</td></tr>
<tr><td align="center" style="padding:24px 16px 0;font-family:${font};font-size:12px;line-height:18px;color:${footerColor};">
<p style="margin:0 0 8px;">${t.reasons[kind]}</p>
<p style="margin:0 0 8px;">${t.company}</p>
<p style="margin:0;">${links.join(' · ')}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}
